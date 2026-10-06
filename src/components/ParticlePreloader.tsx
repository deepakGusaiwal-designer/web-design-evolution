import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

interface ParticlePreloaderProps {
  onComplete: () => void;
}

const PRELOADER_PARTICLES = 3200;
const WORD_PARTICLES = 2200; // 0 .. 2199: Morph from 3D Hypertext Sphere -> "HYPERTEXT ODYSSEY"
// 2200 .. 3199: 3D Orbital Rings & Deep-Space Inward Warp Star-Streaks

const BOOT_LOGS = [
  '00 // INITIALIZING 1989 CERN HYPERTEXT MESH...',
  '01 // CALIBRATING CRT PHOSPHOR & </A> ANCHOR NODES...',
  '02 // SLICING 1995 TABLE MATRICES & MARQUEE FRAMES...',
  '03 // COMPILING 3D CSS { } CASCADE & FLASH VECTORS...',
  '04 // REFLOWING CAPACITIVE TOUCH & RESPONSIVE GRIDS...',
  '05 // RASTERIZING RETINA DISPLAY OPTIC VECTORS...',
  '06 // IGNITING 60FPS WEBGL GLSL WATER SHADERS...',
  '07 // SYNTHESIZING NEURAL CORTEX & AGENT SWARMS...',
  '08 // OPENING SPATIAL HORIZON [9,950 LIVING NODES]...',
] as const;

function samplePreloaderWordTargets(count: number): {
  coords: Float32Array;
  tiers: Uint8Array;
} {
  const coords = new Float32Array(count * 3);
  const tiers = new Uint8Array(count);

  const canvas = document.createElement('canvas');
  const w = 1100;
  const h = 280;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { coords, tiers };

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Top Kicker (Red channel -> Tier 1)
  ctx.fillStyle = '#ff0000';
  ctx.font = '700 20px "DM Sans", sans-serif';
  ctx.fillText('1989 CERN  —  INFINITE LIGHT', w / 2, 58);

  // Main Title (Green channel -> Tier 0)
  ctx.fillStyle = '#00ff00';
  ctx.font = '900 72px "DM Sans", sans-serif';
  ctx.fillText('HYPERTEXT ODYSSEY', w / 2, 146);

  // Bottom Subtitle (Blue channel -> Tier 2)
  ctx.fillStyle = '#0000ff';
  ctx.font = '700 22px "DM Sans", sans-serif';
  ctx.fillText('THE LIVING PARTICLE ARCHIVE OF THE WEB', w / 2, 226);

  const imgData = ctx.getImageData(0, 0, w, h).data;
  const validPixels: { x: number; y: number; tier: number }[] = [];

  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const idx = (y * w + x) * 4;
      const r = imgData[idx];
      const g = imgData[idx + 1];
      const b = imgData[idx + 2];

      if (g > 130) {
        validPixels.push({ x: (x / w) * 2 - 1, y: (y / h) * 2 - 1, tier: 0 });
      } else if (r > 130) {
        validPixels.push({ x: (x / w) * 2 - 1, y: (y / h) * 2 - 1, tier: 1 });
      } else if (b > 130) {
        validPixels.push({ x: (x / w) * 2 - 1, y: (y / h) * 2 - 1, tier: 2 });
      }
    }
  }

  const totalValid = validPixels.length;
  if (totalValid === 0) return { coords, tiers };

  for (let i = 0; i < count; i++) {
    const sample = validPixels[Math.floor((i / count) * totalValid)];
    coords[i * 3] = sample.x * 0.44;
    coords[i * 3 + 1] = sample.y * 0.16 - 0.04;
    coords[i * 3 + 2] = 0;
    tiers[i] = sample.tier;
  }

  return { coords, tiers };
}

