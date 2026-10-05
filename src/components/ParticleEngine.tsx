import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ERAS, type ParticleShapeType, type ParticleNodeStory } from '../data/eras';
import type { ScrollMotionState } from './WaterShader';

interface ParticleEngineProps {
  activeEraIndex: number;
  activePhaseIndex: number;
  motionRef: React.MutableRefObject<ScrollMotionState>;
  overrideWord: string | null;
  customWord: string;
  onCanvasClick?: () => void;
}

const TOTAL_PARTICLES = 9600;
const TEXT_PARTICLES = 7200;   // 0 .. 7199: 4-Line Multi-Tier Particle Story
const SCULPT_PARTICLES = 2000; // 7200 .. 9199: Central 3D Architectural Sculpture
// 9200 .. 9599 (400 particles): Subtle Horizontal Parallax Dust

const BUCKET_STYLES = [
  'rgba(255, 255, 255, 0.99)', // Bucket 0: Pure White Headline & Hovered Particles
  'rgba(232, 232, 232, 0.94)', // Bucket 1: Crisp Silver-White Story Narrative Lines 1 & 2
  'rgba(175, 175, 175, 0.85)', // Bucket 2: Architectural Gray Chapter Kicker & Mid Sculpture
  'rgba(105, 105, 105, 0.34)', // Bucket 3: Deep Sculpture & Ambient Stream Particles
] as const;

interface SampledStoryData {
  coords: Float32Array;
  tiers: Uint8Array; // 0 = Headline, 1 = Story Lines 1&2, 2 = Kicker
}

/**
 * Rasterizes the full 4-line story (Kicker + Monumental Headline + Story Line 1 + Story Line 2)
 * onto a high-res offscreen canvas and maps all 7,200 text particles across a uniform 2px grid.
 */
function sampleMultiLineParticleStory(
  story: ParticleNodeStory,
  count: number
): SampledStoryData {
  const coords = new Float32Array(count * 3);
  const tiers = new Uint8Array(count);

  const canvas = document.createElement('canvas');
  const w = 1240;
  const h = 420;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (!ctx) return { coords, tiers };

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Tier 2 (Encoded in Red channel): Chapter Kicker Line
  ctx.fillStyle = '#ff0000';
  ctx.font = '800 24px "DM Sans", sans-serif';
  ctx.fillText(story.kicker.toUpperCase(), w / 2, 46);

  // Tier 0 (Encoded in Green channel): Monumental Story Headline
  ctx.fillStyle = '#00ff00';
  const headText = story.word.toUpperCase();
  const headLen = headText.length;
  const headSize = headLen > 13 ? 76 : headLen > 10 ? 86 : 96;
  ctx.font = `900 ${headSize}px "DM Sans", sans-serif`;
  ctx.fillText(headText, w / 2, 145);

  // Tier 1 (Encoded in Blue channel): Two-Line Narrative Story in Particles
  ctx.fillStyle = '#0000ff';
  ctx.font = '800 34px "DM Sans", sans-serif';
  ctx.fillText(story.line1.toUpperCase(), w / 2, 266);
  ctx.fillText(story.line2.toUpperCase(), w / 2, 326);

  const imgData = ctx.getImageData(0, 0, w, h).data;
  const validPixels: { x: number; y: number; tier: number }[] = [];

  // Uniform 2px dot-matrix grid scan across all 4 story lines
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const idx = (y * w + x) * 4;
      const r = imgData[idx];
      const g = imgData[idx + 1];
      const b = imgData[idx + 2];

      if (g > 130) {
        validPixels.push({ x: (x / w) * 2 - 1, y: (y / h) * 2 - 1, tier: 0 });
      } else if (b > 130) {
        validPixels.push({ x: (x / w) * 2 - 1, y: (y / h) * 2 - 1, tier: 1 });
      } else if (r > 130) {
        validPixels.push({ x: (x / w) * 2 - 1, y: (y / h) * 2 - 1, tier: 2 });
      }
    }
  }

  const totalValid = validPixels.length;
  if (totalValid === 0) return { coords, tiers };

  for (let i = 0; i < count; i++) {
    const pixelIndex = Math.floor((i / count) * totalValid);
    const sample = validPixels[pixelIndex];

    // Upper stage: spans y = -0.58 to y = -0.04 at Z = 0 for razor-sharp alignment
    coords[i * 3] = sample.x * 0.40;
    coords[i * 3 + 1] = sample.y * 0.26 - 0.31;
    coords[i * 3 + 2] = 0;
    tiers[i] = sample.tier;
  }

  return { coords, tiers };
}

