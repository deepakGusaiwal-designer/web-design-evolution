import React from 'react';
import { Box, Layers, Maximize } from 'lucide-react';
import { SpatialDimensionScene } from '../scenes/SpatialDimensionScene';

export const Web2020: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full py-28 px-6 flex flex-col justify-center items-center">
      {/* Header */}
      <div className="max-w-4xl w-full mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-950/40 font-mono text-[11px] text-pink-400 uppercase tracking-widest mb-3">
          <Box className="w-3.5 h-3.5 text-pink-400" />
          SECTION 04 // 2015 — 2018
        </div>
        <h2 className="font-syne font-bold text-4xl sm:text-6xl text-white tracking-tight mb-3">
          THE THIRD DIMENSION
        </h2>
        <p className="font-space text-lg text-slate-300 max-w-xl mx-auto mb-2">
          “THE SCREEN BECAME A SPACE.”
        </p>
        <p className="font-mono text-xs text-slate-400 max-w-lg mx-auto">
          We spent twenty years flattening our thoughts into 2D rectangles. Then WebGL and Three.js opened up an infinite coordinate system behind the glass.
        </p>
      </div>

      {/* Main 3D Spatial Interactive Viewport */}
      <div className="max-w-5xl w-full mx-auto">
        <SpatialDimensionScene />

        {/* Spatial Dimension Metrics & Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="glass-panel p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase mb-1">
              <Layers className="w-3.5 h-3.5" />
              Z-Axis Volumetrics
            </div>
            <div className="text-sm font-semibold text-white mb-1">Depth Buffer (Z-Buffer)</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every element gained distance from the observer. Fog and perspective attenuation simulate physical atmosphere.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-mono uppercase mb-1">
              <Maximize className="w-3.5 h-3.5" />
              Virtual Optics
            </div>
            <div className="text-sm font-semibold text-white mb-1">Perspective Camera</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Focal lengths, field of view, and camera trajectories transformed passive scrolling into cinematic navigation.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-pink-400 text-xs font-mono uppercase mb-1">
              <Box className="w-3.5 h-3.5" />
              Physically Based Rendering
            </div>
            <div className="text-sm font-semibold text-white mb-1">Roughness & Metalness</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Light ceased to be painted drop shadows. Surfaces reflect point lights and compute ambient occlusion in real time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
