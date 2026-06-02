// Improved POST /api/blogs route for backend/routes/blogs.js
// This is a complete replacement for the POST route

/**
 * POST /api/blogs
 * Admin: Create a new blog post with image uploads
 */
router.post('/', protect, requireRole('admin'), uploadBlogImage.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
]), async (req, res, next) => {
  try {
    console.log('Blog POST request:', {
      hasFiles: !!req.files,
      coverImageCount: req.files?.coverImage?.length || 0,
      galleryCount: req.files?.gallery?.length || 0,
      bodyKeys: Object.keys(req.body || {})
    });

    // Parse FormData JSON fields
    const blogData = { ...req.body };
    
    // Parse JSON fields if they're strings
    if (typeof blogData.author === 'string') {
      try {
        blogData.author = JSON.parse(blogData.author);
      } catch (e) {
        console.warn('Failed to parse author:', e.message);
      }
    }
    
    if (typeof blogData.sections === 'string') {
      try {
        blogData.sections = JSON.parse(blogData.sections);
      } catch (e) {
        console.warn('Failed to parse sections:', e.message);
      }
    }
    
    if (typeof blogData.faqs === 'string') {
      try {
        blogData.faqs = JSON.parse(blogData.faqs);
      } catch (e) {
        console.warn('Failed to parse faqs:', e.message);
      }
    }
    
    if (typeof blogData.cta === 'string') {
      try {
        blogData.cta = JSON.parse(blogData.cta);
      } catch (e) {
        console.warn('Failed to parse cta:', e.message);
      }
    }

    // Parse tags if it's a JSON string
    if (typeof blogData.tags === 'string') {
      try {
        blogData.tags = JSON.parse(blogData.tags);
      } catch (e) {
        blogData.tags = blogData.tags.split(',').map(t => t.trim()).filter(Boolean);
      }
    }

    // Parse seoKeywords if it's a JSON string
    if (typeof blogData.seoKeywords === 'string') {
      try {
        blogData.seoKeywords = JSON.parse(blogData.seoKeywords);
      } catch (e) {
        blogData.seoKeywords = blogData.seoKeywords.split(',').map(k => k.trim()).filter(Boolean);
      }
    }

    let coverImageUrl = null;
    let galleryUrls = [];

    // Upload cover image to Cloudinary if provided
    if (req.files?.coverImage?.[0]) {
      try {
        console.log('Uploading cover image...');
        const result = await uploadToCloudinary(
          req.files.coverImage[0].buffer,
          'zk-rehab-blogs/covers',
          `blog-cover-${Date.now()}`
        );
        coverImageUrl = result.secure_url;
        console.log('✓ Cover image uploaded:', coverImageUrl);
      } catch (err) {
        console.error('✗ Cover image upload failed:', err.message);
        return res.status(400).json({ error: 'Failed to upload cover image: ' + err.message });
      }
    }

    // Upload gallery images to Cloudinary if provided
    if (req.files?.gallery?.length > 0) {
      try {
        console.log(`Uploading ${req.files.gallery.length} gallery images...`);
        const uploadPromises = req.files.gallery.map((file, index) => {
          console.log(`  Uploading gallery image ${index + 1}/${req.files.gallery.length}...`);
          return uploadToCloudinary(
            file.buffer,
            'zk-rehab-blogs/gallery',
            `blog-gallery-${Date.now()}-${index}`
          );
        });
        const results = await Promise.all(uploadPromises);
        galleryUrls = results.map(r => r.secure_url);
        console.log('✓ Gallery images uploaded:', galleryUrls.length);
      } catch (err) {
        console.error('✗ Gallery upload failed:', err.message);
        return res.status(400).json({ error: 'Failed to upload gallery images: ' + err.message });
      }
    }

    // Create the blog post
    const blog = await BlogPost.create({
      ...blogData,
      coverImage: coverImageUrl || blogData.coverImage || '',
      gallery: galleryUrls.length > 0 ? galleryUrls : [],
      publishedAt: blogData.publishedAt || Date.now(),
    });

    console.log('✓ Blog created successfully:', blog._id);
    res.status(201).json({ success: true, blog });
  } catch (err) {
    console.error('Blog creation error:', err);
    next(err);
  }
});
