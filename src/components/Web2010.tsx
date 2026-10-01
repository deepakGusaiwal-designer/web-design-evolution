import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Magnet as MagnetIcon, Wind, RefreshCw } from 'lucide-react';
import Magnet from './reactbits/Magnet';
import SpotlightCard from './reactbits/SpotlightCard';

export const Web2010: React.FC = () => {
  const [scattered, setScattered] = useState(false);
  const headline = "STATIC IS NOT ENOUGH.";

  // Kinetic Floating Interactive Physics Nodes
  const [nodes] = useState([
    { id: 1, text: "EaseInOutCubic", desc: "Bezier Easing Curve", color: "from-violet-500 to-purple-600" },
    { id: 2, text: "Spring(stiffness: 300)", desc: "Harmonic Damping", color: "from-cyan-400 to-blue-500" },
    { id: 3, text: "InertiaVelocity", desc: "Momentum Tracking", color: "from-fuchsia-500 to-pink-500" },
    { id: 4, text: "ParallaxDelta", desc: "Optical Depth Offset", color: "from-emerald-400 to-teal-600" },
  ]);

  const handleScatterLetters = () => {
    setScattered(!scattered);
    if (typeof (window as unknown as { playWebChime?: (f: number, t: OscillatorType) => void }).playWebChime === 'function') {
      (window as unknown as { playWebChime: (f: number, t: OscillatorType) => void }).playWebChime(580, 'triangle');
    }
  };

  // Mouse velocity tracker for typography distortion
  const [mouseVelocity, setMouseVelocity] = useState(0);
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = Math.max(now - lastTime, 1);
      const dist = Math.sqrt(Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2));
      const speed = dist / dt;
      setMouseVelocity(Math.min(speed * 30, 20));
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="relative min-h-screen w-full py-36 sm:py-48 px-6 sm:px-12 flex flex-col justify-center items-center overflow-hidden">
      {/* Chapter 03 Header with Strong Narrative Voice */}
      <div className="max-w-4xl w-full mx-auto mb-16 sm:mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 font-mono text-xs text-violet-400 uppercase tracking-widest mb-6">
          <Activity className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
          CHAPTER 03 // 2006 — 2014
        </div>
        <h2 className="font-syne font-bold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-6">
          THE KINETIC REVOLUTION
        </h2>
        <p className="font-dm text-xl sm:text-3xl text-slate-200 font-light max-w-2xl mx-auto leading-relaxed mb-4">
          “STATIC IS NOT ENOUGH.”
        </p>
        <p className="font-dm text-base sm:text-lg text-slate-200 max-w-xl mx-auto leading-relaxed">
          The web ceased being a series of abrupt cuts. Continuous physics, spring damping, kinetic typography, and magnetic fields brought organic life to the screen.
        </p>
      </div>

      {/* Kinetic Typography Statement: STATIC IS NOT ENOUGH */}
      <div className="max-w-5xl w-full mx-auto my-12 sm:my-16 text-center select-none">
        <div
          onClick={handleScatterLetters}
          data-cursor-hover
          className="cursor-pointer inline-block group"
          title="Click to scatter / reform kinetic typography"
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
                          ? {
                              x: randomX * 2,
                              y: randomY * 2,
                              rotate: randomAngle * 3,
                              scale: 0.85,
                              opacity: 0.6,
                            }
                          : {
                              x: 0,
                              y: 0,
                              rotate: mouseVelocity * ((charIdx % 2 === 0 ? 1 : -1) * 0.15),
                              scale: 1,
                              opacity: 1,
                            }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 14,
                      }}
                      className="font-syne font-extrabold text-4xl sm:text-7xl md:text-8xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-violet-300 via-white to-purple-400 inline-block hover:scale-125 transition-transform"
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 font-mono text-xs text-violet-400 group-hover:text-cyan-300 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>[CLICK HEADLINE TO {scattered ? 'REFORM' : 'SCATTER'} KINETIC LETTERS]</span>
          </div>
        </div>
      </div>

      {/* Physics & Magnetic Interaction Sandbox */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mt-8">
        {/* Interactive Gravitational Attraction Showcase */}
        <SpotlightCard
          spotlightColor="rgba(168, 85, 247, 0.25)"
          className="p-8 rounded-2xl border border-white/10 flex flex-col justify-between items-center text-center bg-slate-900/40"
        >
          <div>
            <div className="flex items-center justify-center gap-2 mb-2 font-mono text-xs text-violet-400 uppercase">
              <MagnetIcon className="w-4 h-4 text-violet-400" />
              GRAVITATIONAL FIELD
            </div>
            <h3 className="font-syne font-bold text-xl text-white mb-2">
              Proximity Vector Attraction
            </h3>
            <p className="font-dm text-xs text-slate-400 mb-8 max-w-sm leading-relaxed">
              Hover near the button to experience how fluid physics broke the rigid grid, calculating proximity vectors to draw interactive elements smoothly toward your pointer.
            </p>
          </div>

          <Magnet
            padding={120}
            magnetStrength={3.5}
            activeTransition="transform 0.2s cubic-bezier(0.2, 0, 0, 1)"
            inactiveTransition="transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
          >
            <button
              onClick={() => {
                if (typeof (window as unknown as { playWebChime?: (f: number) => void }).playWebChime === 'function') {
                  (window as unknown as { playWebChime: (f: number) => void }).playWebChime(640);
                }
              }}
              data-cursor-hover
              className="px-8 py-4 rounded-full font-syne font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_45px_rgba(168,85,247,0.7)] transition-shadow cursor-pointer block"
            >
              TEST VECTOR ATTRACTION
            </button>
          </Magnet>

          <span className="font-mono text-[10px] text-slate-500 mt-6">
            Spring Damping Mechanics: Reach = 120px | Acceleration = 3.5x
          </span>
        </SpotlightCard>

        {/* Floating Kinetic Physics Capsules */}
        <SpotlightCard
          spotlightColor="rgba(0, 240, 255, 0.25)"
          className="p-8 rounded-2xl border border-white/10 flex flex-col justify-between bg-slate-900/40"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400 uppercase">
              <Wind className="w-4 h-4 text-cyan-400" />
              VELOCITY & INERTIA
            </div>
            <h3 className="font-syne font-bold text-xl text-white mb-2">
              Harmonic Motion Primitives
            </h3>
            <p className="font-dm text-xs text-slate-400 mb-6 leading-relaxed">
              Drag, fling, or test inertia on these physics tokens. Notice how dynamic easing curves replaced abrupt binary states with natural organic momentum.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                drag
                dragConstraints={{ left: -30, right: 30, top: -20, bottom: 20 }}
                whileHover={{ scale: 1.03, x: 6 }}
                whileTap={{ scale: 0.96 }}
                data-cursor-hover
                className={`p-3 rounded-xl bg-gradient-to-r ${node.color} text-white font-mono text-xs font-semibold flex items-center justify-between shadow-lg cursor-grab active:cursor-grabbing`}
              >
                <span className="font-mono text-xs text-white font-semibold">
                  {node.text}
                </span>
                <span className="text-[10px] opacity-80 uppercase tracking-widest">DRAG ME</span>
              </motion.div>
            ))}
          </div>

          <span className="font-mono text-[10px] text-slate-500 mt-6 text-center">
            Physical Continuity: Continuous momentum replaces binary state jumps
          </span>
        </SpotlightCard>
      </div>
    </section>
  );
};
