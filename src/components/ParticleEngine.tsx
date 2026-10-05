import React, { useEffect, useRef } from 'react';
import { ERAS, type ParticleShapeType } from '../data/eras';

interface ParticleEngineProps {
  activeEraIndex: number;
  activePhaseIndex: number; // 0, 1, or 2 within the current era
  scrollProgress: number;   // 0 to 1 across entire horizontal track
  scrollVelocity: number;   // horizontal scroll speed
  overrideWord: string | null;
  customWord: string;
  onCanvasClick?: () => void;
}

const TOTAL_PARTICLES = 6200;
const TEXT_PARTICLES = 3200;   // 0 .. 3199: Ultra-dense uniform dot-matrix Particle Word
const SCULPT_PARTICLES = 2500; // 3200 .. 5699: Central 3D Architectural Sculpture
// 5700 .. 6199 (500 particles): Subtle Horizontal Parallax Dust

/**
 * Rasterizes the main word onto an offscreen canvas and maps all 3,200 particles
 * uniformly across every letter stroke with zero gaps or Swiss-cheese holes.
 */
function sampleCrispParticleWord(mainWord: string, count: number): Float32Array {
  const result = new Float32Array(count * 3);
  const canvas = document.createElement('canvas');
  const w = 920;
  const h = 180;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (!ctx) return result;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const text = mainWord.toUpperCase();
  const len = text.length;
  const fontSize = len > 11 ? 92 : len > 8 ? 108 : 124;
  ctx.font = `900 ${fontSize}px "DM Sans", sans-serif`;
  ctx.fillText(text, w / 2, h / 2);

  const imgData = ctx.getImageData(0, 0, w, h).data;
  const validPixels: { x: number; y: number }[] = [];

  // Uniform 2px dot-matrix grid scan
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const idx = (y * w + x) * 4;
      if (imgData[idx] > 140) {
        validPixels.push({
          x: (x / w) * 2 - 1,
          y: (y / h) * 2 - 1,
        });
      }
    }
  }

  const totalValid = validPixels.length;
  if (totalValid === 0) return result;

  // Evenly distribute all `count` particles across the ordered validPixels array
  for (let i = 0; i < count; i++) {
    const pixelIndex = Math.floor((i / count) * totalValid);
    const sample = validPixels[pixelIndex];

    // Keep Z=0 so perspective never distorts letter alignment
    result[i * 3] = sample.x * 0.46;
    result[i * 3 + 1] = sample.y * 0.125 - 0.44;
    result[i * 3 + 2] = 0;
  }

  return result;
}

