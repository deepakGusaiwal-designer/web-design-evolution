import React, { useState } from 'react';
import { Smartphone, Monitor, Tablet, Layers } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import TiltedCard from './reactbits/TiltedCard';
import Magnet from './reactbits/Magnet';
import ClickSpark from './reactbits/ClickSpark';
import ShinyText from './reactbits/ShinyText';

export const Web2020: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'skeuomorph' | 'responsive'>('skeuomorph');
  const [viewportWidth, setViewportWidth] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [leatherTexture, setLeatherTexture] = useState(true);
  const [glossyGel, setGlossyGel] = useState(true);

  return (
    <section className="relative min-h-screen w-full py-32 sm:py-44 px-6 sm:px-12 flex flex-col justify-center items-center font-dm">
      {/* Chapter Header */}
      <div className="max-w-4xl w-full mx-auto mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-xs text-emerald-400 uppercase tracking-widest mb-6 font-semibold">
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <ShinyText text="CHAPTER 04 // 2007 — 2012" speed={4} shimmerColor="#34d399" />
        </div>

        <h2 className="font-dm font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-5">
          SKEUOMORPHISM & THE MOBILE REVOLUTION
        </h2>

        <p className="font-dm text-xl sm:text-2xl text-slate-100 font-light italic leading-relaxed mb-6">
          “Skeuomorphism served as a cozy blanket for early touchscreen humans.”
        </p>

        <p className="font-dm text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Canva’s design history notes that when the iPhone launched in 2007, users needed familiar physical metaphors to understand digital touch. Designers added stitched leather, glossy plastic gel buttons, paper grains, and drop shadows. In 2010, Ethan Marcotte coined Responsive Web Design, teaching interfaces to morph across every screen size.
        </p>
      </div>

      {/* Epoch Paradigm Mode Switcher */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <button
          onClick={() => setActiveTab('skeuomorph')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-dm font-semibold transition-all cursor-pointer ${
            activeTab === 'skeuomorph'
              ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
              : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>2007–2010: Skeuomorphism (The Cozy Blanket)</span>
        </button>

        <button
          onClick={() => setActiveTab('responsive')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-dm font-semibold transition-all cursor-pointer ${
            activeTab === 'responsive'
              ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
              : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span>2010–2012: Responsive Web (Ethan Marcotte)</span>
        </button>
      </div>

      {/* MODE 1: SKEUOMORPHISM SIMULATION */}
      {activeTab === 'skeuomorph' && (
        <TiltedCard maxAngle={8} className="max-w-3xl w-full mx-auto mb-16">
          <div className="rounded-2xl border border-white/20 bg-[#161210] p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* Skeuomorphic Stitched Leather Header */}
            <div
              className={`rounded-xl p-4 mb-6 transition-all duration-300 border-2 ${
                leatherTexture
                  ? 'bg-[#3b2314] border-[#6b4226] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]'
                  : 'bg-slate-900 border-slate-700'
              }`}
              style={{
                boxShadow: leatherTexture ? 'inset 0 1px 3px rgba(255,255,255,0.2), 0 4px 10px rgba(0,0,0,0.5)' : 'none',
              }}
            >
              <div className="flex items-center justify-between border-b border-dashed border-amber-900/60 pb-2 mb-2">
                <span className="text-xs font-bold text-amber-200 font-serif tracking-wider">
                  {leatherTexture ? 'STITCHED SADDLE LEATHER CALENDAR // iOS 1–6' : 'FLAT DIGITAL HEADER'}
                </span>
                <span className="text-[10px] text-amber-300 font-mono">1984 - 2012</span>
              </div>
              <p className="text-xs text-amber-100 font-serif leading-relaxed">
                Mimicking real-world textures reassured early touchscreen users that digital buttons could be "pressed".
              </p>
            </div>

            {/* Skeuomorphic Notepad Paper */}
            <div
              className="rounded-xl p-6 mb-6 shadow-lg border border-yellow-600/30 text-black font-sans leading-relaxed select-text"
              style={{
                backgroundColor: '#fef9c3',
                backgroundImage: 'repeating-linear-gradient(#fef9c3 0px, #fef9c3 24px, #fcd34d 25px)',
              }}
            >
              <div className="text-sm font-bold text-slate-800 mb-2 border-b-2 border-red-400 pb-1">
                CANVA DESIGN HISTORY NOTES:
              </div>
              <ul className="text-xs space-y-3 font-medium text-slate-900">
                <li>• Skeuomorphism provided cognitive training wheels for the smartphone generation.</li>
                <li>• Buttons looked like shiny plastic candy pills you wanted to lick.</li>
                <li>• Bookshelf apps had mahogany woodgrain; notes apps had yellow legal pads.</li>
              </ul>
            </div>

            {/* Glossy Aqua Gel Button Simulation */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex gap-2">
                <button
                  onClick={() => setLeatherTexture(!leatherTexture)}
                  className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 text-slate-300 text-xs hover:bg-white/10 cursor-pointer"
                >
                  {leatherTexture ? 'Leather: Enabled' : 'Leather: Flat'}
                </button>
                <button
                  onClick={() => setGlossyGel(!glossyGel)}
                  className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 text-slate-300 text-xs hover:bg-white/10 cursor-pointer"
                >
                  {glossyGel ? 'Gel Gloss: Enabled' : 'Gel Gloss: Flat'}
                </button>
              </div>

              {/* Physical Glossy Button */}
              <Magnet magnetStrength={2}>
                <ClickSpark sparkColor="#38bdf8">
                  <button
                    className={`px-6 py-2.5 text-xs font-bold text-white transition-all cursor-pointer ${
                      glossyGel
                        ? 'rounded-full bg-gradient-to-b from-sky-400 via-sky-600 to-sky-800 border border-sky-300 shadow-[0_4px_14px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.8)] active:translate-y-0.5'
                        : 'rounded-lg bg-sky-600 border border-sky-500 shadow-none'
                    }`}
                  >
                    GLOSSY GEL BUTTON (PRESS ME)
                  </button>
                </ClickSpark>
              </Magnet>
            </div>
          </div>
        </TiltedCard>
      )}

      {/* MODE 2: RESPONSIVE WEB DESIGN SIMULATOR */}
      {activeTab === 'responsive' && (
        <div className="max-w-4xl w-full mx-auto mb-16">
          <div className="rounded-2xl border border-cyan-500/30 bg-[#06121e] p-6 sm:p-8 shadow-2xl">
            {/* Viewport Width Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
                <span className="font-bold text-xs text-cyan-300 font-mono">
                  ETHAN MARCOTTE (2010) — FLUID GRIDS & MEDIA QUERIES
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewportWidth('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-dm cursor-pointer ${
                    viewportWidth === 'desktop'
                      ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-bold'
                      : 'border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop (1200px)</span>
                </button>

                <button
                  onClick={() => setViewportWidth('tablet')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-dm cursor-pointer ${
                    viewportWidth === 'tablet'
                      ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-bold'
                      : 'border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>Tablet (768px)</span>
                </button>

                <button
                  onClick={() => setViewportWidth('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-dm cursor-pointer ${
                    viewportWidth === 'mobile'
                      ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-bold'
                      : 'border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile (375px)</span>
                </button>
              </div>
            </div>

            {/* Dynamic Morphing Viewport Frame */}
            <div className="flex justify-center p-4 bg-black/60 rounded-xl border border-white/10 overflow-hidden">
              <div
                className={`transition-all duration-500 p-6 rounded-xl border border-cyan-400/40 bg-slate-900/90 shadow-xl ${
                  viewportWidth === 'desktop'
                    ? 'w-full'
                    : viewportWidth === 'tablet'
                    ? 'w-[75%]'
                    : 'w-[42%]'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-cyan-300 font-mono mb-4 border-b border-white/10 pb-2">
                  <span>@media (max-width: {viewportWidth === 'desktop' ? '1200px' : viewportWidth === 'tablet' ? '768px' : '480px'})</span>
                  <span>{viewportWidth.toUpperCase()}</span>
                </div>

                <div
                  className={`grid gap-4 ${
                    viewportWidth === 'desktop'
                      ? 'grid-cols-3'
                      : viewportWidth === 'tablet'
                      ? 'grid-cols-2'
                      : 'grid-cols-1'
                  }`}
                >
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-left">
                    <div className="text-sm font-bold text-white mb-1">Fluid Grids</div>
                    <p className="text-[11px] text-slate-300">Elements scale in percentages rather than fixed pixel dimensions.</p>
                  </div>

                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-left">
                    <div className="text-sm font-bold text-white mb-1">Flexible Media</div>
                    <p className="text-[11px] text-slate-300">Images resize organically with max-width: 100%.</p>
                  </div>

                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-left">
                    <div className="text-sm font-bold text-white mb-1">Media Queries</div>
                    <p className="text-[11px] text-slate-300">CSS breakpoints adapt layouts to the human glass viewport.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Summary Cards */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="text-xs uppercase font-bold text-emerald-400 mb-2 font-mono">2007 // THE IPHONE</div>
          <div className="text-base font-bold text-white mb-2">The Multi-Touch Era</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Steve Jobs introduced mobile Safari. The web expanded into the human palm, triggering the need for intuitive touch interfaces.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="text-xs uppercase font-bold text-yellow-400 mb-2 font-mono">2008 // SKEUOMORPHISM</div>
          <div className="text-base font-bold text-white mb-2">The Psychological Bridge</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Textures like stitched leather, beveled edges, and drop shadows helped users transition from physical to digital objects.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="text-xs uppercase font-bold text-cyan-400 mb-2 font-mono">2010 // ETHAN MARCOTTE</div>
          <div className="text-base font-bold text-white mb-2">Responsive Web Design</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Replaced clumsy "m." mobile websites with single fluid layouts powered by CSS3 media queries and percentage grid units.
          </p>
        </SpotlightCard>
      </div>
    </section>
  );
};
