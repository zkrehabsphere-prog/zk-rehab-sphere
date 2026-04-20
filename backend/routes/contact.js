const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { sendContactNotification } = require('../utils/email');

const router = express.Router();

/**
 * POST /api/contact
 * Public: Submit a contact form message
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    if (message.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters.' });
    }

    const ipAddress = req.ip || req.connection.remoteAddress;

    const contact = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      message: message.trim(),
      ipAddress,
    });

    // Notify clinic admin via email (non-blocking)
    sendContactNotification({ name, email, phone, message }).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will get back to you within 24 hours.',
      id: contact._id,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/contact
 * Admin only: Get all contact messages with pagination
 */
router.get('/', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [messages, total, unreadCount] = await Promise.all([
      ContactMessage.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ContactMessage.countDocuments(filter),
      ContactMessage.countDocuments({ isRead: false }),
    ]);

    res.json({
      success: true,
      messages,
      unreadCount,
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
 * PATCH /api/contact/:id/read
 * Admin only: Mark a message as read/unread
 */
router.patch('/:id/read', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const { isRead } = req.body;
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      {
        isRead: isRead !== false,
        ...(isRead !== false && { repliedAt: new Date() }),
      },
      { new: true }
    );
    if (!msg) return res.status(404).json({ error: 'Message not found.' });
    res.json({ success: true, message: msg });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/contact/:id
 * Admin only: Delete a message
 */
router.delete('/:id', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found.' });
    res.json({ success: true, message: 'Message deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
