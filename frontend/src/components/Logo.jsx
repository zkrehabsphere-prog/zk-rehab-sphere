import React from 'react';
import logoImg from '../assets/logo.png';

const Logo = ({ className = "", size = "md" }) => {
  const isSm = size === "sm";
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`
        ${isSm ? 'w-10 h-10' : 'w-14 h-14 md:w-16 md:h-16'} 
        rounded-full overflow-hidden shadow-lg border-2 border-slate-100 bg-white shrink-0
      `}>
        <img 
          src={logoImg} 
          alt="ZK Rehab Sphere" 
          className="w-full h-full object-cover scale-[1.2]" 
        />
      </div>
      
      {/* Branding Text - Optional if the logo already has text, but keeping for better accessibility/presence if needed */}
      <div className="flex flex-col leading-none">
        <span className={`${isSm ? 'text-lg' : 'text-xl md:text-2xl'} font-black text-slate-800 tracking-tighter`}>
          ZK REHAB <span className="text-primary italic">SPHERE</span>
        </span>
        <span className={`${isSm ? 'text-[7px]' : 'text-[9px]'} font-bold text-slate-500 uppercase tracking-widest mt-0.5`}>
          Empowering Movement
        </span>
      </div>
    </div>
  );
};

export default Logo;

