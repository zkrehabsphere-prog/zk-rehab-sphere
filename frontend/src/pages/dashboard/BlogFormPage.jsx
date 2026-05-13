import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Calendar, Tag, FileText, Loader2, Globe, Clock, Eye } from 'lucide-react';
import { blogsAPI } from '../../api/axios';

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
    status: 'draft',
    publishedAt: new Date().toISOString().slice(0, 16),
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
          const blog = res.data.blogs.find(b => b._id === id);
          if (blog) {
            setForm({
              ...blog,
              tags: blog.tags.join(', '),
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, coverImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        publishedAt: new Date(form.publishedAt)
      };

      if (isEdit) {
        await blogsAPI.update(id, payload);
      } else {
        await blogsAPI.create(payload);
      }
      navigate('/dashboard/admin');
    } catch (err) {
      alert(err.message || 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
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
      {/* Top Bar */}
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
          /* Live Preview Area */
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
             <div className="aspect-video bg-slate-100">
                {form.coverImage && <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />}
             </div>
             <div className="p-8 md:p-12">
                <h1 className="text-4xl font-black text-slate-900 mb-6">{form.title || 'Post Title'}</h1>
                <div className="prose prose-slate prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-slate-400">Article content will appear here...</p>' }} />
             </div>
          </div>
        ) : (
          /* Editor Area */
          <form onSubmit={handleSubmit} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
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
                    onChange={e => setForm({...form, title: e.target.value})}
                    placeholder="Enter a catchy title..."
                    className="w-full text-2xl font-bold border-0 border-b-2 border-slate-100 px-0 py-2 focus:ring-0 focus:border-primary transition-all placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Globe size={16} className="text-primary" /> Short Summary *
                  </label>
                  <textarea 
                    required
                    rows="2"
                    value={form.summary}
                    onChange={e => setForm({...form, summary: e.target.value})}
                    placeholder="A brief overview for the blog cards (max 150 characters)..."
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm leading-relaxed"
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
                    onChange={e => setForm({...form, content: e.target.value})}
                    placeholder="Write your article here. You can use standard HTML tags for formatting..."
                    className="w-full border border-slate-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono text-sm leading-relaxed bg-slate-50"
                  />
                  <p className="mt-2 text-[10px] text-slate-400">
                    Pro tip: Use <strong>&lt;p&gt;</strong> for paragraphs, <strong>&lt;h2&gt;</strong> for headings, and <strong>&lt;img src="..."&gt;</strong> to embed images.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Settings */}
            <div className="space-y-6">
              {/* Status & Schedule */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider border-b border-slate-50 pb-4">Publish Settings</h3>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Post Status</label>
                  <select 
                    value={form.status}
                    onChange={e => setForm({...form, status: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="draft">Draft (Private)</option>
                    <option value="published">Published (Public)</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" /> Publication Date
                  </label>
                  <input 
                    type="datetime-local" 
                    value={form.publishedAt}
                    onChange={e => setForm({...form, publishedAt: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {form.status === 'scheduled' && (
                    <p className="mt-2 text-[10px] text-primary font-bold">
                      Post will go live automatically at this time.
                    </p>
                  )}
                </div>
              </div>

              {/* Cover Image */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider border-b border-slate-50 pb-4">Featured Image</h3>
                <div className="aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden relative group">
                  {form.coverImage ? (
                    <>
                      <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setForm({...form, coverImage: ''})}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowLeft size={14} className="rotate-45" />
                      </button>
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                      <ImageIcon size={32} className="text-slate-300 mb-2" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upload Cover</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                 <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Tag size={16} className="text-slate-400" /> Tags (Comma separated)
                  </label>
                  <input 
                    type="text" 
                    value={form.tags}
                    onChange={e => setForm({...form, tags: e.target.value})}
                    placeholder="Health, Fitness, Therapy..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
              </div>

            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BlogFormPage;
