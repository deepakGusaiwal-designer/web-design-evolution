import React, { useState } from 'react';
import { Palette, Columns, LayoutGrid, Smartphone, Sparkles, Check } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';

export const Web2000: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(4); // Default to full stage or let user explore

  const stages = [
    {
      id: 0,
      title: "Stage 1: Plain Text",
      era: "1996",
      desc: "Default browser styling. Zero aesthetic intent. Information trapped in rigid sequential paragraphs.",
      icon: Palette,
      code: "/* No CSS file attached */\nbody { margin: 8px; font-family: serif; color: black; }",
    },
    {
      id: 1,
      title: "Stage 2: Styled Typography",
      era: "1999",
      desc: "Typography gains deliberate hierarchy. Color theory enters the screen. Information begins to whisper and shout.",
      icon: Columns,
      code: "body {\n  font-family: 'Helvetica Neue', sans-serif;\n  color: #1e293b;\n  background: #f8fafc;\n  letter-spacing: -0.02em;\n}",
    },
    {
      id: 2,
      title: "Stage 3: CSS Grid & Cards",
      era: "2007",
      desc: "Layout breaks free from table tags. Asymmetric editorial compositions, multi-column modular rhythm.",
      icon: LayoutGrid,
      code: ".grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1.5rem;\n}",
    },
    {
      id: 3,
      title: "Stage 4: Responsive Layout",
      era: "2012",
      desc: "Mobile screens arrive. Interfaces morph fluidly to fit any glass rectangle in the human palm.",
      icon: Smartphone,
      code: "@media (max-width: 768px) {\n  .grid-container { grid-template-columns: 1fr; }\n  .hero { font-size: 2rem; }\n}",
    },
    {
      id: 4,
      title: "Stage 5: Micro-Motion & Depth",
      era: "2016+",
      desc: "Design became a living language. Glassmorphism, blur shaders, cubic-bezier ease, and tactile feedback.",
      icon: Sparkles,
      code: ".card {\n  backdrop-filter: blur(16px);\n  box-shadow: 0 20px 40px rgba(0,240,255,0.15);\n  transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);\n}",
    },
  ];

  return (
    <section className="relative min-h-screen w-full py-36 sm:py-48 px-6 sm:px-12 flex flex-col justify-center items-center">
      {/* Header with Generous Breathing Space */}
      <div className="max-w-4xl w-full mx-auto mb-16 sm:mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-950/40 font-mono text-xs text-sky-400 uppercase tracking-widest mb-6">
          <Palette className="w-3.5 h-3.5 text-sky-400" />
          SECTION 02 // 1996 — 2005
        </div>
        <h2 className="font-syne font-bold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-6">
          THE WEB BECOMES VISUAL
        </h2>
        <p className="font-dm text-xl sm:text-3xl text-slate-200 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
          “Design became a language.”
        </p>
        <p className="font-dm text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Click the evolutionary stages below to watch the same raw document mutate through CSS history.
        </p>
      </div>

      {/* Stage Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12 sm:mb-16 max-w-4xl mx-auto">
        {stages.map((stg) => {
          const Icon = stg.icon;
          const isActive = activeStage === stg.id;
          return (
            <button
              key={stg.id}
              onClick={() => {
                setActiveStage(stg.id);
                if (typeof (window as unknown as { playWebChime?: (f: number) => void }).playWebChime === 'function') {
                  (window as unknown as { playWebChime: (f: number) => void }).playWebChime(350 + stg.id * 80);
                }
              }}
              data-cursor-hover
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono transition-all duration-300 ${
                isActive
                  ? 'border-sky-400 bg-sky-500/20 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.3)] scale-105'
                  : 'border-white/10 glass-panel text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{stg.title.split(':')[1]}</span>
              {isActive && <Check className="w-3 h-3 text-sky-400 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Metamorphic Canvas */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: The Transforming Live Webpage Container */}
        <div className="lg:col-span-8 flex flex-col">
          <div
            className={`rounded-2xl transition-all duration-700 p-6 sm:p-8 flex-1 flex flex-col justify-between overflow-hidden relative ${
              activeStage === 0
                ? 'bg-white text-black font-serif border border-black shadow-none'
                : activeStage === 1
                ? 'bg-[#f8fafc] text-[#0f172a] font-sans border border-slate-300 shadow-lg'
                : activeStage === 2
                ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white font-sans border border-slate-700 shadow-xl'
                : activeStage === 3
                ? 'bg-slate-950 text-sky-100 font-sans border border-sky-900/60 shadow-2xl'
                : 'glass-panel-glow border border-sky-400/40 text-white'
            }`}
          >
            {/* Visual Header */}
            <div className="mb-6">
              <div
                className={`transition-all duration-500 ${
                  activeStage === 0
                    ? 'text-xs text-black border-b border-black pb-1 uppercase'
                    : activeStage === 1
                    ? 'text-xs tracking-wider text-sky-600 font-bold uppercase mb-1'
                    : 'text-xs tracking-[0.2em] text-cyan-400 font-mono uppercase mb-2 flex items-center gap-2'
                }`}
              >
                {activeStage >= 2 && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                {activeStage === 0 ? 'Document #402' : 'JOURNAL OF SPATIAL ARCHITECTURE'}
              </div>

              <h3
                className={`transition-all duration-500 font-bold tracking-tight mb-2 ${
                  activeStage === 0
                    ? 'text-2xl font-serif text-black'
                    : activeStage === 1
                    ? 'text-3xl font-sans text-slate-900'
                    : activeStage === 2
                    ? 'text-3xl font-syne text-white'
                    : activeStage === 3
                    ? 'text-3xl sm:text-4xl font-syne text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300'
                    : 'text-4xl font-syne text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-400 glow-text-cyan'
                }`}
              >
                Information Is Liquid
              </h3>

              <p
                className={`transition-all duration-500 ${
                  activeStage === 0
                    ? 'text-sm font-serif text-black'
                    : activeStage === 1
                    ? 'text-base font-sans text-slate-600'
                    : 'text-sm font-space text-slate-300'
                }`}
              >
                When layout rules became fluid, documents stopped being paper replicas and became adaptive canvases for the human eye.
              </p>
            </div>

            {/* Content Elements Transforming across Grid / Columns */}
            <div
              className={`transition-all duration-500 gap-4 mb-6 ${
                activeStage <= 1
                  ? 'flex flex-col'
                  : activeStage === 2
                  ? 'grid grid-cols-2'
                  : activeStage === 3
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                  : 'grid grid-cols-1 sm:grid-cols-3'
              }`}
            >
              {[
                { title: 'Chromatic Balance', val: 'RGB: 0, 240, 255', tag: 'Aesthetics' },
                { title: 'Harmonic Scale', val: 'Golden Ratio 1.618', tag: 'Rhythm' },
                { title: 'Responsive Flow', val: 'Viewport Width (vw)', tag: 'Adaptation' },
              ].map((card, i) =>
                activeStage >= 3 ? (
                  <SpotlightCard
                    key={i}
                    spotlightColor="rgba(0, 240, 255, 0.3)"
                    className="p-4 rounded-xl border border-cyan-400/20 text-white bg-slate-900/60"
                  >
                    <span className="text-[10px] font-mono text-cyan-400/80 block mb-1 uppercase">
                      {card.tag}
                    </span>
                    <div className="font-semibold text-sm mb-1">{card.title}</div>
                    <div className="text-xs opacity-75 font-mono">{card.val}</div>
                  </SpotlightCard>
                ) : (
                  <div
                    key={i}
                    className={`transition-all duration-500 p-4 ${
                      activeStage === 0
                        ? 'border border-black bg-white text-black font-serif'
                        : activeStage === 1
                        ? 'rounded-lg bg-white border border-slate-200 text-slate-800 shadow-sm'
                        : 'rounded-xl bg-slate-800/90 border border-slate-700 text-white'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-cyan-400/80 block mb-1 uppercase">
                      {card.tag}
                    </span>
                    <div className="font-semibold text-sm mb-1">{card.title}</div>
                    <div className="text-xs opacity-75 font-mono">{card.val}</div>
                  </div>
                )
              )}
            </div>

            {/* Interactive Call to Action */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="font-mono text-[11px] text-slate-400">
                Active Paradigm: {stages[activeStage].era}
              </span>
              <button
                data-cursor-hover
                className={`px-4 py-2 font-mono text-xs font-semibold transition-all duration-300 ${
                  activeStage === 0
                    ? 'border border-black bg-slate-200 text-black'
                    : activeStage === 1
                    ? 'rounded-md bg-sky-600 text-white shadow'
                    : activeStage >= 2
                    ? 'rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 text-black hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                    : ''
                }`}
              >
                Experience Flow →
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live CSS Engine Inspector */}
        <div className="lg:col-span-4 flex flex-col justify-between glass-panel rounded-2xl p-6 border border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider">
                CSS Engine State
              </span>
            </div>

            <h4 className="font-syne font-bold text-lg text-white mb-2">
              {stages[activeStage].title}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {stages[activeStage].desc}
            </p>

            <div className="bg-black/60 rounded-xl p-4 border border-white/10 font-mono text-xs text-sky-300 overflow-x-auto">
              <div className="text-slate-500 text-[10px] mb-2">// Active stylesheet declaration:</div>
              <pre className="whitespace-pre-wrap">{stages[activeStage].code}</pre>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Era: {stages[activeStage].era}</span>
            <span className="text-cyan-400">Stage {activeStage + 1} of 5</span>
          </div>
        </div>
      </div>
    </section>
  );
};
