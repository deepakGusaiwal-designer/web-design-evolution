import React from 'react';

interface BrandLogoProps {
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = React.memo(({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 text-left cursor-pointer focus:outline-none"
      title="Return to Chapter 00 — Prologue"
    >
      {/* Black & White Architectural Particle-Globe 'W' Emblem */}
      <div className="relative w-8 h-8 rounded-lg bg-black border border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_16px_rgba(255,255,255,0.08)] flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-white group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_0_20px_rgba(255,255,255,0.22)] shrink-0">
        <svg
          viewBox="0 0 120 120"
          fill="none"
          className="w-6 h-6 transition-transform duration-500 group-hover:scale-105"
          aria-hidden="true"
        >
          {/* Left Hemisphere: 1989 CERN Wireframe Meridian */}
          <path
            d="M60 16C35.6995 16 16 35.6995 16 60C16 84.3005 35.6995 104 60 104"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M60 16C45.5 16 34 35.6995 34 60C34 84.3005 45.5 104 60 104"
            stroke="#FFFFFF"
            strokeOpacity="0.5"
            strokeWidth="3"
          />
          <line
            x1="18"
            y1="60"
            x2="60"
            y2="60"
            stroke="#FFFFFF"
            strokeOpacity="0.45"
            strokeWidth="3"
          />

          {/* Tilted Orbital Ring */}
          <ellipse
            cx="60"
            cy="60"
            rx="48"
            ry="16"
            transform="rotate(-24 60 60)"
            stroke="#FFFFFF"
            strokeOpacity="0.85"
            strokeWidth="3.5"
            strokeDasharray="6 5"
          />

          {/* Bold Geometric 'W' Monogram */}
          <path
            d="M32 45L44 77L60 49L76 77L88 45"
            stroke="#FFFFFF"
            strokeWidth="7.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          {/* Right Hemisphere: Dissolving Particle Nodes */}
          <circle cx="74" cy="20" r="4.2" fill="#FFFFFF" />
          <circle cx="88" cy="28" r="3.8" fill="#FFFFFF" />
          <circle cx="99" cy="43" r="4.5" fill="#FFFFFF" />
          <circle cx="103" cy="60" r="4.2" fill="#FFFFFF" />
          <circle cx="99" cy="77" r="4.0" fill="#FFFFFF" />
          <circle cx="88" cy="92" r="3.6" fill="#FFFFFF" />
          <circle cx="74" cy="100" r="4.0" fill="#FFFFFF" />
          <circle cx="60" cy="16" r="4.5" fill="#FFFFFF" />
          <circle cx="60" cy="104" r="4.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Black & White Brand Wordmark Lockup */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-2">
          <span className="font-dm font-extrabold text-xs sm:text-[13px] tracking-[0.22em] text-white uppercase whitespace-nowrap group-hover:tracking-[0.24em] transition-all">
            WEB EVOLUTION
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white text-black font-mono font-bold text-[8px] tracking-widest uppercase">
            1989—∞
          </span>
        </div>
        <span className="font-mono text-[8px] tracking-[0.2em] text-neutral-400 uppercase mt-0.5 whitespace-nowrap group-hover:text-neutral-200 transition-colors">
          PARTICLE STORY ARCHIVE
        </span>
      </div>
    </button>
  );
});

export default BrandLogo;
