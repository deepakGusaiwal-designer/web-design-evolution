import React, { useState } from 'react';
import { FUTURE_CONCEPTS } from '../data/evolution';
import { Eye, Compass } from 'lucide-react';

export const SpatialWeb: React.FC = () => {
  const [activeConcept, setActiveConcept] = useState<string | null>("SPACE");

  const selectedConceptData = FUTURE_CONCEPTS.find((c) => c.word === activeConcept) || FUTURE_CONCEPTS[0];

  return (
    <section className="relative min-h-screen w-full py-36 sm:py-48 px-6 sm:px-12 flex flex-col justify-center items-center select-none overflow-hidden font-dm">
      {/* Background celestial glow */}
      <div className="absolute inset-0 bg-radial from-violet-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Chapter 07 Header with Generous Breathing Space */}
      <div className="max-w-4xl w-full mx-auto text-center mb-16 sm:mb-24 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/40 text-xs text-cyan-400 uppercase tracking-widest mb-8 font-semibold">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
          CHAPTER 07 // 2026 — 2030
        </div>

        <h2 className="font-dm font-black text-3xl sm:text-5xl md:text-7xl text-white tracking-tight leading-tight mb-8">
          WHAT IF THE INTERFACE
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-violet-400 glow-text-cyan">
            HAD NO FIXED FORM?
          </span>
        </h2>

        <p className="font-dm font-semibold text-2xl sm:text-4xl text-slate-100 max-w-2xl mx-auto mb-6 leading-relaxed">
          “What if design could imagine with you?”
        </p>

        <p className="font-dm text-base sm:text-lg text-slate-200 max-w-xl mx-auto font-normal leading-relaxed">
          When physical environments and digital perception merge, the concept of a flat website evaporates. Interface elements detach from screens, floating as contextual, gaze-responsive, and ambient realities.
        </p>
      </div>

      {/* Floating Constellation of Speculative Future Concepts (Unbounded UI) */}
      <div className="relative max-w-5xl w-full mx-auto my-6 z-10">
        {/* Floating Ring Horizon */}
        <div className="relative min-h-[360px] flex items-center justify-center">
          {/* Orbital Decorative Rings */}
          <div className="absolute w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] rounded-full border border-cyan-500/15 animate-spin pointer-events-none" style={{ animationDuration: '45s' }} />
          <div className="absolute w-[240px] sm:w-[360px] h-[240px] sm:h-[360px] rounded-full border border-violet-500/20 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />

          {/* Center Pulsing Singularity Beacon */}
          <div className="absolute flex flex-col items-center justify-center text-center p-4">
            <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_25px_rgba(0,240,255,1)] animate-ping" />
            <div className="w-2.5 h-2.5 rounded-full bg-white absolute" />
          </div>

          {/* Floating Constellation Words */}
          <div className="relative w-full h-full flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-4">
            {FUTURE_CONCEPTS.map((concept, index) => {
              const isActive = activeConcept === concept.word;
              return (
                <button
                  key={concept.word}
                  onClick={() => {
                    setActiveConcept(concept.word);
                    if (typeof (window as unknown as { playWebChime?: (f: number) => void }).playWebChime === 'function') {
                      (window as unknown as { playWebChime: (f: number) => void }).playWebChime(500 + index * 50);
                    }
                  }}
                  onMouseEnter={() => setActiveConcept(concept.word)}
                  className={`group relative px-5 py-2.5 rounded-full font-dm font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white text-black scale-110 shadow-[0_0_30px_rgba(0,240,255,0.8)]'
                      : 'glass-panel text-slate-200 hover:text-white hover:border-cyan-400/50 hover:scale-105'
                  }`}
                  style={{
                    borderColor: isActive ? '#00f0ff' : 'rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: concept.color }}
                    />
                    {concept.word}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Speculative Node Insight Card */}
        {selectedConceptData && (
          <div className="mt-8 max-w-xl mx-auto glass-panel-glow rounded-2xl p-6 border border-cyan-400/30 text-center animate-fade-in font-dm">
            <div className="flex items-center justify-center gap-2 mb-2 text-xs text-cyan-400 uppercase tracking-widest font-semibold">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              Speculative Paradigm // {selectedConceptData.word}
            </div>
            <h4 className="font-dm font-black text-2xl text-white mb-2">
              {selectedConceptData.word}
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-dm">
              {selectedConceptData.description}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
