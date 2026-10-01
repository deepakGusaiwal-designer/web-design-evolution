import React, { useState } from 'react';
import { ArrowDown, Compass, Layers, Cpu, Brain, Orbit, Sliders, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import ShinyText from './reactbits/ShinyText';
import ClickSpark from './reactbits/ClickSpark';
import TrueFocus from './reactbits/TrueFocus';
import type { LiquidColorScheme } from './reactbits/LiquidEther';

interface HeroSectionProps {
  onHoverTitle?: (hovering: boolean) => void;
  onExploreClick?: () => void;
  etherPalette?: LiquidColorScheme;
  onChangePalette?: (palette: LiquidColorScheme) => void;
  viscosity?: number;
  onChangeViscosity?: (v: number) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onHoverTitle,
  onExploreClick,
  etherPalette = 'nebula',
  onChangePalette,
  viscosity = 0.85,
  onChangeViscosity,
}) => {
  const [showEtherControls, setShowEtherControls] = useState(false);

  const milestones = [
    { year: "1989", label: "DARK AGES", icon: Compass, color: "text-slate-400" },
    { year: "1991", label: "HTML", icon: Compass, color: "text-slate-300" },
    { year: "1996", label: "CSS", icon: Layers, color: "text-sky-400" },
    { year: "1999", label: "FLASH", icon: Orbit, color: "text-amber-400" },
    { year: "2007", label: "MOBILE", icon: Layers, color: "text-emerald-400" },
    { year: "2013", label: "FLAT", icon: Layers, color: "text-pink-400" },
    { year: "2019", label: "WEBGL", icon: Cpu, color: "text-cyan-400" },
    { year: "2024", label: "AI", icon: Brain, color: "text-violet-400" },
    { year: "2026+", label: "SPATIAL", icon: Orbit, color: "text-cyan-300" },
  ];

  const focusEras = [
    { id: '1989', label: '1989 Dark Ages', badge: 'CERN' },
    { id: '1996', label: '1996 CSS Invention', badge: 'Style' },
    { id: '1999', label: '1999 Flash Era', badge: 'Motion' },
    { id: '2007', label: '2007 Skeuomorphism', badge: 'iPhone' },
    { id: '2013', label: '2013 Flat Design', badge: 'Minimal' },
    { id: '2019', label: '2019 GPU & WebGL', badge: '3D' },
    { id: '2026', label: '2026+ Spatial Web', badge: 'Vision' },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center py-24 sm:py-32 px-6 sm:px-12 text-center select-none overflow-hidden font-dm">
      {/* Subtle radial vignette overlay to keep text pristine over the fluid ether */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#050508]/40 to-[#050508]/90 pointer-events-none" />

      {/* Hero Container with Generous Breathing Space */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center w-full">
        {/* Story Chapter Marker with ShinyText */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-black/50 backdrop-blur-md mb-6">
          <Droplets className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <ShinyText
            text="HISTORICAL RETROSPECTIVE // 1989 — 2026+"
            speed={4}
            className="text-xs tracking-widest text-slate-200 uppercase font-semibold"
            shimmerColor="#00f0ff"
          />
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
                className="inline-flex text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.25)]"
              >
                {word.split('').map((char, cIdx) => (
                  <motion.span
                    key={cIdx}
                    whileHover={{ scale: 1.08, y: -6, color: '#00f0ff' }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    className="inline-block transition-colors cursor-pointer"
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
                whileHover={{ scale: 1.1, y: -8 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="inline-block text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-violet-400 glow-text-cyan cursor-pointer"
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Interactive Kinetic Subtitle */}
        <div className="my-5 max-w-3xl mx-auto">
          <p className="font-dm text-2xl sm:text-4xl text-slate-100 font-medium leading-relaxed drop-shadow-[0_0_30px_rgba(255,255,255,0.18)]">
            “The web stopped being a document. It became an experience.”
          </p>
        </div>

        {/* Canva Historical Thesis */}
        <p className="font-dm text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
          In 1989, humanity lived in the terminal dark ages with black screens, pixelated monospace text, and the <code className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-sm">TAB</code> key. Over three decades, that sterile parchment broke free into tables, Cascading Style Sheets, interactive Flash soundscapes, skeuomorphic leather, flat design, WebGL shaders, and autonomous AI spatial fabrics.
        </p>

        {/* TrueFocus Historical Eras Interactive Reticle */}
        <div className="mb-8 hidden sm:block">
          <TrueFocus items={focusEras} activeId="1989" accentColor="#00f0ff" />
        </div>

        {/* 30-Year Paradigm Progression Ticker */}
        <div className="w-full max-w-4xl mx-auto mb-10 p-3 sm:p-4 rounded-2xl glass-panel border border-white/10 flex flex-wrap items-center justify-around gap-2 sm:gap-3">
          {milestones.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.year} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 border border-white/5">
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                <span className="font-dm text-xs font-bold text-white">{m.year}</span>
                <span className="font-dm text-[11px] text-slate-400 uppercase tracking-wider">{m.label}</span>
              </div>
            );
          })}
        </div>

        {/* Liquid Ether Interactive HUD Controls */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowEtherControls(!showEtherControls)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-400/30 bg-black/60 hover:bg-cyan-950/50 text-xs font-dm text-cyan-300 transition-all cursor-pointer backdrop-blur-md shadow-lg"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Liquid Fluid Shader: <strong className="uppercase">{etherPalette}</strong></span>
          </button>

          {showEtherControls && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl glass-panel border border-white/15 text-xs text-slate-300 shadow-xl"
            >
              <span className="text-[11px] uppercase font-bold text-slate-400">Palette:</span>
              <button
                onClick={() => onChangePalette?.('nebula')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${etherPalette === 'nebula' ? 'bg-cyan-500/30 text-cyan-200 font-bold' : 'hover:text-white'}`}
              >
                Nebula
              </button>
              <button
                onClick={() => onChangePalette?.('aurora')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${etherPalette === 'aurora' ? 'bg-emerald-500/30 text-emerald-200 font-bold' : 'hover:text-white'}`}
              >
                Aurora
              </button>
              <button
                onClick={() => onChangePalette?.('cyber')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${etherPalette === 'cyber' ? 'bg-pink-500/30 text-pink-200 font-bold' : 'hover:text-white'}`}
              >
                Cyber
              </button>

              <span className="text-slate-500">|</span>
              <span className="text-[11px] uppercase font-bold text-slate-400">Viscosity:</span>
              <input
                type="range"
                min="0.3"
                max="1.8"
                step="0.1"
                value={viscosity}
                onChange={(e) => onChangeViscosity?.(parseFloat(e.target.value))}
                className="w-16 accent-cyan-400 cursor-pointer"
              />
            </motion.div>
          )}
        </div>

        {/* Ultra-Clean, Guaranteed Click Call to Action Button */}
        <ClickSpark sparkColor="#00f0ff" sparkCount={12}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onExploreClick}
            className="group flex flex-col items-center gap-3 text-slate-300 hover:text-cyan-300 focus:outline-none transition-all cursor-pointer p-3"
          >
            <span className="font-dm text-xs tracking-[0.25em] uppercase font-semibold text-slate-300 group-hover:text-cyan-300">
              BEGIN THE ODYSSEY
            </span>
            <div className="w-13 h-13 rounded-full border border-white/20 group-hover:border-cyan-400 bg-black/60 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_35px_rgba(0,240,255,0.45)]">
              <ArrowDown className="w-5 h-5 text-white group-hover:text-cyan-300 group-hover:translate-y-1 transition-transform" />
            </div>
          </motion.button>
        </ClickSpark>
      </div>
    </section>
  );
};
export default HeroSection;
