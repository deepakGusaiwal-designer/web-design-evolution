import React, { useState } from 'react';
import { Palette, Columns, LayoutGrid, Smartphone, Sparkles, Check } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';

export const Web2000: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(4);

  const stages = [
    {
      id: 0,
      title: "Stage 1: Plain Text",
      era: "1996",
      desc: "Default browser styling. Zero aesthetic intent. Information trapped in rigid sequential paragraphs.",
      icon: Palette,
      code: "/* No CSS attached */\nbody { margin: 8px; font-family: serif; color: black; }",
    },
    {
      id: 1,
      title: "Stage 2: Styled Typography",
      era: "1999",
      desc: "Typography gains deliberate hierarchy. Color theory enters the screen. Information begins to whisper and shout.",
      icon: Columns,
      code: "body {\n  font-family: 'DM Sans', sans-serif;\n  color: #1e293b;\n  background: #f8fafc;\n  letter-spacing: -0.02em;\n}",
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
    <section className="relative min-h-screen w-full py-36 sm:py-48 px-6 sm:px-12 flex flex-col justify-center items-center font-dm">
      {/* Header with Generous Breathing Space */}
      <div className="max-w-4xl w-full mx-auto mb-16 sm:mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-950/40 text-xs text-sky-400 uppercase tracking-widest mb-6 font-semibold">
          <Palette className="w-3.5 h-3.5 text-sky-400" />
          CHAPTER 02 // 1996 — 2005
        </div>
        <h2 className="font-dm font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-6">
          THE AESTHETIC REVOLUTION
        </h2>
        <p className="font-dm text-xl sm:text-3xl text-slate-100 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
          “With CSS, design stopped being a decorator. It became a language.”
        </p>
        <p className="font-dm text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal">
          When Cascading Style Sheets arrived, information broke free from table jail cells. Visual presentation was severed from data markup. Colors painted the void, typography found its rhythm, and responsive layouts allowed the web to adapt to any human screen.
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-dm font-semibold transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'border-sky-400 bg-sky-500/20 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.35)] scale-105'
                  : 'border-white/10 glass-panel text-slate-300 hover:border-white/20 hover:text-white'
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
                ? 'bg-[#f8fafc] text-[#0f172a] font-dm border border-slate-300 shadow-lg'
                : activeStage === 2
                ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white font-dm border border-slate-700 shadow-xl'
                : activeStage === 3
                ? 'bg-slate-950 text-sky-100 font-dm border border-sky-900/60 shadow-2xl'
                : 'glass-panel-glow border border-sky-400/40 text-white font-dm'
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
                    : 'text-xs tracking-[0.2em] text-cyan-400 uppercase mb-2 flex items-center gap-2 font-semibold'
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
                    ? 'text-3xl font-dm text-slate-900 font-bold'
                    : activeStage === 2
                    ? 'text-3xl font-dm text-white font-extrabold'
                    : activeStage === 3
                    ? 'text-3xl sm:text-4xl font-dm font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300'
                    : 'text-4xl font-dm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-400 glow-text-cyan'
                }`}
              >
                Information Is Liquid
              </h3>

              <p
                className={`transition-all duration-500 ${
                  activeStage === 0
                    ? 'text-sm font-serif text-black'
                    : activeStage === 1
                    ? 'text-base text-slate-600'
                    : 'text-sm text-slate-200'
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
                    <span className="text-[10px] text-cyan-400 font-semibold block mb-1 uppercase tracking-wider">
                      {card.tag}
                    </span>
                    <div className="font-bold text-sm mb-1 font-dm">{card.title}</div>
                    <div className="text-xs text-slate-300 font-dm">{card.val}</div>
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
                    <span className="text-[10px] text-cyan-400 font-semibold block mb-1 uppercase tracking-wider">
                      {card.tag}
                    </span>
                    <div className="font-bold text-sm mb-1 font-dm">{card.title}</div>
                    <div className="text-xs text-slate-300 font-dm">{card.val}</div>
                  </div>
                )
              )}
            </div>

            {/* Interactive Call to Action */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 font-dm">
              <span className="text-xs text-slate-300">
                Active Paradigm: {stages[activeStage].era}
              </span>
              <button
                className={`px-4 py-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
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
        <div className="lg:col-span-4 flex flex-col justify-between glass-panel rounded-2xl p-6 border border-white/10 font-dm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">
                CSS Engine State
              </span>
            </div>

            <h4 className="font-dm font-bold text-lg text-white mb-2">
              {stages[activeStage].title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {stages[activeStage].desc}
            </p>

            <div className="bg-black/60 rounded-xl p-4 border border-white/10 text-xs text-sky-300 overflow-x-auto font-mono">
              <div className="text-slate-400 text-[10px] mb-2 font-dm">// Active stylesheet declaration:</div>
              <pre className="whitespace-pre-wrap">{stages[activeStage].code}</pre>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-dm">
            <span>Era: {stages[activeStage].era}</span>
            <span className="text-cyan-400 font-semibold">Stage {activeStage + 1} of 5</span>
          </div>
        </div>
      </div>
    </section>
  );
};
