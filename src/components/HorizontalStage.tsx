import React from 'react';
import { ERAS } from '../data/eras';
import { ArrowRight, ArrowLeft, Sparkles, Terminal, RotateCcw } from 'lucide-react';

interface HorizontalStageProps {
  scrollProgress: number; // 0 to 1
  activeEraIndex: number;
  isAltMode: boolean;
  onToggleAltMode: () => void;
  customWord: string;
  onChangeCustomWord: (val: string) => void;
  onSelectEra: (index: number) => void;
  pureParticleMode: boolean;
}

const PRESET_WORDS = ['IMAGINE', 'FUTURE', 'SPATIAL', 'SYNAPSE', 'BEYOND', 'THE WEB'];

export const HorizontalStage: React.FC<HorizontalStageProps> = ({
  scrollProgress,
  activeEraIndex,
  isAltMode,
  onToggleAltMode,
  customWord,
  onChangeCustomWord,
  onSelectEra,
  pureParticleMode,
}) => {
  // Translate across 9 full-viewport (100vw) horizontal stations
  const totalStations = ERAS.length;
  const translateXvw = -scrollProgress * (totalStations - 1) * 100;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-10 transition-opacity duration-500 ${
        pureParticleMode ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Horizontal Track of 9 Stations (900vw wide) */}
      <div
        className="flex h-full will-change-transform"
        style={{
          width: `${totalStations * 100}vw`,
          transform: `translate3d(${translateXvw}vw, 0, 0)`,
        }}
      >
        {ERAS.map((era, idx) => {
          const isActive = idx === activeEraIndex;

          return (
            <section
              key={era.id}
              className="relative w-screen h-full flex flex-col justify-end pb-16 sm:pb-20 px-4 sm:px-10 lg:px-16"
            >
              {/* Subtle vertical station divider line on left edge */}
              <div className="absolute left-0 top-14 bottom-14 w-px bg-white/[0.06]" />

              {/* Top-left Station Coordinate Watermark */}
              <div className="absolute top-18 left-6 sm:left-16 hidden lg:flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-neutral-500">
                <span className="text-white font-semibold">STATION {era.chapter}</span>
                <span>//</span>
                <span>X-COORD: {(idx * 1920).toString().padStart(5, '0')}PX</span>
                <span>//</span>
                <span className="text-neutral-300">{era.year}</span>
              </div>

              {/* Bottom Architectural Information Deck (leaves upper 62% of screen open for the Particle Formation) */}
              <div
                className={`pointer-events-auto w-full max-w-7xl mx-auto mono-panel p-5 sm:p-6 lg:p-7 transition-all duration-500 relative ${
                  isActive
                    ? 'opacity-100 translate-y-0 border-white/25 shadow-[0_0_50px_rgba(0,0,0,0.9)]'
                    : 'opacity-40 translate-y-2 border-white/10'
                }`}
              >
                {/* Architectural Corner Crosshairs */}
                <span className="absolute -top-1.5 -left-1.5 text-white/60 font-mono text-xs leading-none">+</span>
                <span className="absolute -top-1.5 -right-1.5 text-white/60 font-mono text-xs leading-none">+</span>
                <span className="absolute -bottom-1.5 -left-1.5 text-white/60 font-mono text-xs leading-none">+</span>
                <span className="absolute -bottom-1.5 -right-1.5 text-white/60 font-mono text-xs leading-none">+</span>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* COLUMN 1 (4 Cols): Era Identity & Quote */}
                  <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0 lg:pr-6">
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="px-2 py-0.5 bg-white text-black font-mono text-[10px] font-bold tracking-widest uppercase">
                          CH.{era.chapter}
                        </span>
                        <span className="font-mono text-xs text-neutral-400 tracking-wider font-semibold">
                          {era.year}
                        </span>
                      </div>

                      <h2 className="font-dm text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white uppercase leading-tight mb-2.5">
                        {era.title}
                      </h2>

                      <p className="font-dm text-xs sm:text-sm text-neutral-300 italic leading-relaxed border-l-2 border-white/40 pl-3">
                        {era.quote}
                      </p>
                    </div>

                    {/* Archival Spec Pills */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10">
                      {era.specs.map((spec) => (
                        <div key={spec.label} className="bg-white/[0.03] border border-white/10 px-2.5 py-1.5">
                          <div className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">
                            {spec.label}
                          </div>
                          <div className="font-mono text-[11px] text-white font-semibold truncate mt-0.5">
                            {spec.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* COLUMN 2 (4 Cols): Historical Narrative & Particle Experiment Trigger */}
                  <div className="lg:col-span-4 flex flex-col justify-between h-full border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0 lg:pr-6">
                    <p className="font-dm text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                      {era.summary}
                    </p>

                    {/* Special Live Particle Word Synthesizer on Final Chapter (08) */}
                    {idx === 8 ? (
                      <div className="space-y-2.5 bg-white/[0.03] border border-white/15 p-3">
                        <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5 text-white">
                            <Terminal className="w-3 h-3" />
                            LIVE PARTICLE WORD SYNTHESIZER
                          </span>
                          <span>MAX 14 CHARS</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={14}
                            value={customWord}
                            onChange={(e) => onChangeCustomWord(e.target.value)}
                            placeholder="TYPE ANY WORD..."
                            className="w-full bg-black border border-white/30 px-3 py-1.5 font-mono text-xs text-white uppercase tracking-widest focus:outline-none focus:border-white"
                          />
                          <button
                            onClick={onToggleAltMode}
                            className="px-3 py-1.5 bg-white text-black font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
                          >
                            {isAltMode ? 'CONVERGE' : 'EXPLODE'}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {PRESET_WORDS.map((word) => (
                            <button
                              key={word}
                              onClick={() => onChangeCustomWord(word)}
                              className={`px-2 py-0.5 font-mono text-[9px] uppercase border transition-colors cursor-pointer ${
                                customWord.toUpperCase() === word
                                  ? 'bg-white text-black border-white font-bold'
                                  : 'bg-black/60 text-neutral-400 border-white/15 hover:text-white hover:border-white/40'
                              }`}
                            >
                              {word}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Interactive Particle Sculpture State Button */
                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <button
                          onClick={onToggleAltMode}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                            isAltMode
                              ? 'bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.35)]'
                              : 'bg-white/[0.06] text-white border-white/30 hover:bg-white hover:text-black'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isAltMode ? era.interactionActiveLabel : era.interactionLabel}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* COLUMN 3 (4 Cols): Chronological Era Milestones & Station Stepper */}
                  <div className="lg:col-span-4 flex flex-col justify-between h-full">
                    <div className="space-y-2">
                      <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-1">
                        ARCHIVAL MILESTONES // {era.year}
                      </div>
                      {era.milestones.map((m) => (
                        <div
                          key={m.year + m.title}
                          className="flex items-start gap-3 bg-white/[0.02] border border-white/[0.07] px-3 py-2 hover:border-white/25 transition-colors"
                        >
                          <span className="font-mono text-xs font-bold text-white bg-white/10 px-1.5 py-0.5 shrink-0">
                            {m.year}
                          </span>
                          <div className="min-w-0">
                            <div className="font-dm text-xs font-bold text-white leading-snug">
                              {m.title}
                            </div>
                            <div className="font-dm text-[11px] text-neutral-400 leading-snug">
                              {m.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Prev / Next Station Controls */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/10">
                      <button
                        onClick={() => onSelectEra(Math.max(0, idx - 1))}
                        disabled={idx === 0}
                        className="flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] uppercase tracking-wider border border-white/15 text-neutral-300 hover:text-white hover:border-white/40 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transition-colors"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>PREV ERA</span>
                      </button>

                      <span className="font-mono text-[10px] text-neutral-500">
                        SCROLL OR DRAG HORIZONTALLY
                      </span>

                      {idx < totalStations - 1 ? (
                        <button
                          onClick={() => onSelectEra(idx + 1)}
                          className="flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] uppercase tracking-wider bg-white text-black font-bold hover:bg-neutral-200 cursor-pointer transition-colors"
                        >
                          <span>NEXT ERA</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectEra(0)}
                          className="flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] uppercase tracking-wider bg-white text-black font-bold hover:bg-neutral-200 cursor-pointer transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>RESTART 1989</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalStage;
