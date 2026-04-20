import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Award, Clock, BookOpen, ChevronLeft, Calendar, 
  MapPin, Globe, Linkedin, Twitter, Facebook 
} from 'lucide-react';
import { expertsAPI } from '../api/axios';
import SEO from '../components/SEO';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await expertsAPI.getById(id);
        setDoctor(res.data.expert);
      } catch (err) {
        setError('Expert profile not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !doctor) return <div className="min-h-screen flex items-center justify-center p-4"><div className="text-center"><h2 className="text-xl font-bold text-slate-800 mb-2">{error}</h2><button onClick={() => navigate('/experts')} className="text-primary font-bold">Back to Experts</button></div></div>;

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <SEO title={`${doctor.name} — Pediatric Expert`} />
      
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-semibold text-sm"
        >
          <ChevronLeft size={16} /> Back to Search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar / Photo */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border-4 border-white mb-6 aspect-[4/5]">
              <img 
                src={doctor.image || '/placeholder.jpg'} 
                alt={doctor.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => navigate('/book-appointment', { state: { selectedDoctor: doctor.linkedUserId?._id } })}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-dark transition-all hover:shadow-xl hover:shadow-primary/20"
              >
                Book Appointment
              </button>

              {/* Social Links if available */}
              {doctor.socialLinks && Object.values(doctor.socialLinks).some(v => v) && (
                <div className="flex justify-center gap-4 py-2">
                  {doctor.socialLinks.linkedin && <a href={doctor.socialLinks.linkedin} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-full transition-colors"><Linkedin size={18} /></a>}
                  {doctor.socialLinks.twitter && <a href={doctor.socialLinks.twitter} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-400 rounded-full transition-colors"><Twitter size={18} /></a>}
                  {doctor.socialLinks.facebook && <a href={doctor.socialLinks.facebook} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-700 rounded-full transition-colors"><Facebook size={18} /></a>}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                 <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                    Pediatric Specialist
                 </span>
                 <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                    Available for Consultation
                 </span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 mb-2">{doctor.name}</h1>
              <p className="text-lg text-slate-600 font-medium">{doctor.role} — Expert in Child Rehabilitation</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:border-primary/30 transition-colors">
                <BookOpen className="text-primary mb-3" size={20} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Education</p>
                <p className="text-slate-800 font-black">{doctor.degree}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:border-primary/30 transition-colors">
                <Clock className="text-primary mb-3" size={20} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                <p className="text-slate-800 font-black">{doctor.experience}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:border-primary/30 transition-colors hidden md:block">
                <Award className="text-primary mb-3" size={20} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
                <p className="text-slate-800 font-black">98% Satisfied</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
                <User size={24} className="text-primary" /> About {doctor.name}
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                {doctor.bio}
              </p>
            </div>

            {/* Specializations */}
            {doctor.specializations?.length > 0 && (
              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-6">Expertise & Specializations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {doctor.specializations.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {idx + 1}
                      </div>
                      <span className="text-slate-700 font-bold">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
