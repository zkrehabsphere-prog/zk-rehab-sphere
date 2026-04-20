import React from 'react';
import logoImg from '../assets/logo.png';

const Logo = ({ className = "", size = "md" }) => {
  const isSm = size === "sm";
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`
        ${isSm ? 'w-10 h-10' : 'w-16 h-16 md:w-20 md:h-20'} 
        rounded-full overflow-hidden shadow-xl border-2 border-slate-100 bg-white shrink-0
      `}>
        <img 
          src={logoImg} 
          alt="ZK Rehab Sphere" 
          className="w-full h-full object-cover scale-[1.1]" 
        />
      </div>
    </div>
  );
};

export default Logo;


