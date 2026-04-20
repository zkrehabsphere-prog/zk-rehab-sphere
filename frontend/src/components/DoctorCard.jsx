import React from 'react';
import { Award, Clock, Mail, Phone } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image; 
  if (image.startsWith('/uploads')) return `${API_BASE}${image}`;
  return image;
};

const DoctorCard = ({ doctor, onViewProfile }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Card className="text-center group p-0 overflow-hidden border-none hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
        <img
          src={getImageUrl(doctor.image) || '/placeholder.jpg'}
          alt={doctor.name}
          className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
          onError={e => { e.target.src = 'https://via.placeholder.com/300x288/e2e8f0/94a3b8?text=Doctor'; }}
        />
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
        <p className="text-primary font-medium mb-4 uppercase text-sm tracking-wide">{doctor.role}</p>
        
        <div className="flex flex-col gap-3 text-gray-600 text-sm mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-center gap-2">
            <Award size={16} className="text-secondary" /> 
            <span className="font-medium text-slate-700">{doctor.degree}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock size={16} className="text-secondary" /> 
            <span className="font-medium text-slate-700">{doctor.experience}</span>
          </div>
        </div>

        {doctor.bio && (
          <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 italic">
            "{doctor.bio.length > 100 ? `${doctor.bio.substring(0, 100)}...` : doctor.bio}"
          </p>
        )}

        {/* Admin only contact details */}

        {isAdmin && doctor.linkedUserId && (
          <div className="mb-6 p-3 bg-slate-50 rounded-xl space-y-2 text-left border border-slate-200">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Administrative Info</p>
            <div className="flex items-center gap-2 text-xs text-slate-600 truncate">
               <Mail size={14} className="text-primary shrink-0" /> {doctor.linkedUserId.email}
            </div>
            {doctor.linkedUserId.phone && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                 <Phone size={14} className="text-primary shrink-0" /> {doctor.linkedUserId.phone}
              </div>
            )}
          </div>
        )}

        {doctor.specializations?.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center mb-6">
            {doctor.specializations.slice(0, 3).map(s => (
              <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">{s}</span>
            ))}
          </div>
        )}
        <Button onClick={() => onViewProfile(doctor)} className="w-full">View Profile</Button>
      </div>
    </Card>
  );
};

export default DoctorCard;
