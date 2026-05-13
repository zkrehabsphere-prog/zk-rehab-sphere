const express = require('express');
const BlogPost = require('../models/BlogPost');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

const router = express.Router();

/**
 * GET /api/blogs
 * Public: Get all published blog posts
 */
router.get('/', async (req, res, next) => {
  try {
    const blogs = await BlogPost.find({
      status: { $in: ['published', 'scheduled'] },
      publishedAt: { $lte: new Date() }
    }).sort({ publishedAt: -1 });
    
    res.json({ success: true, blogs });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/blogs/all
 * Admin: Get all blog posts (including drafts and scheduled)
 */
router.get('/all', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const blogs = await BlogPost.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/blogs/:slug
 * Public: Get single blog post by slug
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const blog = await BlogPost.findOne({ slug: req.params.slug });
    
    if (!blog) return res.status(404).json({ error: 'Blog post not found.' });
    
    // Check if published (unless admin/scheduled time reached)
    const isVisible = blog.status !== 'draft' && new Date(blog.publishedAt) <= new Date();
    if (!isVisible) {
      // In a real app, we might check for an admin token here to allow previewing
      return res.status(404).json({ error: 'Blog post not yet available.' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({ success: true, blog });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/blogs
 * Admin: Create a new blog post
 */
router.post('/', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const { title, summary, content, coverImage, tags, status, publishedAt, author } = req.body;
    
    const blog = await BlogPost.create({
      title,
      summary,
      content,
      coverImage,
      tags,
      status,
      publishedAt: publishedAt || Date.now(),
      author
    });

    res.status(201).json({ success: true, blog });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/blogs/:id
 * Admin: Update a blog post
 */
router.put('/:id', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const blog = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!blog) return res.status(404).json({ error: 'Blog post not found.' });
    res.json({ success: true, blog });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/blogs/:id
 * Admin: Delete a blog post
 */
router.delete('/:id', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const blog = await BlogPost.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog post not found.' });
    res.json({ success: true, message: 'Blog post deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
