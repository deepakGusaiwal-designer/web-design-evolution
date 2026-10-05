import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ERAS } from '../data/eras';
import { ArrowRight, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';

interface HorizontalStageProps {
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

export const HorizontalStage: React.FC<HorizontalStageProps> = React.memo(
  ({
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

    const leftPanelRef = useRef<HTMLElement>(null);
    const rightPanelRef = useRef<HTMLElement>(null);
    const phaseBoxRef = useRef<HTMLDivElement>(null);

    // Smooth GSAP entrance transition when switching eras
    useEffect(() => {
      if (leftPanelRef.current) {
        gsap.fromTo(
          leftPanelRef.current,
          { opacity: 0.35, x: -16 },
          { opacity: 1, x: 0, duration: 0.48, ease: 'power3.out', overwrite: true }
        );
      }
      if (rightPanelRef.current) {
        gsap.fromTo(
          rightPanelRef.current,
          { opacity: 0.35, x: 16 },
          { opacity: 1, x: 0, duration: 0.48, ease: 'power3.out', overwrite: true }
        );
      }
    }, [activeEraIndex]);

    // Subtle GSAP pulse when active phase or override word changes
    useEffect(() => {
      if (phaseBoxRef.current) {
        gsap.fromTo(
          phaseBoxRef.current,
          { opacity: 0.5, y: 4 },
          { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out', overwrite: true }
        );
      }
    }, [activePhaseIndex, overrideWord]);

    return (
      <div
        className={`fixed inset-0 pointer-events-none z-10 transition-opacity duration-500 ${
          pureParticleMode ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Main Viewport-Locked Split Stage: Left Glass Panel + Open Center Particle Stage + Right Glass Panel */}
        <div className="relative w-full h-full flex flex-col justify-between pt-24 pb-6 px-4 sm:px-6 lg:px-7">
          <div className="flex-1 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* LEFT PANEL: Frosted Glassmorphism Era & Active Particle Phase Block */}
            <aside
              ref={leftPanelRef}
              className="pointer-events-auto w-full lg:w-[276px] xl:w-[296px] flex flex-col gap-3.5 glass-panel rounded-xl p-4 will-change-transform"
            >
              {/* Chapter & Year Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em]">
                  <span className="bg-white/20 text-white border border-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] font-bold px-2 py-0.5 rounded text-[10px]">
                    /{era.chapter}
                  </span>
                  <span className="text-white font-semibold">{era.year}</span>
                </div>
                <span className="font-mono text-[10px] text-neutral-300 uppercase tracking-wider">
                  {era.id}
                </span>
              </div>

              {/* Era Title */}
              <h2 className="font-dm text-xl sm:text-2xl font-bold tracking-tight text-white leading-[1.12]">
                {era.title}
              </h2>

              {/* Active Particle Phase Glass Sub-Block */}
              <div
                ref={phaseBoxRef}
                className="glass-subcard rounded-lg p-2.5 flex flex-col gap-1"
              >
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
              <p className="font-dm text-xs text-neutral-200 italic leading-relaxed border-l-2 border-white/50 pl-3">
                {era.quote}
              </p>

              {/* Era Summary */}
              <p className="font-dm text-xs text-neutral-300 leading-relaxed hidden sm:block">
                {era.summary}
              </p>

              {/* 3 Interactive Glassmorphic Spec Blocks */}
              <div className="pt-2 border-t border-white/15">
                <div className="font-mono text-[9px] text-neutral-300 uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>ERA SPECS</span>
                  <span>CLICK TO MORPH</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {era.specs.map((spec) => {
                    const isSelected = overrideWord === spec.particleWord;
                    return (
                      <button
                        key={spec.label}
                        onClick={() =>
                          onSelectOverrideWord(isSelected ? null : spec.particleWord)
                        }
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/25 text-white border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_16px_rgba(0,0,0,0.5)]'
                            : 'glass-subcard text-white'
                        }`}
                        title={`Click to morph particles into "${spec.particleWord}"`}
                      >
                        <span
                          className={`font-mono text-[9px] uppercase tracking-wider ${
                            isSelected ? 'text-white font-bold' : 'text-neutral-300'
                          }`}
                        >
                          {spec.label}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-white">
                          {spec.value}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* CENTER STAGE: 100% Unobstructed Open Space for Particle Word, 3D Sculpture & Callouts */}
            <div className="hidden lg:block flex-1 h-full pointer-events-none" />

            {/* RIGHT PANEL: Frosted Glassmorphism Milestones Block */}
            <aside
              ref={rightPanelRef}
              className="pointer-events-auto hidden lg:flex w-[276px] xl:w-[296px] flex-col gap-3 glass-panel rounded-xl p-4 will-change-transform"
            >
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-white uppercase border-b border-white/15 pb-2.5">
                <span className="font-bold">KEY MILESTONES</span>
                <span className="text-[9px] text-neutral-300">CLICK TO MORPH</span>
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
                      className={`text-left group p-3 rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white/25 text-white border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_20px_rgba(0,0,0,0.6)]'
                          : 'glass-subcard'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="font-bold text-white">{m.year}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded border ${
                            isSelected
                              ? 'border-white/60 bg-white/20 text-white font-bold'
                              : 'border-white/20 bg-white/[0.05] text-neutral-200 group-hover:text-white group-hover:border-white/40'
                          }`}
                        >
                          {m.particleWord}
                        </span>
                      </div>
                      <div className="font-dm text-xs font-bold text-white mt-1">
                        {m.title}
                      </div>
                      <div className="font-dm text-[11px] leading-snug text-neutral-300 mt-0.5">
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
                  className="mt-1 w-full py-1.5 px-3 rounded-lg glass-subcard font-mono text-[10px] text-white uppercase tracking-wider cursor-pointer"
                >
                  ↺ Reset to Phase Word ({activePhase.word})
                </button>
              )}
            </aside>
          </div>

          {/* BOTTOM-CENTER LOCKED GLASSMORPHIC CONTROL BAR */}
          <div className="pointer-events-auto w-full max-w-xl mx-auto flex items-center justify-between gap-2 px-3 py-2 glass-pill rounded-full">
            {/* Prev Era Button */}
            <button
              onClick={() => onSelectEra(Math.max(0, activeEraIndex - 1))}
              disabled={activeEraIndex === 0}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] border border-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-white/20 hover:border-white/50 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transition-all shrink-0"
              title="Previous Era"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            {/* Center: 3 Sequential Particle Phases OR Live Word Input on Final Era */}
            {activeEraIndex === 8 ? (
              <div className="flex items-center gap-2 flex-1 justify-center px-2">
                <Sparkles className="w-3.5 h-3.5 text-white shrink-0 hidden sm:inline" />
                <span className="font-mono text-[10px] text-neutral-200 uppercase hidden sm:inline">
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
                  className="w-36 sm:w-44 bg-white/[0.07] border border-white/30 rounded-full px-3 py-1 font-mono text-xs text-white text-center uppercase tracking-widest focus:outline-none focus:border-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
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
                      className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                        isPhaseActive
                          ? 'bg-white/25 text-white border border-white/55 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_10px_rgba(0,0,0,0.4)]'
                          : 'text-neutral-300 border border-transparent hover:text-white hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="opacity-65 mr-1">{phaseLetter}.</span>
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
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/25 text-white border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] hover:bg-white/35 cursor-pointer transition-all shrink-0"
                title="Next Era"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onSelectEra(0)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/25 text-white border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] hover:bg-white/35 cursor-pointer transition-all shrink-0"
                title="Restart Journey"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default HorizontalStage;