/**
 * Generates clean 3D coordinates for the Era's Architectural Sculpture
 * Positioned in the lower stage (centered around y = +0.24) below the 4-line particle story.
 */
function generateSculptureCoordinates(
  shape: ParticleShapeType,
  variant: number,
  count: number
): Float32Array {
  const coords = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = i / count;
    let x = 0;
    let y = 0;
    let z = 0;

    switch (shape) {
      case 'sphere': {
        if (i < count * 0.72) {
          const sub = Math.floor(count * 0.72);
          const phi = Math.acos(1 - (2 * (i % sub)) / sub);
          const theta = Math.PI * (1 + Math.sqrt(5)) * i;
          const r = variant === 0 ? 0.21 : variant === 1 ? 0.24 + (i % 3) * 0.02 : 0.19;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        } else {
          const angle = t * Math.PI * 24;
          const ringR = variant === 1 ? 0.36 : 0.32;
          const tilt = variant === 2 ? 0.45 : 0.2;
          x = Math.cos(angle) * ringR;
          y = Math.sin(angle) * ringR * tilt;
          z = Math.sin(angle) * ringR;
        }
        break;
      }

      case 'terminal': {
        if (i < count * 0.25) {
          const edge = i % 4;
          const p = ((i * 13) % 100) / 100;
          const w = 0.31;
          const h = 0.18;
          if (edge === 0) { x = -w + p * w * 2; y = -h; }
          else if (edge === 1) { x = -w + p * w * 2; y = h; }
          else if (edge === 2) { x = -w; y = -h + p * h * 2; }
          else { x = w; y = -h + p * h * 2; }
          z = -0.02;
        } else {
          const row = i % 10;
          const col = Math.floor(i / 10) % 34;
          const tabShift = variant === 1 ? ((row % 3) + 1) * 0.04 : 0;
          x = -0.26 + (col / 34) * 0.52 + tabShift;
          y = -0.14 + (row / 10) * 0.28;
          z = variant === 2 ? Math.sin(row * 0.6) * 0.05 : 0;
        }
        break;
      }

      case 'table': {
        const cellIndex = i % 5;
        const p = ((i * 29) % 200) / 200;
        const edge = i % 4;
        const cells = [
          { cx: 0.0, cy: -0.14, cw: 0.28, ch: 0.038, cz: 0 },
          { cx: -0.19, cy: 0.01, cw: 0.08, ch: 0.09, cz: 0.03 },
          { cx: 0.01, cy: 0.01, cw: 0.10, ch: 0.09, cz: -0.02 },
          { cx: 0.20, cy: 0.01, cw: 0.07, ch: 0.09, cz: 0.04 },
          { cx: 0.0, cy: 0.15, cw: 0.28, ch: 0.03, cz: -0.02 },
        ];
        const c = cells[cellIndex];
        const explode = variant === 1 ? 1.18 : variant === 2 ? 1.28 : 1.0;
        const zBoost = variant > 0 ? (cellIndex - 2) * 0.08 * variant : c.cz;

        if (edge === 0) { x = c.cx * explode - c.cw + p * c.cw * 2; y = c.cy * explode - c.ch; }
        else if (edge === 1) { x = c.cx * explode - c.cw + p * c.cw * 2; y = c.cy * explode + c.ch; }
        else if (edge === 2) { x = c.cx * explode - c.cw; y = c.cy * explode - c.ch + p * c.ch * 2; }
        else { x = c.cx * explode + c.cw; y = c.cy * explode - c.ch + p * c.ch * 2; }
        z = zBoost;
        break;
      }

      case 'cascade': {
        const layer = i % 3;
        const spread = variant === 0 ? 0.09 : variant === 1 ? 0.16 : 0.21;
        const lx = (layer - 1) * spread;
        const lz = (layer - 1) * (variant === 2 ? 0.15 : 0.08);

        if (layer < 2 && variant !== 1) {
          const gx = ((i * 17) % 24) / 24 - 0.5;
          const gy = (Math.floor(i / 24) % 18) / 18 - 0.5;
          x = lx + gx * 0.32;
          y = gy * 0.22;
          z = lz + gx * 0.12;
        } else {
          const waveX = (t - 0.5) * 0.66;
          const freq = variant === 1 ? 16.0 : 10.0;
          x = waveX;
          y = Math.sin(waveX * freq + (i % 5)) * 0.11;
          z = lz + Math.cos(waveX * 7.0) * 0.07;
        }
        break;
      }

      case 'responsive': {
        if (variant !== 1) {
          const cols = variant === 2 ? 6 : 12;
          const col = i % cols;
          const row = Math.floor(i / cols);
          const maxRows = Math.ceil(count / cols);
          const colCenter = -0.28 + (col / (cols - 1)) * 0.56;
          x = colCenter + ((i % 2) - 0.5) * 0.015;
          y = ((row / maxRows) - 0.5) * 0.3;
          z = Math.sin(col * 0.5) * 0.02;
        } else {
          if (i < count * 0.4) {
            const p = i / (count * 0.4);
            const angle = p * Math.PI * 2;
            const pw = 0.15;
            const ph = 0.22;
            x = Math.sign(Math.cos(angle)) * Math.pow(Math.abs(Math.cos(angle)), 0.3) * pw;
            y = Math.sign(Math.sin(angle)) * Math.pow(Math.abs(Math.sin(angle)), 0.3) * ph;
            z = 0.02;
          } else {
            const cardIdx = i % 3;
            const cy = -0.11 + cardIdx * 0.11;
            const cw = 0.105;
            const ch = 0.034;
            const edge = i % 4;
            const p = ((i * 19) % 100) / 100;
            if (edge === 0) { x = -cw + p * cw * 2; y = cy - ch; }
            else if (edge === 1) { x = -cw + p * cw * 2; y = cy + ch; }
            else if (edge === 2) { x = -cw; y = cy - ch + p * ch * 2; }
            else { x = cw; y = cy - ch + p * ch * 2; }
            z = 0;
          }
        }
        break;
      }

      case 'flat': {
        const side = Math.cbrt(count);
        const ix = (i % side) / side - 0.5;
        const iy = (Math.floor(i / side) % side) / side - 0.5;
        const iz = (Math.floor(i / (side * side)) % side) / side - 0.5;

        if (variant === 0 || variant === 2) {
          const tile = i % 4;
          const tx = (tile % 2 === 0 ? -0.15 : 0.15) + ix * 0.22;
          const ty = (tile < 2 ? -0.09 : 0.09) + iy * 0.14;
          x = tx;
          y = ty;
          z = 0.0;
        } else {
          x = ix * 0.29;
          y = iy * 0.29;
          z = iz * 0.29;
        }
        break;
      }

      case 'wave3d': {
        const cols = 42;
        const rows = Math.floor(count / cols);
        const u = (i % cols) / cols - 0.5;
        const v = Math.floor(i / cols) / rows - 0.5;

        if (variant === 1) {
          const a = t * Math.PI * 2 * 3;
          const b = t * Math.PI * 2 * 7;
          const r = 0.17 + 0.065 * Math.cos(b);
          x = r * Math.cos(a) * 0.78;
          y = r * Math.sin(a) * 0.48;
          z = 0.08 * Math.sin(b);
        } else {
          const dist = Math.sqrt(u * u + v * v);
          x = u * 0.65;
          z = v * 0.5;
          y = Math.sin(dist * (variant === 2 ? 20.0 : 12.0)) * 0.09;
        }
        break;
      }

      case 'neural': {
        const cluster = i % 7;
        const centers = [
          [0, 0, 0],
          [-0.21, -0.09, 0.05],
          [0.21, -0.09, -0.05],
          [-0.17, 0.1, -0.07],
          [0.17, 0.1, 0.07],
          [0, -0.14, 0.09],
          [0, 0.14, -0.09],
        ];
        const [cx, cy, cz] = centers[cluster];
        const rad = (variant === 1 ? 0.11 : 0.075) * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        x = cx + rad * Math.sin(phi) * Math.cos(theta);
        y = cy + rad * Math.sin(phi) * Math.sin(theta);
        z = cz + rad * Math.cos(phi);
        break;
      }

      case 'singularity': {
        const arm = i % 4;
        const radius = Math.pow(t, 0.65) * (variant === 1 ? 0.38 : 0.29);
        const spin = radius * (variant === 2 ? 5.0 : 12.0) + (arm * Math.PI) / 2;

        x = Math.cos(spin) * radius * 0.82;
        y = (Math.random() - 0.5) * (variant === 1 ? 0.22 : 0.055 * (1 - t * 0.7));
        z = Math.sin(spin) * radius;
        break;
      }
    }

    // Center the 3D sculpture at y = +0.24 so it sits cleanly below the 4-line particle story
    coords[i * 3] = x;
    coords[i * 3 + 1] = y + 0.24;
    coords[i * 3 + 2] = z;
  }

  return coords;
}

