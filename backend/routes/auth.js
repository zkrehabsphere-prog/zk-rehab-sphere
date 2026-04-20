const express = require('express');
const { protect } = require('../middleware/auth');
const admin = require('../config/firebase');
const User = require('../models/User');

const router = express.Router();

/**
 * POST /api/auth/verify
 * Verified Firebase token, create/update MongoDB user, return user data
 */
router.post('/verify', async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ error: 'No token provided' });

    // Verify token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Create new user
      const isFirstAdmin = email === process.env.ADMIN_EMAIL;
      user = await User.create({
        firebaseUid: uid,
        email: email,
        name: name || email.split('@')[0],
        photo: picture || '',
        role: isFirstAdmin ? 'admin' : 'patient',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Your account has been deactivated.' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        role: user.role,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

/**
 * POST /api/auth/logout
 * Dummy route to clear front-end state 
 * (Cookie sessions removed, just keeping for API consistency)
 */
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * PATCH /api/auth/profile
 * Update current user's phone and address
 */
router.patch('/profile', protect, async (req, res, next) => {
  try {
    const { phone, address } = req.body;
    const user = req.user; // from protect middleware

    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
