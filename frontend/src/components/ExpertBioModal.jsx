import React from 'react';
import { X, Award, Clock, GraduationCap, Quote } from 'lucide-react';
import Button from './Button';

const ExpertBioModal = ({ isOpen, onClose, expert }) => {
  if (!isOpen || !expert) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header/Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all shadow-sm border border-slate-100"
        >
          <X size={20} />
        </button>

        {/* Content Container */}
        <div className="flex flex-col md:flex-row h-full overflow-y-auto">
          {/* Left: Image Side */}
          <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden bg-slate-100">
             <img 
               src={expert.image} 
               alt={expert.name} 
               className="w-full h-full object-cover object-top"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>

          {/* Right: Info Side */}
          <div className="md:w-3/5 p-6 md:p-8 flex flex-col pt-4 md:pt-8 bg-white overflow-y-auto">
            <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider mb-2">
                    {expert.role}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1">{expert.name}</h2>
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="flex items-center gap-1.5"><Award size={14} className="text-primary"/> {expert.degree}</div>
                    <div className="flex items-center gap-1.5"><Clock size={14} className="text-primary"/> {expert.experience}</div>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                    <Quote className="text-secondary/20 shrink-0" size={24} />
                    <div className="space-y-4">
                        {expert.bio.split('\n').filter(p => p.trim()).map((para, i) => (
                            <p key={i} className="text-slate-600 leading-relaxed text-sm md:text-base italic">
                                {para.trim()}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <GraduationCap size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Clinical Excellence</span>
                </div>
                <Button onClick={onClose} size="sm" variant="outline-primary">Close Profile</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertBioModal;
