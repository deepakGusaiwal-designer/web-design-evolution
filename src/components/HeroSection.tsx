import React, { useEffect, useState } from 'react';
import { ArrowDown, Sparkles, MousePointer } from 'lucide-react';
import TechText from './reactbits/TechText';
import DecryptedText from './reactbits/DecryptedText';

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
    const timer1 = setTimeout(() => setMounted(true), 250);
    const timer2 = setTimeout(() => setWordWebRevealed(true), 1600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center py-36 sm:py-48 px-6 sm:px-12 text-center select-none overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-radial from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Hero Typography with Generous Breathing Space */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center w-full">
        {/* Story Chapter Marker */}
        <div
          className={`flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 sm:mb-12 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <DecryptedText
            text="PROLOGUE // THE THIRTY-YEAR SPATIAL CHRONICLE"
            speed={35}
            maxIterations={12}
            animateOn="view"
            className="font-mono text-xs tracking-widest text-slate-300 uppercase"
            encryptedClassName="font-mono text-xs text-cyan-400 opacity-80"
          />
        </div>

        {/* PRIMARY HERO: INTERACTIVE VECTOR TYPOGRAPHY (Tech Text) */}
        <div
          onMouseEnter={() => onHoverTitle?.(true)}
          onMouseLeave={() => onHoverTitle?.(false)}
          className={`w-full max-w-4xl h-[180px] sm:h-[240px] md:h-[280px] my-4 relative flex items-center justify-center transition-all duration-1000 ${
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <TechText
            text="THE WEB EVOLVED"
            fontSize={120}
            color="#ffffff"
            accentColor="#00f0ff"
            fontFamily="Syne, 'DM Sans', sans-serif"
            fontWeight={800}
            letterSpacing={-0.03}
            selection={true}
            labels={true}
            draggable={true}
            reach={220}
            softness={0.7}
            specks={20}
            strokeWidth={1.8}
            dashLength={4}
            dashGap={2}
            lineStyle="dashed"
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />
        </div>

        {/* Interactive Story Guide */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400/80 mb-10 tracking-widest uppercase">
          <MousePointer className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>[VECTOR TELEMETRY ACTIVE // DRAG LETTERS TO DISRUPT THE BASELINE]</span>
        </div>

        {/* Core Philosophical Statement with DecryptedText on Hover */}
        <div className="mb-6 max-w-3xl mx-auto">
          <DecryptedText
            text="“The web stopped being a document. It became an experience.”"
            speed={25}
            maxIterations={12}
            animateOn="hover"
            className="font-dm text-2xl sm:text-3xl md:text-4xl text-slate-100 font-light leading-relaxed cursor-pointer"
            encryptedClassName="font-dm text-2xl sm:text-3xl text-cyan-400 font-light"
          />
        </div>

        <p
          className={`font-dm text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed mb-14 transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          In 1991, humanity pinned the first piece of text to a digital screen. Over three decades, that sterile document learned how to breathe, move, expand into 3D space, compute on silicon GPUs, and synthesize reality.
        </p>

        {/* Formed Particle Structure Indicator */}
        <div
          className={`transition-all duration-1000 delay-700 mb-16 ${
            wordWebRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/60 text-slate-300 font-mono text-xs tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            INITIALIZING 1991 MONOCHROME PARTICLES
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
          <span className="font-mono text-xs tracking-[0.25em] uppercase">
            BEGIN THE ODYSSEY
          </span>
          <div className="w-11 h-11 rounded-full border border-white/20 group-hover:border-cyan-400/60 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]">
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </button>
      </div>
    </section>
  );
};
