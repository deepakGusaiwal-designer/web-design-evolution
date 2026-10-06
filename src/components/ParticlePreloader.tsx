import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

interface ParticlePreloaderProps {
  preloaderProgressRef: React.MutableRefObject<number>;
  onStartMelt: () => void;
  onComplete: () => void;
}

const BOOT_LOGS = [
  '00 // INITIALIZING 1989 CERN HYPERTEXT MESH...',
  '01 // CALIBRATING CRT PHOSPHOR & </A> ANCHOR NODES...',
  '02 // SLICING 1995 TABLE MATRICES & MARQUEE FRAMES...',
  '03 // COMPILING 3D CSS { } CASCADE & FLASH VECTORS...',
  '04 // REFLOWING CAPACITIVE TOUCH & RESPONSIVE GRIDS...',
  '05 // RASTERIZING RETINA DISPLAY OPTIC VECTORS...',
  '06 // IGNITING 60FPS WEBGL GLSL WATER SHADERS...',
  '07 // SYNTHESIZING NEURAL CORTEX & AGENT SWARMS...',
  '08 // MELTING INTO SPATIAL HORIZON [9,950 NODES]...',
] as const;

export const ParticlePreloader: React.FC<ParticlePreloaderProps> = React.memo(
  ({ preloaderProgressRef, onStartMelt, onComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const consoleRef = useRef<HTMLDivElement>(null);
    const topBarRef = useRef<HTMLDivElement>(null);
    const progressTextRef = useRef<HTMLSpanElement>(null);
    const yearTextRef = useRef<HTMLSpanElement>(null);
    const logTextRef = useRef<HTMLDivElement>(null);
    const barFillRef = useRef<HTMLDivElement>(null);

    const [isMelting, setIsMelting] = useState(false);
    const meltStartedRef = useRef(false);

    const triggerMelt = useCallback(() => {
      if (meltStartedRef.current) return;
      meltStartedRef.current = true;
      setIsMelting(true);

      // Ensure particle engine reaches 1.0 convergence and immediately begins melting into Chapter 00
      gsap.to(preloaderProgressRef, {
        current: 1,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true,
      });

      onStartMelt();

      // Smoothly melt the preloader telemetry console downward into the stage controls
      if (consoleRef.current) {
        gsap.to(consoleRef.current, {
          opacity: 0,
          y: 18,
          scale: 0.94,
          duration: 1.0,
          ease: 'power3.inOut',
        });
      }

      if (topBarRef.current) {
        gsap.to(topBarRef.current, {
          opacity: 0,
          y: -12,
          duration: 0.8,
          ease: 'power3.inOut',
        });
      }

      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1.05,
          ease: 'power2.inOut',
          onComplete: () => {
            onComplete();
          },
        });
      } else {
        onComplete();
      }
    }, [preloaderProgressRef, onStartMelt, onComplete]);

    useEffect(() => {
      preloaderProgressRef.current = 0;

      const progTween = gsap.to(preloaderProgressRef, {
        current: 1,
        duration: 4.8,
        ease: 'power1.inOut',
        onComplete: () => {
          triggerMelt();
        },
      });

      let lastPct = -1;
      let lastLogIdx = -1;

      const onTick = () => {
        const normProg = Math.max(0, Math.min(1, preloaderProgressRef.current));
        const pct = Math.min(100, Math.round(normProg * 100));

        if (pct !== lastPct) {
          lastPct = pct;
          if (progressTextRef.current) {
            progressTextRef.current.textContent = `${pct.toString().padStart(3, '0')}%`;
          }
          if (yearTextRef.current) {
            const year = Math.round(1989 + normProg * 37);
            yearTextRef.current.textContent = year >= 2026 ? '2026+' : `${year}`;
          }
          if (barFillRef.current) {
            barFillRef.current.style.width = `${pct}%`;
          }
        }

        const logIdx = Math.min(
          BOOT_LOGS.length - 1,
          Math.floor(normProg * BOOT_LOGS.length)
        );
        if (logIdx !== lastLogIdx && logTextRef.current) {
          lastLogIdx = logIdx;
          logTextRef.current.textContent = BOOT_LOGS[logIdx];
        }
      };

      gsap.ticker.add(onTick);

      return () => {
        progTween.kill();
        gsap.ticker.remove(onTick);
      };
    }, [preloaderProgressRef, triggerMelt]);

    return (
      <div
        ref={containerRef}
        className={`fixed inset-0 z-50 flex flex-col items-center justify-between py-6 sm:py-9 px-4 select-none pointer-events-none`}
      >
        {/* Top Minimalist Archival Boot Bar */}
        <div
          ref={topBarRef}
          className={`w-full max-w-2xl flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-neutral-300 uppercase ${
            isMelting ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          <div className="flex items-center gap-2 glass-pill px-3.5 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
            <span className="text-white font-semibold">HYPERTEXT ODYSSEY // PARTICLE SYNTHESIS</span>
          </div>
          <button
            onClick={triggerMelt}
            className="px-3.5 py-1.5 rounded-full glass-pill text-white hover:bg-white/18 hover:border-white/35 transition-all cursor-pointer font-mono text-[9.5px] font-semibold tracking-widest uppercase"
          >
            SKIP INTRO →
          </button>
        </div>

        {/* Bottom Liquid Glass Telemetry Console (Melts directly into the bottom stage controls) */}
        <div
          ref={consoleRef}
          className={`w-full max-w-lg glass-panel p-4 sm:p-5 flex flex-col gap-3 ${
            isMelting ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-neutral-200 tracking-widest uppercase">
              <span>CHRONOLOGY</span>
              <span
                ref={yearTextRef}
                className="text-white font-bold px-2 py-0.5 rounded bg-white/12 border border-white/15"
              >
                1989
              </span>
            </div>

            <span
              ref={progressTextRef}
              className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight"
            >
              000%
            </span>
          </div>

          {/* Luminous Monochrome Progress Bar */}
          <div className="w-full h-[3px] bg-white/12 rounded-full overflow-hidden">
            <div
              ref={barFillRef}
              className="h-full progress-shine-bar rounded-full transition-none"
              style={{ width: '0%' }}
            />
          </div>

          {/* Live Particle Synthesis Status Readout */}
          <div className="flex items-center justify-between gap-2 font-mono text-[9.5px] sm:text-[10px] text-neutral-200 tracking-wider uppercase">
            <div ref={logTextRef} className="truncate text-white font-medium">
              00 // INITIALIZING 1989 CERN HYPERTEXT MESH...
            </div>
            <span className="shrink-0 text-neutral-300">9,950 NODES</span>
          </div>
        </div>
      </div>
    );
  }
);

export default ParticlePreloader;
