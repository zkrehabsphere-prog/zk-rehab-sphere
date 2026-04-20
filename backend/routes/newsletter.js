const express = require('express');
const Newsletter = require('../models/Newsletter');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

const router = express.Router();

/**
 * POST /api/newsletter
 * Public: Subscribe to newsletter
 */
router.post('/', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.isActive) {
        return res.status(409).json({ error: 'This email is already subscribed.' });
      }
      // Re-subscribe
      existing.isActive = true;
      existing.subscribedAt = new Date();
      existing.unsubscribedAt = null;
      await existing.save();
      return res.json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
    }

    await Newsletter.create({ email: email.toLowerCase() });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed! You will receive rehabilitation insights and updates.',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/newsletter
 * Admin: Get all subscribers
 */
router.get('/', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const { isActive, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [subscribers, total, activeCount] = await Promise.all([
      Newsletter.find(filter).sort({ subscribedAt: -1 }).skip(skip).limit(Number(limit)),
      Newsletter.countDocuments(filter),
      Newsletter.countDocuments({ isActive: true }),
    ]);

    res.json({
      success: true,
      subscribers,
      activeCount,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/newsletter/:id
 * Admin: Remove a subscriber
 */
router.delete('/:id', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const sub = await Newsletter.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Subscriber not found.' });
    res.json({ success: true, message: 'Subscriber removed.' });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/newsletter/unsubscribe/:token
 * Public: Unsubscribe via token link (from email)
 */
router.get('/unsubscribe/:token', async (req, res, next) => {
  try {
    const sub = await Newsletter.findOne({ unsubscribeToken: req.params.token });
    if (!sub) return res.status(404).json({ error: 'Invalid unsubscribe link.' });

    sub.isActive = false;
    sub.unsubscribedAt = new Date();
    await sub.save();

    res.json({ success: true, message: 'You have been unsubscribed successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
