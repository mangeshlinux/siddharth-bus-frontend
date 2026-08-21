import React from 'react';

export default function Logo({ size = 'md', className = '', showText = false }) {
  const sizeClasses = {
    xs: 'w-10 h-10',
    sm: 'w-12 h-12',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-32 h-32',
    hero: 'w-44 h-44 sm:w-52 sm:h-52'
  };

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <div className={`relative ${sizeClasses[size] || sizeClasses.md} flex-shrink-0 transition-transform duration-300 hover:scale-105 group`}>
        
        {/* Subtle Golden Glow Halo */}
        <div className="absolute -inset-1 rounded-full bg-[#D97B29]/30 blur-md group-hover:bg-[#D97B29]/50 transition-all pointer-events-none" />
        
        {/* Official Brand Logo Image */}
        <div className="relative z-10 w-full h-full rounded-full overflow-hidden shadow-xl border border-[#B08D57]/40 bg-[#3B2314]">
          <img 
            src="/logo.png" 
            alt="Siddharth School Bus & Travels Logo" 
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-black tracking-tight text-white text-2xl sm:text-3xl font-heading leading-none">
            SIDDHARTH
          </span>
          <span className="text-xs sm:text-sm font-black text-[#D97B29] tracking-widest uppercase mt-0.5">
            School Bus &amp; Travels
          </span>
          <span className="text-[11px] text-[#FBF3E7]/80 font-medium">
            Safe &amp; Reliable Journeys • Nashik
          </span>
        </div>
      )}
    </div>
  );
}
