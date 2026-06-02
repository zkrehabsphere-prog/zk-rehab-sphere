import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Calendar, Tag, FileText, Loader2, Globe, Clock, Eye } from 'lucide-react';
import { blogsAPI } from '../../api/axios';

const BLOG_CATEGORIES = [
  'Back Pain',
  'Sports Injury',
  'Neck Pain',
  'Rehabilitation',
  'Exercise Therapy',
  'Posture Correction',
];

const BlogFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    coverImage: '',
    tags: '',
    category: '',
    status: 'draft',
    publishedAt: new Date().toISOString().slice(0, 16),
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    gallery: [],
    galleryFiles: [], // NEW: for tracking new gallery files
    sections: [],
    faqs: [],
    cta: { title: '', description: '', buttonType: 'appointment', buttonText: 'Book Appointment', buttonUrl: '' },
    author: {
      name: 'ZK Rehab Sphere',
      role: 'Medical Team',
      image: ''
    }
  });

  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          const res = await blogsAPI.getAllAdmin();
          const blog = res.data.blogs.find((b) => b._id === id);
          if (blog) {
            setForm({
              ...blog,
              tags: (blog.tags || []).join(', '),
              category: blog.category || '',
              seoTitle: blog.seoTitle || '',
              seoDescription: blog.seoDescription || '',
              seoKeywords: (blog.seoKeywords || []).join(', '),
              gallery: blog.gallery || [],
              sections: blog.sections || [],
              faqs: blog.faqs || [],
              cta: blog.cta || { title: '', description: '', buttonType: 'appointment', buttonText: 'Book Appointment', buttonUrl: '' },
              publishedAt: new Date(blog.publishedAt).toISOString().slice(0, 16),
              author: blog.author || { name: 'ZK Rehab Sphere', role: 'Medical Team', image: '' }
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the file
      const previewUrl = URL.createObjectURL(file);
      setForm({ ...form, coverImage: file, coverImagePreview: previewUrl });
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    // Create preview URLs for each file
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setForm({
      ...form,
      gallery: [...form.gallery, ...previews.map(p => p.preview)],
      galleryFiles: [...(form.galleryFiles || []), ...files]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add simple text fields
      formData.append('title', form.title);
      formData.append('summary', form.summary);
      formData.append('content', form.content);
      formData.append('category', form.category);
      formData.append('status', form.status);
      formData.append('publishedAt', form.publishedAt);
      formData.append('seoTitle', form.seoTitle);
      formData.append('seoDescription', form.seoDescription);
      
      // Send keywords and tags as JSON strings (backend will parse)
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
        formData.append('coverImage', form.coverImage);
      }
      
      // Add gallery files
      if (form.galleryFiles && form.galleryFiles.length > 0) {
        form.galleryFiles.forEach((file) => {
          formData.append('gallery', file);
        });
      }
      
      if (isEdit) {
        await blogsAPI.update(id, formData);
      } else {
        await blogsAPI.create(formData);
      }
      navigate('/dashboard/admin');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    setForm({ ...form, sections: [...form.sections, { title: '', content: '', image: '' }] });
  };

  const updateSection = (index, field, value) => {
    const updated = [...form.sections];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, sections: updated });
  };

  const removeSection = (index) => {
    const updated = form.sections.filter((_, idx) => idx !== index);
    setForm({ ...form, sections: updated });
  };

  const addFaq = () => {
    setForm({ ...form, faqs: [...form.faqs, { question: '', answer: '' }] });
  };

  const updateFaq = (index, field, value) => {
    const updated = [...form.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, faqs: updated });
  };

  const removeFaq = (index) => {
    const updated = form.faqs.filter((_, idx) => idx !== index);
    setForm({ ...form, faqs: updated });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-black text-slate-900">
              {isEdit ? 'Edit Blog Post' : 'Write New Article'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${previewMode ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              {previewMode ? <FileText size={18} /> : <Eye size={18} />}
              {previewMode ? 'Back to Editor' : 'Live Preview'}
            </button>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isEdit ? 'Save Changes' : 'Publish Article'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {previewMode ? (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
            <div className="aspect-video bg-slate-100">
              {form.coverImagePreview ? (
                <img src={form.coverImagePreview} alt="Cover" className="w-full h-full object-cover" />
              ) : form.coverImage ? (
                <img src={form.coverImage instanceof File ? URL.createObjectURL(form.coverImage) : form.coverImage} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No cover image</div>
              )}
            </div>
            <div className="p-8 md:p-12">
              <h1 className="text-4xl font-black text-slate-900 mb-6">{form.title || 'Post Title'}</h1>
              <div className="prose prose-slate prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-slate-400">Article content will appear here...</p>' }} />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <FileText size={16} className="text-primary" /> Article Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Enter a catchy title..."
                    className="w-full text-2xl font-bold border-0 border-b-2 border-slate-100 px-0 py-2 focus:ring-0 focus:border-primary transition-all placeholder:text-slate-300"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select category</option>
                      {BLOG_CATEGORIES.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">SEO Title</label>
                    <input
                      type="text"
                      value={form.seoTitle}
                      onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                      placeholder="SEO title for social sharing"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Globe size={16} className="text-primary" /> Short Summary *
                  </label>
                  <textarea
                    required
                    rows="2"
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    placeholder="A brief overview for the blog cards (max 150 characters)..."
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">SEO Description</label>
                  <textarea
                    rows="3"
                    value={form.seoDescription}
                    onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                    placeholder="Meta description used by search engines"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">SEO Keywords</label>
                  <input
                    type="text"
                    value={form.seoKeywords}
                    onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
                    placeholder="rehab, recovery, health, posture"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Clock size={16} className="text-primary" /> Content (HTML Supported) *
                  </label>
                  <textarea
                    required
                    rows="20"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Write your article here. You can use standard HTML tags for formatting..."
                    className="w-full border border-slate-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono text-sm leading-relaxed bg-slate-50"
                  />
                  <p className="mt-2 text-[10px] text-slate-400">
                    Pro tip: Use <strong>&lt;p&gt;</strong> for paragraphs, <strong>&lt;h2&gt;</strong> for headings, and <strong>&lt;img src="..."&gt;</strong> to embed images.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Sections</h3>
                  <button
                    type="button"
                    onClick={addSection}
                    className="px-4 py-2 text-sm font-bold text-primary border border-primary rounded-full hover:bg-primary/10 transition-colors"
                  >
                    Add Section
                  </button>
                </div>
                {form.sections.length === 0 ? (
                  <p className="text-sm text-slate-500">Add optional article sections with heading, text, and image.</p>
                ) : (
                  <div className="space-y-4">
                    {form.sections.map((section, index) => (
                      <div key={`section-${index}`} className="rounded-3xl border border-slate-200 p-5 bg-slate-50">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <p className="font-bold text-slate-900">Section {index + 1}</p>
                          <button
                            type="button"
                            onClick={() => removeSection(index)}
                            className="text-sm text-red-500 hover:text-red-700"
                          >Remove</button>
                        </div>
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSection(index, 'title', e.target.value)}
                            placeholder="Section title"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <textarea
                            rows="4"
                            value={section.content}
                            onChange={(e) => updateSection(index, 'content', e.target.value)}
                            placeholder="Section content (HTML allowed)"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <input
                            type="text"
                            value={section.image || ''}
                            onChange={(e) => updateSection(index, 'image', e.target.value)}
                            placeholder="Optional image URL"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">FAQ</h3>
                  <button
                    type="button"
                    onClick={addFaq}
                    className="px-4 py-2 text-sm font-bold text-primary border border-primary rounded-full hover:bg-primary/10 transition-colors"
                  >
                    Add FAQ
                  </button>
                </div>
                {form.faqs.length === 0 ? (
                  <p className="text-sm text-slate-500">Add common questions to help readers understand the topic.</p>
                ) : (
                  <div className="space-y-4">
                    {form.faqs.map((faq, index) => (
                      <div key={`faq-${index}`} className="rounded-3xl border border-slate-200 p-5 bg-slate-50">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <p className="font-bold text-slate-900">FAQ {index + 1}</p>
                          <button
                            type="button"
                            onClick={() => removeFaq(index)}
                            className="text-sm text-red-500 hover:text-red-700"
                          >Remove</button>
                        </div>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFaq(index, 'question', e.target.value)}
                          placeholder="Question"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <textarea
                          rows="3"
                          value={faq.answer}
                          onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                          placeholder="Answer"
                          className="w-full mt-3 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider border-b border-slate-50 pb-4">Call to Action</h3>
                <input
                  type="text"
                  value={form.cta.title}
                  onChange={(e) => setForm({ ...form, cta: { ...form.cta, title: e.target.value } })}
                  placeholder="CTA title"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <textarea
                  rows="3"
                  value={form.cta.description}
                  onChange={(e) => setForm({ ...form, cta: { ...form.cta, description: e.target.value } })}
                  placeholder="CTA description"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <select
                    value={form.cta.buttonType}
                    onChange={(e) => setForm({ ...form, cta: { ...form.cta, buttonType: e.target.value } })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="appointment">Book Appointment</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="contact">Contact Form</option>
                    <option value="custom">Custom Link</option>
                  </select>
                  <input
                    type="text"
                    value={form.cta.buttonText}
                    onChange={(e) => setForm({ ...form, cta: { ...form.cta, buttonText: e.target.value } })}
                    placeholder="Button text"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {form.cta.buttonType === 'custom' && (
                  <input
                    type="text"
                    value={form.cta.buttonUrl}
                    onChange={(e) => setForm({ ...form, cta: { ...form.cta, buttonUrl: e.target.value } })}
                    placeholder="Custom URL"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                )}
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider border-b border-slate-50 pb-4">Gallery</h3>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className="w-full text-sm text-slate-500"
                />
                {form.gallery.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {form.gallery.map((image, index) => (
                      <div key={`gallery-${index}`} className="relative rounded-3xl overflow-hidden border border-slate-200">
                        <img 
                          src={image instanceof File ? URL.createObjectURL(image) : image} 
                          alt={`Gallery ${index + 1}`} 
                          className="w-full h-28 object-cover" 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newGallery = form.gallery.filter((_, idx) => idx !== index);
                            const newGalleryFiles = form.galleryFiles?.filter((_, idx) => idx !== index) || [];
                            setForm({ ...form, gallery: newGallery, galleryFiles: newGalleryFiles });
                          }}
                          className="absolute top-2 right-2 rounded-full bg-slate-900/80 text-white p-1 text-xs"
                        >Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BlogFormPage;

