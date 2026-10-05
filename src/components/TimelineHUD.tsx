import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ERAS } from '../data/eras';
import { Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';
import type { ScrollMotionState } from './WaterShader';
import { BrandLogo } from './BrandLogo';

interface TimelineHUDProps {
  activeEraIndex: number;
  motionRef: React.MutableRefObject<ScrollMotionState>;
  onSelectEra: (index: number) => void;
  pureParticleMode: boolean;
  onTogglePureParticleMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TimelineHUD: React.FC<TimelineHUDProps> = React.memo(
  ({
    activeEraIndex,
    motionRef,
    onSelectEra,
    pureParticleMode,
    onTogglePureParticleMode,
    soundEnabled,
    onToggleSound,
  }) => {
    const percentRef = useRef<HTMLSpanElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      let lastPct = -1;

      const onTick = () => {
        const prog = motionRef.current.progress;
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${prog})`;
        }
        const pct = Math.round(prog * 100);
        if (pct !== lastPct && percentRef.current) {
          lastPct = pct;
          percentRef.current.textContent = `TIMELINE PROGRESS // ${pct.toString().padStart(3, '0')}%`;
        }
      };

      gsap.ticker.add(onTick);
      return () => {
        gsap.ticker.remove(onTick);
      };
    }, [motionRef]);

    return (
      <header className="fixed top-0 left-0 right-0 z-30 glass-timeline">
        {/* ROW 1: Top Frosted Glass Identity & Mode Controls (48px) */}
        <div className="h-12 px-4 sm:px-7 flex items-center justify-between border-b border-white/10">
          <BrandLogo onClick={() => onSelectEra(0)} />

          <div className="flex items-center gap-3 sm:gap-4">
            <span
              ref={percentRef}
              className="hidden md:inline font-mono text-[10px] text-neutral-300 tracking-widest whitespace-nowrap"
            >
              TIMELINE PROGRESS // 000%
            </span>

            <button
              onClick={onTogglePureParticleMode}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap backdrop-blur-md ${
                pureParticleMode
                  ? 'bg-white/90 text-black border-white font-bold shadow-[0_0_16px_rgba(255,255,255,0.25)]'
                  : 'bg-white/[0.06] text-neutral-200 border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-white/[0.14] hover:text-white hover:border-white/45'
              }`}
            >
              {pureParticleMode ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>{pureParticleMode ? 'SHOW UI' : 'PARTICLES ONLY'}</span>
            </button>

            <button
              onClick={onToggleSound}
              className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 backdrop-blur-md ${
                soundEnabled
                  ? 'bg-white/90 text-black border-white shadow-[0_0_14px_rgba(255,255,255,0.25)]'
                  : 'bg-white/[0.06] text-neutral-200 border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-white/[0.14] hover:text-white hover:border-white/45'
              }`}
              title="Toggle Audio"
            >
              {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* ROW 2: Frosted Glassmorphic 9-Column Interactive Horizontal Timeline Bar */}
        <nav
          aria-label="Historical Era Timeline"
          className="relative h-10 px-2 sm:px-6 py-1 flex items-center overflow-x-auto no-scrollbar"
        >
          {/* GPU-Accelerated ScaleX Progress Fill at Bottom of Timeline Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white/10 pointer-events-none">
            <div
              ref={progressBarRef}
              className="h-full w-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] origin-left will-change-transform"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>

          <div className="w-full min-w-[780px] h-full grid grid-cols-9 gap-1">
            {ERAS.map((era, idx) => {
              const isActive = idx === activeEraIndex;
              const isPast = idx < activeEraIndex;
              const startYear = era.year.split(' ')[0];

              return (
                <button
                  key={era.id}
                  onClick={() => onSelectEra(idx)}
                  className={`relative h-full px-2.5 rounded-md flex items-center justify-between border transition-all cursor-pointer group whitespace-nowrap backdrop-blur-md ${
                    isActive
                      ? 'bg-white/20 text-white border-white/50 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_16px_rgba(0,0,0,0.5)]'
                      : isPast
                        ? 'bg-white/[0.04] text-neutral-300 border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/[0.10] hover:border-white/25 hover:text-white'
                        : 'bg-white/[0.02] text-neutral-400 border-white/[0.07] hover:bg-white/[0.09] hover:border-white/25 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase whitespace-nowrap">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-white shadow-[0_0_6px_#ffffff]'
                          : isPast
                            ? 'bg-white/60'
                            : 'bg-white/20 group-hover:bg-white/60'
                      }`}
                    />
                    <span className="font-bold">/{era.chapter}</span>
                    <span className={isActive ? 'text-white' : 'text-white/85'}>
                      {era.id}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-[9px] tracking-normal whitespace-nowrap hidden xl:inline ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-neutral-500 group-hover:text-neutral-300'
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
  }
);

export default TimelineHUD;
