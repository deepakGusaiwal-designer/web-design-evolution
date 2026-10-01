import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, RotateCcw, Sparkles, Orbit, Eraser } from 'lucide-react';

interface FutureWebProps {
  onRestart: () => void;
  onExplodeParticles: () => void;
}

export const FutureWeb: React.FC<FutureWebProps> = ({
  onRestart,
  onExplodeParticles,
}) => {
  const [explosionTriggered, setExplosionTriggered] = useState(false);
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showCallout, setShowCallout] = useState(false);
  const [inSandbox, setInSandbox] = useState(false);

  // Future Sandbox Canvas for "ENTER THE FUTURE →"
  const sandboxCanvasRef = useRef<HTMLCanvasElement>(null);
  const [sandboxPoints, setSandboxPoints] = useState<{ x: number; y: number; color: string; life: number }[]>([]);

  const handleTriggerExplosion = () => {
    setExplosionTriggered(true);
    onExplodeParticles();

    // Trigger audio resonance
    if (typeof (window as unknown as { playWebChime?: (f: number, t: OscillatorType) => void }).playWebChime === 'function') {
      (window as unknown as { playWebChime: (f: number, t: OscillatorType) => void }).playWebChime(150, 'sawtooth');
      setTimeout(() => {
        (window as unknown as { playWebChime: (f: number, t: OscillatorType) => void }).playWebChime(880, 'sine');
      }, 400);
    }

    // Canvas confetti particle burst
    try {
      confetti({
        particleCount: 120,
        spread: 140,
        origin: { y: 0.5 },
        colors: ['#00f0ff', '#8b5cf6', '#ffffff', '#ec4899'],
        ticks: 200,
        gravity: 0.6,
      });
    } catch {
      // Confetti fallback
    }

    // Staggered text reveals
    setTimeout(() => setShowText1(true), 900);
    setTimeout(() => setShowText2(true), 2400);
    setTimeout(() => setShowCallout(true), 3800);
  };

  // Interactive Sandbox Canvas
  useEffect(() => {
    if (!inSandbox) return;
    const canvas = sandboxCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    let isDrawing = false;
    const colors = ['#00f0ff', '#38bdf8', '#8b5cf6', '#ec4899', '#facc15'];

    const onMouseDown = () => (isDrawing = true);
    const onMouseUp = () => (isDrawing = false);
    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const col = colors[Math.floor(Math.random() * colors.length)];
      setSandboxPoints((prev) => [...prev.slice(-300), { x, y, color: col, life: 1.0 }]);

      if (typeof (window as unknown as { playWebChime?: (f: number) => void }).playWebChime === 'function') {
        (window as unknown as { playWebChime: (f: number) => void }).playWebChime(300 + (x / width) * 600);
      }
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);

    let rafId: number;
    const loop = () => {
      ctx.fillStyle = 'rgba(5, 5, 8, 0.15)';
      ctx.fillRect(0, 0, width, height);

      setSandboxPoints((prev) => {
        const updated = prev
          .map((pt) => ({ ...pt, life: pt.life - 0.008 }))
          .filter((pt) => pt.life > 0);

        updated.forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, Math.max(pt.life * 6, 1), 0, Math.PI * 2);
          ctx.fillStyle = pt.color;
          ctx.shadowColor = pt.color;
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        return updated;
      });

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [inSandbox]);

  return (
    <section className="relative min-h-screen w-full py-28 px-6 flex flex-col justify-center items-center text-center select-none overflow-hidden">
      {!inSandbox ? (
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Pre-explosion state: Singularity Core */}
          {!explosionTriggered ? (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/40 bg-violet-950/40 font-mono text-[11px] text-violet-300 uppercase tracking-widest mb-6 animate-pulse">
                <Orbit className="w-3.5 h-3.5 text-violet-400" />
                COSMIC CONVERGENCE
              </div>

              <h2 className="font-syne font-bold text-4xl sm:text-6xl text-white tracking-tight mb-4">
                THE SINGULARITY OF THE WEB
              </h2>

              <p className="font-space text-lg text-slate-300 max-w-xl mx-auto mb-10">
                All particles from the past three decades have converged into a singular point of infinite potential.
              </p>

              {/* Pulsing Core Sphere Button */}
              <button
                onClick={handleTriggerExplosion}
                data-cursor-hover
                className="group relative flex items-center justify-center w-36 h-36 rounded-full glass-panel-glow border-2 border-cyan-400 text-white cursor-pointer transition-transform duration-500 hover:scale-110 active:scale-95 shadow-[0_0_50px_rgba(0,240,255,0.5)]"
              >
                <div className="absolute inset-0 rounded-full bg-radial from-cyan-400/30 via-violet-500/20 to-transparent animate-ping opacity-60" />
                <div className="relative z-10 flex flex-col items-center gap-1 font-mono text-xs tracking-widest uppercase">
                  <Sparkles className="w-5 h-5 text-cyan-300 group-hover:rotate-45 transition-transform" />
                  <span>TRIGGER</span>
                  <span className="text-[10px] text-cyan-300">EXPLOSION</span>
                </div>
              </button>
            </div>
          ) : (
            /* Post-explosion void: The Climactic Epiphany */
            <div className="flex flex-col items-center text-center max-w-3xl animate-fade-in">
              {showText1 && (
                <h3 className="font-syne font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight mb-6 animate-fade-in">
                  THE NEXT WEB HASN&apos;T BEEN DESIGNED YET.
                </h3>
              )}

              {showText2 && (
                <p className="font-syne font-medium text-2xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-violet-400 mb-6 animate-fade-in">
                  IT&apos;S WAITING TO BE IMAGINED.
                </p>
              )}

              {showCallout && (
                <div className="flex flex-col items-center gap-6 mt-4 animate-fade-in">
                  <p className="font-space text-lg text-slate-400">
                    What will you build?
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                      onClick={() => setInSandbox(true)}
                      data-cursor-hover
                      className="flex items-center gap-3 px-8 py-4 rounded-full font-syne font-bold text-sm tracking-widest uppercase bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-500 text-black shadow-[0_0_35px_rgba(0,240,255,0.6)] hover:shadow-[0_0_55px_rgba(0,240,255,0.9)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>ENTER THE FUTURE</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={onRestart}
                      data-cursor-hover
                      className="flex items-center gap-2 px-6 py-4 rounded-full font-mono text-xs text-slate-300 hover:text-white glass-panel border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restart Journey</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* The Future Experimental Canvas Sandbox */
        <div className="fixed inset-0 z-50 bg-[#050508] flex flex-col">
          <canvas ref={sandboxCanvasRef} className="w-full h-full cursor-crosshair block" />

          {/* Sandbox Controls Bar */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-3 pointer-events-auto glass-panel px-4 py-2 rounded-full border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-xs text-cyan-300 uppercase tracking-widest">
                IMAGINATION CANVAS // {sandboxPoints.length} PARTICLES ACTIVE // DRAG TO MANIFEST
              </span>
            </div>

            <div className="flex items-center gap-3 pointer-events-auto">
              <button
                onClick={() => setSandboxPoints([])}
                data-cursor-hover
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel text-xs font-mono text-slate-300 hover:text-white border border-white/10"
              >
                <Eraser className="w-3.5 h-3.5" />
                Clear
              </button>

              <button
                onClick={() => {
                  setInSandbox(false);
                  onRestart();
                }}
                data-cursor-hover
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400 text-black font-mono text-xs font-bold hover:bg-cyan-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Return to Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
