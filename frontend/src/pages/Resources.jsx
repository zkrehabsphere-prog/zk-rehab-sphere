import React, { useState, useEffect } from 'react';
import { Activity, BookOpen, GraduationCap, ArrowRight, Download, Eye, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { resourcesAPI } from '../api/axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const categoryConfig = {
  blog: { icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/20', label: 'Blog Post' },
  pdf: { icon: BookOpen, color: 'text-green-500', bg: 'bg-green-500/20', label: 'PDF Guide' },
  'clinical-notes': { icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-500/20', label: 'Clinical Notes' },
};

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const params = activeCategory !== 'all' ? { category: activeCategory } : {};
        const res = await resourcesAPI.getPublished(params);
        setResources(res.data.resources || []);
      } catch (err) {
        setError('Failed to load resources.');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [activeCategory]);

  const handleDownload = async (resource) => {
    if (resource.fileUrl) {
      await resourcesAPI.incrementDownload(resource._id).catch(() => {});
      const url = resource.fileUrl.startsWith('/uploads') ? `${API_BASE}${resource.fileUrl}` : resource.fileUrl;
      window.open(url, '_blank');
    }
  };

  const grouped = {
    blog: resources.filter(r => r.category === 'blog'),
    pdf: resources.filter(r => r.category === 'pdf'),
    'clinical-notes': resources.filter(r => r.category === 'clinical-notes'),
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-primary">
        <div className="text-center text-white">
          <Loader2 size={40} className="animate-spin mx-auto mb-4" />
          <p className="font-medium opacity-80">Loading resources...</p>
        </div>
      </div>
    );
  }

  // If no resources at all yet — show coming soon
  if (!loading && resources.length === 0 && activeCategory === 'all') {
    return (
      <div className="w-full min-h-[80vh] flex flex-col">
        <SEO title="Resources Coming Soon - ZK Rehab Sphere" description="Our comprehensive library of rehabilitation resources is coming soon." />
        <section className="flex-grow relative flex items-center justify-center py-20 bg-primary overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="container mx-auto px-4 text-center relative z-10 text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Knowledge Hub <br />
              <span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-blue-300">Coming Soon</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12 leading-relaxed opacity-90">
              We are currently curating a comprehensive library of evidence-based physiotherapy resources, clinical guides, and structured study materials.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/"><Button variant="secondary" className="px-8 py-3.5">← Back to Home</Button></Link>
              <Link to="/contact"><Button className="bg-accent hover:bg-accent-light text-primary font-bold px-8 py-3.5 shadow-xl">Notify Me</Button></Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SEO title="Resources — ZK Rehab Sphere" description="Access our curated collection of articles, guides, and clinical notes for physiotherapy." />

      {/* Hero */}
      <section className="relative pt-4 pb-16 lg:pb-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="container mx-auto px-4 text-center relative z-10 text-white pt-8">
          <span className="text-accent font-bold tracking-wider uppercase text-sm mb-3 block">Knowledge Hub</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Resources Library</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Access our curated collection of articles, guides, and clinical notes.</p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['all', 'blog', 'pdf', 'clinical-notes'].map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setLoading(true); }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-accent text-primary' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
              >
                {cat === 'all' ? 'All' : cat === 'clinical-notes' ? 'Clinical Notes' : cat === 'pdf' ? 'PDF Guides' : 'Blog Posts'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          {error && <p className="text-center text-red-500 mb-8">{error}</p>}

          {activeCategory === 'all' ? (
            // Grouped view
            Object.entries(grouped).map(([cat, items]) => {
              if (items.length === 0) return null;
              const cfg = categoryConfig[cat];
              const Icon = cfg.icon;
              return (
                <div key={cat} className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 ${cfg.bg} rounded-xl flex items-center justify-center`}>
                      <Icon size={20} className={cfg.color} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{cfg.label}s</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(r => <ResourceCard key={r._id} resource={r} onDownload={handleDownload} />)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map(r => <ResourceCard key={r._id} resource={r} onDownload={handleDownload} />)}
            </div>
          )}

          {resources.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-slate-400 font-medium">No resources found in this category yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const ResourceCard = ({ resource, onDownload }) => {
  const cfg = categoryConfig[resource.category] || categoryConfig.blog;
  const Icon = cfg.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      {resource.coverImage && (
        <div className="h-44 overflow-hidden">
          <img
            src={resource.coverImage.startsWith('/uploads') ? `${API_BASE}${resource.coverImage}` : resource.coverImage}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-8 h-8 ${cfg.bg} rounded-lg flex items-center justify-center`}>
            <Icon size={16} className={cfg.color} />
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
        </div>
        <h3 className="font-bold text-slate-800 text-lg mb-2 leading-tight group-hover:text-primary transition-colors">{resource.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{resource.description}</p>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span>{resource.author}</span>
          <span className="flex items-center gap-1"><Eye size={12} /> {resource.viewCount || 0}</span>
        </div>
        {resource.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs">{tag}</span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          {resource.fileUrl ? (
            <button
              onClick={() => onDownload(resource)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              <Download size={14} /> Download
            </button>
          ) : (
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
              <ArrowRight size={14} /> Read More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;