export const ParticlePreloader: React.FC<ParticlePreloaderProps> = React.memo(
  ({ onComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const progressTextRef = useRef<HTMLSpanElement>(null);
    const yearTextRef = useRef<HTMLSpanElement>(null);
    const logTextRef = useRef<HTMLDivElement>(null);
    const barFillRef = useRef<HTMLDivElement>(null);

    const [isExiting, setIsExiting] = useState(false);
    const completedRef = useRef(false);
    const progressStateRef = useRef({ value: 0, burst: 0 });

    const triggerExit = useCallback(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      setIsExiting(true);

      gsap.to(progressStateRef.current, {
        burst: 1,
        duration: 0.72,
        ease: 'power3.inOut',
      });

      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.68,
          delay: 0.12,
          ease: 'power2.inOut',
          onComplete: () => {
            onComplete();
          },
        });
      } else {
        onComplete();
      }
    }, [onComplete]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      let width = window.innerWidth;
      let height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      const updateSize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      updateSize();
      window.addEventListener('resize', updateSize);

      // 1. Precompute 3D Fibonacci Geodesic Sphere Targets (Phase 1: 0% -> 46%)
      const sphereTargets = new Float32Array(WORD_PARTICLES * 3);
      for (let i = 0; i < WORD_PARTICLES; i++) {
        if (i < WORD_PARTICLES * 0.76) {
          const sub = Math.floor(WORD_PARTICLES * 0.76);
          const phi = Math.acos(1 - (2 * (i % sub)) / sub);
          const theta = Math.PI * (1 + Math.sqrt(5)) * i;
          const r = 0.175;
          sphereTargets[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          sphereTargets[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 0.04;
          sphereTargets[i * 3 + 2] = r * Math.cos(phi);
        } else {
          // Inner equatorial data ring around the genesis sphere
          const u = (i - WORD_PARTICLES * 0.76) / (WORD_PARTICLES * 0.24);
          const ang = u * Math.PI * 2;
          sphereTargets[i * 3] = Math.cos(ang) * 0.27;
          sphereTargets[i * 3 + 1] = Math.sin(ang) * 0.055 - 0.04;
          sphereTargets[i * 3 + 2] = Math.sin(ang) * 0.27;
        }
      }

      // 2. Precompute Wordmark Particle Targets (Phase 2: 46% -> 100%)
      const { coords: wordTargets, tiers: wordTiers } =
        samplePreloaderWordTargets(WORD_PARTICLES);

      // 3. Initialize Particle Positions, Velocities & Orbital Ring / Starfield Nodes
      const current = new Float32Array(PRELOADER_PARTICLES * 3);
      const velocity = new Float32Array(PRELOADER_PARTICLES * 3);
      const sizes = new Float32Array(PRELOADER_PARTICLES);

      for (let i = 0; i < PRELOADER_PARTICLES; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.65 + Math.random() * 1.35;
        current[i * 3] = Math.cos(angle) * radius;
        current[i * 3 + 1] = Math.sin(angle) * radius;
        current[i * 3 + 2] = (Math.random() - 0.5) * 1.2;

        if (i < WORD_PARTICLES) {
          const tier = wordTiers[i];
          sizes[i] = tier === 0 ? 1.65 : tier === 1 ? 1.25 : 1.18;
        } else {
          sizes[i] = 0.9 + Math.random() * 1.2;
        }
      }

      // Animate progress from 0 -> 100 over 2.9 seconds
      const progTween = gsap.to(progressStateRef.current, {
        value: 100,
        duration: 2.85,
        ease: 'power2.inOut',
        onComplete: () => {
          triggerExit();
        },
      });

      let lastPct = -1;
      let lastLogIdx = -1;

      const onTick = (gsapTime: number) => {
        const time = gsapTime * 0.95;
        const prog = progressStateRef.current.value; // 0 .. 100
        const normProg = prog / 100; // 0 .. 1
        const burst = progressStateRef.current.burst; // 0 .. 1 on exit

        // Update DOM telemetry counters without triggering React re-renders
        const pct = Math.min(100, Math.round(prog));
        if (pct !== lastPct) {
          lastPct = pct;
          if (progressTextRef.current) {
            progressTextRef.current.textContent = `${pct.toString().padStart(3, '0')}%`;
          }
          if (yearTextRef.current) {
            const year = Math.round(1989 + normProg * 37);
            yearTextRef.current.textContent = year >= 2026 ? '2026+' : `${year}`;
          }
          if (barFillRef.current) {
            barFillRef.current.style.width = `${pct}%`;
          }
        }

        const logIdx = Math.min(
          BOOT_LOGS.length - 1,
          Math.floor(normProg * BOOT_LOGS.length)
        );
        if (logIdx !== lastLogIdx && logTextRef.current) {
          lastLogIdx = logIdx;
          logTextRef.current.textContent = BOOT_LOGS[logIdx];
        }

        // Pure Pitch-Black #000000 Background Clear
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        const centerX = width * 0.5;
        const centerY = height * 0.46;
        const isMobile = width < 768;
        const scaleX = isMobile
          ? Math.min(width * 1.05, 620)
          : Math.min(width * 0.72, 920);
        const scaleY = scaleX;

        // Subtle architectural horizon hairline & concentric radar rings
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.arc(centerX, centerY, Math.min(width, height) * 0.26, 0, Math.PI * 2);
        ctx.stroke();

        // Phase morph blend: 0..0.44 = Rotating 3D Hypertext Sphere, 0.44..1.0 = "HYPERTEXT ODYSSEY" Particle Wordmark
        const wordBlend = Math.max(0, Math.min(1, (normProg - 0.40) / 0.34));
        const rotY = time * 1.15 * (1 - wordBlend * 0.88);
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);

        // Batch buckets for fast rendering
        ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
        ctx.beginPath();

        for (let i = 0; i < WORD_PARTICLES; i++) {
          const i3 = i * 3;
          // Sphere coordinates rotated in 3D
          const sx0 = sphereTargets[i3];
          const sy0 = sphereTargets[i3 + 1];
          const sz0 = sphereTargets[i3 + 2];

          const rsx = sx0 * cosY - sz0 * sinY;
          const rsz = sx0 * sinY + sz0 * cosY;

          // Target blends smoothly from 3D Sphere -> Wordmark
          let tx = rsx * (1 - wordBlend) + wordTargets[i3] * wordBlend;
          let ty = sy0 * (1 - wordBlend) + wordTargets[i3 + 1] * wordBlend;
          let tz = rsz * (1 - wordBlend) + wordTargets[i3 + 2] * wordBlend;

          // Supernova outward expansion burst on completion
          if (burst > 0) {
            const expand = 1 + burst * 2.4;
            tx *= expand;
            ty *= expand;
            tz += burst * 0.85;
          }

          const spring = 0.11 + wordBlend * 0.06;
          velocity[i3] = (velocity[i3] + (tx - current[i3]) * spring) * 0.76;
          velocity[i3 + 1] = (velocity[i3 + 1] + (ty - current[i3 + 1]) * spring) * 0.76;
          velocity[i3 + 2] = (velocity[i3 + 2] + (tz - current[i3 + 2]) * spring) * 0.76;

          current[i3] += velocity[i3];
          current[i3 + 1] += velocity[i3 + 1];
          current[i3 + 2] += velocity[i3 + 2];

          const persp = 1.85 / Math.max(0.35, 1.85 - current[i3 + 2]);
          const px = centerX + current[i3] * scaleX * persp;
          const py = centerY + current[i3 + 1] * scaleY * persp;
          const sz = sizes[i] * (isMobile ? 0.82 : 1.0) * persp;

          ctx.rect(px - sz * 0.5, py - sz * 0.5, sz, sz);
        }
        ctx.fill();

        // Outer Orbital Gyroscopic Rings & Deep-Space Warp Particles (2200 .. 3199)
        ctx.fillStyle = 'rgba(200, 200, 200, 0.52)';
        ctx.beginPath();
        for (let i = WORD_PARTICLES; i < PRELOADER_PARTICLES; i++) {
          const i3 = i * 3;
          const u = (i - WORD_PARTICLES) / (PRELOADER_PARTICLES - WORD_PARTICLES);
          const angle = u * Math.PI * 24 + time * (i % 2 === 0 ? 0.9 : -0.7);
          const ringR = 0.26 + (i % 5) * 0.065 + burst * 0.55;
          const tilt = (i % 3 === 0 ? 0.36 : -0.28);

          const ox = Math.cos(angle) * ringR;
          const oy = Math.sin(angle) * ringR * Math.sin(tilt);
          const oz = Math.sin(angle) * ringR * Math.cos(tilt);

          current[i3] += (ox - current[i3]) * 0.12;
          current[i3 + 1] += (oy - current[i3 + 1]) * 0.12;
          current[i3 + 2] += (oz - current[i3 + 2]) * 0.12;

          const persp = 1.85 / Math.max(0.35, 1.85 - current[i3 + 2]);
          const px = centerX + current[i3] * scaleX * persp;
          const py = centerY + current[i3 + 1] * scaleY * persp;
          const sz = sizes[i] * persp;

          ctx.rect(px - sz * 0.5, py - sz * 0.5, sz, sz);
        }
        ctx.fill();
      };

      gsap.ticker.add(onTick);

      return () => {
        progTween.kill();
        gsap.ticker.remove(onTick);
        window.removeEventListener('resize', updateSize);
      };
    }, [triggerExit]);

    return (
      <div
        ref={containerRef}
        className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-between py-7 sm:py-10 px-4 select-none ${
          isExiting ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
      >
        {/* Full-Screen 3D Monochrome Particle Synthesis Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Top Minimalist Archival Header */}
        <div className="relative z-10 w-full max-w-2xl flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-neutral-300 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
            <span>HYPERTEXT ODYSSEY // SYSTEM BOOT</span>
          </div>
          <button
            onClick={triggerExit}
            className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/15 text-white hover:bg-white/18 hover:border-white/35 transition-all cursor-pointer font-mono text-[9.5px] tracking-widest uppercase"
          >
            SKIP INTRO →
          </button>
        </div>

        {/* Bottom Liquid Glass Telemetry & Progress Console */}
        <div className="relative z-10 w-full max-w-lg glass-panel p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-neutral-200 tracking-widest uppercase">
              <span>CHRONOLOGY</span>
              <span
                ref={yearTextRef}
                className="text-white font-bold px-2 py-0.5 rounded bg-white/12 border border-white/15"
              >
                1989
              </span>
            </div>

            <span
              ref={progressTextRef}
              className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight"
            >
              000%
            </span>
          </div>

          {/* Luminous Monochrome Progress Bar */}
          <div className="w-full h-[3px] bg-white/12 rounded-full overflow-hidden">
            <div
              ref={barFillRef}
              className="h-full progress-shine-bar rounded-full transition-none"
              style={{ width: '0%' }}
            />
          </div>

          {/* Live Particle Synthesis Status Readout */}
          <div className="flex items-center justify-between gap-2 font-mono text-[9.5px] sm:text-[10px] text-neutral-200 tracking-wider uppercase">
            <div ref={logTextRef} className="truncate text-white font-medium">
              00 // INITIALIZING 1989 CERN HYPERTEXT MESH...
            </div>
            <span className="shrink-0 text-neutral-300">9,950 NODES</span>
          </div>
        </div>
      </div>
    );
  }
);

export default ParticlePreloader;
