import React from 'react';
import { Award, Clock, Mail, Phone } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

import { useNavigate } from 'react-router-dom';

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('data:image')) return image; 
  if (image.startsWith('http')) return image; 
  if (image.startsWith('/uploads')) return `${API_BASE}${image}`;
  return image;
};

const DoctorCard = ({ doctor }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  return (
    <Card className="text-center group p-0 overflow-hidden border-none hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 bg-white">
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src={getImageUrl(doctor.image) || '/placeholder.jpg'}
          alt={doctor.name}
          className="w-full h-full object-cover object-top transform group-hover:scale-110 transition-transform duration-1000"
          onError={e => { e.target.src = 'https://via.placeholder.com/300x288/e2e8f0/94a3b8?text=Doctor'; }}
        />
        <div className="absolute bottom-6 left-0 right-0 z-20 px-6">
           <h3 className="text-2xl font-black text-white mb-0 shadow-sm leading-tight">{doctor.name}</h3>
           <p className="text-primary-light font-bold uppercase text-[10px] tracking-[0.2em]">{doctor.role}</p>
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex items-center justify-center gap-6 mb-8 text-slate-600">
          <div className="text-center group/item hover:text-primary transition-colors">
            <Award size={18} className="mx-auto mb-1 text-slate-300 group-hover/item:text-primary transition-colors" /> 
            <p className="text-[10px] font-black uppercase tracking-widest">{doctor.degree}</p>
          </div>
          <div className="w-[1px] h-8 bg-slate-100" />
          <div className="text-center group/item hover:text-primary transition-colors">
            <Clock size={18} className="mx-auto mb-1 text-slate-300 group-hover/item:text-primary transition-colors" /> 
            <p className="text-[10px] font-black uppercase tracking-widest">{doctor.experience}</p>
          </div>
        </div>

        {/* Admin only contact details */}
        {isAdmin && doctor.linkedUserId && (
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl space-y-2 text-left border border-slate-100">
            <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-tighter">Admin Visibility Only</p>
            <div className="flex items-center gap-2 text-xs text-slate-600 truncate font-semibold">
               <Mail size={14} className="text-primary shrink-0" /> {doctor.linkedUserId.email}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button 
            onClick={() => navigate(`/experts/${doctor._id}`)} 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white border-none py-4 text-xs font-black tracking-widest"
          >
            Explore Profile
          </Button>
          <Button 
            onClick={() => navigate('/book-appointment', { state: { selectedDoctor: doctor.linkedUserId?._id } })}
            variant="outline"
            className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 py-3.5 text-[10px] font-bold"
          >
            Quick Booking
          </Button>
        </div>
      </div>
    </Card>
  );
};


export default DoctorCard;
