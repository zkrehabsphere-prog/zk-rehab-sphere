const express = require('express');
const { protect } = require('../middleware/auth');
const admin = require('../config/firebase');
const { uploadExpertImage, bufferToBase64 } = require('../middleware/upload');
const User = require('../models/User');

const router = express.Router();

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  photo: user.photo,
  coverImage: user.coverImage,
  role: user.role || 'patient',
  profileTitle: user.profileTitle,
  profileTag: user.profileTag,
  bio: user.bio,
  username: user.username,
  phone: user.phone,
  address: user.address,
  gender: user.gender,
  dob: user.dob,
  bloodGroup: user.bloodGroup,
  qualification: user.qualification,
  experience: user.experience,
  specialization: user.specialization,
  languages: user.languages,
  city: user.city,
  state: user.state,
  country: user.country,
  pincode: user.pincode,
  emergencyContact: user.emergencyContact,
  clinicName: user.clinicName,
  department: user.department,
  position: user.position,
  registrationNumber: user.registrationNumber,
  expertiseAreas: user.expertiseAreas,
  socialLinks: user.socialLinks,
  preferences: user.preferences,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/**
 * POST /api/auth/verify
 * Verify Firebase token, create/update MongoDB user, return user data
 */
router.post('/verify', async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      const isSuperAdmin = email === 'zkrehabsphere@gmail.com' || email === process.env.ADMIN_EMAIL;
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || email.split('@')[0],
        photo: picture || '',
        role: isSuperAdmin ? 'admin' : 'patient',
        lastLogin: new Date(),
      });
    } else {
      user.lastLogin = new Date();
      if (!user.role) {
        user.role = 'patient';
      }
      if (email === 'zkrehabsphere@gmail.com' && user.role !== 'admin') {
        user.role = 'admin';
      }
      await user.save();
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Your account has been deactivated.' });
    }

    res.json({ success: true, user: buildUserResponse(user) });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

/**
 * GET /api/auth/profile
 * Returns the current authenticated profile
 */
router.get('/profile', protect, async (req, res, next) => {
  try {
    res.json({ success: true, user: buildUserResponse(req.user) });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/auth/profile
 * Update profile details and optional images
 */
router.patch(
  '/profile',
  protect,
  uploadExpertImage.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const updates = {
        name: req.body.name,
        profileTitle: req.body.profileTitle,
        profileTag: req.body.profileTag,
        bio: req.body.bio,
        username: req.body.username,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender,
        dob: req.body.dob ? new Date(req.body.dob) : req.user.dob,
        bloodGroup: req.body.bloodGroup,
        qualification: req.body.qualification,
        experience: req.body.experience,
        specialization: req.body.specialization,
        photo: req.body.photo,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        pincode: req.body.pincode,
        emergencyContact: req.body.emergencyContact,
        clinicName: req.body.clinicName,
        department: req.body.department,
        position: req.body.position,
        registrationNumber: req.body.registrationNumber,
      };

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          req.user[key] = value;
        }
      });

      if (req.body.languages !== undefined) {
        req.user.languages = Array.isArray(req.body.languages)
          ? req.body.languages.filter(Boolean)
          : req.body.languages.split(',').map((item) => item.trim()).filter(Boolean);
      }

      if (req.body.expertiseAreas !== undefined) {
        req.user.expertiseAreas = Array.isArray(req.body.expertiseAreas)
          ? req.body.expertiseAreas.filter(Boolean)
          : req.body.expertiseAreas.split(',').map((item) => item.trim()).filter(Boolean);
      }

      if (req.body.socialLinks !== undefined) {
        const social = typeof req.body.socialLinks === 'string' ? JSON.parse(req.body.socialLinks) : req.body.socialLinks;
        req.user.socialLinks = {
          ...req.user.socialLinks,
          ...social,
        };
      }

      if (req.body.preferences !== undefined) {
        const prefs = typeof req.body.preferences === 'string' ? JSON.parse(req.body.preferences) : req.body.preferences;
        req.user.preferences = {
          ...req.user.preferences,
          ...prefs,
        };
      }

      if (req.files?.photo?.[0]) {
        req.user.photo = bufferToBase64(req.files.photo[0]);
      }
      if (req.files?.coverImage?.[0]) {
        req.user.coverImage = bufferToBase64(req.files.coverImage[0]);
      }

      await req.user.save();

      res.json({ success: true, message: 'Profile updated successfully', user: buildUserResponse(req.user) });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/auth/profile-image
 * Upload only profile picture
 */
router.post('/profile-image', protect, uploadExpertImage.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No profile image provided.' });
    req.user.photo = bufferToBase64(req.file);
    await req.user.save();
    res.json({ success: true, user: buildUserResponse(req.user) });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/cover-image
 * Upload only cover image
 */
router.post('/cover-image', protect, uploadExpertImage.single('coverImage'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No cover image provided.' });
    req.user.coverImage = bufferToBase64(req.file);
    await req.user.save();
    res.json({ success: true, user: buildUserResponse(req.user) });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/auth/password
 * Change password for the current Firebase user account
 */
router.patch('/password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'New password and confirmation are required.' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Password confirmation does not match.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    await admin.auth().updateUser(req.user.firebaseUid, { password: newPassword });

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
