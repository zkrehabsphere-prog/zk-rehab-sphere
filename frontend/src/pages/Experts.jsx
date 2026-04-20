import React, { useState, useEffect } from 'react';
import { Award, Clock, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import SEO from '../components/SEO';
import DoctorCard from '../components/DoctorCard';
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
          <p className="text-slate-500">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SEO
        title="Our Doctors - ZK Rehab Sphere"
        description="Meet our team of experienced and compassionate physiotherapy professionals."
      />
      <div className="bg-slate-50 pt-8 pb-12 lg:pt-12 lg:pb-20">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Doctors" subtitle="Meet the team dedicated to your recovery." className="mb-12" />


          {error && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 mb-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!error && expertData.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500">No doctors found.</p>
            </div>
          )}


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {expertData.map((expert) => (
              <DoctorCard 
                key={expert._id} 
                doctor={expert} 
                onViewProfile={handleViewProfile} 
              />
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