/**
 * Generates clean 3D coordinates for the Era's Architectural Sculpture
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
          const r = variant === 0 ? 0.27 : variant === 1 ? 0.31 + (i % 3) * 0.025 : 0.23;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        } else {
          const angle = t * Math.PI * 24;
          const ringR = variant === 1 ? 0.44 : 0.38;
          const tilt = variant === 2 ? 0.5 : 0.22;
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
          const w = 0.36;
          const h = 0.23;
          if (edge === 0) { x = -w + p * w * 2; y = -h; }
          else if (edge === 1) { x = -w + p * w * 2; y = h; }
          else if (edge === 2) { x = -w; y = -h + p * h * 2; }
          else { x = w; y = -h + p * h * 2; }
          z = -0.02;
        } else {
          const row = i % 12;
          const col = Math.floor(i / 12) % 36;
          const tabShift = variant === 1 ? ((row % 3) + 1) * 0.05 : 0;
          x = -0.3 + (col / 36) * 0.6 + tabShift;
          y = -0.17 + (row / 12) * 0.34;
          z = variant === 2 ? Math.sin(row * 0.6) * 0.06 : 0;
        }
        break;
      }

      case 'table': {
        const cellIndex = i % 5;
        const p = ((i * 29) % 200) / 200;
        const edge = i % 4;
        const cells = [
          { cx: 0.0, cy: -0.17, cw: 0.32, ch: 0.045, cz: 0 },
          { cx: -0.22, cy: 0.01, cw: 0.09, ch: 0.11, cz: 0.03 },
          { cx: 0.01, cy: 0.01, cw: 0.12, ch: 0.11, cz: -0.02 },
          { cx: 0.23, cy: 0.01, cw: 0.08, ch: 0.11, cz: 0.04 },
          { cx: 0.0, cy: 0.18, cw: 0.32, ch: 0.035, cz: -0.02 },
        ];
        const c = cells[cellIndex];
        const explode = variant === 1 ? 1.2 : variant === 2 ? 1.32 : 1.0;
        const zBoost = variant > 0 ? (cellIndex - 2) * 0.1 * variant : c.cz;

        if (edge === 0) { x = c.cx * explode - c.cw + p * c.cw * 2; y = c.cy * explode - c.ch; }
        else if (edge === 1) { x = c.cx * explode - c.cw + p * c.cw * 2; y = c.cy * explode + c.ch; }
        else if (edge === 2) { x = c.cx * explode - c.cw; y = c.cy * explode - c.ch + p * c.ch * 2; }
        else { x = c.cx * explode + c.cw; y = c.cy * explode - c.ch + p * c.ch * 2; }
        z = zBoost;
        break;
      }

      case 'cascade': {
        const layer = i % 3;
        const spread = variant === 0 ? 0.1 : variant === 1 ? 0.19 : 0.24;
        const lx = (layer - 1) * spread;
        const lz = (layer - 1) * (variant === 2 ? 0.18 : 0.09);

        if (layer < 2 && variant !== 1) {
          const gx = ((i * 17) % 24) / 24 - 0.5;
          const gy = (Math.floor(i / 24) % 20) / 20 - 0.5;
          x = lx + gx * 0.38;
          y = gy * 0.28;
          z = lz + gx * 0.15;
        } else {
          const waveX = (t - 0.5) * 0.76;
          const freq = variant === 1 ? 16.0 : 10.0;
          x = waveX;
          y = Math.sin(waveX * freq + (i % 5)) * 0.14;
          z = lz + Math.cos(waveX * 7.0) * 0.08;
        }
        break;
      }

      case 'responsive': {
        if (variant !== 1) {
          const cols = variant === 2 ? 6 : 12;
          const col = i % cols;
          const row = Math.floor(i / cols);
          const maxRows = Math.ceil(count / cols);
          const colCenter = -0.32 + (col / (cols - 1)) * 0.64;
          x = colCenter + ((i % 2) - 0.5) * 0.018;
          y = ((row / maxRows) - 0.5) * 0.38;
          z = Math.sin(col * 0.5) * 0.025;
        } else {
          // Crisp Smartphone Bezel + Clean Horizontal Card Outlines
          if (i < count * 0.4) {
            const p = i / (count * 0.4);
            const angle = p * Math.PI * 2;
            const pw = 0.17;
            const ph = 0.28;
            x = Math.sign(Math.cos(angle)) * Math.pow(Math.abs(Math.cos(angle)), 0.3) * pw;
            y = Math.sign(Math.sin(angle)) * Math.pow(Math.abs(Math.sin(angle)), 0.3) * ph;
            z = 0.02;
          } else {
            // Crisp card wireframes inside phone instead of noisy blotches
            const cardIdx = i % 3;
            const cy = -0.14 + cardIdx * 0.14;
            const cw = 0.12;
            const ch = 0.042;
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
          const tx = (tile % 2 === 0 ? -0.17 : 0.17) + ix * 0.26;
          const ty = (tile < 2 ? -0.11 : 0.11) + iy * 0.17;
          x = tx;
          y = ty;
          z = 0.0;
        } else {
          x = ix * 0.36;
          y = iy * 0.36;
          z = iz * 0.36;
        }
        break;
      }

      case 'wave3d': {
        const cols = 46;
        const rows = Math.floor(count / cols);
        const u = (i % cols) / cols - 0.5;
        const v = Math.floor(i / cols) / rows - 0.5;

        if (variant === 1) {
          const a = t * Math.PI * 2 * 3;
          const b = t * Math.PI * 2 * 7;
          const r = 0.2 + 0.08 * Math.cos(b);
          x = r * Math.cos(a) * 0.82;
          y = r * Math.sin(a) * 0.56;
          z = 0.1 * Math.sin(b);
        } else {
          const dist = Math.sqrt(u * u + v * v);
          x = u * 0.75;
          z = v * 0.6;
          y = Math.sin(dist * (variant === 2 ? 20.0 : 12.0)) * 0.11;
        }
        break;
      }

      case 'neural': {
        const cluster = i % 7;
        const centers = [
          [0, 0, 0],
          [-0.24, -0.11, 0.06],
          [0.24, -0.11, -0.06],
          [-0.2, 0.13, -0.08],
          [0.2, 0.13, 0.08],
          [0, -0.17, 0.11],
          [0, 0.17, -0.11],
        ];
        const [cx, cy, cz] = centers[cluster];
        const rad = (variant === 1 ? 0.14 : 0.09) * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        x = cx + rad * Math.sin(phi) * Math.cos(theta);
        y = cy + rad * Math.sin(phi) * Math.sin(theta);
        z = cz + rad * Math.cos(phi);
        break;
      }

      case 'singularity': {
        const arm = i % 4;
        const radius = Math.pow(t, 0.65) * (variant === 1 ? 0.48 : 0.35);
        const spin = radius * (variant === 2 ? 5.0 : 12.0) + (arm * Math.PI) / 2;

        x = Math.cos(spin) * radius * 0.82;
        y = (Math.random() - 0.5) * (variant === 1 ? 0.28 : 0.07 * (1 - t * 0.7));
        z = Math.sin(spin) * radius;
        break;
      }
    }

    coords[i * 3] = x;
    coords[i * 3 + 1] = y + 0.08;
    coords[i * 3 + 2] = z;
  }

  return coords;
}

export const ParticleEngine: React.FC<ParticleEngineProps> = ({
  activeEraIndex,
  activePhaseIndex,
  scrollProgress,
  scrollVelocity,
  overrideWord,
  customWord,
  onCanvasClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stateRef = useRef({
    activeEraIndex,
    activePhaseIndex,
    scrollProgress,
    scrollVelocity,
    overrideWord,
    customWord,
    onCanvasClick,
  });

  useEffect(() => {
    stateRef.current = {
      activeEraIndex,
      activePhaseIndex,
      scrollProgress,
      scrollVelocity,
      overrideWord,
      customWord,
      onCanvasClick,
    };
  }, [
    activeEraIndex,
    activePhaseIndex,
    scrollProgress,
    scrollVelocity,
    overrideWord,
    customWord,
    onCanvasClick,
  ]);

  const targetsRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES * 3));
  const currentRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES * 3));
  const velocityRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES * 3));
  const shadesRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES));
  const sizesRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES));

  useEffect(() => {
    const era = ERAS[activeEraIndex] || ERAS[0];
    const phase = era.phases[activePhaseIndex] || era.phases[0];

    const displayWord = overrideWord
      ? overrideWord
      : activeEraIndex === 8 && customWord.trim().length > 0
        ? customWord.trim().slice(0, 12)
        : phase.word;

    const textTargets = sampleCrispParticleWord(displayWord, TEXT_PARTICLES);
    const sculptTargets = generateSculptureCoordinates(
      era.shapeType,
      phase.sculptVariant,
      SCULPT_PARTICLES
    );

    const targets = targetsRef.current;
    targets.set(textTargets, 0);
    targets.set(sculptTargets, TEXT_PARTICLES * 3);

    const streamStart = TEXT_PARTICLES + SCULPT_PARTICLES;
    for (let i = streamStart; i < TOTAL_PARTICLES; i++) {
      targets[i * 3] = (Math.random() - 0.5) * 2.4;
      targets[i * 3 + 1] = (Math.random() - 0.5) * 1.9;
      targets[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
  }, [activeEraIndex, activePhaseIndex, overrideWord, customWord]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

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
    const streamStart = TEXT_PARTICLES + SCULPT_PARTICLES;

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      current[i * 3] = (Math.random() - 0.5) * 2.2;
      current[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
      current[i * 3 + 2] = (Math.random() - 0.5) * 1.0;

      if (i < TEXT_PARTICLES) {
        // Pure solid white for maximum word legibility
        shades[i] = 1.0;
        sizes[i] = 2.1;
      } else if (i < streamStart) {
        shades[i] = 0.55 + Math.random() * 0.45;
        sizes[i] = 1.5 + Math.random() * 0.8;
      } else {
        shades[i] = 0.14 + Math.random() * 0.22;
        sizes[i] = 1.0 + Math.random() * 0.5;
      }
    }

    const mouse = {
      x: -9999,
      y: -9999,
      normX: 0,
      normY: 0,
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
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.normX = (e.clientX / width) * 2 - 1;
      mouse.normY = (e.clientY / height) * 2 - 1;
      mouse.active = true;
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
      shockwave.alpha = 0.8;
      shockwave.active = true;

      const clickNormX = (e.clientX / width) * 2 - 1;
      const clickNormY = (e.clientY / height) * 2 - 1;
      const vel = velocityRef.current;

      for (let i = 0; i < TOTAL_PARTICLES; i++) {
        const dx = current[i * 3] - clickNormX;
        const dy = current[i * 3 + 1] - clickNormY;
        const distSq = dx * dx + dy * dy + 0.01;
        if (distSq < 0.3) {
          const force = (0.04 / Math.sqrt(distSq)) * (1 - distSq / 0.3);
          vel[i * 3] += (dx / Math.sqrt(distSq)) * force;
          vel[i * 3 + 1] += (dy / Math.sqrt(distSq)) * force;
          vel[i * 3 + 2] += (Math.random() - 0.5) * 0.03;
        }
      }

      stateRef.current.onCanvasClick?.();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    let rafId: number;
    let time = 0;

    const screenX = new Float32Array(TOTAL_PARTICLES);
    const screenY = new Float32Array(TOTAL_PARTICLES);

    const render = () => {
      time += 0.013;
      const {
        activeEraIndex: eraIdx,
        activePhaseIndex: phaseIdx,
        scrollVelocity: sVel,
        overrideWord: ovWord,
      } = stateRef.current;
      const era = ERAS[eraIdx] || ERAS[0];
      const phase = era.phases[phaseIdx] || era.phases[0];

      // 1. Pure Deep Obsidian Black Background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle Architectural Center Equator Hairline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.53);
      ctx.lineTo(width, height * 0.53);
      ctx.stroke();

      // 3. 3D Rotation for Central Sculpture
      const isFlatPlane = era.shapeType === 'flat' && phase.sculptVariant !== 1;
      const rotY =
        era.shapeType === 'terminal' ||
        era.shapeType === 'table' ||
        era.shapeType === 'responsive' ||
        isFlatPlane
          ? Math.sin(time * 0.5) * 0.14 + (mouse.active ? mouse.normX * 0.15 : 0)
          : time * 0.26 + (mouse.active ? mouse.normX * 0.32 : 0);

      const rotX =
        era.shapeType === 'wave3d'
          ? 0.38 + (mouse.active ? mouse.normY * 0.14 : 0)
          : Math.cos(time * 0.38) * 0.07 + (mouse.active ? mouse.normY * 0.12 : 0);

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const vel = velocityRef.current;
      const scaleX = Math.min(width * 0.46, 700);
      const scaleY = Math.min(height * 0.45, 480);
      const centerX = width * 0.5;
      const centerY = height * 0.48;

      const horizontalWind = Math.max(-0.07, Math.min(0.07, sVel * -0.0015));

      // 4. Update & Project All Particles
      for (let i = 0; i < TOTAL_PARTICLES; i++) {
        const i3 = i * 3;
        let tx = targets[i3];
        let ty = targets[i3 + 1];
        let tz = targets[i3 + 2];

        if (i >= TEXT_PARTICLES && i < streamStart) {
          if (era.shapeType === 'wave3d' && phase.sculptVariant !== 1) {
            const d = Math.sqrt(tx * tx + tz * tz);
            ty = Math.sin(d * 14.0 - time * 3.0) * 0.11 + 0.08;
          } else if (era.shapeType === 'cascade' && i % 3 === 2) {
            ty = Math.sin(tx * 12.0 + time * 3.6) * 0.12 + 0.08;
          }

          const localY = ty - 0.08;
          const rx = tx * cosY - tz * sinY;
          const rz1 = tx * sinY + tz * cosY;
          const ry = localY * cosX - rz1 * sinX;
          const rz2 = localY * sinX + rz1 * cosX;

          tx = rx;
          ty = ry + 0.08;
          tz = rz2;
        } else if (i >= streamStart) {
          targets[i3] -= 0.0012 + horizontalWind * 0.35;
          if (targets[i3] < -1.25) targets[i3] = 1.25;
          if (targets[i3] > 1.25) targets[i3] = -1.25;
          tx = targets[i3];
        }

        const spring = i < TEXT_PARTICLES ? 0.14 : 0.095;
        vel[i3] = (vel[i3] + (tx - current[i3]) * spring + horizontalWind * 0.08) * 0.76;
        vel[i3 + 1] = (vel[i3 + 1] + (ty - current[i3 + 1]) * spring) * 0.76;
        vel[i3 + 2] = (vel[i3 + 2] + (tz - current[i3 + 2]) * spring) * 0.76;

        current[i3] += vel[i3];
        current[i3 + 1] += vel[i3 + 1];
        current[i3 + 2] += vel[i3 + 2];

        const perspective = 1.85 / (1.85 - current[i3 + 2]);
        let sx = centerX + current[i3] * scaleX * perspective;
        let sy = centerY + current[i3 + 1] * scaleY * perspective;

        if (mouse.active) {
          const dx = sx - mouse.x;
          const dy = sy - mouse.y;
          const distSq = dx * dx + dy * dy;
          const maxR = i < TEXT_PARTICLES ? 85 : 115;
          if (distSq < maxR * maxR && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const factor = 1 - dist / maxR;
            sx += (dx / dist) * factor * 18;
            sy += (dy / dist) * factor * 18;
          }
        }

        screenX[i] = sx;
        screenY[i] = sy;

        const depthBoost = Math.max(0.3, Math.min(1.25, perspective));
        const brightness = i < TEXT_PARTICLES ? 255 : Math.min(255, Math.floor(shades[i] * depthBoost * 255));
        const alpha = i < TEXT_PARTICLES ? 0.98 : Math.min(0.92, shades[i] * depthBoost);
        const size = i < TEXT_PARTICLES ? sizes[i] : sizes[i] * perspective * 0.92;
        const streak = Math.min(12, Math.abs(sVel) * 0.25);

        ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha.toFixed(2)})`;
        ctx.fillRect(sx - size * 0.5, sy - size * 0.5, size + streak, size);
      }

      // 5. Crisp Vector Phase Header Badge Above the Particle Word (100% Legible!)
      const headerY = Math.max(104, centerY - 0.64 * scaleY);
      const badgeText = ovWord
        ? `INSPECTING ARCHIVE NODE // ${ovWord} // ${era.year}`
        : `${phase.tag} — ${phase.caption}`;

      ctx.font = '600 11px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(badgeText).width;
      const pillW = textWidth + 28;
      const pillH = 24;

      ctx.fillStyle = 'rgba(14, 14, 14, 0.94)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 1;
      ctx.fillRect(centerX - pillW / 2, headerY - pillH / 2, pillW, pillH);
      ctx.strokeRect(centerX - pillW / 2, headerY - pillH / 2, pillW, pillH);

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, centerX, headerY + 0.5);

      // 6. Subtle Structural Filaments inside the 3D Sculpture
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      const step = era.shapeType === 'neural' ? 5 : 11;
      for (let i = TEXT_PARTICLES; i < streamStart - step; i += step) {
        const x1 = screenX[i];
        const y1 = screenY[i];
        const x2 = screenX[i + 1];
        const y2 = screenY[i + 1];
        if ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) < 3200) {
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
      }
      ctx.stroke();

      // 7. Render 4 Crystal-Clear 3D Sculpture Callout Badges on Canvas
      // Safe horizontal radius ensures zero collision with Left/Right editorial panels
      if (width >= 1120) {
        let leftSlot = 0;
        let rightSlot = 0;
        const cardW = 172;
        const cardH = 44;
        const outerRadius = Math.max(250, Math.min(335, width * 0.5 - 316));

        era.sculptureCallouts.forEach((callout) => {
          // Rotate anchor point with the 3D sculpture
          const rx = callout.x * cosY - callout.z * sinY;
          const rz1 = callout.x * sinY + callout.z * cosY;
          const ry = callout.y * cosX - rz1 * sinX;
          const rz2 = callout.y * sinX + rz1 * cosX;

          const perspective = 1.85 / (1.85 - rz2);
          const ax = centerX + rx * scaleX * perspective;
          const ay = centerY + (ry + 0.08) * scaleY * perspective;

          const isLeft = callout.side === 'left';
          const slotIdx = isLeft ? leftSlot++ : rightSlot++;
          const dir = isLeft ? -1 : 1;

          // Stationary vertical slot so callout text stays rock-solid & readable
          const slotOffsetY = slotIdx === 0 ? -0.05 * scaleY : 0.23 * scaleY;
          const cardCenterY = centerY + slotOffsetY;
          const cardEdgeX = centerX + dir * (outerRadius - cardW);
          const cardX = isLeft ? cardEdgeX - cardW : cardEdgeX;
          const cardY = cardCenterY - cardH / 2;
          const elbowX = cardEdgeX - dir * 18;

          // Anchor point square on the 3D sculpture
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(ax - 2.5, ay - 2.5, 5, 5);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.lineWidth = 1;
          ctx.strokeRect(ax - 5.5, ay - 5.5, 11, 11);

          // Crisp 2-Segment CAD Leader Line connecting 3D Node -> Elbow -> Callout Card
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.36)';
          ctx.lineWidth = 1;
          ctx.moveTo(ax, ay);
          ctx.lineTo(elbowX, cardCenterY);
          ctx.lineTo(cardEdgeX, cardCenterY);
          ctx.stroke();

          // High-Contrast Callout Badge Box
          ctx.fillStyle = 'rgba(10, 10, 10, 0.92)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
          ctx.fillRect(cardX, cardY, cardW, cardH);
          ctx.strokeRect(cardX, cardY, cardW, cardH);

          // Crisp White Accent Bar on inner edge of Callout Box
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(isLeft ? cardEdgeX - 2 : cardEdgeX, cardY, 2, cardH);

          // Callout Typography (100% Crisp & Readable)
          const textX = isLeft ? cardEdgeX - 10 : cardEdgeX + 10;
          ctx.textAlign = isLeft ? 'right' : 'left';

          ctx.font = '700 10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`${callout.code} // ${callout.title}`, textX, cardY + 15);

          ctx.font = '500 11px "DM Sans", sans-serif';
          ctx.fillStyle = '#d4d4d4';
          ctx.fillText(callout.value, textX, cardY + 31);
        });
      }

      // 8. Expanding Click Shockwave Ring
      if (shockwave.active) {
        shockwave.radius += 13;
        shockwave.alpha *= 0.91;
        ctx.strokeStyle = `rgba(255, 255, 255, ${shockwave.alpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(shockwave.x, shockwave.y, shockwave.radius, 0, Math.PI * 2);
        ctx.stroke();
        if (shockwave.alpha < 0.02) shockwave.active = false;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto cursor-crosshair z-0"
    />
  );
};

export default ParticleEngine;
