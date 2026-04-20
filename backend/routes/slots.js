const express = require('express');
const Slot = require('../models/Slot');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { getISTTodayStr, isSlotInPast } = require('../utils/timeUtils');


const router = express.Router();

/**
 * GET /api/slots
 * Public: Get available (not booked) slots for a given date or all upcoming slots
 * Query params: date (YYYY-MM-DD), doctorId
 */
router.get('/', async (req, res, next) => {
  try {
    const { date, doctorId } = req.query;

    const filter = { isActive: true };

    if (date) {
      filter.date = date;
    } else {
      // Default: get slots from today onwards
      const today = new Date().toISOString().split('T')[0];
      filter.date = { $gte: today };
    }

    if (doctorId) filter.doctor = doctorId;

    const slots = await Slot.find(filter)
      .populate('doctor', 'name email photo')
      .sort({ date: 1, time: 1 });

    res.json({ success: true, slots });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/slots/available
 * Get only unbooked slots (for patient booking modal)
 */
router.get('/available', async (req, res, next) => {
  try {
    const today = getISTTodayStr();
    
    // 1. Fetch potentially available slots (today onwards)
    let slots = await Slot.find({
      isBooked: false,
      isActive: true,
      date: { $gte: today },
    })
      .populate('doctor', 'name photo')
      .sort({ date: 1, time: 1 });

    // 2. Identify and DELETE past slots (Auto-Cleanup)
    const pastSlotIds = slots
      .filter(slot => isSlotInPast(slot.date, slot.time))
      .map(slot => slot._id);

    if (pastSlotIds.length > 0) {
      await Slot.deleteMany({ _id: { $in: pastSlotIds } });
      // Remove them from the local list being returned
      slots = slots.filter(slot => !pastSlotIds.includes(slot._id));
    }

    res.json({ success: true, slots: slots.slice(0, 50) });
  } catch (err) {
    next(err);
  }
});


/**
 * POST /api/slots
 * Admin or Doctor: Create one or more slots
 * Body: { doctorId, date, times: ['10:00 AM', '11:30 AM'] }
 */
router.post('/', protect, requireRole('admin', 'doctor'), async (req, res, next) => {
  try {
    const { doctorId, date, times } = req.body;

    if (!date || !times || !Array.isArray(times) || times.length === 0) {
      return res.status(400).json({ error: 'date and times array are required.' });
    }

    // Doctors can only create slots for themselves
    let resolvedDoctorId = doctorId;
    if (req.user.role === 'doctor') {
      resolvedDoctorId = req.user._id.toString();
    }

    // Validate doctor exists
    const doctor = await User.findById(resolvedDoctorId);
    if (!doctor || doctor.role === 'patient') {
      return res.status(400).json({ error: 'Invalid doctor ID.' });
    }

    // Validate that the date is not in the past
    const today = getISTTodayStr();
    if (date < today) {
        return res.status(400).json({ error: 'Cannot create slots for a past date.' });
    }

    // Create slots (skip duplicates and SKIP PAST TIMES for today)
    const slotsToCreate = times
      .map(time => time.trim())
      .filter(time => !isSlotInPast(date, time)) // Filter out past times for today
      .map((time) => ({
        doctor: resolvedDoctorId,
        date,
        time,
      }));

    if (slotsToCreate.length === 0 && times.length > 0) {
        return res.status(400).json({ error: 'All provided times have already passed for today.' });
    }

    let created = [];
    let duplicates = 0;
    for (const s of slotsToCreate) {
      try {
        const slot = await Slot.create(s);
        created.push(slot);
      } catch (e) {
        if (e.code === 11000) duplicates++;
        else throw e;
      }
    }


    res.status(201).json({
      success: true,
      message: `Created ${created.length} slot(s).${duplicates ? ` ${duplicates} duplicate(s) skipped.` : ''}`,
      slots: created,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/slots/:id
 * Admin/Doctor: Update slot (date, time, active status)
 */
router.patch('/:id', protect, requireRole('admin', 'doctor'), async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ error: 'Slot not found.' });

    // Doctors can only update their own slots
    if (req.user.role === 'doctor' && slot.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only update your own slots.' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ error: 'Cannot modify a slot that is already booked.' });
    }

    const { date, time, isActive } = req.body;
    if (date) slot.date = date;
    if (time) slot.time = time;
    if (isActive !== undefined) slot.isActive = isActive;

    await slot.save();
    res.json({ success: true, slot });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/slots/:id
 * Admin/Doctor: Delete a slot
 */
router.delete('/:id', protect, requireRole('admin', 'doctor'), async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ error: 'Slot not found.' });

    if (req.user.role === 'doctor' && slot.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own slots.' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ error: 'Cannot delete a booked slot. Cancel the appointment first.' });
    }

    await slot.deleteOne();
    res.json({ success: true, message: 'Slot deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
