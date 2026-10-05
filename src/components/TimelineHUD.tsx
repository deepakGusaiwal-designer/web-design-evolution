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
    <>
      {/* TOP MINIMAL HEADER */}
      <header className="fixed top-0 left-0 right-0 h-12 z-30 px-6 sm:px-10 lg:px-14 flex items-center justify-between border-b border-white/[0.06] bg-[#050505]/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-white rounded-full" />
          <span className="font-dm font-bold text-xs tracking-[0.2em] text-white uppercase">
            THE EVOLUTION OF THE WEB
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline font-mono text-[10px] text-neutral-500 tracking-widest">
            SCROLL HORIZONTALLY // {percent}%
          </span>

          <button
            onClick={onTogglePureParticleMode}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider border transition-all cursor-pointer ${
              pureParticleMode
                ? 'bg-white text-black border-white font-bold'
                : 'text-neutral-400 border-white/15 hover:text-white hover:border-white/40'
            }`}
          >
            {pureParticleMode ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>{pureParticleMode ? 'SHOW TEXT' : 'PARTICLES ONLY'}</span>
          </button>

          <button
            onClick={onToggleSound}
            className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-white text-black border-white'
                : 'text-neutral-400 border-white/15 hover:text-white hover:border-white/40'
            }`}
            title="Toggle Audio"
          >
            {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </button>
        </div>
      </header>

      {/* BOTTOM MINIMAL HORIZONTAL TIMELINE */}
      <footer className="fixed bottom-0 left-0 right-0 h-11 z-30 px-6 sm:px-10 lg:px-14 flex items-center justify-between border-t border-white/[0.06] bg-[#050505]/70 backdrop-blur-md">
        {/* Hairline Progress Fill */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10">
          <div
            className="h-full bg-white transition-all duration-75"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        <div className="w-full flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {ERAS.map((era, idx) => {
            const isActive = idx === activeEraIndex;

            return (
              <button
                key={era.id}
                onClick={() => onSelectEra(idx)}
                className={`flex items-center gap-2 py-1 font-mono text-[10px] tracking-widest uppercase transition-colors cursor-pointer shrink-0 ${
                  isActive ? 'text-white font-bold' : 'text-neutral-600 hover:text-neutral-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    isActive ? 'bg-white scale-125' : 'bg-white/20'
                  }`}
                />
                <span>{era.chapter}</span>
                <span className="hidden md:inline text-[9px] opacity-75">
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
