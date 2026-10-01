import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowDown, RotateCcw, Sparkles, Orbit, Compass, Activity, Zap } from 'lucide-react';

interface FutureWebProps {
  onRestart: () => void;
  onExplodeParticles: () => void;
}

type CanvasMode = 'plasma' | 'vortex' | 'matrix' | 'pulse';

export const FutureWeb: React.FC<FutureWebProps> = ({
  onRestart,
  onExplodeParticles,
}) => {
  const [explosionTriggered, setExplosionTriggered] = useState(false);
  const [canvasMode, setCanvasMode] = useState<CanvasMode>('plasma');
  const [activeParticleCount, setActiveParticleCount] = useState(0);

  // Futuristic Canvas references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, speed: 0 });

  const handleTriggerExplosion = () => {
    setExplosionTriggered(true);
    onExplodeParticles();

    if (typeof (window as unknown as { playWebChime?: (f: number, t: OscillatorType) => void }).playWebChime === 'function') {
      (window as unknown as { playWebChime: (f: number, t: OscillatorType) => void }).playWebChime(140, 'sawtooth');
      setTimeout(() => {
        (window as unknown as { playWebChime: (f: number, t: OscillatorType) => void }).playWebChime(880, 'sine');
      }, 350);
    }

    try {
      confetti({
        particleCount: 140,
        spread: 160,
        origin: { y: 0.5 },
        colors: ['#00f0ff', '#8b5cf6', '#ffffff', '#38bdf8', '#ec4899'],
        ticks: 240,
        gravity: 0.5,
      });
    } catch {
      // Fallback
    }
  };

  // Ultra-Futuristic Cyber Canvas Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = 560);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 560;
    };
    window.addEventListener('resize', onResize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      life: number;
      maxLife: number;
      angle?: number;
      distance?: number;
    }

    const particles: Particle[] = [];
    const colors = ['#00f0ff', '#38bdf8', '#818cf8', '#a855f7', '#f43f5e', '#ffffff'];

    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mousePosRef.current.targetX = x;
      mousePosRef.current.targetY = y;

      const dx = x - prevMouseX;
      const dy = y - prevMouseY;
      mousePosRef.current.speed = Math.sqrt(dx * dx + dy * dy);
      prevMouseX = x;
      prevMouseY = y;

      // Spawn particles based on mode
      const spawnCount = mousePosRef.current.isDown ? 5 : 2;
      for (let i = 0; i < spawnCount; i++) {
        const col = colors[Math.floor(Math.random() * colors.length)];
        if (canvasMode === 'vortex') {
          particles.push({
            x: x + (Math.random() - 0.5) * 60,
            y: y + (Math.random() - 0.5) * 60,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: 1.5 + Math.random() * 3,
            color: col,
            life: 1.0,
            maxLife: 1.0,
            angle: Math.random() * Math.PI * 2,
            distance: 20 + Math.random() * 80,
          });
        } else {
          particles.push({
            x: x + (Math.random() - 0.5) * 12,
            y: y + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 4 + dx * 0.1,
            vy: (Math.random() - 0.5) * 4 + dy * 0.1,
            radius: 2 + Math.random() * 3.5,
            color: col,
            life: 1.0,
            maxLife: 1.0,
          });
        }
      }

      if (mousePosRef.current.isDown) {
        if (typeof (window as unknown as { playWebChime?: (f: number) => void }).playWebChime === 'function') {
          (window as unknown as { playWebChime: (f: number) => void }).playWebChime(320 + (x / width) * 540);
        }
      }
    };

    const onMouseDown = () => {
      mousePosRef.current.isDown = true;
    };

    const onMouseUp = () => {
      mousePosRef.current.isDown = false;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    let rafId: number;
    let time = 0;

    const render = () => {
      time += 0.02;

      // Smooth mouse lerp
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.2;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.2;

      // Dark cyber canvas clearing with motion trail decay
      ctx.fillStyle = 'rgba(5, 5, 8, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // 1. Futuristic Cyber Perspective Grid Floor
      ctx.save();
      const gridSpacing = 40;
      const horizonY = height * 0.45;

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;

      // Horizontal perspective scanlines
      for (let y = horizonY; y < height; y += (y - horizonY) * 0.35 + 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vanishing perspective rays converging to center
      const centerX = width / 2;
      for (let x = -width; x < width * 2; x += gridSpacing * 1.5) {
        ctx.beginPath();
        ctx.moveTo(centerX, horizonY);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Targeting Crosshairs / Reticle
      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;
      if (mx > 0 && my > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.lineWidth = 1;

        // Outer reticle circle
        ctx.beginPath();
        ctx.arc(mx, my, 22, 0, Math.PI * 2);
        ctx.stroke();

        // Inner reticle dot
        ctx.beginPath();
        ctx.arc(mx, my, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.fill();

        // Crosshairs ticks
        ctx.beginPath();
        ctx.moveTo(mx - 32, my);
        ctx.lineTo(mx - 24, my);
        ctx.moveTo(mx + 24, my);
        ctx.lineTo(mx + 32, my);
        ctx.moveTo(mx, my - 32);
        ctx.lineTo(mx, my - 24);
        ctx.moveTo(mx, my + 24);
        ctx.lineTo(mx, my + 32);
        ctx.stroke();

        // Telemetry coordinate label
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
        ctx.fillText(`[${Math.round(mx)}, ${Math.round(my)}]`, mx + 28, my - 12);
        ctx.restore();
      }

      // 3. Update and Render Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.012;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        if (canvasMode === 'vortex' && p.angle !== undefined && p.distance !== undefined) {
          p.angle += 0.04;
          p.distance *= 0.985;
          p.x = mx + Math.cos(p.angle) * p.distance;
          p.y = my + Math.sin(p.angle) * p.distance;
        } else {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
        }

        const alpha = Math.max(p.life, 0);
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.radius * p.life, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      setActiveParticleCount(particles.length);

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, [canvasMode]);

  return (
    <section className="relative min-h-screen w-full py-36 sm:py-48 px-6 sm:px-12 flex flex-col justify-center items-center text-center select-none overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-radial from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Climactic Epiphany Narrative Header with Generous Breathing Space */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center mb-16 sm:mb-24">
        {/* Section Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 font-mono text-xs text-cyan-300 uppercase tracking-widest mb-8">
          <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '14s' }} />
          CHAPTER 08 // THE UNWRITTEN CANVAS
        </div>

        {/* Big Cosmic Singularity Trigger */}
        {!explosionTriggered ? (
          <div className="flex flex-col items-center">
            <h2 className="font-syne font-extrabold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight mb-8">
              THE SINGULARITY OF THE WEB
            </h2>

            <p className="font-dm text-lg sm:text-2xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed mb-12">
              Three decades of markup, styles, shaders, and neural weights converge into a single coordinate.
            </p>

            <button
              onClick={handleTriggerExplosion}
              className="group relative flex items-center justify-center w-40 h-40 rounded-full glass-panel-glow border-2 border-cyan-400 text-white cursor-pointer transition-transform duration-500 hover:scale-110 active:scale-95 shadow-[0_0_60px_rgba(0,240,255,0.5)]"
            >
              <div className="absolute inset-0 rounded-full bg-radial from-cyan-400/40 via-violet-500/20 to-transparent animate-ping opacity-60" />
              <div className="relative z-10 flex flex-col items-center gap-1.5 font-mono text-xs tracking-widest uppercase">
                <Sparkles className="w-6 h-6 text-cyan-300 group-hover:rotate-45 transition-transform" />
                <span className="font-bold text-sm">TRIGGER</span>
                <span className="text-[10px] text-cyan-300">SUPERNOVA</span>
              </div>
            </button>
          </div>
        ) : (
          /* Revealed Climactic Truth */
          <div className="flex flex-col items-center text-center max-w-3xl animate-fade-in">
            <h3 className="font-syne font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight mb-6">
              THE NEXT WEB HASN&apos;T BEEN DESIGNED YET.
            </h3>

            <p className="font-syne font-bold text-2xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-violet-400 mb-6">
              IT&apos;S WAITING TO BE IMAGINED.
            </p>

            <p className="font-dm text-lg sm:text-xl text-slate-200 font-light max-w-xl mx-auto mb-8">
              What will you build?
            </p>
          </div>
        )}
      </div>

      {/* ULTRA-FUTURISTIC INTERACTIVE CANVAS (Always available right in flow) */}
      <div className="relative max-w-5xl w-full mx-auto my-10 z-10 glass-panel-glow rounded-3xl border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.15)]">
        {/* Futuristic HUD Top Telemetry Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f0ff]" />
            <div className="text-left">
              <span className="font-mono text-xs text-white font-bold tracking-wider block">
                FUTURISTIC QUANTUM SANDBOX
              </span>
              <span className="font-mono text-[10px] text-cyan-400">
                ACTIVE PARTICLES: {activeParticleCount} // LATENCY: 0.2ms
              </span>
            </div>
          </div>

          {/* Canvas Mode Selectors */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
            {(['plasma', 'vortex', 'matrix'] as CanvasMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setCanvasMode(mode)}
                data-cursor-hover
                className={`px-3 py-1 rounded-lg font-mono text-[10px] tracking-wider uppercase transition-all ${
                  canvasMode === mode
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Telemetry Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <Activity className="w-3.5 h-3.5 text-violet-400" />
            <span>QUANTUM COHERENCE: 99.8%</span>
          </div>
        </div>

        {/* The 2D/3D Futuristic Drawing Canvas */}
        <div className="relative w-full h-[460px] sm:h-[540px] bg-[#050508] cursor-crosshair">
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Futuristic Watermark / Instruction */}
          <div className="absolute bottom-6 left-6 pointer-events-none text-left">
            <span className="font-mono text-[10px] text-cyan-400 tracking-widest uppercase flex items-center gap-2 mb-1">
              <Compass className="w-3.5 h-3.5" />
              CYBERNETIC INTERFACE ENGINE
            </span>
            <span className="font-dm text-xs text-slate-400 block max-w-sm">
              Click & drag across the perspective grid to sculpt plasma particle streams with synthesizer frequencies.
            </span>
          </div>

          <div className="absolute bottom-6 right-6 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel font-mono text-[10px] text-cyan-300 border border-cyan-500/20">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            HARMONIC AUDIO SYNTHESIS ACTIVE
          </div>
        </div>

        {/* Futuristic Bottom Controls & Restart Journey */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/50 flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-xs text-slate-400 text-left">
            Scroll up at any time to re-explore earlier eras, or restart from the beginning:
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onRestart}
              data-cursor-hover
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-violet-500 text-black shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTART JOURNEY</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Scroll Guide */}
      <div className="mt-12 flex flex-col items-center gap-2 text-slate-500 font-mono text-xs">
        <ArrowDown className="w-4 h-4 animate-bounce text-cyan-400" />
        <span>SCROLL UP OR DOWN FREELY TO TRAVERSE TIME</span>
      </div>
    </section>
  );
};
