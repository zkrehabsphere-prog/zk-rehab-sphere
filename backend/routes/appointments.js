const express = require('express');
const Appointment = require('../models/Appointment');
const Slot = require('../models/Slot');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const {
  sendAppointmentConfirmation,
  sendBookingNotification,
  sendStatusUpdate,
} = require('../utils/email');

const router = express.Router();

/**
 * POST /api/appointments
 * Patient: Book an appointment on a slot
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const { slotId, patientName, patientAge, patientPhone, patientAddress, purpose } = req.body;

    // Validate required fields
    if (!slotId || !patientName || !patientAge || !patientPhone || !patientAddress) {
      return res.status(400).json({ error: 'slotId, name, age, phone, and address are required.' });
    }

    // Find and validate slot
    const slot = await Slot.findById(slotId).populate('doctor', 'name email');
    if (!slot) return res.status(404).json({ error: 'Slot not found.' });
    if (slot.isBooked) return res.status(409).json({ error: 'This slot is already booked. Please choose another.' });
    if (!slot.isActive) return res.status(400).json({ error: 'This slot is no longer available.' });

    // Check patient hasn't already booked this slot
    const existing = await Appointment.findOne({ patient: req.user._id, slot: slotId });
    if (existing) return res.status(409).json({ error: 'You already have an appointment in this slot.' });

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: slot.doctor._id,
      slot: slot._id,
      slotDate: slot.date,
      slotTime: slot.time,
      patientName,
      patientAge: Number(patientAge),
      patientPhone,
      patientAddress,
      purpose: purpose || '',
      status: 'pending',
    });

    // Mark slot as booked
    slot.isBooked = true;
    slot.bookedBy = req.user._id;
    await slot.save();

    // Populate for response
    await appointment.populate([
      { path: 'patient', select: 'name email photo' },
      { path: 'doctor', select: 'name email photo' },
    ]);

    // Send emails (non-blocking)
    const patientEmail = req.user.email;
    const doctorEmail = slot.doctor.email;

    sendAppointmentConfirmation({
      to: patientEmail,
      patientName,
      doctorName: slot.doctor.name,
      date: slot.date,
      time: slot.time,
      purpose,
    }).catch(console.error);

    sendBookingNotification({
      doctorEmail,
      patientName,
      patientPhone,
      date: slot.date,
      time: slot.time,
      address: patientAddress,
      purpose,
    }).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/appointments
 * Admin: All appointments
 * Doctor: Their own appointments
 * Patient: Their own bookings
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    const filter = {};

    // Scope by role
    if (req.user.role === 'patient') {
      filter.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      filter.doctor = req.user._id;
    }
    // admin sees all

    if (status) filter.status = status;
    if (date) filter.slotDate = date;

    const skip = (Number(page) - 1) * Number(limit);

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate('patient', 'name email photo phone')
        .populate('doctor', 'name email photo')
        .populate('slot', 'date time')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Appointment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      appointments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/appointments/:id
 * Get a single appointment (owner or admin/doctor)
 */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email photo phone address')
      .populate('doctor', 'name email photo')
      .populate('slot', 'date time');

    if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });

    // Access control
    const isOwner = appointment.patient._id.toString() === req.user._id.toString();
    const isDoctor = req.user.role === 'doctor' && appointment.doctor._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isDoctor && !isAdmin) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json({ success: true, appointment });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/appointments/:id/status
 * Doctor/Admin: Update appointment status and add notes
 * Body: { status, doctorNotes, cancelReason }
 */
router.patch('/:id/status', protect, requireRole('admin', 'doctor'), async (req, res, next) => {
  try {
    const { status, doctorNotes, cancelReason } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor', 'name email');

    if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });

    // Doctor can only update their own appointments
    if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only update your own appointments.' });
    }

    // If cancelling, free up the slot
    if (status === 'cancelled' && appointment.status !== 'cancelled') {
      await Slot.findByIdAndUpdate(appointment.slot, { isBooked: false, bookedBy: null });
    }

    appointment.status = status;
    if (doctorNotes !== undefined) appointment.doctorNotes = doctorNotes;
    if (cancelReason !== undefined) appointment.cancelReason = cancelReason;

    await appointment.save();

    // Send status update email to patient (non-blocking)
    if (status !== 'pending') {
      sendStatusUpdate({
        to: appointment.patient.email,
        patientName: appointment.patientName,
        status,
        date: appointment.slotDate,
        time: appointment.slotTime,
        doctorNotes: appointment.doctorNotes,
      }).catch(console.error);
    }

    res.json({
      success: true,
      message: `Appointment ${status} successfully.`,
      appointment,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/appointments/:id
 * Admin only: Hard delete an appointment
 */
router.delete('/:id', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });

    // Free up the slot
    await Slot.findByIdAndUpdate(appointment.slot, { isBooked: false, bookedBy: null });

    await appointment.deleteOne();
    res.json({ success: true, message: 'Appointment deleted.' });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/appointments/stats/overview
 * Admin: Dashboard stats
 */
router.get('/stats/overview', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'confirmed' }),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ status: 'cancelled' }),
    ]);

    res.json({
      success: true,
      stats: { total, pending, confirmed, completed, cancelled },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
