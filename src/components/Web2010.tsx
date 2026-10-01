import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Volume2, FastForward, Activity } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import TiltedCard from './reactbits/TiltedCard';
import Magnet from './reactbits/Magnet';
import ClickSpark from './reactbits/ClickSpark';
import ShinyText from './reactbits/ShinyText';

export const Web2010: React.FC = () => {
  const [scattered, setScattered] = useState(false);

  const headline = "STATIC IS NOT ENOUGH.";

  const playChime = (freq: number, type: OscillatorType = 'triangle') => {
    if (typeof (window as unknown as { playWebChime?: (f: number, t: OscillatorType) => void }).playWebChime === 'function') {
      (window as unknown as { playWebChime: (f: number, t: OscillatorType) => void }).playWebChime(freq, type);
    }
  };

  const handleScatterLetters = () => {
    setScattered(!scattered);
    playChime(580, 'sine');
  };

  return (
    <section className="relative min-h-screen w-full py-32 sm:py-44 px-6 sm:px-12 flex flex-col justify-center items-center overflow-hidden font-dm">
      {/* Chapter Header */}
      <div className="max-w-4xl w-full mx-auto mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 text-xs text-amber-400 uppercase tracking-widest mb-6 font-semibold">
          <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <ShinyText text="CHAPTER 03 // 1999 — 2006" speed={4} shimmerColor="#fbbf24" />
        </div>

        <h2 className="font-dm font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-5">
          THE GOLDEN AGE OF FLASH
        </h2>

        <p className="font-dm text-xl sm:text-2xl text-slate-100 font-light italic leading-relaxed mb-6">
          “Before modern web standards, Adobe Flash allowed designers to bypass HTML entirely.”
        </p>

        <p className="font-dm text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Canva’s history documents how Macromedia & Adobe Flash broke the rigid barriers of the early web. Designers were no longer confined to boxes. Flash ushered in 24fps vector animations, splash intro movies, interactive soundboards, and liquid interfaces.
        </p>
      </div>

      {/* Interactive Macromedia Flash Player 2000 Simulation */}
      <TiltedCard maxAngle={6} className="max-w-4xl w-full mx-auto mb-16">
        <div className="rounded-2xl border border-amber-500/30 bg-[#0e0c18] p-6 sm:p-8 shadow-2xl">
          {/* Flash Window Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 font-mono text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="font-bold">Macromedia_Flash_Player_v6.0 — [movie_intro.swf]</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">
              VECTOR 24 FPS
            </div>
          </div>

          {/* Flash Stage Viewport */}
          <div className="relative rounded-xl border border-amber-500/20 bg-black/80 p-8 sm:p-12 text-center overflow-hidden">
            {/* Ambient Flash Glow */}
            <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono mb-4">
                <Sparkles className="w-3 h-3" />
                <span>CANVA HISTORY: 24FPS KEYFRAME TIMELINE</span>
              </div>

              {/* Kinetic Typography Statement: STATIC IS NOT ENOUGH */}
              <div
                onClick={handleScatterLetters}
                className="cursor-pointer inline-block group select-none my-6"
                title="Click to trigger Flash keyframe scatter / reform"
              >
                <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
                  {headline.split(' ').map((word, wordIdx) => (
                    <span key={wordIdx} className="inline-flex">
                      {word.split('').map((char, charIdx) => {
                        const randomAngle = ((charIdx * 17 + wordIdx * 31) % 60) - 30;
                        const randomX = ((charIdx * 23 + wordIdx * 13) % 80) - 40;
                        const randomY = ((charIdx * 29 + wordIdx * 19) % 80) - 40;

                        return (
                          <motion.span
                            key={charIdx}
                            animate={
                              scattered
                                ? { x: randomX, y: randomY, rotate: randomAngle, opacity: 0.35, scale: 0.85 }
                                : { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }
                            }
                            transition={{ type: "spring", stiffness: 350, damping: 18 }}
                            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-200 to-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                          >
                            {char}
                          </motion.span>
                        );
                      })}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-400 font-dm max-w-md mx-auto mb-6">
                Click the typography above to scatter vector glyphs through ActionScript physics.
              </p>

              {/* Interactive Flash Controls: Skip Intro & Soundboard */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Magnet magnetStrength={2}>
                  <ClickSpark sparkColor="#f59e0b">
                    <button
                      onClick={() => {
                        setScattered(!scattered);
                        playChime(640, 'triangle');
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-400/50 bg-amber-500/20 text-amber-200 text-xs font-bold font-dm hover:bg-amber-500/30 transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                    >
                      <FastForward className="w-3.5 h-3.5" />
                      <span>SKIP INTRO (FLASH MEME)</span>
                    </button>
                  </ClickSpark>
                </Magnet>

                <button
                  onClick={() => {
                    playChime(440, 'sawtooth');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-slate-200 text-xs font-dm hover:bg-white/10 transition-all cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PLAY VECTOR AUDIO CHIME</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </TiltedCard>

      {/* Historical Summary Cards */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="text-xs uppercase font-bold text-amber-400 mb-2 font-mono">1999 // MACROMEDIA</div>
          <div className="text-base font-bold text-white mb-2">The Vector Animation Era</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Flash bypasses HTML restrictions, introducing smooth vector interpolation, interactive splash pages, and 24fps cartoons.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="text-xs uppercase font-bold text-orange-400 mb-2 font-mono">2003 // ACTIONSCRIPT</div>
          <div className="text-base font-bold text-white mb-2">Rich Internet Applications</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Websites became full software apps with games, interactive sound effects, and digital art experiences.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6 rounded-2xl border border-white/10 bg-slate-950/60">
          <div className="text-xs uppercase font-bold text-yellow-400 mb-2 font-mono">2010 // THE TURNING POINT</div>
          <div className="text-base font-bold text-white mb-2">Steve Jobs' Thoughts on Flash</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Apple excluded Flash from the iPhone, catalyzing the swift migration toward open HTML5, CSS3, and JavaScript standards.
          </p>
        </SpotlightCard>
      </div>
    </section>
  );
};
