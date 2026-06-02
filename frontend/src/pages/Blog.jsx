import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Loader2, Search, Filter } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import SEO from '../components/SEO';
import { blogsAPI } from '../api/axios';
import { resolveImageUrl } from '../utils/imageUtils';

const BLOG_CATEGORIES = [
  'Back Pain',
  'Sports Injury',
  'Neck Pain',
  'Rehabilitation',
  'Exercise Therapy',
  'Posture Correction',
];

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await blogsAPI.getPublished({ search: searchTerm, category, page, limit: 9 });
      setBlogs(res.data.blogs || []);
      setPagination(res.data.pagination || { page: 1, pages: 1 });
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setBlogs([]);
      setPagination({ page: 1, pages: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [searchTerm, category, page]);

  return (
    <div className="w-full">
      <SEO 
        title="Health Blog - ZK Rehab Sphere" 
        description="Stay updated with the latest health tips, recovery stories, and rehabilitation insights from our experts."
      />
      
      <div className="bg-slate-50 pt-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <SectionTitle 
              title="Health & Wellness Blog" 
              subtitle="Insights, tips, and updates from our medical professionals."
              className="mb-0"
            />

            <div className="grid gap-4 w-full lg:w-auto sm:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="">All Categories</option>
                  {BLOG_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-500">No blog posts found matching your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Link 
                    key={blog._id} 
                    to={`/blog/${blog.slug}`}
                    className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <div className="aspect-[16/9] overflow-hidden relative">
                      <img 
                        src={resolveImageUrl(blog.coverImage)} 
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        {blog.category && (
                          <span className="px-3 py-1 bg-primary/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                            {blog.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 mb-3 font-medium uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1.5"><User size={12} /> {blog.author?.name || 'ZK Medical Team'}</span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {blog.title}
                      </h3>

                      <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {blog.summary}
                      </p>

                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-3 flex-wrap justify-between">
                        <span className="text-slate-500 text-xs">{blog.readTime || 2} min read</span>
                        <span className="text-primary font-bold text-sm flex items-center gap-2 group/btn">
                          Read More 
                          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >Previous</button>
                <span className="text-sm text-slate-500">Page {pagination.page} of {pagination.pages}</span>
                <button
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, pagination.pages))}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >Next</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
