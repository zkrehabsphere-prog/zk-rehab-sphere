import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Loader2, Share2, Facebook, Twitter, Linkedin as LinkedIn, Eye, MessageCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { blogsAPI } from '../api/axios';
import { resolveImageUrl } from '../utils/imageUtils';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
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

  useEffect(() => {
    const fetchRelated = async () => {
      if (!blog?.category) return;
      try {
        const res = await blogsAPI.getPublished({ category: blog.category, limit: 4 });
        setRelated((res.data.blogs || []).filter((item) => item.slug !== blog.slug));
      } catch (err) {
        console.error('Failed to load related blogs', err);
      }
    };
    fetchRelated();
  }, [blog]);

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
        title={blog.seoTitle || `${blog.title} - ZK Rehab Sphere`}
        description={blog.seoDescription || blog.summary}
      />

      <article className="pb-20">
        <div className="bg-slate-50 pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-primary font-bold text-sm mb-8 hover:-translate-x-1 transition-all group">
              <ArrowLeft size={16} /> Back to Health Blog
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              {blog.category && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {blog.category}
                </span>
              )}
              {blog.tags?.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-[1.1]">
              {blog.title}
            </h1>

            <div className="grid gap-4 md:grid-cols-[1fr_auto] items-center pt-8 border-t border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-white shadow-sm">
                  {blog.author?.image ? (
                    <img src={blog.author.image} alt={blog.author.name} className="w-full h-full object-cover" />
                  ) : (
                    blog.author?.name?.[0]
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{blog.author?.name || 'ZK Medical Team'}</p>
                  <p className="text-xs text-slate-500">{blog.author?.designation || blog.author?.role || 'Medical Professional'}</p>
                  {blog.author?.qualification && <p className="text-xs text-slate-500">{blog.author.qualification}</p>}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-slate-500 text-sm">
                <span className="inline-flex items-center gap-2"><Calendar size={16} /> {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="inline-flex items-center gap-2"><Eye size={16} /> {blog.readTime || 2} min read</span>
                <span className="inline-flex items-center gap-2"><MessageCircle size={16} /> {blog.views || 0} views</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-10 md:-mt-16 mb-12 md:mb-20">
          <div className="max-w-5xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={resolveImageUrl(blog.coverImage)} 
              alt={blog.title} 
              className="w-full h-auto aspect-video object-cover"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl">
          <div className="md:grid md:grid-cols-[64px_1fr] gap-12">
            <div className="md:block hidden sticky top-28 h-fit">
              <div className="flex flex-col gap-4">
                <button className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"><Facebook size={18} /></button>
                <button className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"><Twitter size={18} /></button>
                <button className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"><LinkedIn size={18} /></button>
              </div>
            </div>

            <div>
              <div 
                className="prose prose-slate prose-lg max-w-none 
                  prose-headings:text-slate-900 prose-headings:font-black prose-headings:leading-tight
                  prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                  prose-img:rounded-3xl prose-img:shadow-xl prose-img:my-10
                  prose-strong:text-slate-900 prose-strong:font-bold
                  prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {blog.sections?.length > 0 && (
                <div className="mt-20 space-y-8">
                  {blog.sections.map((section, index) => (
                    <div key={`${section.title}-${index}`} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-slate-900 mb-4">{section.title}</h2>
                          <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: section.content || '<p className="text-slate-500">No section content added yet.</p>' }} />
                        </div>
                        {section.image && (
                          <div className="w-full lg:w-72 rounded-3xl overflow-hidden border border-slate-200">
                            <img src={resolveImageUrl(section.image)} alt={section.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {blog.gallery?.length > 0 && (
                <div className="mt-20">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Image Gallery</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {blog.gallery.map((image, index) => (
                      <div key={index} className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
                        <img src={resolveImageUrl(image)} alt={`${blog.title} gallery ${index + 1}`} className="w-full h-60 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {blog.keyTakeaways?.length > 0 && (
                <div className="mt-20 rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Takeaways</h2>
                  <ul className="space-y-3 text-slate-600">
                    {blog.keyTakeaways.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 text-primary font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {blog.faqs?.length > 0 && (
                <div className="mt-20 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">FAQ</h2>
                  <div className="space-y-4">
                    {blog.faqs.map((faq, index) => (
                      <details key={index} className="rounded-3xl border border-slate-200 p-5 bg-slate-50">
                        <summary className="cursor-pointer font-semibold text-slate-900">{faq.question}</summary>
                        <div className="mt-3 text-slate-600 prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {blog.cta?.title && (
                <div className="mt-20 rounded-3xl border border-primary bg-primary/5 p-8 shadow-sm">
                  <div className="max-w-3xl">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">{blog.cta.title}</h2>
                    <p className="text-slate-600 mb-6">{blog.cta.description}</p>
                    <div className="flex flex-wrap gap-3">
                      {blog.cta.buttonType === 'appointment' && (
                        <Link to="/services" className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors">{blog.cta.buttonText || 'Book Appointment'}</Link>
                      )}
                      {blog.cta.buttonType === 'whatsapp' && (
                        <a href={blog.cta.buttonUrl || 'https://wa.me/'} target="_blank" rel="noreferrer" className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-colors">{blog.cta.buttonText || 'WhatsApp'}</a>
                      )}
                      {blog.cta.buttonType === 'contact' && (
                        <Link to="/contact" className="px-6 py-3 bg-white text-slate-900 rounded-full font-bold border border-slate-200 hover:bg-slate-100 transition-colors">{blog.cta.buttonText || 'Contact'}</Link>
                      )}
                      {blog.cta.buttonType === 'custom' && blog.cta.buttonUrl && (
                        <a href={blog.cta.buttonUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors">{blog.cta.buttonText || 'Take Action'}</a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {related.length > 0 && (
                <div className="mt-20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Related Articles</h2>
                    <span className="text-sm text-slate-500">More from {blog.category}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {related.map((item) => (
                      <Link key={item._id} to={`/blog/${item.slug}`} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-[16/9] overflow-hidden">
                          <img src={resolveImageUrl(item.coverImage)} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-5">
                          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-2">{item.category}</p>
                          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-3">{item.title}</h3>
                          <p className="text-slate-500 text-sm">{item.summary}</p>
                        </div>
                      </Link>
                    ))}}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
