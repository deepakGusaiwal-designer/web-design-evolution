import React from 'react';
import { Box, Layers, Maximize } from 'lucide-react';
import { SpatialDimensionScene } from '../scenes/SpatialDimensionScene';
import SpotlightCard from './reactbits/SpotlightCard';

export const Web2020: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full py-36 sm:py-48 px-6 sm:px-12 flex flex-col justify-center items-center">
      {/* Chapter 04 Header with Generous Breathing Space */}
      <div className="max-w-4xl w-full mx-auto mb-16 sm:mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-950/40 font-mono text-xs text-pink-400 uppercase tracking-widest mb-6">
          <Box className="w-3.5 h-3.5 text-pink-400" />
          CHAPTER 04 // 2015 — 2018
        </div>
        <h2 className="font-syne font-bold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-6">
          PIERCING THE THIRD DIMENSION
        </h2>
        <p className="font-dm text-xl sm:text-3xl text-slate-200 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
          “THE SCREEN BECAME A SPACE.”
        </p>
        <p className="font-dm text-base sm:text-lg text-slate-200 max-w-xl mx-auto leading-relaxed">
          For twenty-four years, human thought was flattened into 2D viewports. In 2015, the screen tore open: Three.js and WebGL unlocked infinite Z-axis coordinates, virtual optics, and real-time volumetric light.
        </p>
      </div>

      {/* Main 3D Spatial Interactive Viewport */}
      <div className="max-w-5xl w-full mx-auto">
        <SpatialDimensionScene />

        {/* Spatial Dimension Metrics & Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <SpotlightCard
            spotlightColor="rgba(0, 240, 255, 0.25)"
            className="p-6 rounded-2xl border border-white/10 bg-slate-900/40"
          >
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase mb-2">
              <Layers className="w-3.5 h-3.5" />
              Z-Axis Volumetrics
            </div>
            <div className="text-base font-semibold text-white mb-1">Depth Buffer (Z-Buffer)</div>
            <p className="text-xs text-slate-400 leading-relaxed font-dm">
              Every element gained distance from the observer. Fog and perspective attenuation simulate physical atmosphere.
            </p>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(168, 85, 247, 0.25)"
            className="p-6 rounded-2xl border border-white/10 bg-slate-900/40"
          >
            <div className="flex items-center gap-2 text-violet-400 text-xs font-mono uppercase mb-2">
              <Maximize className="w-3.5 h-3.5" />
              Virtual Optics
            </div>
            <div className="text-base font-semibold text-white mb-1">Perspective Camera</div>
            <p className="text-xs text-slate-400 leading-relaxed font-dm">
              Focal lengths, field of view, and camera trajectories transformed passive scrolling into cinematic navigation.
            </p>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(236, 72, 153, 0.25)"
            className="p-6 rounded-2xl border border-white/10 bg-slate-900/40"
          >
            <div className="flex items-center gap-2 text-pink-400 text-xs font-mono uppercase mb-2">
              <Box className="w-3.5 h-3.5" />
              Physically Based Rendering
            </div>
            <div className="text-base font-semibold text-white mb-1">Roughness & Metalness</div>
            <p className="text-xs text-slate-400 leading-relaxed font-dm">
              Light ceased to be painted drop shadows. Surfaces reflect point lights and compute ambient occlusion in real time.
            </p>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};
