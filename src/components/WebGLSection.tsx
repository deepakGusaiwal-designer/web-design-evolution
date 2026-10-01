import React from 'react';
import { Cpu, Waves, Sparkles, Terminal } from 'lucide-react';
import { WebGLScene } from '../scenes/WebGLScene';

export const WebGLSection: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full py-36 sm:py-48 px-6 sm:px-12 flex flex-col justify-center items-center">
      {/* Header with Generous Breathing Space */}
      <div className="max-w-4xl w-full mx-auto mb-16 sm:mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-6">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          SECTION 05 // 2019 — 2022
        </div>
        <h2 className="font-syne font-bold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-6">
          THE BROWSER BECAME A GPU
        </h2>
        <p className="font-dm text-xl sm:text-3xl text-slate-200 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
          “When every pixel has its own computer program, the medium dissolves into light.”
        </p>
        <p className="font-dm text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Custom GLSL fragment and vertex shaders enabled millions of parallel mathematical operations per millisecond.
        </p>
      </div>

      {/* Main Interactive Liquid Shader Canvas */}
      <div className="max-w-5xl w-full mx-auto">
        <WebGLScene />

        {/* Shader Pipeline Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="glass-panel p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase mb-1">
              <Waves className="w-3.5 h-3.5" />
              Vertex Displacement
            </div>
            <div className="text-sm font-semibold text-white mb-1">Per-Vertex Trigonometry</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trigonometric harmonic waves and Simplex noise displace 25,600 grid vertices in parallel at 60+ FPS on your GPU hardware.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-mono uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Fragment Chromatics
            </div>
            <div className="text-sm font-semibold text-white mb-1">Fresnel & Normal Optics</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates optical incident angles, refractive dispersion, and electric rim lighting for every single screen fragment.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase mb-1">
              <Terminal className="w-3.5 h-3.5" />
              GLSL Execution
            </div>
            <div className="text-sm font-semibold text-white mb-1">Zero DOM Overhead</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              By bypassing the CPU DOM entirely, visual computing shifted into the GPU pipeline, enabling liquid physics and particle vortices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
