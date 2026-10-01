import React from 'react';
import { ERAS } from '../data/evolution';

interface NavigationProps {
  currentEraIndex: number;
  onSelectEra: (index: number) => void;
  scrollProgress: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentEraIndex,
  onSelectEra,
  scrollProgress,
}) => {
  const currentEra = ERAS[currentEraIndex] || ERAS[0];

  return (
    <>
      {/* Top Floating Editorial HUD Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-5 flex items-center justify-between pointer-events-none">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="relative flex items-center justify-center w-7 h-7 rounded border border-cyan-400/40 bg-black/60 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 absolute" />
          </div>
          <div>
            <h1 className="font-syne font-bold text-xs sm:text-sm tracking-[0.2em] text-white uppercase m-0 leading-none">
              EVOLUTION
            </h1>
            <span className="font-mono text-[9px] text-slate-400 tracking-wider">
              OF THE WEB // 1990 — ∞
            </span>
          </div>
        </div>

        {/* Current Active Era Marker */}
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full glass-panel border border-white/10 pointer-events-auto">
          <span className="font-mono text-[10px] text-cyan-400 tracking-widest uppercase">
            {currentEra.tag}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="font-space text-xs text-white font-medium">
            {currentEra.title}
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            [{currentEra.year}]
          </span>
        </div>

        {/* Global Progress Metric */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400 pointer-events-auto">
          <span className="hidden sm:inline text-cyan-400/80">INDEX</span>
          <span className="text-white font-semibold">
            {String(currentEraIndex + 1).padStart(2, '0')} / {String(ERAS.length).padStart(2, '0')}
          </span>
          <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
        </div>
      </header>

      {/* Left Vertical Era Marker Rail */}
      <nav
        aria-label="Timeline navigation"
        className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 pointer-events-auto"
      >
        {ERAS.map((era, index) => {
          const isActive = index === currentEraIndex;
          return (
            <button
              key={era.id}
              onClick={() => onSelectEra(index)}
              data-cursor-hover
              title={`${era.tag}: ${era.title} (${era.year})`}
              className="group flex items-center gap-3 text-left transition-all duration-300 focus:outline-none"
            >
              <div
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-7 h-1.5 bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.8)]'
                    : 'w-2 h-1.5 bg-white/20 group-hover:bg-white/60 group-hover:w-4'
                }`}
              />
              <span
                className={`font-mono text-[10px] tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-300 font-semibold opacity-100 translate-x-1'
                    : 'text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                }`}
              >
                {era.year.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
