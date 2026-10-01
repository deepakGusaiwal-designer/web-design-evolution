import React, { useState } from 'react';
import { ArrowDown, Sparkles, Sliders, Compass, Layers, Orbit, Smartphone, Layout, Cpu, Brain, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import ShinyText from './reactbits/ShinyText';
import Magnet from './reactbits/Magnet';
import ClickSpark from './reactbits/ClickSpark';
import type { LiquidColorScheme } from './reactbits/LiquidEther';

interface HeroSectionProps {
  onHoverTitle?: (hovering: boolean) => void;
  onExploreClick?: () => void;
  onSelectEra?: (eraIndex: number) => void;
  etherPalette?: LiquidColorScheme;
  onChangePalette?: (palette: LiquidColorScheme) => void;
  viscosity?: number;
  onChangeViscosity?: (v: number) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onHoverTitle,
  onExploreClick,
  onSelectEra,
  etherPalette = 'nebula',
  onChangePalette,
  viscosity = 0.85,
  onChangeViscosity,
}) => {
  const [showEtherControls, setShowEtherControls] = useState(false);

  const eras = [
    { index: 1, year: '1989', label: 'CERN', icon: Compass, color: 'hover:text-emerald-300 hover:border-emerald-500/40' },
    { index: 2, year: '1996', label: 'CSS', icon: Layers, color: 'hover:text-sky-300 hover:border-sky-500/40' },
    { index: 2, year: '1999', label: 'FLASH', icon: Orbit, color: 'hover:text-amber-300 hover:border-amber-500/40' },
    { index: 3, year: '2007', label: 'MOBILE', icon: Smartphone, color: 'hover:text-teal-300 hover:border-teal-500/40' },
    { index: 4, year: '2013', label: 'FLAT', icon: Layout, color: 'hover:text-pink-300 hover:border-pink-500/40' },
    { index: 5, year: '2019', label: 'WEBGL', icon: Cpu, color: 'hover:text-cyan-300 hover:border-cyan-500/40' },
    { index: 6, year: '2023', label: 'AI', icon: Brain, color: 'hover:text-violet-300 hover:border-violet-500/40' },
    { index: 7, year: '2026+', label: 'SPATIAL', icon: Eye, color: 'hover:text-cyan-200 hover:border-cyan-400/40' },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-8 py-16 sm:py-24 text-center select-none overflow-hidden font-dm">
      {/* Subtle radial vignette to guarantee optimal text contrast over the silky fluid ether */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#030308]/40 to-[#030308]/90 pointer-events-none" />

      {/* Main Hero Container - Perfectly balanced to fit comfortably above the fold */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center w-full">
        {/* 1. React Bits Glossy Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl mb-6 shadow-[0_0_25px_rgba(0,240,255,0.12)] hover:border-cyan-400/30 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <ShinyText
            text="THE STORY OF WEB DESIGN // 1989 — 2026+"
            speed={4}
            className="text-[11px] sm:text-xs tracking-[0.2em] text-slate-300 uppercase font-semibold"
            shimmerColor="#00f0ff"
          />
        </motion.div>

        {/* 2. Monumental Editorial Typography */}
        <div
          onMouseEnter={() => onHoverTitle?.(true)}
          onMouseLeave={() => onHoverTitle?.(false)}
          className="flex flex-col items-center justify-center cursor-default mb-4"
        >
          <div className="flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-5">
            {"THE WEB".split(' ').map((word, wIdx) => (
              <span
                key={wIdx}
                className="inline-flex text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                {word.split('').map((char, cIdx) => (
                  <motion.span
                    key={cIdx}
                    whileHover={{ scale: 1.08, y: -6, color: '#00f0ff' }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="inline-block transition-colors cursor-pointer"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center items-center -mt-1 sm:-mt-2">
            {"EVOLVED.".split('').map((char, cIdx) => (
              <motion.span
                key={cIdx}
                whileHover={{ scale: 1.1, y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="inline-block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-violet-400 glow-text-cyan cursor-pointer"
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* 3. Punchy Editorial Subtitle & Thesis Statement */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8 px-4"
        >
          <p className="font-dm text-xl sm:text-2xl md:text-3xl text-slate-100 font-normal leading-relaxed drop-shadow-[0_0_20px_rgba(255,255,255,0.12)]">
            “The web stopped being a document. It became an experience.”
          </p>
          <p className="font-mono text-xs sm:text-sm text-slate-400 tracking-wider mt-2">
            From CERN's 1989 monochrome hypertext to 2026+ spatial intelligence.
          </p>
        </motion.div>

        {/* 4. Centerpiece Magnet CTA Button */}
        <div className="mb-10">
          <Magnet magnetStrength={4} padding={40}>
            <ClickSpark sparkColor="#00f0ff" sparkCount={14}>
              <button
                onClick={onExploreClick}
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-cyan-400/40 bg-black/60 hover:bg-cyan-950/40 backdrop-blur-xl text-white font-dm text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.25)] hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] cursor-pointer hover:border-cyan-300 hover:scale-105 active:scale-95"
              >
                <span>EXPLORE THE EVOLUTION</span>
                <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center group-hover:bg-cyan-400/40 transition-colors">
                  <ArrowDown className="w-3.5 h-3.5 text-cyan-300 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </button>
            </ClickSpark>
          </Magnet>
        </div>

        {/* 5. Sleek Interactive Era Quick-Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-3xl flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl glass-panel border border-white/10"
        >
          {eras.map((era, i) => {
            const Icon = era.icon;
            return (
              <button
                key={i}
                onClick={() => onSelectEra?.(era.index)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/5 transition-all text-[11px] sm:text-xs font-dm text-slate-300 cursor-pointer ${era.color}`}
              >
                <Icon className="w-3 h-3 text-slate-400 group-hover:text-current" />
                <span className="font-bold text-white">{era.year}</span>
                <span className="text-[10px] text-slate-400 font-mono">{era.label}</span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* 6. Discreet Floating Liquid Ether HUD in Bottom Corner (Never clutters center) */}
      <div className="absolute bottom-6 right-6 z-20 hidden md:block">
        <div className="flex items-center gap-2">
          {showEtherControls && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full glass-panel border border-white/15 text-xs text-slate-300 shadow-xl"
            >
              <button
                onClick={() => onChangePalette?.('nebula')}
                className={`px-2 py-0.5 rounded-full cursor-pointer text-[11px] font-semibold transition-colors ${etherPalette === 'nebula' ? 'bg-cyan-500/30 text-cyan-200' : 'text-slate-400 hover:text-white'}`}
              >
                Nebula
              </button>
              <button
                onClick={() => onChangePalette?.('aurora')}
                className={`px-2 py-0.5 rounded-full cursor-pointer text-[11px] font-semibold transition-colors ${etherPalette === 'aurora' ? 'bg-emerald-500/30 text-emerald-200' : 'text-slate-400 hover:text-white'}`}
              >
                Aurora
              </button>
              <button
                onClick={() => onChangePalette?.('cyber')}
                className={`px-2 py-0.5 rounded-full cursor-pointer text-[11px] font-semibold transition-colors ${etherPalette === 'cyber' ? 'bg-pink-500/30 text-pink-200' : 'text-slate-400 hover:text-white'}`}
              >
                Cyber
              </button>
              <span className="text-white/20">|</span>
              <input
                type="range"
                min="0.3"
                max="1.8"
                step="0.1"
                value={viscosity}
                onChange={(e) => onChangeViscosity?.(parseFloat(e.target.value))}
                className="w-14 accent-cyan-400 cursor-pointer"
                title={`Viscosity: ${viscosity}`}
              />
            </motion.div>
          )}

          <button
            onClick={() => setShowEtherControls(!showEtherControls)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-white/10 hover:border-cyan-400/40 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-all cursor-pointer backdrop-blur-md"
            title="Toggle Fluid Shader Settings"
          >
            <Sliders className="w-3 h-3 text-cyan-400" />
            <span>ETHER: <strong className="text-white uppercase">{etherPalette}</strong></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
