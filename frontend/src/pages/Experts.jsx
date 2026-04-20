import React, { useState, useEffect } from 'react';
import { Award, Clock, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import SEO from '../components/SEO';
import ExpertBioModal from '../components/ExpertBioModal';
import { expertsAPI } from '../api/axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image; // External URL
  if (image.startsWith('/uploads')) return `${API_BASE}${image}`; // Uploaded file
  return image; // Fallback
};

const Experts = () => {
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expertData, setExpertData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await expertsAPI.getAll();
        setExpertData(res.data.experts || []);
      } catch (err) {
        setError('Failed to load experts. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const handleViewProfile = (expert) => {
    setSelectedExpert(expert);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-primary mx-auto mb-3" />
          <p className="text-slate-500">Loading experts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SEO
        title="Our Experts - ZK Rehab Sphere"
        description="Meet our team of experienced and compassionate physiotherapy professionals."
      />
      <div className="bg-slate-50 pt-8 pb-12 lg:pt-12 lg:pb-20">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Experts" subtitle="Meet the team dedicated to your recovery." className="mb-12" />

          {error && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 mb-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!error && expertData.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500">No experts found.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {expertData.map((expert) => (
              <Card key={expert._id} className="text-center group p-0 overflow-hidden border-none hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-72 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
                  <img
                    src={getImageUrl(expert.image) || '/placeholder.jpg'}
                    alt={expert.name}
                    className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                    onError={e => { e.target.src = 'https://via.placeholder.com/300x288/e2e8f0/94a3b8?text=Expert'; }}
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{expert.name}</h3>
                  <p className="text-primary font-medium mb-4 uppercase text-sm tracking-wide">{expert.role}</p>
                  <div className="flex flex-col gap-2 text-gray-600 text-sm mb-6">
                    <div className="flex items-center justify-center gap-2">
                      <Award size={16} className="text-secondary" /> {expert.degree}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock size={16} className="text-secondary" /> {expert.experience}
                    </div>
                  </div>
                  {expert.specializations?.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {expert.specializations.slice(0, 2).map(s => (
                        <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  )}
                  <Button onClick={() => handleViewProfile(expert)} className="w-full">View Profile</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <ExpertBioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expert={selectedExpert}
        getImageUrl={getImageUrl}
      />
    </div>
  );
};

export default Experts;
