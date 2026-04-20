const express = require('express');
const path = require('path');
const Resource = require('../models/Resource');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { uploadResource, deleteFile } = require('../middleware/upload');

const router = express.Router();

/**
 * GET /api/resources
 * Public: Get published resources (with optional category filter)
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);

    const [resources, total] = await Promise.all([
      Resource.find(filter)
        .select('-content') // Don't send full content in list view
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Resource.countDocuments(filter),
    ]);

    res.json({
      success: true,
      resources,
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
 * GET /api/resources/all
 * Admin: Get all resources (published and draft)
 */
router.get('/all', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const resources = await Resource.find(filter)
      .select('-content')
      .sort({ createdAt: -1 });

    res.json({ success: true, resources });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/resources/:id
 * Public: Get single resource (published only for non-admin)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found.' });
    if (!resource.isPublished) return res.status(404).json({ error: 'Resource not available.' });

    // Increment view count
    resource.viewCount += 1;
    await resource.save();

    res.json({ success: true, resource });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/resources
 * Admin: Create a new resource
 */
router.post(
  '/',
  protect,
  requireRole('admin'),
  uploadResource.fields([
    { name: 'file', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const { title, category, description, content, tags, author, isPublished } = req.body;

      if (!title || !category || !description) {
        return res.status(400).json({ error: 'title, category, and description are required.' });
      }

      let fileUrl = '';
      let coverImageUrl = '';

      if (req.files?.file?.[0]) {
        fileUrl = `/uploads/resources/${req.files.file[0].filename}`;
      }
      if (req.files?.coverImage?.[0]) {
        coverImageUrl = `/uploads/resources/${req.files.coverImage[0].filename}`;
      }

      const publish = isPublished === 'true' || isPublished === true;

      const resource = await Resource.create({
        title,
        category,
        description,
        content: content || '',
        tags: tags ? JSON.parse(tags) : [],
        author: author || 'ZK Rehab Sphere',
        fileUrl,
        coverImage: coverImageUrl,
        isPublished: publish,
        publishedAt: publish ? new Date() : null,
      });

      res.status(201).json({ success: true, resource });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /api/resources/:id
 * Admin: Update a resource
 */
router.put(
  '/:id',
  protect,
  requireRole('admin'),
  uploadResource.fields([
    { name: 'file', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const resource = await Resource.findById(req.params.id);
      if (!resource) return res.status(404).json({ error: 'Resource not found.' });

      const { title, category, description, content, tags, author, isPublished } = req.body;

      if (req.files?.file?.[0]) {
        if (resource.fileUrl?.startsWith('/uploads')) deleteFile(path.join(__dirname, '..', resource.fileUrl));
        resource.fileUrl = `/uploads/resources/${req.files.file[0].filename}`;
      }
      if (req.files?.coverImage?.[0]) {
        if (resource.coverImage?.startsWith('/uploads')) deleteFile(path.join(__dirname, '..', resource.coverImage));
        resource.coverImage = `/uploads/resources/${req.files.coverImage[0].filename}`;
      }

      if (title) resource.title = title;
      if (category) resource.category = category;
      if (description) resource.description = description;
      if (content !== undefined) resource.content = content;
      if (tags) resource.tags = JSON.parse(tags);
      if (author) resource.author = author;
      if (isPublished !== undefined) {
        const pub = isPublished === 'true' || isPublished === true;
        if (pub && !resource.isPublished) resource.publishedAt = new Date();
        resource.isPublished = pub;
      }

      await resource.save();
      res.json({ success: true, resource });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/resources/:id
 * Admin: Delete a resource and its files
 */
router.delete('/:id', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found.' });

    if (resource.fileUrl?.startsWith('/uploads')) deleteFile(path.join(__dirname, '..', resource.fileUrl));
    if (resource.coverImage?.startsWith('/uploads')) deleteFile(path.join(__dirname, '..', resource.coverImage));

    await resource.deleteOne();
    res.json({ success: true, message: 'Resource deleted.' });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/resources/:id/download
 * Public: Increment download count
 */
router.patch('/:id/download', async (req, res, next) => {
  try {
    await Resource.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
