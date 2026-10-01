import React, { useEffect, useState } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onHoverTitle?: (hovering: boolean) => void;
  onExploreClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onHoverTitle,
  onExploreClick,
}) => {
  const [mounted, setMounted] = useState(false);
  const [wordWebRevealed, setWordWebRevealed] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setMounted(true), 300);
    const timer2 = setTimeout(() => setWordWebRevealed(true), 1800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 text-center select-none overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-radial from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Hero Typography */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Subtle sub-header */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-mono text-[11px] tracking-widest text-slate-300 uppercase">
            An Interactive Spatial Chronicle
          </span>
        </div>

        {/* Primary Staggered Titles */}
        <h1
          onMouseEnter={() => onHoverTitle?.(true)}
          onMouseLeave={() => onHoverTitle?.(false)}
          className={`font-syne font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white mb-2 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          data-cursor-hover
        >
          THE WEB
        </h1>

        <h2
          onMouseEnter={() => onHoverTitle?.(true)}
          onMouseLeave={() => onHoverTitle?.(false)}
          className={`font-syne font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-violet-500 mb-6 transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          data-cursor-hover
        >
          EVOLVED.
        </h2>

        {/* Central Core Statement */}
        <p
          className={`font-space text-lg sm:text-2xl md:text-3xl text-slate-300 font-light max-w-2xl mx-auto mb-4 transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          “From documents to experiences.”
        </p>

        <p
          className={`font-mono text-xs sm:text-sm text-slate-400 max-w-lg mx-auto tracking-wide mb-12 transition-all duration-1000 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          The web stopped being a document. It became an experience.
          <br className="hidden sm:inline" />
          What happens when imagination becomes the interface?
        </p>

        {/* Formed Particle Structure Indicator */}
        <div
          className={`transition-all duration-1000 delay-1000 mb-10 ${
            wordWebRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-400/30 bg-cyan-950/30 text-cyan-300 font-mono text-[11px] tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            PARTICLES CONVERGED INTO: &apos;WEB&apos;
          </div>
        </div>

        {/* Call to Action Scroll Button */}
        <button
          onClick={onExploreClick}
          data-cursor-hover
          className={`group flex flex-col items-center gap-3 transition-all duration-1000 delay-1000 text-slate-400 hover:text-cyan-300 focus:outline-none ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase">
            Commence The Journey
          </span>
          <div className="w-9 h-9 rounded-full border border-white/20 group-hover:border-cyan-400/60 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </button>
      </div>
    </section>
  );
};
