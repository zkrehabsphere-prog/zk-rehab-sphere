import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Loader2, Share2, Facebook, Twitter, Linkedin as LinkedIn } from 'lucide-react';
import SEO from '../components/SEO';
import { blogsAPI } from '../api/axios';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blogsAPI.getBySlug(slug);
        setBlog(res.data.blog);
      } catch (err) {
        setError('Blog post not found.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{error}</h2>
        <Link to="/blog" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Blog
        </Link>
      </div>
    );
  }

  const shareUrl = window.location.href;

  return (
    <div className="w-full">
      <SEO 
        title={`${blog.title} - ZK Rehab Sphere`}
        description={blog.summary}
      />

      <article className="pb-20">
        {/* Header Section */}
        <div className="bg-slate-50 pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-primary font-bold text-sm mb-8 hover:-translate-x-1 transition-all group">
              <ArrowLeft size={16} /> Back to Health Blog
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              {blog.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-[1.1]">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-white shadow-sm">
                  {blog.author?.image ? <img src={blog.author.image} alt={blog.author.name} className="w-full h-full object-cover" /> : blog.author?.name?.[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{blog.author?.name || 'ZK Medical Team'}</p>
                  <p className="text-xs text-slate-500">{blog.author?.role || 'Medical Professional'}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-slate-400 text-sm">
                <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-2"><Share2 size={16} /> 2 min read</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="container mx-auto px-4 -mt-10 md:-mt-16 mb-12 md:mb-20">
          <div className="max-w-5xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={blog.coverImage || '/placeholder-blog.jpg'} 
              alt={blog.title} 
              className="w-full h-auto aspect-video object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Sidebar / Sharing */}
            <div className="md:w-16 shrink-0 flex md:flex-col items-center gap-4 py-4 md:sticky md:top-28 h-fit">
               <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"><Facebook size={18} /></button>
               <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"><Twitter size={18} /></button>
               <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"><LinkedIn size={18} /></button>
            </div>

            {/* Main Article */}
            <div className="flex-1">
               <div 
                  className="prose prose-slate prose-lg max-w-none 
                    prose-headings:text-slate-900 prose-headings:font-black prose-headings:leading-tight
                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                    prose-img:rounded-3xl prose-img:shadow-xl prose-img:my-10
                    prose-strong:text-slate-900 prose-strong:font-bold
                    prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: blog.content }} 
               />

               <div className="mt-16 pt-10 border-t border-slate-100 flex flex-wrap gap-3">
                  {blog.tags?.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl border border-slate-100 hover:border-primary hover:text-primary transition-all cursor-default">
                      #{tag}
                    </span>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </article>

      {/* Newsletter / CTA Section could go here */}
    </div>
  );
};

export default BlogPostPage;
