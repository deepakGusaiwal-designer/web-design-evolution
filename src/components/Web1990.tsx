import React, { useState } from 'react';
import { Terminal, Zap, RefreshCw, BookOpen } from 'lucide-react';

interface Web1990Props {
  onShatter?: () => void;
}

export const Web1990: React.FC<Web1990Props> = ({ onShatter }) => {
  // Start fully constructed so user can read immediately
  const [constructionStep, setConstructionStep] = useState(7);
  const [isShattered, setIsShattered] = useState(false);
  const [showRawTags, setShowRawTags] = useState(true);

  // Progressive construction of early HTML elements
  const steps = [
    { tag: '<html>', label: 'ROOT CONTAINER' },
    { tag: '<head><title>WorldWideWeb: Executive Summary</title></head>', label: 'METADATA' },
    { tag: '<body>', label: 'DOCUMENT BODY' },
    { tag: '<h1>The World Wide Web Project</h1>', label: 'HEADING 1' },
    { tag: '<p>The WorldWideWeb (W3) is a wide-area hypermedia information retrieval initiative aiming to give universal access to a large universe of documents.</p>', label: 'PARAGRAPH' },
    { tag: '<a href="http://info.cern.ch/hypertext/WWW/TheProject.html">Link: What is Hypertext?</a>', label: 'HYPERLINK' },
    { tag: '<img src="cern_logo.xbm" alt="CERN 1991" width="180" />', label: 'INLINE BITMAP' },
  ];

  const handleShatter = () => {
    setIsShattered(true);
    onShatter?.();
    if (typeof (window as unknown as { playWebChime?: (f: number, t: OscillatorType) => void }).playWebChime === 'function') {
      (window as unknown as { playWebChime: (f: number, t: OscillatorType) => void }).playWebChime(320, 'sawtooth');
    }

    // Auto-restore document after 6 seconds so scrolling back up always shows content
    setTimeout(() => {
      setIsShattered(false);
    }, 6000);
  };

  const handleReset = () => {
    setIsShattered(false);
    setConstructionStep(0);
    // Swift 200ms step-through if user wants to see construction replay
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setConstructionStep(current);
      if (current >= steps.length) clearInterval(interval);
    }, 220);
  };

  return (
    <section className="relative min-h-screen w-full py-36 sm:py-48 px-6 sm:px-12 flex flex-col justify-center items-center">
      {/* Chapter 01 Header with Strong Narrative Voice */}
      <div className="max-w-4xl w-full mx-auto mb-16 sm:mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-900/60 font-mono text-xs text-slate-300 uppercase tracking-widest mb-6">
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          CHAPTER 01 // 1991 — 1995
        </div>

        <h2 className="font-syne font-bold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-6">
          THE STERILE PARCHMENT
        </h2>

        <p className="font-dm text-xl sm:text-3xl text-slate-100 font-light italic leading-relaxed mb-6">
          “In the beginning, the web had no voice. It had only links.”
        </p>

        <p className="font-dm text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-light">
          When Tim Berners-Lee created the World Wide Web on a NeXT workstation at CERN, there was no graphic design. The web was conceived as a decentralized filing cabinet for physicists. Black Times Roman text on gray screens. The only interaction humanity had was clicking a blue underlined hyperlink.
        </p>
      </div>

      {/* The 1991 NeXT / CERN Simulated Browser Window */}
      <div className="relative max-w-3xl w-full mx-auto my-6">
        <div
          className={`relative rounded-xl shadow-2xl transition-all duration-700 overflow-hidden border border-slate-400/40 ${
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
          {/* Vintage Browser Window Titlebar */}
          <div className="bg-[#c0c0c0] border-b-2 border-slate-400 px-4 py-2 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border border-black bg-white flex items-center justify-center font-mono text-[9px] font-bold">
                ✕
              </div>
              <span className="font-mono text-xs font-bold text-black tracking-tight">
                CERN_NeXTSTEP_Browser.app — file://info.cern.ch/hypertext/WWW/TheProject.html
              </span>
            </div>
            <div className="flex gap-1">
              <span className="w-3.5 h-3.5 border border-black bg-white inline-block" />
              <span className="w-3.5 h-3.5 border border-black bg-[#808080] inline-block" />
            </div>
          </div>

          {/* Vintage Toolbar */}
          <div className="bg-[#dcdcdc] border-b border-[#808080] px-4 py-1.5 flex items-center gap-3 text-xs font-sans">
            <button
              onClick={() => setShowRawTags(!showRawTags)}
              data-cursor-hover
              className="px-2.5 py-1 border border-black bg-[#e0e0e0] active:bg-[#a0a0a0] font-sans text-xs cursor-pointer"
            >
              {showRawTags ? 'Hide Source Tags' : 'Inspect HTML Tags'}
            </button>
            <span className="text-slate-600 font-mono text-[11px]">
              Protocol: HTTP/0.9 | Encoding: US-ASCII | Monochromatic
            </span>
          </div>

          {/* Document Content Viewport */}
          <div className="p-8 sm:p-14 min-h-[380px] bg-white text-black leading-relaxed">
            {/* Step 0: HTML & HEAD */}
            {constructionStep >= 0 && showRawTags && (
              <div className="font-mono text-xs text-blue-800 mb-1">
                &lt;html&gt;&lt;head&gt;
              </div>
            )}
            {constructionStep >= 1 && (
              <div className="font-mono text-xs text-slate-500 pl-4 mb-2">
                &lt;title&gt;World Wide Web - Executive Summary&lt;/title&gt;
              </div>
            )}
            {constructionStep >= 2 && showRawTags && (
              <div className="font-mono text-xs text-blue-800 mb-4">
                &lt;body&gt;
              </div>
            )}

            {/* Step 3: H1 */}
            {constructionStep >= 3 && (
              <div className="mb-5">
                {showRawTags && <span className="font-mono text-xs text-red-700 block mb-1">&lt;h1&gt;</span>}
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black border-b border-black pb-1 mb-2">
                  The World Wide Web
                </h1>
                {showRawTags && <span className="font-mono text-xs text-red-700 block mt-1">&lt;/h1&gt;</span>}
              </div>
            )}

            {/* Step 4: Paragraph */}
            {constructionStep >= 4 && (
              <div className="mb-5">
                {showRawTags && <span className="font-mono text-xs text-emerald-800 block mb-1">&lt;p&gt;</span>}
                <p className="text-sm sm:text-base text-black">
                  The WorldWideWeb is a wide-area hypermedia information retrieval initiative aiming to give universal access to a large universe of documents. Everything there is online about W3 is linked directly or indirectly to this document.
                </p>
                {showRawTags && <span className="font-mono text-xs text-emerald-800 block mt-1">&lt;/p&gt;</span>}
              </div>
            )}

            {/* Step 5: Hyperlink */}
            {constructionStep >= 5 && (
              <div className="mb-5">
                {showRawTags && <span className="font-mono text-xs text-purple-700 block mb-1">&lt;a href=&quot;...&quot;&gt;</span>}
                <p className="text-sm sm:text-base">
                  See also:{' '}
                  <span className="text-blue-700 underline cursor-pointer hover:text-blue-900 font-serif">
                    What is Hypertext and how does it connect knowledge?
                  </span>
                </p>
                {showRawTags && <span className="font-mono text-xs text-purple-700 block mt-1">&lt;/a&gt;</span>}
              </div>
            )}

            {/* Step 6: Image */}
            {constructionStep >= 6 && (
              <div className="mt-6 p-4 border border-dashed border-black/40 bg-slate-50 flex items-center gap-4">
                <div className="w-16 h-14 bg-black/10 border border-black flex items-center justify-center font-mono text-[9px] text-black text-center p-1">
                  [1-BIT XBM BITMAP]
                </div>
                <div>
                  <div className="font-mono text-xs font-bold">CERN_NextStation_1991.bmp</div>
                  <div className="font-mono text-[10px] text-slate-600">Resolution: 320x240 | Color depth: 1-bit monochrome</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Shatter Overlay Visualisation */}
        {isShattered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center p-6 animate-fade-in">
            <div className="px-8 py-6 rounded-2xl glass-panel-glow border border-cyan-400/50 max-w-md shadow-[0_0_40px_rgba(0,240,255,0.2)]">
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block mb-2">
                HISTORICAL TRANSITION // 1996 CSS ARRIVAL
              </span>
              <h3 className="font-syne font-bold text-2xl text-white mb-2">
                STATIC → DYNAMIC
              </h3>
              <p className="font-dm text-xs text-slate-300 mb-5 leading-relaxed">
                The sterile document shatters. Cascading stylesheets arrive to give the web color, rhythm, and graphic emotion.
              </p>
              <button
                onClick={handleReset}
                data-cursor-hover
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reassemble Document
              </button>
            </div>
          </div>
        )}

        {/* Shatter Action Trigger Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Document Architecture: Step {Math.min(constructionStep, steps.length)} of {steps.length} ({steps[Math.min(constructionStep, steps.length - 1)]?.label})</span>
          </div>

          <button
            onClick={handleShatter}
            disabled={isShattered}
            data-cursor-hover
            className="flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-300 border border-cyan-400/60 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-500/20 hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] disabled:opacity-40 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Shatter Document &amp; Unlock Colors</span>
          </button>
        </div>
      </div>
    </section>
  );
};
