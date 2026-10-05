import React from 'react';
import { ERAS } from '../data/eras';
import { Eye, EyeOff, Volume2, VolumeX, MoveHorizontal } from 'lucide-react';

interface TimelineHUDProps {
  activeEraIndex: number;
  scrollProgress: number;
  onSelectEra: (index: number) => void;
  pureParticleMode: boolean;
  onTogglePureParticleMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TimelineHUD: React.FC<TimelineHUDProps> = ({
  activeEraIndex,
  scrollProgress,
  onSelectEra,
  pureParticleMode,
  onTogglePureParticleMode,
  soundEnabled,
  onToggleSound,
}) => {
  const activeEra = ERAS[activeEraIndex] || ERAS[0];
  const pixelCoord = Math.round(scrollProgress * (ERAS.length - 1) * 1920)
    .toString()
    .padStart(5, '0');
  const percent = Math.round(scrollProgress * 100)
    .toString()
    .padStart(3, '0');

  return (
    <>
      {/* TOP MONOCHROME ARCHITECTURAL HEADER */}
      <header className="fixed top-0 left-0 right-0 h-13 z-30 mono-panel border-t-0 border-x-0 px-4 sm:px-8 flex items-center justify-between">
        {/* Left: Archive Title */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-white" />
          <span className="font-dm font-black text-xs sm:text-sm tracking-[0.18em] text-white uppercase">
            THE EVOLUTION OF THE WEB
          </span>
          <span className="hidden md:inline-block font-mono text-[10px] text-neutral-500 border-l border-white/15 pl-3">
            MONOCHROME PARTICLE ARCHIVE // 1989 — ∞
          </span>
        </div>

        {/* Center: Live Coordinate Telemetry */}
        <div className="hidden xl:flex items-center gap-4 font-mono text-[11px] text-neutral-400">
          <span className="flex items-center gap-1.5 text-white">
            <MoveHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            HORIZONTAL SCROLL
          </span>
          <span className="text-neutral-600">|</span>
          <span>X-POS: <strong className="text-white">{pixelCoord}PX</strong></span>
          <span className="text-neutral-600">|</span>
          <span>PROGRESS: <strong className="text-white">{percent}%</strong></span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-300">[{activeEra.chapter}] {activeEra.id.toUpperCase()}</span>
        </div>

        {/* Right: Pure Particle View & Audio Synthesizer Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePureParticleMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border transition-all cursor-pointer ${
              pureParticleMode
                ? 'bg-white text-black border-white font-bold'
                : 'bg-black/60 text-neutral-300 border-white/20 hover:text-white hover:border-white/50'
            }`}
            title="Hide info cards to inspect full-screen particles"
          >
            {pureParticleMode ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>{pureParticleMode ? 'SHOW INFO DECK' : 'PURE PARTICLES'}</span>
          </button>

          <button
            onClick={onToggleSound}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-white text-black border-white font-bold'
                : 'bg-black/60 text-neutral-400 border-white/20 hover:text-white hover:border-white/50'
            }`}
            title="Toggle Monochrome Audio Synthesizer"
          >
            {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            <span className="hidden sm:inline">{soundEnabled ? 'AUDIO ON' : 'AUDIO'}</span>
          </button>
        </div>
      </header>

      {/* BOTTOM HORIZONTAL TIMELINE RULER & ERA SCRUBBER */}
      <footer className="fixed bottom-0 left-0 right-0 h-13 z-30 mono-panel border-b-0 border-x-0 px-4 sm:px-8 flex flex-col justify-center">
        {/* Continuous Horizontal Progress Hairline at Top of Footer */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10">
          <div
            className="h-full bg-white transition-all duration-75"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* 9 Horizontal Chapter Nodes */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1">
          {ERAS.map((era, idx) => {
            const isActive = idx === activeEraIndex;
            const isPassed = idx < activeEraIndex;

            return (
              <button
                key={era.id}
                onClick={() => onSelectEra(idx)}
                className={`group flex items-center gap-2 px-2.5 py-1 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white text-black font-bold'
                    : isPassed
                      ? 'text-neutral-300 hover:text-white'
                      : 'text-neutral-500 hover:text-neutral-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 transition-transform ${
                    isActive
                      ? 'bg-black scale-125'
                      : isPassed
                        ? 'bg-white/70'
                        : 'bg-white/25 group-hover:bg-white/60'
                  }`}
                />
                <span className="font-mono text-[10px] tracking-wider uppercase">
                  {era.chapter}
                </span>
                <span className="hidden md:inline font-mono text-[10px] tracking-wider uppercase">
                  {era.year.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </footer>
    </>
  );
};

export default TimelineHUD;
