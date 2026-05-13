const express = require('express');
const path = require('path');
const Expert = require('../models/Expert');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { uploadExpertImage, bufferToBase64, deleteFile } = require('../middleware/upload');


const router = express.Router();

/**
 * GET /api/experts
 * Public: Get all active experts sorted by order
 */
router.get('/', async (req, res, next) => {
  try {
    const experts = await Expert.find({ isActive: { $ne: false } })
      .sort({ order: 1, createdAt: 1 })

      .populate('linkedUserId', 'name email photo phone');


    res.json({ success: true, experts });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/experts/all
 * Admin: Get all experts including inactive
 */
router.get('/all', protect, requireRole('admin', 'doctor'), async (req, res, next) => {
  try {
    const experts = await Expert.find()
      .sort({ order: 1, createdAt: 1 })
      .populate('linkedUserId', 'name email photo role phone');


    res.json({ success: true, experts });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/experts/me
 * Doctor/Admin: Get currently logged-in user's expert profile
 */
router.get('/me', protect, requireRole('doctor', 'admin'), async (req, res, next) => {
  try {
    const expert = await Expert.findOne({ linkedUserId: req.user._id });
    if (!expert) return res.status(404).json({ error: 'No expert profile found for your account.' });
    res.json({ success: true, expert });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/experts/me
 * Doctor/Admin: Create or update currently logged-in user's expert profile
 */
router.put(
  '/me',
  protect,
  requireRole('doctor', 'admin'),
  uploadExpertImage.single('image'),
  async (req, res, next) => {
    try {
      const { name, role, degree, experience, bio, specializations, socialLinks } = req.body;
      let expert = await Expert.findOne({ linkedUserId: req.user._id });

      let imageUrl = expert ? expert.image : '';
      if (req.body.image && req.body.image.startsWith('data:image')) {
        if (expert && expert.image && expert.image.startsWith('/uploads')) {
          try { deleteFile(path.join(__dirname, '..', expert.image)); } catch (e) {}
        }
        imageUrl = req.body.image;
      } else if (req.file) {
        if (expert && expert.image && expert.image.startsWith('/uploads')) {
          try { deleteFile(path.join(__dirname, '..', expert.image)); } catch (e) {}
        }
        imageUrl = typeof bufferToBase64 === 'function' ? bufferToBase64(req.file) : `/uploads/experts/${req.file.filename}`;
      }


      if (!expert) {
        if (!name || !role || !degree || !experience || !bio) {
          if (req.file) deleteFile(req.file.path);
          return res.status(400).json({ error: 'name, role, degree, experience, and bio are required to create a profile.' });
        }
        expert = await Expert.create({
          linkedUserId: req.user._id,
          name, role, degree, experience, bio,
          image: imageUrl,
          specializations: specializations ? (typeof specializations === 'string' ? JSON.parse(specializations) : specializations) : [],
          socialLinks: socialLinks ? (typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks) : {},
        });
        
        // Update user reference
        req.user.expertProfileId = expert._id;
        await req.user.save();
      } else {
        if (name) expert.name = name;
        if (role) expert.role = role;
        if (degree) expert.degree = degree;
        if (experience) expert.experience = experience;
        if (bio) expert.bio = bio;
        expert.image = imageUrl;
        if (specializations) expert.specializations = typeof specializations === 'string' ? JSON.parse(specializations) : specializations;
        if (socialLinks) expert.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
        await expert.save();
      }

      res.json({ success: true, expert });
    } catch (err) {
      next(err);
    }

  }
);

/**
 * GET /api/experts/:id
 * Public: Get single expert
 */
router.get('/:id', async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id).populate('linkedUserId', 'name email photo');
    if (!expert || !expert.isActive) return res.status(404).json({ error: 'Expert not found.' });
    res.json({ success: true, expert });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/experts
 * Admin: Create a new expert profile
 * Multipart form data with optional image upload
 */
router.post(
  '/',
  protect,
  requireRole('admin', 'doctor'),
  uploadExpertImage.single('image'),
  async (req, res, next) => {
    try {
      const { name, role, degree, experience, bio, order, linkedUserId, specializations, socialLinks } = req.body;

      if (!name || !role || !degree || !experience || !bio) {
        // Clean up uploaded file if validation fails
        if (req.file) deleteFile(req.file.path);
        return res.status(400).json({ error: 'name, role, degree, experience, and bio are required.' });
      }

      let imageUrl = '';
      if (req.body.image && req.body.image.startsWith('data:image')) {
        // Use Base64 image from body (saved in MongoDB)
        imageUrl = req.body.image;
      } else if (req.file) {
        // Use bufferToBase64 if available, else fallback
        imageUrl = typeof bufferToBase64 === 'function' ? bufferToBase64(req.file) : `/uploads/experts/${req.file.filename}`;
      }


      const expert = await Expert.create({
        name,
        role,
        degree,
        experience,
        bio,
        image: imageUrl,
        order: order ? Number(order) : 0,
        linkedUserId: linkedUserId || null,
        specializations: specializations ? (typeof specializations === 'string' ? JSON.parse(specializations) : specializations) : [],
        socialLinks: socialLinks ? (typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks) : {},
      });

      res.status(201).json({ success: true, expert });
    } catch (err) {
      next(err);
    }

  }
);

/**
 * PUT /api/experts/:id
 * Admin: Update an expert
 */
router.put(
  '/:id',
  protect,
  requireRole('admin', 'doctor'),
  uploadExpertImage.single('image'),
  async (req, res, next) => {
    try {
      const expert = await Expert.findById(req.params.id);
      if (!expert) {
        if (req.file) deleteFile(req.file.path);
        return res.status(404).json({ error: 'Expert not found.' });
      }

      const { name, role, degree, experience, bio, order, linkedUserId, isActive, specializations, socialLinks } =
        req.body;

      // Priority 1: Base64 image in body
      if (req.body.image && req.body.image.startsWith('data:image')) {
        // If there was an old file-based image, we could delete it, but Base64 is stored in DB
        if (expert.image && expert.image.startsWith('/uploads')) {
          try { deleteFile(path.join(__dirname, '..', expert.image)); } catch (e) {}
        }
        expert.image = req.body.image;
      } 
      // Priority 2: New file upload
      else if (req.file) {
        if (expert.image && expert.image.startsWith('/uploads')) {
          try { deleteFile(path.join(__dirname, '..', expert.image)); } catch (e) {}
        }
        expert.image = typeof bufferToBase64 === 'function' ? bufferToBase64(req.file) : `/uploads/experts/${req.file.filename}`;
      }


      if (name) expert.name = name;
      if (role) expert.role = role;
      if (degree) expert.degree = degree;
      if (experience) expert.experience = experience;
      if (bio) expert.bio = bio;
      if (order !== undefined) expert.order = Number(order);
      if (linkedUserId !== undefined) expert.linkedUserId = linkedUserId || null;
      if (isActive !== undefined) expert.isActive = isActive === 'true' || isActive === true;
      if (specializations) expert.specializations = typeof specializations === 'string' ? JSON.parse(specializations) : specializations;
      if (socialLinks) expert.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;

      await expert.save();
      res.json({ success: true, expert });
    } catch (err) {
      next(err);
    }

  }
);

/**
 * DELETE /api/experts/:id
 * Admin: Remove expert
 */
router.delete('/:id', protect, requireRole('admin', 'doctor'), async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) return res.status(404).json({ error: 'Expert not found.' });

    // Delete image file
    if (expert.image && expert.image.startsWith('/uploads')) {
      deleteFile(path.join(__dirname, '..', expert.image));
    }

    await expert.deleteOne();
    res.json({ success: true, message: 'Expert deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
