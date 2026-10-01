import React, { useState } from 'react';
import { Cpu, Waves, Layout, Layers } from 'lucide-react';
import { WebGLScene } from '../scenes/WebGLScene';
import SpotlightCard from './reactbits/SpotlightCard';
import TiltedCard from './reactbits/TiltedCard';
import Magnet from './reactbits/Magnet';
import ClickSpark from './reactbits/ClickSpark';
import ShinyText from './reactbits/ShinyText';

export const WebGLSection: React.FC = () => {
  const [paradigmMode, setParadigmMode] = useState<'flat' | 'gpu'>('gpu');

  return (
    <section className="relative min-h-screen w-full py-32 sm:py-44 px-6 sm:px-12 flex flex-col justify-center items-center font-dm">
      {/* Chapter 05 Header */}
      <div className="max-w-4xl w-full mx-auto mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-xs text-cyan-400 uppercase tracking-widest mb-6 font-semibold">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <ShinyText text="CHAPTER 05 // 2013 — 2023" speed={4} shimmerColor="#00f0ff" />
        </div>

        <h2 className="font-dm font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-5">
          FLAT DESIGN TO THE SILICON GPU
        </h2>

        <p className="font-dm text-xl sm:text-2xl text-slate-100 font-light italic leading-relaxed mb-6">
          “From stripping decorative fluff to executing raw mathematics on the graphics processor.”
        </p>

        <p className="font-dm text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Canva’s design history chronicles the dramatic transition from skeuomorphism into <strong>Flat Design</strong> in 2013 (iOS 7, Microsoft Metro, Material Design). Clean 2D lines, bold solid colors, and efficiency took over. By 2019, that minimalism evolved into "Flat 2.0" and WebGL shaders: turning the browser into a high-performance GPU playground.
        </p>
      </div>

      {/* Epoch Mode Switcher with Magnet & ClickSpark */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <Magnet magnetStrength={2}>
          <ClickSpark sparkColor="#ec4899">
            <button
              onClick={() => setParadigmMode('flat')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-dm font-semibold transition-all cursor-pointer ${
                paradigmMode === 'flat'
                  ? 'border-pink-500 bg-pink-950/40 text-pink-200 shadow-[0_0_20px_rgba(236,72,153,0.25)]'
                  : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
              }`}
            >
              <Layout className="w-4 h-4 text-pink-400" />
              <span>2013: Flat Design & Material Minimalism</span>
            </button>
          </ClickSpark>
        </Magnet>

        <Magnet magnetStrength={2}>
          <ClickSpark sparkColor="#00f0ff">
            <button
              onClick={() => setParadigmMode('gpu')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-dm font-semibold transition-all cursor-pointer ${
                paradigmMode === 'gpu'
                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                  : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>2019–2023: The Browser Becomes a GPU (WebGL)</span>
            </button>
          </ClickSpark>
        </Magnet>
      </div>

      {/* MODE 1: 2013 FLAT DESIGN INTERACTIVE SHOWCASE */}
      {paradigmMode === 'flat' && (
        <TiltedCard maxAngle={6} className="max-w-4xl w-full mx-auto mb-16">
          <div className="rounded-2xl border border-pink-500/30 bg-[#120816] p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-pink-500/20 pb-4 mb-6 text-xs text-pink-300 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-pink-400 inline-block" />
                <span className="font-bold">FLAT DESIGN REVOLUTION — iOS 7 & MATERIAL DESIGN (2013–2014)</span>
              </div>
              <span className="text-[11px] bg-pink-500/20 px-2 py-0.5 rounded text-pink-200">
                ZERO SHADOWS // BOLD 2D
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
              <div className="p-6 rounded-xl bg-[#ec4899] text-white text-left shadow-none transition-transform hover:scale-102">
                <div className="text-2xl font-black mb-2 font-dm">#EC4899</div>
                <div className="text-sm font-bold uppercase tracking-wider mb-2 font-mono">Bold Flat Color</div>
                <p className="text-xs text-white/90 leading-relaxed font-dm">
                  Gradients and fake beveled textures were abolished. High-contrast vivid solid colors commanded attention.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#3b82f6] text-white text-left shadow-none transition-transform hover:scale-102">
                <div className="text-2xl font-black mb-2 font-dm">#3B82F6</div>
                <div className="text-sm font-bold uppercase tracking-wider mb-2 font-mono">2D Geometric Vectors</div>
                <p className="text-xs text-white/90 leading-relaxed font-dm">
                  Clean crisp icons rendered at infinite resolution via SVG, optimizing load times across mobile devices.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#10b981] text-white text-left shadow-none transition-transform hover:scale-102">
                <div className="text-2xl font-black mb-2 font-dm">#10B981</div>
                <div className="text-sm font-bold uppercase tracking-wider mb-2 font-mono">Typography-First</div>
                <p className="text-xs text-white/90 leading-relaxed font-dm">
                  Sans-serif fonts like Roboto, San Francisco, and Helvetica Neue became the core visual architecture.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-pink-500/20 flex items-center justify-between text-xs text-pink-200/80">
              <span>Canva takeaway: Flat design improved efficiency and responsiveness on mobile smartphones.</span>
              <span className="font-mono text-pink-400 font-bold">2013–2018</span>
            </div>
          </div>
        </TiltedCard>
      )}

      {/* MODE 2: WEBGL SILICON GPU SCENE */}
      {paradigmMode === 'gpu' && (
        <div className="max-w-5xl w-full mx-auto mb-16">
          <WebGLScene />
        </div>
      )}

      {/* Historical Summary Cards */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 font-dm">
        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2 text-pink-400 text-xs uppercase mb-2 font-semibold">
            <Layout className="w-3.5 h-3.5" />
            2013 // Flat Minimalism
          </div>
          <div className="text-base font-bold text-white mb-1 font-dm">The Death of Texture</div>
          <p className="text-xs text-slate-300 leading-relaxed font-dm">
            Microsoft Metro and Apple iOS 7 wiped away faux wood and stitched leather in favor of pure 2D digital honesty.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2 text-violet-400 text-xs uppercase mb-2 font-semibold">
            <Layers className="w-3.5 h-3.5" />
            2016 // Flat 2.0 & Glass
          </div>
          <div className="text-base font-bold text-white mb-1 font-dm">Neumorphism & Elevation</div>
          <p className="text-xs text-slate-300 leading-relaxed font-dm">
            Design re-introduced subtle depth: soft extruded drop shadows, glassmorphism blur filters, and micro-interactions.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2 text-cyan-400 text-xs uppercase mb-2 font-semibold">
            <Waves className="w-3.5 h-3.5" />
            2019 // WebGL GPU Shaders
          </div>
          <div className="text-base font-bold text-white mb-1 font-dm">The Silicon Canvas</div>
          <p className="text-xs text-slate-300 leading-relaxed font-dm">
            Three.js and GLSL shaders brought fluid dynamics, 3D meshes, and real-time raymarching to standard web browsers.
          </p>
        </SpotlightCard>
      </div>
    </section>
  );
};