export const ParticleEngine: React.FC<ParticleEngineProps> = React.memo(
  ({
    activeEraIndex,
    activePhaseIndex,
    motionRef,
    overrideWord,
    customWord,
    onCanvasClick,
  }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const stateRef = useRef({
      activeEraIndex,
      activePhaseIndex,
      overrideWord,
      customWord,
      onCanvasClick,
    });

    const morphBoostRef = useRef({ value: 0 });

    useEffect(() => {
      stateRef.current = {
        activeEraIndex,
        activePhaseIndex,
        overrideWord,
        customWord,
        onCanvasClick,
      };
    }, [activeEraIndex, activePhaseIndex, overrideWord, customWord, onCanvasClick]);

    const targetsRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES * 3));
    const currentRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES * 3));
    const velocityRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES * 3));
    const shadesRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES));
    const sizesRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES));
    const textTiersRef = useRef<Uint8Array>(new Uint8Array(TEXT_PARTICLES));

    useEffect(() => {
      const era = ERAS[activeEraIndex] || ERAS[0];
      const phase = era.phases[activePhaseIndex] || era.phases[0];

      // Resolve full 4-line story for the current phase, spec override, milestone override, or custom word
      let activeStory: ParticleNodeStory = {
        kicker: phase.tag,
        word: phase.word,
        line1: phase.line1,
        line2: phase.line2,
      };

      if (overrideWord) {
        const matchedSpec = era.specs.find((s) => s.particleWord === overrideWord);
        const matchedMilestone = era.milestones.find((m) => m.particleWord === overrideWord);
        if (matchedSpec) {
          activeStory = matchedSpec.story;
        } else if (matchedMilestone) {
          activeStory = matchedMilestone.story;
        } else {
          activeStory = {
            kicker: `ERA ${era.chapter} · ARCHIVE NODE`,
            word: overrideWord,
            line1: phase.line1,
            line2: phase.line2,
          };
        }
      } else if (activeEraIndex === 8 && customWord.trim().length > 0) {
        activeStory = {
          kicker: 'CHAPTER 08 · LIVE PARTICLE SYNTHESIZER',
          word: customWord.trim().slice(0, 12),
          line1: 'SCULPTED LIVE FROM YOUR INTENT',
          line2: 'EVERY WORD TELLS THE STORY IN LIGHT',
        };
      }

      const { coords: textTargets, tiers } = sampleMultiLineParticleStory(
        activeStory,
        TEXT_PARTICLES
      );
      textTiersRef.current.set(tiers);

      const sculptTargets = generateSculptureCoordinates(
        era.shapeType,
        phase.sculptVariant,
        SCULPT_PARTICLES
      );

      const targets = targetsRef.current;
      const sizes = sizesRef.current;
      targets.set(textTargets, 0);
      targets.set(sculptTargets, TEXT_PARTICLES * 3);

      // Assign crisp dot sizes per story tier (Headline = 2.05px, Story = 1.8px, Kicker = 1.65px)
      for (let i = 0; i < TEXT_PARTICLES; i++) {
        const tier = tiers[i];
        sizes[i] = tier === 0 ? 2.05 : tier === 1 ? 1.8 : 1.65;
      }

      const streamStart = TEXT_PARTICLES + SCULPT_PARTICLES;
      for (let i = streamStart; i < TOTAL_PARTICLES; i++) {
        targets[i * 3] = (Math.random() - 0.5) * 2.4;
        targets[i * 3 + 1] = (Math.random() - 0.5) * 1.9;
        targets[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      }

      gsap.fromTo(
        morphBoostRef.current,
        { value: 0.085 },
        { value: 0, duration: 0.75, ease: 'power3.out', overwrite: true }
      );
    }, [activeEraIndex, activePhaseIndex, overrideWord, customWord]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: true });
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

      const current = currentRef.current;
      const targets = targetsRef.current;
      const shades = shadesRef.current;
      const sizes = sizesRef.current;
      const textTiers = textTiersRef.current;
      const streamStart = TEXT_PARTICLES + SCULPT_PARTICLES;

      for (let i = 0; i < TOTAL_PARTICLES; i++) {
        current[i * 3] = (Math.random() - 0.5) * 2.2;
        current[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
        current[i * 3 + 2] = (Math.random() - 0.5) * 1.0;

        if (i < TEXT_PARTICLES) {
          shades[i] = 1.0;
          sizes[i] = 1.9;
        } else if (i < streamStart) {
          shades[i] = 0.55 + Math.random() * 0.45;
          sizes[i] = 1.45 + Math.random() * 0.75;
        } else {
          shades[i] = 0.14 + Math.random() * 0.22;
          sizes[i] = 1.0 + Math.random() * 0.5;
        }
      }

      const mouse = {
        x: -9999,
        y: -9999,
        vx: 0,
        vy: 0,
        normX: 0,
        normY: 0,
        smoothNormX: 0,
        smoothNormY: 0,
        active: false,
      };

      const shockwave = {
        x: 0,
        y: 0,
        radius: 0,
        alpha: 0,
        active: false,
      };

      const onPointerMove = (e: PointerEvent) => {
        const dx = e.clientX - mouse.x;
        const dy = e.clientY - mouse.y;
        if (mouse.active) {
          mouse.vx = Math.max(-28, Math.min(28, dx));
          mouse.vy = Math.max(-28, Math.min(28, dy));
        }
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.normX = (e.clientX / width) * 2 - 1;
        mouse.normY = (e.clientY / height) * 2 - 1;
        mouse.active = true;
      };

      const onPointerLeave = () => {
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
      };

      const onPointerDown = (e: PointerEvent) => {
        const target = e.target as HTMLElement;
        if (
          target &&
          (target.tagName === 'BUTTON' ||
            target.tagName === 'INPUT' ||
            target.closest('button') ||
            target.closest('input'))
        ) {
          return;
        }

        shockwave.x = e.clientX;
        shockwave.y = e.clientY;
        shockwave.radius = 6;
        shockwave.alpha = 0.85;
        shockwave.active = true;

        const clickNormX = (e.clientX / width) * 2 - 1;
        const clickNormY = (e.clientY / height) * 2 - 1;
        const vel = velocityRef.current;

        for (let i = 0; i < TOTAL_PARTICLES; i++) {
          const dx = current[i * 3] - clickNormX;
          const dy = current[i * 3 + 1] - clickNormY;
          const distSq = dx * dx + dy * dy + 0.01;
          if (distSq < 0.35) {
            const dist = Math.sqrt(distSq);
            const force = (0.048 / dist) * (1 - distSq / 0.35);
            vel[i * 3] += (dx / dist) * force;
            vel[i * 3 + 1] += (dy / dist) * force;
            vel[i * 3 + 2] += (Math.random() - 0.5) * 0.04;
          }
        }

        stateRef.current.onCanvasClick?.();
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave, { passive: true });
      window.addEventListener('pointerdown', onPointerDown, { passive: true });

      const screenX = new Float32Array(TOTAL_PARTICLES);
      const screenY = new Float32Array(TOTAL_PARTICLES);
      const drawSizes = new Float32Array(TOTAL_PARTICLES);
      const bucketIndices = new Uint8Array(TOTAL_PARTICLES);

      const onTick = (gsapTime: number) => {
        const time = gsapTime * 0.8;
        mouse.vx *= 0.88;
        mouse.vy *= 0.88;
        mouse.smoothNormX += ((mouse.active ? mouse.normX : 0) - mouse.smoothNormX) * 0.1;
        mouse.smoothNormY += ((mouse.active ? mouse.normY : 0) - mouse.smoothNormY) * 0.1;

        const {
          activeEraIndex: eraIdx,
          activePhaseIndex: phaseIdx,
        } = stateRef.current;
        const sVel = motionRef.current.velocity;
        const era = ERAS[eraIdx] || ERAS[0];
        const phase = era.phases[phaseIdx] || era.phases[0];

        // 1. Transparent Clear so WebGL Water Shader Shines Through
        ctx.clearRect(0, 0, width, height);

        // 2. Subtle Architectural Equator Hairline Separating Story & Sculpture
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.52);
        ctx.lineTo(width, height * 0.52);
        ctx.stroke();

        // 3. Smooth Interactive 3D Rotation for Central Sculpture
        const isFlatPlane = era.shapeType === 'flat' && phase.sculptVariant !== 1;
        const rotY =
          era.shapeType === 'terminal' ||
          era.shapeType === 'table' ||
          era.shapeType === 'responsive' ||
          isFlatPlane
            ? Math.sin(time * 0.5) * 0.14 + mouse.smoothNormX * 0.18
            : time * 0.26 + mouse.smoothNormX * 0.34;

        const rotX =
          era.shapeType === 'wave3d'
            ? 0.38 + mouse.smoothNormY * 0.15
            : Math.cos(time * 0.38) * 0.07 + mouse.smoothNormY * 0.14;

        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        const vel = velocityRef.current;
        const scaleX = Math.min(width * 0.46, 720);
        const scaleY = Math.min(height * 0.46, 490);
        const centerX = width * 0.5;
        const centerY = height * 0.5;

        const horizontalWind = Math.max(-0.07, Math.min(0.07, sVel * -0.0015));
        const streak = Math.min(10, Math.abs(sVel) * 0.22);
        const morphBoost = morphBoostRef.current.value;

        // 4. Update & Project All 9,600 Particles
        for (let i = 0; i < TOTAL_PARTICLES; i++) {
          const i3 = i * 3;
          let tx = targets[i3];
          let ty = targets[i3 + 1];
          let tz = targets[i3 + 2];

          if (i >= TEXT_PARTICLES && i < streamStart) {
            if (era.shapeType === 'wave3d' && phase.sculptVariant !== 1) {
              const d = Math.sqrt(tx * tx + tz * tz);
              ty = Math.sin(d * 14.0 - time * 3.0) * 0.09 + 0.24;
            } else if (era.shapeType === 'cascade' && i % 3 === 2) {
              ty = Math.sin(tx * 12.0 + time * 3.6) * 0.10 + 0.24;
            }

            const localY = ty - 0.24;
            const rx = tx * cosY - tz * sinY;
            const rz1 = tx * sinY + tz * cosY;
            const ry = localY * cosX - rz1 * sinX;
            const rz2 = localY * sinX + rz1 * cosX;

            tx = rx;
            ty = ry + 0.24;
            tz = rz2;
          } else if (i >= streamStart) {
            targets[i3] -= 0.0014 + horizontalWind * 0.35;
            if (targets[i3] < -1.25) targets[i3] = 1.25;
            if (targets[i3] > 1.25) targets[i3] = -1.25;
            tx = targets[i3];
            ty += Math.sin(tx * 4.5 + time * 1.8 + (i % 17) * 0.3) * 0.04;
          }

          const spring = (i < TEXT_PARTICLES ? 0.16 : 0.11) + morphBoost;
          vel[i3] = (vel[i3] + (tx - current[i3]) * spring + horizontalWind * 0.08) * 0.74;
          vel[i3 + 1] = (vel[i3 + 1] + (ty - current[i3 + 1]) * spring) * 0.74;
          vel[i3 + 2] = (vel[i3 + 2] + (tz - current[i3 + 2]) * spring) * 0.74;

          current[i3] += vel[i3];
          current[i3 + 1] += vel[i3 + 1];
          current[i3 + 2] += vel[i3 + 2];

          const perspective = 1.85 / (1.85 - current[i3 + 2]);
          let sx = centerX + current[i3] * scaleX * perspective;
          let sy = centerY + current[i3 + 1] * scaleY * perspective;
          let hoverBoost = 0;

          if (mouse.active) {
            const dx = sx - mouse.x;
            const dy = sy - mouse.y;
            const distSq = dx * dx + dy * dy;
            const maxR = i < TEXT_PARTICLES ? 88 : 130;
            if (distSq < maxR * maxR && distSq > 1) {
              const dist = Math.sqrt(distSq);
              const factor = 1 - dist / maxR;
              const smoothFactor = factor * factor;
              hoverBoost = smoothFactor;

              const push = i < TEXT_PARTICLES ? 20 : 28;
              sx += (dx / dist) * smoothFactor * push;
              sy += (dy / dist) * smoothFactor * push;

              const velImpulse = i < TEXT_PARTICLES ? 0.002 : 0.003;
              vel[i3] += ((dx / dist) * velImpulse + mouse.vx * 0.00012) * smoothFactor;
              vel[i3 + 1] += ((dy / dist) * velImpulse + mouse.vy * 0.00012) * smoothFactor;
              vel[i3 + 2] += Math.sin(i) * 0.0016 * smoothFactor;
            }
          }

          screenX[i] = sx;
          screenY[i] = sy;

          const baseSize = i < TEXT_PARTICLES ? sizes[i] : sizes[i] * perspective * 0.92;
          drawSizes[i] = baseSize * (1 + hoverBoost * 0.55);

          if (hoverBoost > 0.25) {
            bucketIndices[i] = 0;
          } else if (i < TEXT_PARTICLES) {
            bucketIndices[i] = textTiers[i]; // 0 = Headline, 1 = Story Lines, 2 = Kicker
          } else {
            const lum = shades[i] * perspective;
            bucketIndices[i] = lum > 0.78 ? 0 : lum > 0.56 ? 1 : lum > 0.34 ? 2 : 3;
          }
        }

        // 4B. Batched Path Draw (4 fill() calls for all 9,600 particles)
        for (let b = 0; b < 4; b++) {
          ctx.fillStyle = BUCKET_STYLES[b];
          ctx.beginPath();
          const startIdx = b === 3 ? TEXT_PARTICLES : 0;
          for (let i = startIdx; i < TOTAL_PARTICLES; i++) {
            if (bucketIndices[i] === b) {
              const sz = drawSizes[i];
              ctx.rect(screenX[i] - sz * 0.5, screenY[i] - sz * 0.5, sz + streak, sz);
            }
          }
          ctx.fill();
        }

        // 5. Subtle Structural Filaments inside the 3D Sculpture
        ctx.lineWidth = 0.6;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        const step = era.shapeType === 'neural' ? 5 : 11;
        for (let i = TEXT_PARTICLES; i < streamStart - step; i += step) {
          const x1 = screenX[i];
          const y1 = screenY[i];
          const x2 = screenX[i + 1];
          const y2 = screenY[i + 1];
          if ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) < 3000) {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
          }
        }
        ctx.stroke();

        // 6. Render 4 Frosted Glassmorphic 3D Sculpture Callout Blocks on Canvas
        if (width >= 1180) {
          let leftSlot = 0;
          let rightSlot = 0;
          const cardW = 174;
          const cardH = 44;
          const outerRadius = Math.max(265, Math.min(405, width * 0.5 - 308));

          era.sculptureCallouts.forEach((callout) => {
            const rx = callout.x * cosY - callout.z * sinY;
            const rz1 = callout.x * sinY + callout.z * cosY;
            const ry = callout.y * cosX - rz1 * sinX;
            const rz2 = callout.y * sinX + rz1 * cosX;

            const perspective = 1.85 / (1.85 - rz2);
            const ax = centerX + rx * scaleX * perspective;
            const ay = centerY + (ry + 0.24) * scaleY * perspective;

            const isLeft = callout.side === 'left';
            const slotIdx = isLeft ? leftSlot++ : rightSlot++;
            const dir = isLeft ? -1 : 1;

            // Stationary lower-stage vertical slots aligned with the 3D sculpture
            const slotOffsetY = slotIdx === 0 ? 0.12 * scaleY : 0.34 * scaleY;
            const cardCenterY = centerY + slotOffsetY;
            const cardEdgeX = centerX + dir * (outerRadius - cardW);
            const cardX = isLeft ? cardEdgeX - cardW : cardEdgeX;
            const cardY = cardCenterY - cardH / 2;
            const elbowX = cardEdgeX - dir * 18;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(ax - 2.5, ay - 2.5, 5, 5);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
            ctx.lineWidth = 1;
            ctx.strokeRect(ax - 5.5, ay - 5.5, 11, 11);

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.34)';
            ctx.lineWidth = 1;
            ctx.moveTo(ax, ay);
            ctx.lineTo(elbowX, cardCenterY);
            ctx.lineTo(cardEdgeX, cardCenterY);
            ctx.stroke();

            const boxGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
            boxGrad.addColorStop(0, 'rgba(255, 255, 255, 0.11)');
            boxGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)');
            boxGrad.addColorStop(1, 'rgba(8, 8, 8, 0.52)');

            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardW, cardH, 8);
            ctx.fillStyle = boxGrad;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cardX + 8, cardY + 0.5);
            ctx.lineTo(cardX + cardW - 8, cardY + 0.5);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
            ctx.stroke();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(isLeft ? cardEdgeX - 2.5 : cardEdgeX + 0.5, cardY + 8, 2, cardH - 16);

            const textX = isLeft ? cardEdgeX - 11 : cardEdgeX + 11;
            ctx.textAlign = isLeft ? 'right' : 'left';

            ctx.font = '700 10px "JetBrains Mono", monospace';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${callout.code} // ${callout.title}`, textX, cardY + 15);

            ctx.font = '500 11px "DM Sans", sans-serif';
            ctx.fillStyle = '#e5e5e5';
            ctx.fillText(callout.value, textX, cardY + 31);
          });
        }

        // 7. Expanding Triple Concentric Water Ripple Rings on Click
        if (shockwave.active) {
          shockwave.radius += 11;
          shockwave.alpha *= 0.92;
          ctx.lineWidth = 1;

          const rings = [1.0, 0.68, 0.38];
          rings.forEach((scale, idx) => {
            const r = shockwave.radius * scale;
            if (r > 2) {
              const ringAlpha = shockwave.alpha * (1 - idx * 0.28);
              ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.arc(shockwave.x, shockwave.y, r, 0, Math.PI * 2);
              ctx.stroke();
            }
          });

          if (shockwave.alpha < 0.02) shockwave.active = false;
        }
      };

      gsap.ticker.add(onTick);

      return () => {
        window.removeEventListener('resize', updateSize);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('pointerdown', onPointerDown);
        gsap.ticker.remove(onTick);
      };
    }, [motionRef]);

    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[5]"
      />
    );
  }
);

export default ParticleEngine;
