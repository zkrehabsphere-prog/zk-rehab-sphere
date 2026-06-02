// This is the corrected handleSubmit function for BlogFormPage.jsx
// Replace the handleSubmit function (around line 105-160) with this:

const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    // Create FormData for multipart upload
    const formData = new FormData();
    
    // Add all simple text fields
    formData.append('title', form.title);
    formData.append('summary', form.summary);
    formData.append('content', form.content);
    formData.append('category', form.category);
    formData.append('status', form.status);
    formData.append('publishedAt', form.publishedAt);
    formData.append('seoTitle', form.seoTitle);
    formData.append('seoDescription', form.seoDescription);
    
    // Send seoKeywords and tags as comma-separated strings (backend will parse)
    const keywords = form.seoKeywords.split(',').map((k) => k.trim()).filter(Boolean);
    const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
    formData.append('seoKeywords', JSON.stringify(keywords));
    formData.append('tags', JSON.stringify(tags));
    
    // Send author as JSON string
    formData.append('author', JSON.stringify(form.author));
    
    // Send sections as JSON string
    if (form.sections && form.sections.length > 0) {
      formData.append('sections', JSON.stringify(form.sections));
    }
    
    // Send FAQs as JSON string
    if (form.faqs && form.faqs.length > 0) {
      formData.append('faqs', JSON.stringify(form.faqs));
    }
    
    // Send CTA as JSON string
    formData.append('cta', JSON.stringify(form.cta));
    
    // Add cover image file if it's a File object
    if (form.coverImage instanceof File) {
      console.log('Adding cover image:', form.coverImage.name, form.coverImage.size);
      formData.append('coverImage', form.coverImage);
    }
    
    // Add gallery files
    if (form.galleryFiles && form.galleryFiles.length > 0) {
      console.log('Adding gallery files:', form.galleryFiles.length);
      form.galleryFiles.forEach((file, index) => {
        console.log(`  Gallery file ${index}:`, file.name, file.size);
        formData.append('gallery', file);
      });
    }
    
    console.log('Submitting blog with FormData...');
    
    if (isEdit) {
      await blogsAPI.update(id, formData);
    } else {
      await blogsAPI.create(formData);
    }
    
    navigate('/dashboard/admin');
  } catch (err) {
    console.error('Blog submission error:', err);
    alert(err.response?.data?.message || err.message || 'Failed to save blog post');
  } finally {
    setSaving(false);
  }
};
