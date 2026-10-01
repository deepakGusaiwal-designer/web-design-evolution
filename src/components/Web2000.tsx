import React, { useState } from 'react';
import { Palette, LayoutGrid, FileCode, Sparkles } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import TiltedCard from './reactbits/TiltedCard';
import Magnet from './reactbits/Magnet';
import ClickSpark from './reactbits/ClickSpark';
import ShinyText from './reactbits/ShinyText';

export const Web2000: React.FC = () => {
  const [viewMode, setViewMode] = useState<'tables' | 'css'>('tables');
  const [showTableBorders, setShowTableBorders] = useState(true);
  const [cssElevation, setCssElevation] = useState(true);
  const [cssBorderRadius, setCssBorderRadius] = useState(true);

  return (
    <section className="relative min-h-screen w-full py-32 sm:py-44 px-6 sm:px-12 flex flex-col justify-center items-center font-dm">
      {/* Chapter 02 Header */}
      <div className="max-w-4xl w-full mx-auto mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-950/40 text-xs text-sky-400 uppercase tracking-widest mb-6 font-semibold">
          <Palette className="w-3.5 h-3.5 text-sky-400" />
          <ShinyText text="CHAPTER 02 // 1994 — 1998" speed={4} shimmerColor="#38bdf8" />
        </div>

        <h2 className="font-dm font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-5">
          TABLE HACKS & THE CSS REVOLUTION
        </h2>

        <p className="font-dm text-xl sm:text-2xl text-slate-100 font-light italic leading-relaxed mb-6">
          “In 1996, Cascading Style Sheets liberated content from the prison of table cells.”
        </p>

        <p className="font-dm text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Canva’s design history records a massive turning point: before CSS, web designers hijacked HTML <code className="px-1.5 py-0.5 rounded bg-white/10 text-sky-300 font-mono text-sm">&lt;table&gt;</code> tags and invisible 1x1 spacer GIFs to build layouts. In December 1996, Håkon Wium Lie and Bert Bos created CSS, separating structure from presentation for the first time.
        </p>
      </div>

      {/* Epoch Paradigm Mode Switcher with Magnet & ClickSpark */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <Magnet magnetStrength={2}>
          <ClickSpark sparkColor="#f59e0b">
            <button
              onClick={() => setViewMode('tables')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-dm font-semibold transition-all cursor-pointer ${
                viewMode === 'tables'
                  ? 'border-amber-400 bg-amber-950/40 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-amber-400" />
              <span>1994–1996: Nested Tables & Spacer GIFs</span>
            </button>
          </ClickSpark>
        </Magnet>

        <Magnet magnetStrength={2}>
          <ClickSpark sparkColor="#38bdf8">
            <button
              onClick={() => setViewMode('css')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-dm font-semibold transition-all cursor-pointer ${
                viewMode === 'css'
                  ? 'border-sky-400 bg-sky-950/40 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                  : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4 text-sky-400" />
              <span>1996–1998: The Invention of CSS (Lie & Bos)</span>
            </button>
          </ClickSpark>
        </Magnet>
      </div>

      {/* MODE 1: 1994 TABLE LAYOUT HACK */}
      {viewMode === 'tables' && (
        <TiltedCard maxAngle={6} className="max-w-4xl w-full mx-auto">
          <div className="rounded-2xl border border-amber-500/30 bg-[#121008] p-6 sm:p-8 shadow-2xl">
            {/* Retro Netscape Titlebar */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-6 text-xs text-amber-300 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block animate-pulse" />
                <span className="font-bold">Netscape_Navigator_v2.0 — File: //GEOCITIES/CYBER_NEXUS/index.htm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-amber-500/20 px-2 py-0.5 rounded font-mono">
                  256 WEB-SAFE COLORS
                </span>
              </div>
            </div>

            {/* Retro Marquee Banner */}
            <div className="overflow-hidden bg-[#000080] text-yellow-300 font-mono text-xs py-1.5 px-4 mb-6 border border-yellow-400">
              <div className="animate-marquee whitespace-nowrap">
                ★★★ WELCOME TO CYBER-SPACE 1995 ★ BEST VIEWED IN NETSCAPE 800x600 ★ YOU ARE VISITOR #004819 ★★★
              </div>
            </div>

            {/* Simulated Nested Table Layout */}
            <div className={`p-4 bg-[#c0c0c0] text-black font-serif ${showTableBorders ? 'border-2 border-red-500' : ''}`}>
              <div className="text-xs font-mono text-red-600 mb-2 font-bold">
                {showTableBorders && '&lt;table border="2" width="100%" cellpadding="6"&gt;'}
              </div>

              <div className="grid grid-cols-12 gap-2">
                {/* Left Table Column / Nav */}
                <div className={`col-span-4 p-3 bg-[#008080] text-white ${showTableBorders ? 'border-2 border-dashed border-red-600' : ''}`}>
                  <div className="font-bold text-xs uppercase mb-2 border-b border-white pb-1 font-mono">
                    &lt;td width="30%"&gt;
                  </div>
                  <ul className="text-xs space-y-2 underline font-sans">
                    <li>→ Home Page</li>
                    <li>→ Web-Safe Palette</li>
                    <li>→ Invisible GIF Hack</li>
                    <li>→ Guestbook Sign</li>
                  </ul>
                  <div className="mt-6 p-2 bg-black/40 text-[10px] font-mono text-yellow-300 border border-yellow-300 text-center">
                    [1x1 spacer.gif (height=40)]
                  </div>
                </div>

                {/* Right Main Table Content */}
                <div className={`col-span-8 p-4 bg-white text-black ${showTableBorders ? 'border-2 border-dashed border-red-600' : ''}`}>
                  <div className="font-bold text-xs uppercase mb-2 text-red-600 font-mono">
                    &lt;td width="70%"&gt;
                  </div>
                  <h3 className="text-lg font-bold text-[#000080] mb-2">
                    THE ERA OF NESTED TABLES
                  </h3>
                  <p className="text-xs leading-relaxed mb-3">
                    Without CSS, alignment was impossible. Designers created tables within tables within tables. Invisible transparent 1x1 pixel GIFs were stretched with HTML width attributes to push text into position.
                  </p>

                  <div className="p-2 bg-[#ffffcc] border border-[#999900] text-xs font-mono text-black">
                    &lt;img src="spacer.gif" width="120" height="1"&gt;
                    <br />
                    &lt;font face="Arial" size="2" color="#000080"&gt;Aligned Text&lt;/font&gt;
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Toggle Controls */}
            <div className="mt-6 pt-4 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-amber-200/80 font-mono">
                Visualizing the 1994 layout hack: nested table cells and spacer images.
              </span>

              <button
                onClick={() => setShowTableBorders(!showTableBorders)}
                className="px-3.5 py-1.5 rounded-xl border border-amber-400/40 bg-amber-500/10 text-amber-300 text-xs font-bold font-dm hover:bg-amber-500/20 transition-all cursor-pointer"
              >
                {showTableBorders ? 'HIDE TABLE CELL WIRES' : 'SHOW TABLE CELL WIRES'}
              </button>
            </div>
          </div>
        </TiltedCard>
      )}

      {/* MODE 2: 1996–1998 THE INVENTION OF CSS */}
      {viewMode === 'css' && (
        <TiltedCard maxAngle={6} className="max-w-4xl w-full mx-auto">
          <div className="rounded-2xl border border-sky-500/30 bg-[#08121e] p-6 sm:p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-sky-500/20 pb-4 mb-6 text-xs text-sky-300 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" />
                <span className="font-bold">W3C REC-CSS1-19961217 — Cascading Style Sheets, Level 1</span>
              </div>
              <span className="text-[11px] bg-sky-500/20 px-2 py-0.5 rounded font-mono text-sky-200">
                AUTHORS: HÅKON WIUM LIE & BERT BOS
              </span>
            </div>

            {/* Transforming Clean CSS Container */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* Left: Code Snippet */}
              <div className="md:col-span-6 p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-slate-300 select-text leading-relaxed">
                <div className="text-sky-400 font-bold mb-2 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>style.css (Separation of Concerns)</span>
                </div>
                <pre className="text-[11px] text-slate-300 overflow-x-auto">
{`/* Content remains pure HTML */
.editorial-card {
  font-family: 'DM Sans', sans-serif;
  color: #f1f5f9;
  background: rgba(15, 23, 42, 0.8);
  padding: 1.5rem;
  border-radius: ${cssBorderRadius ? '16px' : '0px'};
  box-shadow: ${cssElevation ? '0 12px 30px rgba(0,240,255,0.15)' : 'none'};
  transition: all 0.3s ease;
}`}
                </pre>
              </div>

              {/* Right: Live Rendered CSS Card */}
              <div className="md:col-span-6 flex flex-col justify-center">
                <div
                  className={`p-6 border transition-all duration-500 ${
                    cssBorderRadius ? 'rounded-2xl' : 'rounded-none'
                  } ${
                    cssElevation
                      ? 'shadow-[0_12px_30px_rgba(0,240,255,0.2)] border-sky-400/50 bg-sky-950/30'
                      : 'shadow-none border-white/10 bg-slate-900/60'
                  }`}
                >
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider mb-3">
                    <Sparkles className="w-3 h-3 text-sky-300" />
                    PURE CSS PRESENTATION
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2 font-dm">
                    Design Became a Language
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-dm mb-4">
                    HTML ceased defining colors and columns. Content was liberated. A single CSS stylesheet could now repaint a website across thousands of pages instantly.
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCssBorderRadius(!cssBorderRadius)}
                      className="px-3 py-1 rounded-lg border border-sky-400/40 bg-sky-500/10 text-sky-200 text-xs font-dm hover:bg-sky-500/20 transition-all cursor-pointer"
                    >
                      {cssBorderRadius ? 'Radius: 16px' : 'Radius: 0px'}
                    </button>
                    <button
                      onClick={() => setCssElevation(!cssElevation)}
                      className="px-3 py-1 rounded-lg border border-sky-400/40 bg-sky-500/10 text-sky-200 text-xs font-dm hover:bg-sky-500/20 transition-all cursor-pointer"
                    >
                      {cssElevation ? 'Shadow: Active' : 'Shadow: Flat'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TiltedCard>
      )}

      {/* Historical Summary Metric Cards */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14">
        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="text-xs uppercase font-bold text-amber-400 mb-2 font-mono">1994 // BROWSER WARS</div>
          <div className="text-base font-bold text-white mb-2">Netscape & The Table Era</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Designers hacked table tags into multi-column layouts, filling blank margins with transparent spacer GIFs to control spacing.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="text-xs uppercase font-bold text-sky-400 mb-2 font-mono">1996 // HÅKON WIUM LIE</div>
          <div className="text-base font-bold text-white mb-2">The Birth of CSS</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Lie and Bert Bos created Cascading Style Sheets, forever severing content (HTML) from visual appearance (CSS).
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="text-xs uppercase font-bold text-violet-400 mb-2 font-mono">1998 // STANDARDIZATION</div>
          <div className="text-base font-bold text-white mb-2">The Web Standards Project</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            WaSP pressured browser vendors to adhere to W3C standards, establishing uniform cross-browser typography and layouts.
          </p>
        </SpotlightCard>
      </div>
    </section>
  );
};
