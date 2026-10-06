import React, { useEffect, useRef, useState } from 'react';
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

    const [mobileTab, setMobileTab] = useState<'story' | 'specs' | 'milestones'>('story');

    const leftPanelRef = useRef<HTMLElement>(null);
    const rightPanelRef = useRef<HTMLElement>(null);
    const mobilePanelRef = useRef<HTMLDivElement>(null);
    const phaseBoxRef = useRef<HTMLDivElement>(null);
    const phaseScrollRef = useRef<HTMLDivElement>(null);

    // Smooth GSAP entrance transition when switching eras (clear inline transform/opacity on complete so backdrop-filter stays active)
    useEffect(() => {
      if (leftPanelRef.current) {
        gsap.fromTo(
          leftPanelRef.current,
          { opacity: 0.45, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.42,
            ease: 'power3.out',
            overwrite: true,
            clearProps: 'transform,opacity',
          }
        );
      }
      if (rightPanelRef.current) {
        gsap.fromTo(
          rightPanelRef.current,
          { opacity: 0.45, x: 12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.42,
            ease: 'power3.out',
            overwrite: true,
            clearProps: 'transform,opacity',
          }
        );
      }
      if (mobilePanelRef.current) {
        gsap.fromTo(
          mobilePanelRef.current,
          { opacity: 0.5, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.38,
            ease: 'power3.out',
            overwrite: true,
            clearProps: 'transform,opacity',
          }
        );
      }
    }, [activeEraIndex]);

    // Subtle GSAP pulse when active phase or override word changes
    useEffect(() => {
      if (phaseBoxRef.current) {
        gsap.fromTo(
          phaseBoxRef.current,
          { opacity: 0.55, y: 3 },
          {
            opacity: 1,
            y: 0,
            duration: 0.28,
            ease: 'power2.out',
            overwrite: true,
            clearProps: 'transform,opacity',
          }
        );
      }
    }, [activePhaseIndex, overrideWord]);

    // Auto-scroll active phase pill into horizontal center on mobile
    useEffect(() => {
      if (!phaseScrollRef.current) return;
      const activePill = phaseScrollRef.current.querySelector<HTMLButtonElement>(
        `[data-phase-idx="${activePhaseIndex}"]`
      );
      if (activePill) {
        activePill.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }, [activePhaseIndex, activeEraIndex]);

    const matchedSpec = overrideWord
      ? era.specs.find((s) => s.particleWord === overrideWord)
      : undefined;
    const matchedMilestone = overrideWord
      ? era.milestones.find((m) => m.particleWord === overrideWord)
      : undefined;
    const trimmedCustom =
      activeEraIndex === 8 ? customWord.trim().toUpperCase() : '';

    const kickerText = matchedSpec
      ? matchedSpec.story.kicker
      : matchedMilestone
        ? matchedMilestone.story.kicker
        : trimmedCustom
          ? 'CHAPTER 08 · LIVE PARTICLE SYNTHESIZER'
          : activePhase.tag;

    const wordText =
      overrideWord || (trimmedCustom ? trimmedCustom : activePhase.word);

    const narrativeText = matchedSpec
      ? `${matchedSpec.story.line1} — ${matchedSpec.story.line2}`
      : matchedMilestone
        ? `${matchedMilestone.story.line1} — ${matchedMilestone.story.line2}`
        : trimmedCustom
          ? `CUSTOM INTENT "${trimmedCustom}" SCULPTED LIVE IN 7,200 MONOCHROME PARTICLES`
          : `${activePhase.line1} — ${activePhase.line2}`;

    return (
      <div
        className={`fixed inset-0 pointer-events-none z-10 transition-opacity duration-500 ${
          pureParticleMode ? 'opacity-0 invisible' : 'opacity-100 visible'
        }`}
      >
        {/* Main Viewport-Locked Split Stage */}
        <div className="relative w-full h-full flex flex-col justify-between pt-20 sm:pt-24 pb-3 sm:pb-6 px-3 sm:px-6 lg:px-7 gap-2.5">
          <div className="flex-1 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* DESKTOP LEFT PANEL: Liquid Glass Era & Active Particle Phase Block */}
            <aside
              ref={leftPanelRef}
              className="pointer-events-auto hidden lg:flex w-[280px] xl:w-[304px] flex-col gap-3.5 glass-panel p-5"
            >
              {/* Chapter & Year Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em]">
                  <span className="bg-white/12 text-white border border-white/15 font-bold px-2 py-0.5 rounded-md text-[10px]">
                    /{era.chapter}
                  </span>
                  <span className="text-white font-bold">{era.year}</span>
                </div>
                <span className="font-mono text-[10px] text-neutral-100 font-semibold uppercase tracking-wider">
                  {era.id}
                </span>
              </div>

              {/* Era Title */}
              <h2 className="font-dm text-xl sm:text-2xl font-bold tracking-tight text-white leading-[1.14]">
                {era.title}
              </h2>

              {/* Active Particle Phase Liquid Glass Sub-Block */}
              <div
                ref={phaseBoxRef}
                className="glass-subcard p-3 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between font-mono text-[9.5px] text-neutral-100 font-semibold uppercase tracking-wider">
                  <span>{kickerText}</span>
                  <span className="text-white font-bold">[{wordText}]</span>
                </div>
                <div className="font-dm text-[12.5px] text-white font-semibold leading-snug">
                  {narrativeText}
                </div>
              </div>

              {/* Era Quote in Liquid Glass Capsule */}
              <div className="glass-subcard px-3.5 py-2.5 border-l border-l-white/35">
                <p className="font-dm text-[12.5px] text-white italic font-medium leading-relaxed">
                  {era.quote}
                </p>
              </div>

              {/* Era Summary */}
              <p className="font-dm text-[12.5px] text-neutral-100 font-normal leading-relaxed">
                {era.summary}
              </p>

              {/* 3 Interactive Liquid Glass Spec Blocks */}
              <div className="pt-2.5 border-t border-white/10">
                <div className="font-mono text-[9.5px] text-neutral-100 font-semibold uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>ERA SPECS</span>
                  <span className="text-neutral-200">CLICK TO MORPH</span>
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
                        className={`w-full flex items-center justify-between px-3 py-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'glass-subcard-active text-white'
                            : 'glass-subcard text-white'
                        }`}
                        title={`Click to morph particles into "${spec.particleWord}"`}
                      >
                        <span
                          className={`font-mono text-[9.5px] uppercase tracking-wider ${
                            isSelected ? 'text-white font-bold' : 'text-neutral-100 font-medium'
                          }`}
                        >
                          {spec.label}
                        </span>
                        <span className="font-mono text-[10.5px] font-bold text-white">
                          {spec.value}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* CENTER STAGE: 100% Unobstructed Open Space for Particle Word & 3D Sculpture */}
            <div className="flex-1 h-full pointer-events-none" />

            {/* DESKTOP RIGHT PANEL: Liquid Glass Milestones Block */}
            <aside
              ref={rightPanelRef}
              className="pointer-events-auto hidden lg:flex w-[280px] xl:w-[304px] flex-col gap-3 glass-panel p-5"
            >
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-white uppercase border-b border-white/10 pb-2.5">
                <span className="font-bold">KEY MILESTONES</span>
                <span className="text-[9.5px] text-neutral-100 font-semibold">CLICK TO MORPH</span>
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
                      className={`text-left group p-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'glass-subcard-active text-white'
                          : 'glass-subcard'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="font-bold text-white">{m.year}</span>
                        <span
                          className={`text-[9.5px] px-1.5 py-0.5 rounded-md border ${
                            isSelected
                              ? 'border-white/35 bg-white/20 text-white font-bold'
                              : 'border-white/10 bg-black/35 text-white font-medium group-hover:border-white/25'
                          }`}
                        >
                          {m.particleWord}
                        </span>
                      </div>
                      <div className="font-dm text-[13px] font-bold text-white mt-1">
                        {m.title}
                      </div>
                      <div className="font-dm text-[11.5px] leading-snug text-neutral-100 font-normal mt-0.5">
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
                  className="mt-1 w-full py-1.5 px-3 glass-subcard font-mono text-[10px] font-semibold text-white uppercase tracking-wider cursor-pointer"
                >
                  ↺ Reset to Phase Word ({activePhase.word})
                </button>
              )}
            </aside>
          </div>

          {/* MOBILE & TABLET COMPACT LIQUID GLASS BOTTOM DOCK (< 1024px) */}
          <div
            ref={mobilePanelRef}
            className="pointer-events-auto lg:hidden w-full max-w-xl mx-auto glass-panel p-3 flex flex-col gap-2"
          >
            {/* Compact Era Title & 3-Tab Switcher Header */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="bg-white/12 text-white border border-white/15 font-mono font-bold px-1.5 py-0.5 rounded-md text-[9.5px] shrink-0">
                  /{era.chapter}
                </span>
                <div className="min-w-0">
                  <div className="font-dm text-sm font-bold text-white truncate leading-tight">
                    {era.title}
                  </div>
                  <div className="font-mono text-[9.5px] text-neutral-200 font-medium tracking-wider">
                    {era.year} · {era.id}
                  </div>
                </div>
              </div>

              {/* Mobile Tab Switcher: STORY | SPECS | NODES */}
              <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-xl border border-white/10 shrink-0">
                {(
                  [
                    { id: 'story', label: 'STORY' },
                    { id: 'specs', label: 'SPECS' },
                    { id: 'milestones', label: 'NODES' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setMobileTab(t.id)}
                    className={`px-2 py-1 rounded-lg font-mono text-[9.5px] tracking-wider uppercase transition-all cursor-pointer ${
                      mobileTab === t.id
                        ? 'bg-white text-black font-bold [text-shadow:none]'
                        : 'text-neutral-100 font-medium hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Tab 1: Active Story Narrative & Quote */}
            {mobileTab === 'story' && (
              <div className="flex flex-col gap-1.5">
                <div className="glass-subcard px-2.5 py-2 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between font-mono text-[9px] text-neutral-100 font-semibold uppercase tracking-widest gap-2">
                    <span className="truncate">{kickerText}</span>
                    <span className="text-white font-bold shrink-0">[{wordText}]</span>
                  </div>
                  <div className="font-dm text-[11.5px] text-white font-semibold leading-snug line-clamp-2">
                    {narrativeText}
                  </div>
                </div>
                <p className="font-dm text-[11.5px] text-neutral-100 italic font-medium leading-snug border-l border-white/35 pl-2.5 line-clamp-1">
                  {era.quote}
                </p>
              </div>
            )}

            {/* Mobile Tab 2: 3 Interactive Era Specs */}
            {mobileTab === 'specs' && (
              <div className="grid grid-cols-3 gap-1.5">
                {era.specs.map((spec) => {
                  const isSelected = overrideWord === spec.particleWord;
                  return (
                    <button
                      key={spec.label}
                      onClick={() =>
                        onSelectOverrideWord(isSelected ? null : spec.particleWord)
                      }
                      className={`flex flex-col items-start justify-between p-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'glass-subcard-active text-white'
                          : 'glass-subcard text-white'
                      }`}
                    >
                      <span className="font-mono text-[8.5px] text-neutral-100 font-semibold uppercase tracking-wider truncate w-full">
                        {spec.label}
                      </span>
                      <span className="font-mono text-[10.5px] font-bold text-white truncate w-full mt-0.5">
                        {spec.value}
                      </span>
                      <span className="font-mono text-[8.5px] text-neutral-200 font-medium mt-1 truncate w-full">
                        [{spec.particleWord}]
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Mobile Tab 3: 3 Interactive Key Milestones */}
            {mobileTab === 'milestones' && (
              <div className="grid grid-cols-3 gap-1.5">
                {era.milestones.map((m) => {
                  const isSelected = overrideWord === m.particleWord;
                  return (
                    <button
                      key={m.year + m.title}
                      onClick={() =>
                        onSelectOverrideWord(isSelected ? null : m.particleWord)
                      }
                      className={`flex flex-col items-start justify-between p-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'glass-subcard-active text-white'
                          : 'glass-subcard text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full font-mono text-[9px]">
                        <span className="font-bold text-white">{m.year}</span>
                        <span className="text-neutral-100 font-medium truncate ml-1">
                          {m.particleWord}
                        </span>
                      </div>
                      <div className="font-dm text-[10.5px] font-bold text-white truncate w-full mt-0.5">
                        {m.title}
                      </div>
                      <div className="font-dm text-[9.5px] text-neutral-100 line-clamp-1 w-full mt-0.5">
                        {m.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* BOTTOM-CENTER LOCKED GLASSMORPHIC CONTROL BAR */}
          <div className="pointer-events-auto w-full max-w-2xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 glass-pill rounded-full">
            {/* Prev Era Button */}
            <button
              onClick={() => onSelectEra(Math.max(0, activeEraIndex - 1))}
              disabled={activeEraIndex === 0}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-black/40 border border-white/12 text-white hover:bg-white/15 hover:border-white/30 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all shrink-0"
              title="Previous Era"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            {/* Center: 3 Sequential Particle Phases + Optional Live Word Input on Final Era */}
            <div
              ref={phaseScrollRef}
              className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar"
            >
              {era.phases.map((phase, pIdx) => {
                const isCustomActive =
                  activeEraIndex === 8 && customWord.trim().length > 0;
                const isPhaseActive =
                  activePhaseIndex === pIdx &&
                  overrideWord === null &&
                  !isCustomActive;
                const phaseLetter = pIdx === 0 ? 'A' : pIdx === 1 ? 'B' : 'C';
                return (
                  <button
                    key={phase.tag}
                    data-phase-idx={pIdx}
                    onClick={() => {
                      onSelectOverrideWord(null);
                      onSelectPhase(activeEraIndex, pIdx);
                    }}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-full font-mono text-[9.5px] sm:text-[10px] uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                      isPhaseActive
                        ? 'bg-white/18 text-white border border-white/25 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]'
                        : 'text-neutral-100 font-medium border border-transparent hover:text-white hover:bg-white/10 hover:border-white/15'
                    }`}
                  >
                    <span className="opacity-80 mr-1">{phaseLetter}.</span>
                    {phase.word}
                  </button>
                );
              })}

              {activeEraIndex === 8 && (
                <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/15 shrink-0">
                  <Sparkles className="w-3 h-3 text-white shrink-0 hidden sm:inline" />
                  <input
                    type="text"
                    maxLength={12}
                    value={customWord}
                    onChange={(e) => {
                      onSelectOverrideWord(null);
                      onChangeCustomWord(e.target.value);
                    }}
                    placeholder="TYPE WORD..."
                    className="w-24 sm:w-32 bg-black/45 border border-white/15 rounded-full px-2.5 py-1 font-mono text-[10px] text-white font-semibold text-center uppercase tracking-widest placeholder:text-neutral-300 focus:outline-none focus:border-white/50"
                  />
                </div>
              )}
            </div>

            {/* Next / Restart Era Button */}
            {activeEraIndex < totalStations - 1 ? (
              <button
                onClick={() => onSelectEra(activeEraIndex + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/18 text-white border border-white/25 hover:bg-white/28 cursor-pointer transition-all shrink-0"
                title="Next Era"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onSelectEra(0)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/18 text-white border border-white/25 hover:bg-white/28 cursor-pointer transition-all shrink-0"
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
