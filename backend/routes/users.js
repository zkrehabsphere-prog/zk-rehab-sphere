const express = require('express');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const ContactMessage = require('../models/ContactMessage');
const Newsletter = require('../models/Newsletter');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { uploadExpertImage, bufferToBase64 } = require('../middleware/upload');

const router = express.Router();

/**
 * PATCH /api/users/profile
 * Auth: Update own profile
 */
router.patch('/profile', protect, uploadExpertImage.single('photo'), async (req, res, next) => {
  try {
    const { name, phone, address, gender, age } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (gender !== undefined) user.gender = gender;
    if (age !== undefined) user.age = Number(age);

    if (req.file) {
      user.photo = bufferToBase64(req.file);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (err) {
    next(err);
  }
});


/**
 * GET /api/users
 * Admin: Get all users with optional role filter
 */
router.get('/', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-googleId -__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      users,
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
 * GET /api/users/dashboard-stats
 * Admin: Get platform-wide dashboard statistics
 */
router.get('/dashboard-stats', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalPatients,
      totalDoctors,
      totalAppointments,
      pendingAppointments,
      unreadMessages,
      totalSubscribers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      ContactMessage.countDocuments({ isRead: false }),
      Newsletter.countDocuments({ isActive: true }),
    ]);

    // Recent appointments (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentAppointments = await Appointment.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalPatients,
        totalDoctors,
        totalAppointments,
        pendingAppointments,
        unreadMessages,
        totalSubscribers,
        recentAppointments,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/users/:id
 * Admin: Get a user by ID
 */
router.get('/:id', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-googleId -__v');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/users/:id/role
 * Admin: Promote/demote a user's role
 */
router.patch('/:id/role', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['admin', 'doctor', 'patient'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    // Prevent admin from demoting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot change your own role.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: '-googleId -__v' }
    );

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({
      success: true,
      message: `${user.name}'s role updated to ${role}.`,
      user,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/users/:id/active
 * Admin: Activate/deactivate a user account
 */
router.patch('/:id/active', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot deactivate your own account.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, select: '-googleId -__v' }
    );

    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({
      success: true,
      message: `${user.name}'s account ${isActive ? 'activated' : 'deactivated'}.`,
      user,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/users/:id
 * Admin: Delete a user account (hard delete)
 */
router.delete('/:id', protect, requireRole('admin'), async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ success: true, message: `User ${user.name} (${user.email}) deleted.` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
