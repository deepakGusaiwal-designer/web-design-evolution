import React, { useState } from 'react';
import { Terminal, Globe, Zap, CornerDownLeft, Sparkles } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import TiltedCard from './reactbits/TiltedCard';
import Magnet from './reactbits/Magnet';
import ClickSpark from './reactbits/ClickSpark';
import ShinyText from './reactbits/ShinyText';

interface Web1990Props {
  onShatter?: () => void;
}

export const Web1990: React.FC<Web1990Props> = ({ onShatter }) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'cern'>('terminal');
  const [tabKeyCount, setTabKeyCount] = useState(2);
  const [isShattered, setIsShattered] = useState(false);
  const [terminalTheme, setTerminalTheme] = useState<'green' | 'amber'>('green');

  const handleShatter = () => {
    setIsShattered(true);
    onShatter?.();
    if (typeof (window as unknown as { playWebChime?: (f: number, t: OscillatorType) => void }).playWebChime === 'function') {
      (window as unknown as { playWebChime: (f: number, t: OscillatorType) => void }).playWebChime(320, 'sawtooth');
    }

    setTimeout(() => {
      setIsShattered(false);
    }, 6000);
  };

  const pressTabKey = () => {
    setTabKeyCount((prev) => (prev >= 6 ? 1 : prev + 1));
    if (typeof (window as unknown as { playWebChime?: (f: number, t: OscillatorType) => void }).playWebChime === 'function') {
      (window as unknown as { playWebChime: (f: number, t: OscillatorType) => void }).playWebChime(420, 'sine');
    }
  };

  const tabSpacing = '    '.repeat(tabKeyCount);

  return (
    <section className="relative min-h-screen w-full py-32 sm:py-44 px-6 sm:px-12 flex flex-col justify-center items-center font-dm">
      {/* Chapter Header */}
      <div className="max-w-4xl w-full mx-auto mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-900/60 text-xs text-slate-300 uppercase tracking-widest mb-6">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <ShinyText text="CHAPTER 01 // 1989 — 1993" speed={4} shimmerColor="#34d399" />
        </div>

        <h2 className="font-dm font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-5">
          THE DARK AGES & THE FIRST HYPERTEXT
        </h2>

        <p className="font-dm text-xl sm:text-2xl text-slate-100 font-light italic leading-relaxed mb-6">
          “In the dark ages, designers worked with black screens, pixelated text, and the TAB key.”
        </p>

        <p className="font-dm text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          According to web history, before graphical browsers existed, the internet lived on black CRT terminals. Tim Berners-Lee invented the World Wide Web in March 1989 at CERN to link documents across computers. On August 6, 1991, the world’s first website went live.
        </p>
      </div>

      {/* Epoch Mode Switcher */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-dm font-semibold transition-all cursor-pointer ${
            activeTab === 'terminal'
              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
              : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>1989: The Terminal Dark Ages</span>
        </button>

        <button
          onClick={() => setActiveTab('cern')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-dm font-semibold transition-all cursor-pointer ${
            activeTab === 'cern'
              ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
              : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>1991: The First Web Page (CERN)</span>
        </button>
      </div>

      {/* INTERACTIVE EXPERIENCE 1: 1989 THE TERMINAL DARK AGES */}
      {activeTab === 'terminal' && (
        <TiltedCard maxAngle={8} className="max-w-3xl w-full mx-auto">
          <div className={`relative rounded-2xl p-6 sm:p-8 border shadow-2xl transition-all duration-300 ${
            terminalTheme === 'green'
              ? 'bg-[#030d07] border-emerald-500/40 text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.15)]'
              : 'bg-[#0f0902] border-amber-500/40 text-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.15)]'
          }`}>
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-semibold">CERN_VM_CMS — VT100 Terminal (80x24 Columns)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTerminalTheme('green')}
                  className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${terminalTheme === 'green' ? 'bg-emerald-500/30 font-bold' : 'opacity-60'}`}
                >
                  P1-Green
                </button>
                <button
                  onClick={() => setTerminalTheme('amber')}
                  className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${terminalTheme === 'amber' ? 'bg-amber-500/30 font-bold' : 'opacity-60'}`}
                >
                  P3-Amber
                </button>
              </div>
            </div>

            {/* CRT Terminal Screen Content */}
            <div className="font-mono text-xs sm:text-sm leading-relaxed space-y-4 select-text">
              <p className="opacity-90">
                &gt; VAX/VMS V5.3 -- SYSTEM RUNNING AT CERN (GENEVA)
                <br />
                &gt; MARCH 1989 -- "INFORMATION MANAGEMENT: A PROPOSAL"
                <br />
                &gt; AUTHOR: TIM BERNERS-LEE // REF: CERN-DD-89-001
              </p>

              <div className="p-4 rounded-lg bg-black/60 border border-white/10 my-4">
                <div className="text-white font-bold mb-2">
                  [CANVA HISTORY LESSON: THE TAB KEY & SYMBOL ALIGNMENT]
                </div>
                <div className="opacity-80">
                  +--------------------------------------------------------------+
                  <br />
                  | INDEX{tabSpacing}DOCUMENT ID{tabSpacing}PROTOCOL             |
                  <br />
                  +--------------------------------------------------------------+
                  <br />
                  | 0001 {tabSpacing}CERNDOC_HYPERTEXT{tabSpacing}NNTP/TCP       |
                  <br />
                  | 0002 {tabSpacing}MESH_PROPOSAL   {tabSpacing}ENQUIRE_V2      |
                  <br />
                  +--------------------------------------------------------------+
                </div>
              </div>

              <p className="italic opacity-85">
                "Vague but exciting... Imagine if all the information stored on computers everywhere were linked. You could just follow your finger along the lines."
              </p>
            </div>

            {/* Interactive TAB key controller */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-400">
                Current TAB spacing column: <span className="text-white font-bold">{tabKeyCount * 4} spaces</span>
              </div>

              <Magnet magnetStrength={2}>
                <ClickSpark sparkColor={terminalTheme === 'green' ? '#10b981' : '#f59e0b'}>
                  <button
                    onClick={pressTabKey}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold transition-all cursor-pointer"
                  >
                    <CornerDownLeft className="w-3.5 h-3.5" />
                    <span>PRESS [TAB] KEY ({tabKeyCount}/6)</span>
                  </button>
                </ClickSpark>
              </Magnet>
            </div>
          </div>
        </TiltedCard>
      )}

      {/* INTERACTIVE EXPERIENCE 2: 1991 THE FIRST WEB PAGE */}
      {activeTab === 'cern' && (
        <div className="relative max-w-3xl w-full mx-auto">
          <div
            className={`relative rounded-2xl shadow-2xl transition-all duration-700 overflow-hidden border border-slate-400/40 ${
              isShattered
                ? 'opacity-30 scale-95 blur-sm rotate-1 translate-y-6'
                : 'opacity-100 scale-100'
            }`}
            style={{
              backgroundColor: '#e6e6e6',
              color: '#000000',
              fontFamily: '"Times New Roman", Times, serif',
            }}
          >
            {/* Vintage NeXT Window Titlebar */}
            <div className="bg-[#c0c0c0] border-b-2 border-slate-400 px-4 py-2.5 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border border-black bg-white flex items-center justify-center text-[9px] font-bold">
                  ✕
                </div>
                <span className="text-xs font-bold text-black tracking-tight font-dm">
                  WorldWideWeb.app (NeXTSTEP) — http://info.cern.ch/hypertext/WWW/TheProject.html
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-600">August 6, 1991</span>
            </div>

            {/* Vintage HTML Render Body */}
            <div className="p-8 sm:p-10 select-text leading-relaxed">
              <h1 className="text-2xl sm:text-3xl font-bold text-black border-b border-black pb-2 mb-4 tracking-tight">
                World Wide Web
              </h1>

              <p className="text-sm sm:text-base text-black mb-4">
                The <strong>WorldWideWeb (W3)</strong> is a wide-area hypermedia information retrieval initiative aiming to give universal access to a large universe of documents.
              </p>

              <p className="text-sm sm:text-base text-black mb-4">
                Everything there is online about W3 is linked directly or indirectly to this document, including an <a href="#summary" className="text-blue-700 underline font-bold hover:text-blue-900 cursor-pointer">Executive summary</a> of the project, <a href="#policy" className="text-blue-700 underline font-bold hover:text-blue-900 cursor-pointer">Mailing lists</a>, <a href="#policy" className="text-blue-700 underline font-bold hover:text-blue-900 cursor-pointer">Policy</a>, and <a href="#people" className="text-blue-700 underline font-bold hover:text-blue-900 cursor-pointer">People</a> involved.
              </p>

              <div className="p-4 bg-[#f0f0f0] border border-[#a0a0a0] rounded my-5 text-xs text-black font-mono">
                &lt;html&gt;
                <br />
                &nbsp;&nbsp;&lt;body&gt;
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;World Wide Web&lt;/h1&gt;
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;p&gt;Zero CSS. Zero JavaScript. Zero Images.&lt;/p&gt;
                <br />
                &nbsp;&nbsp;&lt;/body&gt;
                <br />
                &lt;/html&gt;
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-[#dcdcdc] border-t border-slate-300 px-6 py-4 flex flex-wrap items-center justify-between gap-4 font-dm">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>The Document Era: Raw text bound to hyperlinks</span>
              </div>

              <Magnet magnetStrength={3}>
                <ClickSpark sparkColor="#00f0ff">
                  <button
                    onClick={handleShatter}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-cyan-300 hover:bg-black font-dm text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SHATTER DOCUMENT → DISSOLVE TO PARTICLES</span>
                  </button>
                </ClickSpark>
              </Magnet>
            </div>
          </div>
        </div>
      )}

      {/* Historical Summary Cards using SpotlightCard */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14">
        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="text-xs uppercase font-bold text-emerald-400 mb-2 font-mono">1989 // GENESIS</div>
          <div className="text-base font-bold text-white mb-2">The Dark Ages</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Black screens, pixelated text, and the TAB key. Layout was achieved through ASCII symbols and monospaced character counts.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="text-xs uppercase font-bold text-cyan-400 mb-2 font-mono">1991 // CERN NeXT</div>
          <div className="text-base font-bold text-white mb-2">The First Webpage</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Launched by Tim Berners-Lee on August 6, 1991. Pure hypertext text. Clicking a blue underlined link was the world’s sole web interaction.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="text-xs uppercase font-bold text-sky-400 mb-2 font-mono">1993 // MOSAIC</div>
          <div className="text-base font-bold text-white mb-2">The Image Tag Arrives</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            NCSA Mosaic introduced the <code className="text-cyan-300 font-mono">&lt;img&gt;</code> tag. For the first time, graphics co-existed alongside text on the screen.
          </p>
        </SpotlightCard>
      </div>
    </section>
  );
};
