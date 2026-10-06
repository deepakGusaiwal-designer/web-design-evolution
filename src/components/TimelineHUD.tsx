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
    const navRef = useRef<HTMLElement>(null);

    // Auto-scroll active era button into horizontal center on mobile/tablet
    useEffect(() => {
      if (!navRef.current) return;
      const activeBtn = navRef.current.querySelector<HTMLButtonElement>(
        `[data-era-idx="${activeEraIndex}"]`
      );
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }, [activeEraIndex]);

    useEffect(() => {
      let lastPct = -1;

      const onTick = () => {
        const prog = motionRef.current.progress;
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${prog * 100}%`;
          progressBarRef.current.style.opacity = prog > 0.001 ? '1' : '0';
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
        {/* TOP-OF-APP LUMINOUS SHINING TIMELINE PROGRESS BAR */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 z-50 pointer-events-none">
          <div
            ref={progressBarRef}
            className="h-full progress-shine-bar rounded-r-full"
            style={{ width: '0%', opacity: 0 }}
          />
        </div>

        {/* ROW 1: Top Frosted Glass Identity & Mode Controls */}
        <div className="h-11 sm:h-12 px-3 sm:px-7 flex items-center justify-between border-b border-white/10">
          <BrandLogo onClick={() => onSelectEra(0)} />

          <div className="flex items-center gap-2 sm:gap-4">
            <span
              ref={percentRef}
              className="hidden md:inline font-mono text-[10px] text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.65)] tracking-widest whitespace-nowrap"
            >
              TIMELINE PROGRESS // 000%
            </span>

            <button
              onClick={onTogglePureParticleMode}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full font-mono text-[9px] sm:text-[10px] uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap ${
                pureParticleMode
                  ? 'bg-white text-black border-white font-bold [text-shadow:none]'
                  : 'bg-black/40 text-neutral-100 font-medium border-white/12 hover:bg-white/[0.14] hover:text-white hover:border-white/25'
              }`}
            >
              {pureParticleMode ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>{pureParticleMode ? 'SHOW UI' : 'PARTICLES ONLY'}</span>
            </button>

            <button
              onClick={onToggleSound}
              className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                soundEnabled
                  ? 'bg-white text-black border-white [text-shadow:none]'
                  : 'bg-black/40 text-neutral-100 border-white/12 hover:bg-white/[0.14] hover:text-white hover:border-white/25'
              }`}
              title="Toggle Audio"
            >
              {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* ROW 2: Frosted Glassmorphic Interactive Horizontal Timeline Bar */}
        <nav
          ref={navRef}
          aria-label="Historical Era Timeline"
          className="relative h-9 sm:h-10 px-2.5 sm:px-4 xl:px-6 py-1 flex items-center overflow-x-auto no-scrollbar"
        >
          <div className="flex items-center justify-between gap-1 w-max min-w-full h-full 2xl:w-full 2xl:grid 2xl:grid-cols-9 2xl:gap-1.5">
            {ERAS.map((era, idx) => {
              const isActive = idx === activeEraIndex;
              const isPast = idx < activeEraIndex;
              const startYear = era.year.split(' ')[0];

              return (
                <button
                  key={era.id}
                  data-era-idx={idx}
                  onClick={() => onSelectEra(idx)}
                  className={`relative shrink-0 h-full px-2 xl:px-2.5 rounded-md flex items-center justify-between gap-1.5 border transition-all cursor-pointer group whitespace-nowrap ${
                    isActive
                      ? 'bg-white/18 text-white border-white/28 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]'
                      : isPast
                        ? 'bg-black/35 text-neutral-200 border-white/[0.08] hover:bg-white/[0.10] hover:border-white/20 hover:text-white'
                        : 'bg-black/25 text-neutral-300 border-white/[0.05] hover:bg-white/[0.10] hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1 font-mono text-[9px] xl:text-[10px] tracking-wider uppercase whitespace-nowrap">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-white shadow-[0_0_6px_#ffffff]'
                          : isPast
                            ? 'bg-white/70'
                            : 'bg-white/35 group-hover:bg-white/75'
                      }`}
                    />
                    <span className="font-bold">/{era.chapter}</span>
                    <span className={isActive ? 'text-white font-bold' : 'text-neutral-100 font-medium'}>
                      {era.id}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-[8.5px] tracking-normal whitespace-nowrap hidden 2xl:inline ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-neutral-300 group-hover:text-white'
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
