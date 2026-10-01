import React from 'react';
import { Cpu, Waves, Sparkles, Terminal } from 'lucide-react';
import { WebGLScene } from '../scenes/WebGLScene';
import SpotlightCard from './reactbits/SpotlightCard';

export const WebGLSection: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full py-36 sm:py-48 px-6 sm:px-12 flex flex-col justify-center items-center font-dm">
      {/* Chapter 05 Header with Strong Narrative Voice */}
      <div className="max-w-4xl w-full mx-auto mb-16 sm:mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-xs text-cyan-400 uppercase tracking-widest mb-6 font-semibold">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          CHAPTER 05 // 2019 — 2022
        </div>
        <h2 className="font-dm font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-6">
          THE SILICON CANVAS
        </h2>
        <p className="font-dm text-xl sm:text-3xl text-slate-100 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
          “THE BROWSER BECAME A GPU.”
        </p>
        <p className="font-dm text-base sm:text-lg text-slate-200 max-w-xl mx-auto leading-relaxed font-normal">
          When every single pixel executes its own mathematical shader program in parallel, the interface ceases to be rendered markup. It becomes pure liquid light and raw mathematics.
        </p>
      </div>

      {/* Main Interactive Liquid Shader Canvas */}
      <div className="max-w-5xl w-full mx-auto">
        <WebGLScene />

        {/* Shader Pipeline Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 font-dm">
          <SpotlightCard
            spotlightColor="rgba(6, 182, 212, 0.3)"
            className="p-6 rounded-2xl border border-white/10 bg-slate-900/40"
          >
            <div className="flex items-center gap-2 text-cyan-400 text-xs uppercase mb-2 font-semibold">
              <Waves className="w-3.5 h-3.5" />
              Vertex Displacement
            </div>
            <div className="text-base font-bold text-white mb-1 font-dm">Per-Vertex Trigonometry</div>
            <p className="text-xs text-slate-300 leading-relaxed font-dm">
              Trigonometric harmonic waves and Simplex noise displace 25,600 grid vertices in parallel at 60+ FPS on your GPU hardware.
            </p>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(168, 85, 247, 0.3)"
            className="p-6 rounded-2xl border border-white/10 bg-slate-900/40"
          >
            <div className="flex items-center gap-2 text-violet-400 text-xs uppercase mb-2 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Fragment Chromatics
            </div>
            <div className="text-base font-bold text-white mb-1 font-dm">Fresnel & Normal Optics</div>
            <p className="text-xs text-slate-300 leading-relaxed font-dm">
              Calculates optical incident angles, refractive dispersion, and electric rim lighting for every single screen fragment.
            </p>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(56, 189, 248, 0.3)"
            className="p-6 rounded-2xl border border-white/10 bg-slate-900/40"
          >
            <div className="flex items-center gap-2 text-sky-400 text-xs uppercase mb-2 font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              GLSL Execution
            </div>
            <div className="text-base font-bold text-white mb-1 font-dm">Zero DOM Overhead</div>
            <p className="text-xs text-slate-300 leading-relaxed font-dm">
              By bypassing the CPU DOM entirely, visual computing shifted into the GPU pipeline, enabling liquid physics and particle vortices.
            </p>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};
