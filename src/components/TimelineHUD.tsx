import React from 'react';
import { ERAS } from '../data/eras';
import { Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';

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
  const percent = Math.round(scrollProgress * 100)
    .toString()
    .padStart(3, '0');

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-[#050505]/90 backdrop-blur-md border-b border-white/15">
      {/* ROW 1: Top Identity & Mode Controls (44px) */}
      <div className="h-11 px-4 sm:px-7 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-white rounded-full" />
          <span className="font-dm font-bold text-xs tracking-[0.2em] text-white uppercase whitespace-nowrap">
            THE EVOLUTION OF THE WEB
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden md:inline font-mono text-[10px] text-neutral-400 tracking-widest whitespace-nowrap">
            TIMELINE PROGRESS // {percent}%
          </span>

          <button
            onClick={onTogglePureParticleMode}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap ${
              pureParticleMode
                ? 'bg-white text-black border-white font-bold'
                : 'text-neutral-300 border-white/20 hover:text-white hover:border-white/50'
            }`}
          >
            {pureParticleMode ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>{pureParticleMode ? 'SHOW UI' : 'PARTICLES ONLY'}</span>
          </button>

          <button
            onClick={onToggleSound}
            className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
              soundEnabled
                ? 'bg-white text-black border-white'
                : 'text-neutral-300 border-white/20 hover:text-white hover:border-white/50'
            }`}
            title="Toggle Audio"
          >
            {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* ROW 2: Precision Interactive Horizontal Timeline Ruler (36px, Never Wraps or Clips) */}
      <nav
        aria-label="Historical Era Timeline"
        className="relative h-9 px-2 sm:px-6 flex items-center overflow-x-auto no-scrollbar"
      >
        {/* Continuous Hairline Progress Fill at Bottom of Timeline Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 pointer-events-none">
          <div
            className="h-full bg-white transition-all duration-75"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        <div className="w-full min-w-[760px] h-full grid grid-cols-9">
          {ERAS.map((era, idx) => {
            const isActive = idx === activeEraIndex;
            const isPast = idx < activeEraIndex;
            const startYear = era.year.split(' ')[0];

            return (
              <button
                key={era.id}
                onClick={() => onSelectEra(idx)}
                className={`relative h-full px-2.5 flex items-center justify-between border-l border-white/12 last:border-r transition-colors cursor-pointer group whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-black font-bold'
                    : isPast
                      ? 'bg-white/[0.03] text-neutral-300 hover:bg-white/10 hover:text-white'
                      : 'text-neutral-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {/* Left: Chapter + ID */}
                <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-black'
                        : isPast
                          ? 'bg-white/60'
                          : 'bg-white/20 group-hover:bg-white/60'
                    }`}
                  />
                  <span className="font-bold">/{era.chapter}</span>
                  <span className={isActive ? 'text-black' : 'text-white/90'}>
                    {era.id}
                  </span>
                </div>

                {/* Right: Compact Start Year + Ruler Tick */}
                <span
                  className={`font-mono text-[9px] tracking-normal whitespace-nowrap hidden xl:inline ${
                    isActive ? 'text-black/80 font-semibold' : 'text-neutral-500 group-hover:text-neutral-300'
                  }`}
                >
                  {startYear}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default TimelineHUD;
