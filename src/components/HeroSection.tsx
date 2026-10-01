import React from 'react';
import { ArrowDown, Sparkles, Compass, Layers, Cpu, Brain, Orbit } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onHoverTitle?: (hovering: boolean) => void;
  onExploreClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onHoverTitle,
  onExploreClick,
}) => {

  const milestones = [
    { year: "1991", label: "HTML", icon: Compass, color: "text-slate-400" },
    { year: "1996", label: "CSS", icon: Layers, color: "text-sky-400" },
    { year: "2006", label: "MOTION", icon: Sparkles, color: "text-purple-400" },
    { year: "2015", label: "3D", icon: Layers, color: "text-pink-400" },
    { year: "2019", label: "GPU", icon: Cpu, color: "text-cyan-400" },
    { year: "2023", label: "AI", icon: Brain, color: "text-violet-400" },
    { year: "2026+", label: "SPATIAL", icon: Orbit, color: "text-cyan-300" },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center py-28 sm:py-36 px-6 sm:px-12 text-center select-none overflow-hidden font-dm">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-radial from-cyan-950/25 via-transparent to-transparent pointer-events-none" />

      {/* Hero Container with Generous Breathing Space */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center w-full">
        {/* Story Chapter Marker */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-dm text-xs tracking-widest text-slate-200 uppercase font-semibold">
            PROLOGUE // THE THIRTY-YEAR SPATIAL CHRONICLE
          </span>
        </div>

        {/* PRIMARY HERO TITLE: MONUMENTAL DM SANS TYPOGRAPHY */}
        <div
          onMouseEnter={() => onHoverTitle?.(true)}
          onMouseLeave={() => onHoverTitle?.(false)}
          className="my-3 flex flex-col items-center justify-center cursor-default"
        >
          <div className="flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-6">
            {"THE WEB".split(' ').map((word, wIdx) => (
              <span
                key={wIdx}
                className="inline-flex text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                {word.split('').map((char, cIdx) => (
                  <motion.span
                    key={cIdx}
                    whileHover={{ scale: 1.12, y: -8, color: '#00f0ff' }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="inline-block transition-colors"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center items-center mt-1 sm:mt-2">
            {"EVOLVED.".split('').map((char, cIdx) => (
              <motion.span
                key={cIdx}
                whileHover={{ scale: 1.15, y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="inline-block text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-violet-400 glow-text-cyan"
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Interactive Kinetic Subtitle */}
        <div className="my-6 max-w-3xl mx-auto">
          <p className="font-dm text-2xl sm:text-4xl text-slate-100 font-medium leading-relaxed drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            “The web stopped being a document. It became an experience.”
          </p>
        </div>

        <p className="font-dm text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          In 1991, humanity pinned the first piece of text to a digital screen. Over three decades, that sterile parchment learned to breathe, animate, expand into 3D coordinates, execute on silicon GPUs, and synthesize thought.
        </p>

        {/* 30-Year Paradigm Progression Ticker */}
        <div className="w-full max-w-4xl mx-auto mb-12 p-3 sm:p-4 rounded-2xl glass-panel border border-white/10 flex flex-wrap items-center justify-around gap-2 sm:gap-4">
          {milestones.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.year} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40">
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                <span className="font-dm text-xs font-bold text-white">{m.year}</span>
                <span className="font-dm text-[11px] text-slate-400 uppercase tracking-wider">{m.label}</span>
              </div>
            );
          })}
        </div>

        {/* Call to Action Scroll Button */}
        <button
          onClick={onExploreClick}
          className="group flex flex-col items-center gap-3 text-slate-300 hover:text-cyan-300 focus:outline-none transition-colors cursor-pointer"
        >
          <span className="font-dm text-xs tracking-[0.25em] uppercase font-semibold">
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
