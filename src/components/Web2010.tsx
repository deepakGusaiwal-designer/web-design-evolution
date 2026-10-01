import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Activity, Magnet, Wind, RefreshCw } from 'lucide-react';

export const Web2010: React.FC = () => {
  const [scattered, setScattered] = useState(false);
  const headline = "STATIC IS NOT ENOUGH.";

  // Magnetic Button state and physics
  const magneticRef = useRef<HTMLButtonElement>(null);
  const magX = useMotionValue(0);
  const magY = useMotionValue(0);
  const springX = useSpring(magX, { stiffness: 250, damping: 15 });
  const springY = useSpring(magY, { stiffness: 250, damping: 15 });

  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magneticRef.current) return;
    const rect = magneticRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.45;
    const distanceY = (e.clientY - centerY) * 0.45;
    magX.set(distanceX);
    magY.set(distanceY);
  };

  const handleMagneticLeave = () => {
    magX.set(0);
    magY.set(0);
  };

  // Kinetic Floating Interactive Physics Nodes
  const [nodes] = useState([
    { id: 1, text: "EaseInOutCubic", x: 0, y: 0, scale: 1, rot: 0, color: "from-violet-500 to-purple-600" },
    { id: 2, text: "Spring(stiffness: 300)", x: 0, y: 0, scale: 1, rot: 0, color: "from-cyan-400 to-blue-500" },
    { id: 3, text: "InertiaVelocity", x: 0, y: 0, scale: 1, rot: 0, color: "from-fuchsia-500 to-pink-500" },
    { id: 4, text: "ParallaxDelta", x: 0, y: 0, scale: 1, rot: 0, color: "from-emerald-400 to-teal-600" },
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
      {/* Header with Generous Breathing Space */}
      <div className="max-w-4xl w-full mx-auto mb-16 sm:mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 font-mono text-xs text-violet-400 uppercase tracking-widest mb-6">
          <Activity className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
          SECTION 03 // 2006 — 2014
        </div>
        <h2 className="font-syne font-bold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-6">
          THE WEB LEARNS TO MOVE
        </h2>
        <p className="font-dm text-xl sm:text-3xl text-slate-200 font-light max-w-2xl mx-auto leading-relaxed">
          Transitions, physics engines, kinetic typography, and magnetic interactions gave life to cold pixels.
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

          <div className="mt-3 flex items-center justify-center gap-2 font-mono text-xs text-violet-400 group-hover:text-cyan-300 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>[CLICK HEADLINE TO {scattered ? 'REFORM' : 'SCATTER'} KINETIC LETTERS]</span>
          </div>
        </div>
      </div>

      {/* Physics & Magnetic Interaction Sandbox */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mt-8">
        {/* Interactive Magnetic Button Showcase */}
        <div className="glass-panel rounded-2xl p-8 border border-white/10 flex flex-col justify-between items-center text-center">
          <div>
            <div className="flex items-center justify-center gap-2 mb-2 font-mono text-xs text-violet-400 uppercase">
              <Magnet className="w-4 h-4 text-violet-400" />
              Magnetic Attraction Force
            </div>
            <h3 className="font-syne font-bold text-xl text-white mb-2">
              Spring Damping & Proximity
            </h3>
            <p className="text-xs text-slate-400 mb-8 max-w-sm">
              The cursor exerts a gravitational pull on UI elements. Move your mouse close to the button below.
            </p>
          </div>

          <motion.button
            ref={magneticRef}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            onClick={() => {
              if (typeof (window as unknown as { playWebChime?: (f: number) => void }).playWebChime === 'function') {
                (window as unknown as { playWebChime: (f: number) => void }).playWebChime(640);
              }
            }}
            data-cursor-hover
            className="px-8 py-4 rounded-full font-syne font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_45px_rgba(168,85,247,0.7)] transition-shadow cursor-pointer"
          >
            Pull Toward Cursor
          </motion.button>

          <span className="font-mono text-[10px] text-slate-500 mt-6">
            Physics: Damping = 15 | Stiffness = 250
          </span>
        </div>

        {/* Floating Kinetic Physics Capsules */}
        <div className="glass-panel rounded-2xl p-8 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400 uppercase">
              <Wind className="w-4 h-4 text-cyan-400" />
              Kinetic Tokens & Velocity
            </div>
            <h3 className="font-syne font-bold text-xl text-white mb-2">
              Interactive Motion Tokens
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Drag, fling, or hover over these motion design primitives.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                drag
                dragConstraints={{ left: -30, right: 30, top: -20, bottom: 20 }}
                whileHover={{ scale: 1.04, x: 6 }}
                whileTap={{ scale: 0.96 }}
                data-cursor-hover
                className={`p-3 rounded-xl bg-gradient-to-r ${node.color} text-white font-mono text-xs font-semibold flex items-center justify-between shadow-lg cursor-grab active:cursor-grabbing`}
              >
                <span>{node.text}</span>
                <span className="text-[10px] opacity-80 uppercase tracking-widest">DRAG ME</span>
              </motion.div>
            ))}
          </div>

          <span className="font-mono text-[10px] text-slate-500 mt-6 text-center">
            Smooth interpolated inertia applied to touch & pointer
          </span>
        </div>
      </div>
    </section>
  );
};
