import React from 'react';
import { ERAS } from '../data/eras';
import { ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';

interface HorizontalStageProps {
  scrollProgress: number; // 0 to 1
  activeEraIndex: number;
  activePhaseIndex: number;
  onSelectPhase: (eraIdx: number, phaseIdx: number) => void;
  overrideWord: string | null;
  onSelectOverrideWord: (word: string | null) => void;
  customWord: string;
  onChangeCustomWord: (val: string) => void;
  onSelectEra: (index: number) => void;
  pureParticleMode: boolean;
}

export const HorizontalStage: React.FC<HorizontalStageProps> = ({
  scrollProgress,
  activeEraIndex,
  activePhaseIndex,
  onSelectPhase,
  overrideWord,
  onSelectOverrideWord,
  customWord,
  onChangeCustomWord,
  onSelectEra,
  pureParticleMode,
}) => {
  const totalStations = ERAS.length;
  const translateXvw = -scrollProgress * (totalStations - 1) * 100;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-10 transition-opacity duration-500 ${
        pureParticleMode ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Horizontal Track of 9 Clean Stations (900vw wide) */}
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
              className="relative w-screen h-full flex flex-col justify-between pt-20 pb-18 px-6 sm:px-10 lg:px-14"
            >
              {/* Main Split-Margin Layout: Left Editorial + Open Center Particle Stage + Right Archival */}
              <div
                className={`flex-1 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 transition-opacity duration-500 ${
                  isActive ? 'opacity-100' : 'opacity-20'
                }`}
              >
                {/* LEFT MARGIN: Clean Swiss Editorial Typography (Max 300px wide) */}
                <div className="pointer-events-auto w-full lg:w-[290px] xl:w-[320px] flex flex-col gap-4 bg-black/45 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-4 lg:p-0 border border-white/10 lg:border-0">
                  <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-neutral-400">
                    <span className="text-white font-bold">/{era.chapter}</span>
                    <span className="text-neutral-600">—</span>
                    <span>{era.year}</span>
                  </div>

                  <h2 className="font-dm text-2xl sm:text-3xl font-bold tracking-tight text-white leading-[1.1]">
                    {era.title}
                  </h2>

                  <p className="font-dm text-xs sm:text-sm text-neutral-300 italic leading-relaxed border-l border-white/30 pl-3.5">
                    {era.quote}
                  </p>

                  <p className="font-dm text-xs text-neutral-400 leading-relaxed hidden sm:block">
                    {era.summary}
                  </p>

                  {/* Minimal Spec Hairline Row */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                    {era.specs.map((spec) => {
                      const isSelected = isActive && overrideWord === spec.particleWord;
                      return (
                        <button
                          key={spec.label}
                          onClick={() =>
                            onSelectOverrideWord(isSelected ? null : spec.particleWord)
                          }
                          className="text-left group cursor-pointer"
                          title={`Click to morph particles into "${spec.particleWord}"`}
                        >
                          <div className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider group-hover:text-neutral-300 transition-colors">
                            {spec.label}
                          </div>
                          <div
                            className={`font-mono text-[11px] font-semibold mt-0.5 transition-colors ${
                              isSelected
                                ? 'text-white underline underline-offset-4'
                                : 'text-neutral-200 group-hover:text-white'
                            }`}
                          >
                            {spec.value}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CENTER 55% OF SCREEN: 100% Open Unobstructed Space for Particle Word & 3D Sculpture */}
                <div className="hidden lg:block flex-1 h-full pointer-events-none" />

                {/* RIGHT MARGIN: Minimal Archival Milestones (Click any milestone to morph particles) */}
                <div className="pointer-events-auto hidden lg:flex w-[270px] xl:w-[300px] flex-col gap-5">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase border-b border-white/10 pb-2">
                    KEY MILESTONES // CLICK TO MORPH
                  </div>

                  <div className="flex flex-col gap-4">
                    {era.milestones.map((m) => {
                      const isSelected = isActive && overrideWord === m.particleWord;
                      return (
                        <button
                          key={m.year + m.title}
                          onClick={() =>
                            onSelectOverrideWord(isSelected ? null : m.particleWord)
                          }
                          className={`text-left group border-l pl-3.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-white'
                              : 'border-white/15 hover:border-white/60'
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400">
                            <span className={isSelected ? 'text-white font-bold' : ''}>
                              {m.year}
                            </span>
                            <span className="text-[9px] text-neutral-600 group-hover:text-neutral-300 transition-colors">
                              [{m.particleWord}]
                            </span>
                          </div>
                          <div className="font-dm text-xs font-semibold text-white mt-0.5 group-hover:translate-x-0.5 transition-transform">
                            {m.title}
                          </div>
                          <div className="font-dm text-[11px] text-neutral-500 leading-snug mt-0.5">
                            {m.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* BOTTOM CENTER: Compact Minimal 3-Phase Particle Bar & Prev/Next Stepper */}
              <div
                className={`pointer-events-auto w-full max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-3 px-3 py-2 mono-panel rounded-full transition-opacity duration-500 ${
                  isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Prev Era Button */}
                <button
                  onClick={() => onSelectEra(Math.max(0, idx - 1))}
                  disabled={idx === 0}
                  className="w-7 h-7 rounded-full flex items-center justify-center border border-white/15 text-neutral-400 hover:text-white hover:border-white/50 disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-colors"
                  title="Previous Era"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>

                {/* Center: 3 Sequential Particle Phases OR Live Word Input on Final Era */}
                {idx === 8 ? (
                  <div className="flex items-center gap-2 flex-1 justify-center px-2">
                    <span className="font-mono text-[10px] text-neutral-400 uppercase hidden sm:inline">
                      SYNTHESIZE:
                    </span>
                    <input
                      type="text"
                      maxLength={12}
                      value={customWord}
                      onChange={(e) => {
                        onSelectOverrideWord(null);
                        onChangeCustomWord(e.target.value);
                      }}
                      placeholder="TYPE WORD..."
                      className="w-36 sm:w-44 bg-black/80 border border-white/25 rounded-full px-3 py-1 font-mono text-xs text-white text-center uppercase tracking-widest focus:outline-none focus:border-white"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {era.phases.map((phase, pIdx) => {
                      const isPhaseActive =
                        isActive && activePhaseIndex === pIdx && overrideWord === null;
                      return (
                        <button
                          key={phase.tag}
                          onClick={() => {
                            onSelectOverrideWord(null);
                            onSelectPhase(idx, pIdx);
                          }}
                          className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                            isPhaseActive
                              ? 'bg-white text-black font-bold'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {phase.word}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Next / Restart Era Button */}
                {idx < totalStations - 1 ? (
                  <button
                    onClick={() => onSelectEra(idx + 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-white text-black hover:bg-neutral-200 cursor-pointer transition-colors"
                    title="Next Era"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectEra(0)}
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-white text-black hover:bg-neutral-200 cursor-pointer transition-colors"
                    title="Restart Journey"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalStage;
