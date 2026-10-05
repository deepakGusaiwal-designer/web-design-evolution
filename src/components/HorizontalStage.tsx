import React from 'react';
import { ERAS } from '../data/eras';
import { ArrowRight, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';

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
  const era = ERAS[activeEraIndex] || ERAS[0];
  const activePhase = era.phases[activePhaseIndex] || era.phases[0];

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-10 transition-opacity duration-500 ${
        pureParticleMode ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Main Viewport-Locked Split Stage: Left Panel + Open Center Particle Stage + Right Panel */}
      <div className="relative w-full h-full flex flex-col justify-between pt-24 pb-6 px-4 sm:px-6 lg:px-7">
        <div className="flex-1 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* LEFT PANEL: High-Contrast Era & Active Particle Phase Information */}
          <aside
            key={`left-${era.id}`}
            className="pointer-events-auto w-full lg:w-[272px] xl:w-[292px] flex flex-col gap-3.5 bg-[#0a0a0a]/92 backdrop-blur-md p-4 border border-white/18 shadow-2xl"
          >
            {/* Chapter & Year Header */}
            <div className="flex items-center justify-between border-b border-white/12 pb-2">
              <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em]">
                <span className="bg-white text-black font-bold px-1.5 py-0.5 text-[10px]">
                  /{era.chapter}
                </span>
                <span className="text-white font-semibold">{era.year}</span>
              </div>
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                {era.id}
              </span>
            </div>

            {/* Era Title */}
            <h2 className="font-dm text-xl sm:text-2xl font-bold tracking-tight text-white leading-[1.12]">
              {era.title}
            </h2>

            {/* Active Particle Phase Readout Box (Always Crystal Clear) */}
            <div className="bg-white/[0.06] border border-white/20 p-2.5 flex flex-col gap-1">
              <div className="flex items-center justify-between font-mono text-[9px] text-neutral-300 uppercase tracking-widest">
                <span>{overrideWord ? 'ACTIVE NODE OVERRIDE' : activePhase.tag}</span>
                <span className="text-white font-bold">
                  [{overrideWord || activePhase.word}]
                </span>
              </div>
              <div className="font-dm text-xs text-white font-medium leading-snug">
                {overrideWord
                  ? `Morphing 3,200 text particles into "${overrideWord}"`
                  : activePhase.caption}
              </div>
            </div>

            {/* Era Quote */}
            <p className="font-dm text-xs text-neutral-200 italic leading-relaxed border-l-2 border-white/60 pl-3">
              {era.quote}
            </p>

            {/* Era Summary */}
            <p className="font-dm text-xs text-neutral-300 leading-relaxed hidden sm:block">
              {era.summary}
            </p>

            {/* 3 Interactive Spec Buttons */}
            <div className="pt-2 border-t border-white/12">
              <div className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                <span>ERA SPECS</span>
                <span>CLICK TO MORPH</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {era.specs.map((spec) => {
                  const isSelected = overrideWord === spec.particleWord;
                  return (
                    <button
                      key={spec.label}
                      onClick={() =>
                        onSelectOverrideWord(isSelected ? null : spec.particleWord)
                      }
                      className={`text-left p-2 border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white text-black border-white'
                          : 'bg-white/[0.03] text-white border-white/15 hover:border-white/50 hover:bg-white/[0.07]'
                      }`}
                      title={`Click to morph particles into "${spec.particleWord}"`}
                    >
                      <div
                        className={`font-mono text-[8px] uppercase tracking-wider truncate ${
                          isSelected ? 'text-black/70 font-bold' : 'text-neutral-400'
                        }`}
                      >
                        {spec.label}
                      </div>
                      <div
                        className={`font-mono text-[10px] font-bold mt-0.5 truncate ${
                          isSelected ? 'text-black' : 'text-white'
                        }`}
                      >
                        {spec.value}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* CENTER STAGE: 100% Unobstructed Open Space for Particle Word, 3D Sculpture & Callouts */}
          <div className="hidden lg:block flex-1 h-full pointer-events-none" />

          {/* RIGHT PANEL: High-Contrast Historical Milestones & Sculpture Legend */}
          <aside
            key={`right-${era.id}`}
            className="pointer-events-auto hidden lg:flex w-[272px] xl:w-[292px] flex-col gap-3 bg-[#0a0a0a]/92 backdrop-blur-md p-4 border border-white/18 shadow-2xl"
          >
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-white uppercase border-b border-white/15 pb-2">
              <span className="font-bold">KEY MILESTONES</span>
              <span className="text-[9px] text-neutral-400">CLICK TO MORPH</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {era.milestones.map((m) => {
                const isSelected = overrideWord === m.particleWord;
                return (
                  <button
                    key={m.year + m.title}
                    onClick={() =>
                      onSelectOverrideWord(isSelected ? null : m.particleWord)
                    }
                    className={`text-left group p-2.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white'
                        : 'bg-white/[0.03] border-white/15 hover:border-white/55 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span
                        className={`font-bold ${
                          isSelected ? 'text-black' : 'text-white'
                        }`}
                      >
                        {m.year}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 border ${
                          isSelected
                            ? 'border-black/30 bg-black/10 text-black font-bold'
                            : 'border-white/20 text-neutral-300 group-hover:text-white'
                        }`}
                      >
                        {m.particleWord}
                      </span>
                    </div>
                    <div
                      className={`font-dm text-xs font-bold mt-1 ${
                        isSelected ? 'text-black' : 'text-white'
                      }`}
                    >
                      {m.title}
                    </div>
                    <div
                      className={`font-dm text-[11px] leading-snug mt-0.5 ${
                        isSelected ? 'text-black/80' : 'text-neutral-300'
                      }`}
                    >
                      {m.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reset Override Button if a Spec/Milestone is currently overriding the phase word */}
            {overrideWord && (
              <button
                onClick={() => onSelectOverrideWord(null)}
                className="mt-1 w-full py-1.5 px-3 bg-white/10 hover:bg-white/20 border border-white/30 font-mono text-[10px] text-white uppercase tracking-wider cursor-pointer transition-colors"
              >
                ↺ Reset to Phase Word ({activePhase.word})
              </button>
            )}
          </aside>
        </div>

        {/* BOTTOM-CENTER LOCKED CONTROL BAR: 3 Sequential Particle Phases + Prev/Next Era */}
        <div className="pointer-events-auto w-full max-w-xl mx-auto flex items-center justify-between gap-2 px-3 py-2 bg-[#0a0a0a]/95 border border-white/25 rounded-full shadow-2xl">
          {/* Prev Era Button */}
          <button
            onClick={() => onSelectEra(Math.max(0, activeEraIndex - 1))}
            disabled={activeEraIndex === 0}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black disabled:opacity-25 disabled:pointer-events-none cursor-pointer transition-colors shrink-0"
            title="Previous Era"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          {/* Center: 3 Sequential Particle Phases OR Live Word Input on Final Era */}
          {activeEraIndex === 8 ? (
            <div className="flex items-center gap-2 flex-1 justify-center px-2">
              <Sparkles className="w-3.5 h-3.5 text-white shrink-0 hidden sm:inline" />
              <span className="font-mono text-[10px] text-neutral-300 uppercase hidden sm:inline">
                SYNTHESIZE WORD:
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
                className="w-36 sm:w-44 bg-black border border-white/35 rounded-full px-3 py-1 font-mono text-xs text-white text-center uppercase tracking-widest focus:outline-none focus:border-white"
              />
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
              {era.phases.map((phase, pIdx) => {
                const isPhaseActive =
                  activePhaseIndex === pIdx && overrideWord === null;
                const phaseLetter = pIdx === 0 ? 'A' : pIdx === 1 ? 'B' : 'C';
                return (
                  <button
                    key={phase.tag}
                    onClick={() => {
                      onSelectOverrideWord(null);
                      onSelectPhase(activeEraIndex, pIdx);
                    }}
                    className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                      isPhaseActive
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'text-neutral-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="opacity-60 mr-1">{phaseLetter}.</span>
                    {phase.word}
                  </button>
                );
              })}
            </div>
          )}

          {/* Next / Restart Era Button */}
          {activeEraIndex < totalStations - 1 ? (
            <button
              onClick={() => onSelectEra(activeEraIndex + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-black hover:bg-neutral-200 cursor-pointer transition-colors shrink-0"
              title="Next Era"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => onSelectEra(0)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-black hover:bg-neutral-200 cursor-pointer transition-colors shrink-0"
              title="Restart Journey"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorizontalStage;
