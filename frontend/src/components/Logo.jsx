import React from 'react';

const Logo = ({ className = "", light = false, showTagline = false, circular = false, size = "md" }) => {
  const brandTeal = "#319795"; 
  const brandDark = "#2C3E50";
  const iconColor = light ? "white" : brandTeal;
  const textColorPrimary = light ? "white" : brandDark;
  const textColorSecondary = light ? "white" : brandTeal;

  const isSm = size === "sm";

  return (
    <div className={`flex items-center gap-2 ${circular ? 'border-2 border-slate-900 rounded-full p-6 bg-white aspect-square shadow-lg' : ''} ${className}`}>
      {/* Text Section - Branded Typography */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span className={`${isSm ? 'text-4xl' : 'text-5xl'} font-black italic tracking-tighter`} style={{ color: textColorPrimary }}>Z</span>
          <span className={`${isSm ? 'text-4xl' : 'text-5xl'} font-black tracking-tighter -ml-0.5`} style={{ color: textColorSecondary }}>K</span>
        </div>
        <div className="flex flex-col mt-1 leading-none">
          <div className={`flex ${isSm ? 'text-[9px]' : 'text-[11px]'} font-black tracking-[0.2em] uppercase`}>
            <span style={{ color: textColorPrimary }}>REHAB</span>
            <span className="ml-1.5" style={{ color: textColorSecondary }}>SPHERE</span>
          </div>
          {showTagline && (
            <div className={`text-[7px] font-bold tracking-[0.05em] uppercase mt-1 leading-[1.1] ${light ? 'text-white/90' : 'text-slate-600'}`}>
              EMPOWERING MOVEMENT,<br/>RESTORING LIFE
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logo;
