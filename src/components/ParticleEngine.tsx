import React, { useEffect, useRef } from 'react';
import { ERAS, type ParticleShapeType } from '../data/eras';

interface ParticleEngineProps {
  activeEraIndex: number;
  scrollProgress: number; // 0 to 1 across entire horizontal track
  scrollVelocity: number; // horizontal scroll speed
  isAltMode: boolean;     // interactive toggle per era
  customWord: string;     // user-typed word for Era 08
  selectedNodeIndex: number | null;
  onSelectNode: (idx: number | null) => void;
  onCanvasClick?: () => void;
}

const TOTAL_PARTICLES = 7600;
const TEXT_PARTICLES = 2800;       // 0 .. 2799: Monumental Word + Subheader + Flanking Glyphs
const SCULPT_PARTICLES = 2400;     // 2800 .. 5199: 3D Era Architectural Sculpture
const SATELLITE_PARTICLES = 1200;  // 5200 .. 6399: 6 Interactive Particle Info Satellites (200 pts each)
const HISTOGRAM_PARTICLES = 600;   // 6400 .. 6999: Particle Telemetry Histogram Wave
// 7000 .. 7599 (600 particles): Horizontal Velocity Parallax Stream

/**
 * Samples main typography, subheader, and left/right archival glyphs onto an offscreen canvas
 */
function sampleTextAndGlyphs(
  mainText: string,
  subText: string,
  leftGlyph: string,
  rightGlyph: string,
  count: number
): Float32Array {
  const result = new Float32Array(count * 3);
  const canvas = document.createElement('canvas');
  const w = 1100;
  const h = 320;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (!ctx) return result;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  // 1. Sub-header at top
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 18px "JetBrains Mono", monospace';
  ctx.fillText(subText, w / 2, 38);

  // 2. Monumental center word
  const fontSize = mainText.length > 10 ? 92 : mainText.length > 7 ? 110 : 128;
  ctx.font = `900 ${fontSize}px "DM Sans", sans-serif`;
  ctx.fillText(mainText.toUpperCase(), w / 2, 148);

  // 3. Left & Right flanking era glyphs formed by particles
  ctx.font = '700 36px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`[${leftGlyph}]`, 28, 255);

  ctx.textAlign = 'right';
  ctx.fillText(`[${rightGlyph}]`, w - 28, 255);

  const imgData = ctx.getImageData(0, 0, w, h).data;
  const validPixels: { x: number; y: number; zone: number }[] = [];

  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const idx = (y * w + x) * 4;
      if (imgData[idx] > 128) {
        const zone = y < 70 ? 0 : y > 215 ? 2 : 1;
        validPixels.push({
          x: (x / w) * 2 - 1,
          y: (y / h) * 2 - 1,
          zone,
        });
      }
    }
  }

  if (validPixels.length === 0) return result;

  for (let i = 0; i < count; i++) {
    const sample = validPixels[(i * 79) % validPixels.length];
    const jitterX = (Math.random() - 0.5) * 0.0035;
    const jitterY = (Math.random() - 0.5) * 0.0035;

    result[i * 3] = sample.x * 0.82 + jitterX;
    result[i * 3 + 1] = sample.y * 0.25 - 0.48 + jitterY;
    result[i * 3 + 2] = sample.zone === 1 ? (Math.random() - 0.5) * 0.04 : -0.04;
  }

  return result;
}

/**
 * Generates 3D coordinates for the Era's Architectural Sculpture
 */
function generateSculptureCoordinates(
  shape: ParticleShapeType,
  altMode: boolean,
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
        if (i < count * 0.68) {
          const subCount = Math.floor(count * 0.68);
          const phi = Math.acos(1 - (2 * (i % subCount)) / subCount);
          const theta = Math.PI * (1 + Math.sqrt(5)) * i;
          const r = altMode ? 0.44 + (i % 4) * 0.05 : 0.34;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        } else {
          const angle = t * Math.PI * 28;
          const ringR = altMode ? 0.62 : 0.48 + (i % 3) * 0.04;
          x = Math.cos(angle) * ringR;
          y = Math.sin(angle) * ringR * 0.25;
          z = Math.sin(angle) * ringR;
        }
        break;
      }

      case 'terminal': {
        if (i < count * 0.22) {
          const edge = i % 4;
          const p = ((i * 13) % 100) / 100;
          const w = 0.52;
          const h = 0.31;
          if (edge === 0) { x = -w + p * w * 2; y = -h; }
          else if (edge === 1) { x = -w + p * w * 2; y = h; }
          else if (edge === 2) { x = -w; y = -h + p * h * 2; }
          else { x = w; y = -h + p * h * 2; }
          z = -0.04;
        } else {
          const row = i % 15;
          const col = Math.floor(i / 15) % 44;
          const tabShift = altMode ? ((row % 3) + 1) * 0.075 : 0;
          x = -0.45 + (col / 44) * 0.84 + tabShift;
          y = -0.24 + (row / 15) * 0.48;
          z = altMode ? Math.sin(col * 0.3) * 0.07 : 0;
        }
        break;
      }

      case 'table': {
        const cellIndex = i % 5;
        const p = ((i * 29) % 200) / 200;
        const edge = i % 4;
        const cells = [
          { cx: 0.0, cy: -0.23, cw: 0.48, ch: 0.06, cz: 0 },
          { cx: -0.34, cy: 0.02, cw: 0.14, ch: 0.15, cz: 0.04 },
          { cx: 0.01, cy: 0.02, cw: 0.18, ch: 0.15, cz: -0.03 },
          { cx: 0.35, cy: 0.02, cw: 0.13, ch: 0.15, cz: 0.05 },
          { cx: 0.0, cy: 0.25, cw: 0.48, ch: 0.05, cz: -0.02 },
        ];
        const c = cells[cellIndex];
        const explode = altMode ? 1.32 : 1.0;
        const zBoost = altMode ? (cellIndex - 2) * 0.16 : c.cz;

        if (i % 3 === 0) {
          x = c.cx * explode + (Math.random() - 0.5) * c.cw * 1.8;
          y = c.cy * explode + (Math.random() - 0.5) * c.ch * 1.8;
        } else {
          if (edge === 0) { x = c.cx * explode - c.cw + p * c.cw * 2; y = c.cy * explode - c.ch; }
          else if (edge === 1) { x = c.cx * explode - c.cw + p * c.cw * 2; y = c.cy * explode + c.ch; }
          else if (edge === 2) { x = c.cx * explode - c.cw; y = c.cy * explode - c.ch + p * c.ch * 2; }
          else { x = c.cx * explode + c.cw; y = c.cy * explode - c.ch + p * c.ch * 2; }
        }
        z = zBoost;
        break;
      }

      case 'cascade': {
        const layer = i % 3;
        const spread = altMode ? 0.3 : 0.12;
        const lx = (layer - 1) * spread;
        const lz = (layer - 1) * (altMode ? 0.25 : 0.1);

        if (layer < 2) {
          const gx = ((i * 17) % 28) / 28 - 0.5;
          const gy = (Math.floor(i / 28) % 24) / 24 - 0.5;
          x = lx + gx * 0.56;
          y = gy * 0.42;
          z = lz + gx * 0.22;
        } else {
          const waveX = (t - 0.5) * 1.1;
          const freq = altMode ? 18.0 : 10.0;
          x = waveX;
          y = Math.sin(waveX * freq + (i % 7)) * 0.19;
          z = lz + Math.cos(waveX * 8.0) * 0.12;
        }
        break;
      }

      case 'responsive': {
        if (!altMode) {
          const col = i % 12;
          const row = Math.floor(i / 12);
          const maxRows = Math.ceil(count / 12);
          const colCenter = -0.5 + (col / 11) * 1.0;
          x = colCenter + ((i % 2) - 0.5) * 0.032;
          y = ((row / maxRows) - 0.5) * 0.52;
          z = Math.sin(col * 0.5) * 0.035;
        } else {
          if (i < count * 0.35) {
            const p = i / (count * 0.35);
            const angle = p * Math.PI * 2;
            const pw = 0.22;
            const ph = 0.36;
            x = Math.sign(Math.cos(angle)) * Math.pow(Math.abs(Math.cos(angle)), 0.35) * pw;
            y = Math.sign(Math.sin(angle)) * Math.pow(Math.abs(Math.sin(angle)), 0.35) * ph;
            z = 0.04;
          } else {
            const cardIdx = i % 3;
            const cy = -0.19 + cardIdx * 0.19;
            x = (Math.random() - 0.5) * 0.32;
            y = cy + (Math.random() - 0.5) * 0.12;
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

        if (!altMode) {
          const tile = i % 4;
          const tx = (tile % 2 === 0 ? -0.24 : 0.24) + ix * 0.38;
          const ty = (tile < 2 ? -0.15 : 0.15) + iy * 0.24;
          x = tx;
          y = ty;
          z = 0.0;
        } else {
          x = ix * 0.56;
          y = iy * 0.56;
          z = iz * 0.56;
        }
        break;
      }

      case 'wave3d': {
        const cols = 48;
        const rows = Math.floor(count / cols);
        const u = (i % cols) / cols - 0.5;
        const v = Math.floor(i / cols) / rows - 0.5;

        if (altMode) {
          const a = t * Math.PI * 2 * 3;
          const b = t * Math.PI * 2 * 7;
          const r = 0.28 + 0.12 * Math.cos(b);
          x = r * Math.cos(a) * 1.15;
          y = r * Math.sin(a) * 0.75;
          z = 0.15 * Math.sin(b);
        } else {
          const dist = Math.sqrt(u * u + v * v);
          x = u * 1.1;
          z = v * 0.85;
          y = Math.sin(dist * 14.0) * 0.15;
        }
        break;
      }

      case 'neural': {
        const cluster = i % 7;
        const centers = [
          [0, 0, 0],
          [-0.38, -0.15, 0.1],
          [0.38, -0.15, -0.1],
          [-0.3, 0.18, -0.12],
          [0.3, 0.18, 0.12],
          [0, -0.24, 0.16],
          [0, 0.24, -0.16],
        ];
        const [cx, cy, cz] = centers[cluster];
        const rad = (altMode ? 0.2 : 0.13) * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        x = cx + rad * Math.sin(phi) * Math.cos(theta);
        y = cy + rad * Math.sin(phi) * Math.sin(theta);
        z = cz + rad * Math.cos(phi);
        break;
      }

      case 'singularity': {
        const arm = i % 4;
        const radius = Math.pow(t, 0.65) * (altMode ? 0.82 : 0.48);
        const spin = radius * (altMode ? 4.0 : 12.0) + (arm * Math.PI) / 2;

        x = Math.cos(spin) * radius * 1.1;
        y = (Math.random() - 0.5) * (altMode ? 0.55 : 0.1 * (1 - t * 0.7));
        z = Math.sin(spin) * radius;
        break;
      }
    }

    coords[i * 3] = x;
    coords[i * 3 + 1] = y - 0.02;
    coords[i * 3 + 2] = z;
  }

  return coords;
}

/**
 * Generates 6 dense orbiting Particle Satellite Clusters (200 particles each)
 * corresponding to the 6 historical ParticleInfoNodes of the active era
 */
function generateSatelliteClusters(
  eraIndex: number,
  selectedNodeIdx: number | null,
  count: number
): Float32Array {
  const coords = new Float32Array(count * 3);
  const era = ERAS[eraIndex] || ERAS[0];
  const nodes = era.particleNodes;
  const perNode = Math.floor(count / nodes.length);

  for (let n = 0; n < nodes.length; n++) {
    const node = nodes[n];
    const isSelected = selectedNodeIdx === n;
    const baseRadius = isSelected ? 0.068 : 0.038;

    for (let j = 0; j < perNode; j++) {
      const idx = (n * perNode + j) * 3;
      const angle = (j / perNode) * Math.PI * 2 * 3;
      // Inner core + outer orbital ring per satellite
      const ring = j % 2 === 0 ? baseRadius : baseRadius * 0.45 * Math.random();
      coords[idx] = node.anchorX + Math.cos(angle) * ring;
      coords[idx + 1] = node.anchorY + Math.sin(angle) * ring * 0.85 - 0.02;
      coords[idx + 2] = node.anchorZ + Math.sin(angle * 2) * 0.03;
    }
  }

  return coords;
}

/**
 * Generates Particle Telemetry Histogram Bars along the middle-bottom horizon
 */
function generateHistogramCoordinates(
  complexityScore: number,
  count: number
): Float32Array {
  const coords = new Float32Array(count * 3);
  const bars = 40;
  const perBar = Math.floor(count / bars);
  const activeBars = Math.round((complexityScore / 100) * bars);

  for (let b = 0; b < bars; b++) {
    const bx = -0.78 + (b / (bars - 1)) * 1.56;
    const isFilled = b <= activeBars;
    const barHeight = isFilled
      ? 0.03 + Math.sin((b / bars) * Math.PI) * 0.055 * (complexityScore / 100)
      : 0.008;

    for (let j = 0; j < perBar; j++) {
      const idx = (b * perBar + j) * 3;
      const ratio = j / perBar;
      coords[idx] = bx + (Math.random() - 0.5) * 0.006;
      coords[idx + 1] = 0.34 - ratio * barHeight;
      coords[idx + 2] = 0;
    }
  }

  return coords;
}

export const ParticleEngine: React.FC<ParticleEngineProps> = ({
  activeEraIndex,
  scrollProgress,
  scrollVelocity,
  isAltMode,
  customWord,
  selectedNodeIndex,
  onSelectNode,
  onCanvasClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stateRef = useRef({
    activeEraIndex,
    scrollProgress,
    scrollVelocity,
    isAltMode,
    customWord,
    selectedNodeIndex,
    onSelectNode,
    onCanvasClick,
  });

  useEffect(() => {
    stateRef.current = {
      activeEraIndex,
      scrollProgress,
      scrollVelocity,
      isAltMode,
      customWord,
      selectedNodeIndex,
      onSelectNode,
      onCanvasClick,
    };
  }, [
    activeEraIndex,
    scrollProgress,
    scrollVelocity,
    isAltMode,
    customWord,
    selectedNodeIndex,
    onSelectNode,
    onCanvasClick,
  ]);

  const targetsRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES * 3));
  const currentRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES * 3));
  const velocityRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES * 3));
  const shadesRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES));
  const sizesRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES));

  // Recompute target positions when era, mode, customWord, or selectedNodeIndex changes
  useEffect(() => {
    const era = ERAS[activeEraIndex] || ERAS[0];
    const selectedNode =
      selectedNodeIndex !== null ? era.particleNodes[selectedNodeIndex] : null;

    // If user clicked/locked a satellite node, morph the main particle word to show that node's title!
    const displayWord =
      activeEraIndex === 8 && customWord.trim().length > 0 && selectedNode === null
        ? customWord.trim().slice(0, 14)
        : selectedNode
          ? selectedNode.title.slice(0, 15)
          : isAltMode
            ? era.particleAltWord
            : era.particleWord;

    const subHeader = selectedNode
      ? `${selectedNode.code} // ${selectedNode.year} // ${selectedNode.metric}`
      : `CHAPTER ${era.chapter} // ${era.year} // ${era.particleSubtext}`;

    // 1. Cohort A: Text & Flanking Glyphs
    const textTargets = sampleTextAndGlyphs(
      displayWord,
      subHeader,
      era.leftParticleGlyph,
      era.rightParticleGlyph,
      TEXT_PARTICLES
    );

    // 2. Cohort B: 3D Sculpture
    const sculptTargets = generateSculptureCoordinates(
      era.shapeType,
      isAltMode,
      SCULPT_PARTICLES
    );

    // 3. Cohort C: 6 Orbiting Particle Info Satellites
    const satelliteTargets = generateSatelliteClusters(
      activeEraIndex,
      selectedNodeIndex,
      SATELLITE_PARTICLES
    );

    // 4. Cohort D: Particle Telemetry Histogram
    const histTargets = generateHistogramCoordinates(
      era.telemetry.complexityScore,
      HISTOGRAM_PARTICLES
    );

    const targets = targetsRef.current;
    let offset = 0;

    targets.set(textTargets, offset);
    offset += TEXT_PARTICLES * 3;

    targets.set(sculptTargets, offset);
    offset += SCULPT_PARTICLES * 3;

    targets.set(satelliteTargets, offset);
    offset += SATELLITE_PARTICLES * 3;

    targets.set(histTargets, offset);
    offset += HISTOGRAM_PARTICLES * 3;

    // 5. Cohort E: Ambient Horizontal Stream
    for (let i = offset / 3; i < TOTAL_PARTICLES; i++) {
      targets[i * 3] = (Math.random() - 0.5) * 2.3;
      targets[i * 3 + 1] = (Math.random() - 0.5) * 1.9;
      targets[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
  }, [activeEraIndex, isAltMode, customWord, selectedNodeIndex]);

  // Main 60FPS Hardware Canvas Loop
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

    const satStart = TEXT_PARTICLES + SCULPT_PARTICLES;
    const histStart = satStart + SATELLITE_PARTICLES;
    const streamStart = histStart + HISTOGRAM_PARTICLES;

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      current[i * 3] = (Math.random() - 0.5) * 2.4;
      current[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
      current[i * 3 + 2] = (Math.random() - 0.5) * 1.2;

      if (i < TEXT_PARTICLES) {
        shades[i] = 0.88 + Math.random() * 0.12;
        sizes[i] = 1.55 + Math.random() * 0.65;
      } else if (i < satStart) {
        shades[i] = 0.42 + Math.random() * 0.55;
        sizes[i] = 1.35 + Math.random() * 1.0;
      } else if (i < histStart) {
        // Satellite info cluster particles: bright white/silver
        shades[i] = 0.78 + Math.random() * 0.22;
        sizes[i] = 1.5 + Math.random() * 0.9;
      } else if (i < streamStart) {
        // Histogram particles
        shades[i] = 0.65 + Math.random() * 0.35;
        sizes[i] = 1.5;
      } else {
        shades[i] = 0.16 + Math.random() * 0.32;
        sizes[i] = 1.0 + Math.random() * 0.7;
      }
    }

    // Track projected 2D positions of the 6 satellite nodes for hover/click detection
    const satelliteScreenPos: { x: number; y: number }[] = Array.from({ length: 6 }, () => ({
      x: 0,
      y: 0,
    }));
    let hoveredNodeIdx: number | null = null;

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

      // Check proximity to any of the 6 satellite info nodes
      let foundHover: number | null = null;
      for (let n = 0; n < 6; n++) {
        const sx = satelliteScreenPos[n].x;
        const sy = satelliteScreenPos[n].y;
        const dx = e.clientX - sx;
        const dy = e.clientY - sy;
        if (dx * dx + dy * dy < 58 * 58) {
          foundHover = n;
          break;
        }
      }
      hoveredNodeIdx = foundHover;
      if (canvas) {
        canvas.style.cursor = foundHover !== null ? 'pointer' : 'crosshair';
      }
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

      // Check if user clicked on one of the 6 Satellite Particle Info Nodes
      for (let n = 0; n < 6; n++) {
        const sx = satelliteScreenPos[n].x;
        const sy = satelliteScreenPos[n].y;
        const dx = e.clientX - sx;
        const dy = e.clientY - sy;
        if (dx * dx + dy * dy < 64 * 64) {
          const currentSelected = stateRef.current.selectedNodeIndex;
          stateRef.current.onSelectNode(currentSelected === n ? null : n);
          stateRef.current.onCanvasClick?.();
          shockwave.x = sx;
          shockwave.y = sy;
          shockwave.radius = 8;
          shockwave.alpha = 1.0;
          shockwave.active = true;
          return;
        }
      }

      // Otherwise trigger general shockwave
      shockwave.x = e.clientX;
      shockwave.y = e.clientY;
      shockwave.radius = 5;
      shockwave.alpha = 0.85;
      shockwave.active = true;

      const clickNormX = (e.clientX / width) * 2 - 1;
      const clickNormY = (e.clientY / height) * 2 - 1;
      const vel = velocityRef.current;

      for (let i = 0; i < TOTAL_PARTICLES; i++) {
        const dx = current[i * 3] - clickNormX;
        const dy = current[i * 3 + 1] - clickNormY;
        const distSq = dx * dx + dy * dy + 0.01;
        if (distSq < 0.32) {
          const force = (0.042 / Math.sqrt(distSq)) * (1 - distSq / 0.32);
          vel[i * 3] += (dx / Math.sqrt(distSq)) * force;
          vel[i * 3 + 1] += (dy / Math.sqrt(distSq)) * force;
          vel[i * 3 + 2] += (Math.random() - 0.5) * 0.035;
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
      time += 0.014;
      const {
        activeEraIndex: eraIdx,
        scrollVelocity: sVel,
        isAltMode: alt,
        selectedNodeIndex: selNodeIdx,
      } = stateRef.current;
      const era = ERAS[eraIdx] || ERAS[0];
      const activeNodeIdx = hoveredNodeIdx !== null ? hoveredNodeIdx : selNodeIdx;

      // 1. Pure Black Background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // 2. Monochrome Architectural Grid & Coordinate Hairlines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.028)';
      ctx.lineWidth = 1;
      const gridStep = 80;
      const parallaxOffset = (stateRef.current.scrollProgress * 2600) % gridStep;

      ctx.beginPath();
      for (let gx = -parallaxOffset; gx < width; gx += gridStep) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
      }
      ctx.moveTo(0, height * 0.44);
      ctx.lineTo(width, height * 0.44);
      ctx.stroke();

      // 3. 3D Rotation for Central Sculpture
      const rotY =
        era.shapeType === 'terminal' || era.shapeType === 'table' || (era.shapeType === 'flat' && !alt)
          ? Math.sin(time * 0.5) * 0.16 + (mouse.active ? mouse.normX * 0.2 : 0)
          : time * 0.3 + (mouse.active ? mouse.normX * 0.4 : 0);

      const rotX =
        era.shapeType === 'wave3d'
          ? 0.42 + (mouse.active ? mouse.normY * 0.18 : 0)
          : Math.cos(time * 0.4) * 0.09 + (mouse.active ? mouse.normY * 0.18 : 0);

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const vel = velocityRef.current;
      const scaleX = Math.min(width * 0.47, 740);
      const scaleY = Math.min(height * 0.45, 490);
      const centerX = width * 0.5;
      const centerY = height * 0.44;

      const horizontalWind = Math.max(-0.08, Math.min(0.08, sVel * -0.0018));
      const perSat = Math.floor(SATELLITE_PARTICLES / 6);

      // 4. Update & Project All 7,600 Particles
      for (let i = 0; i < TOTAL_PARTICLES; i++) {
        const i3 = i * 3;
        let tx = targets[i3];
        let ty = targets[i3 + 1];
        let tz = targets[i3 + 2];

        if (i >= TEXT_PARTICLES && i < satStart) {
          // Cohort B: 3D Era Sculpture
          if (era.shapeType === 'wave3d' && !alt) {
            const d = Math.sqrt(tx * tx + tz * tz);
            ty = Math.sin(d * 14.0 - time * 3.2) * 0.13 - 0.02;
          } else if (era.shapeType === 'cascade' && i % 3 === 2) {
            ty = Math.sin(tx * 12.0 + time * 4.0) * 0.16 - 0.02;
          }

          const rx = tx * cosY - tz * sinY;
          const rz1 = tx * sinY + tz * cosY;
          const ry = ty * cosX - rz1 * sinX;
          const rz2 = ty * sinX + rz1 * cosX;

          tx = rx;
          ty = ry;
          tz = rz2;
        } else if (i >= satStart && i < histStart) {
          // Cohort C: 6 Orbiting Particle Satellite Clusters
          const satIdx = Math.min(5, Math.floor((i - satStart) / perSat));
          const node = era.particleNodes[satIdx];
          if (node) {
            // Subtle orbital spin around the node's anchor
            const localX = tx - node.anchorX;
            const localY = ty - (node.anchorY - 0.02);
            const spinSpeed = activeNodeIdx === satIdx ? time * 3.2 : time * 1.1 + satIdx;
            const cs = Math.cos(spinSpeed);
            const sn = Math.sin(spinSpeed);
            tx = node.anchorX + (localX * cs - localY * sn);
            ty = node.anchorY - 0.02 + (localX * sn + localY * cs);
          }
        } else if (i >= streamStart) {
          // Cohort E: Ambient horizontal stream
          targets[i3] -= 0.0014 + horizontalWind * 0.4;
          if (targets[i3] < -1.25) targets[i3] = 1.25;
          if (targets[i3] > 1.25) targets[i3] = -1.25;
          tx = targets[i3];
        }

        const spring = i < TEXT_PARTICLES ? 0.115 : i < histStart ? 0.095 : 0.08;
        vel[i3] = (vel[i3] + (tx - current[i3]) * spring + horizontalWind * 0.11) * 0.78;
        vel[i3 + 1] = (vel[i3 + 1] + (ty - current[i3 + 1]) * spring) * 0.78;
        vel[i3 + 2] = (vel[i3 + 2] + (tz - current[i3 + 2]) * spring) * 0.78;

        current[i3] += vel[i3];
        current[i3 + 1] += vel[i3 + 1];
        current[i3 + 2] += vel[i3 + 2];

        const perspective = 1.85 / (1.85 - current[i3 + 2]);
        let sx = centerX + current[i3] * scaleX * perspective;
        let sy = centerY + current[i3 + 1] * scaleY * perspective;

        // Cursor Vortex & Repulsion
        if (mouse.active) {
          const dx = sx - mouse.x;
          const dy = sy - mouse.y;
          const distSq = dx * dx + dy * dy;
          const maxR = 125;
          if (distSq < maxR * maxR && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const factor = 1 - dist / maxR;
            sx += (dx / dist) * factor * 22 - (dy / dist) * factor * 8;
            sy += (dy / dist) * factor * 22 + (dx / dist) * factor * 8;
          }
        }

        screenX[i] = sx;
        screenY[i] = sy;

        const depthBoost = Math.max(0.25, Math.min(1.25, perspective));
        const brightness = Math.min(255, Math.floor(shades[i] * depthBoost * 255));
        const alpha = i < TEXT_PARTICLES ? 0.94 : Math.min(0.92, shades[i] * depthBoost);
        const size = sizes[i] * (i < TEXT_PARTICLES ? 1.0 : perspective * 0.92);
        const streak = Math.min(16, Math.abs(sVel) * 0.32);

        ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha.toFixed(2)})`;
        ctx.fillRect(sx - size * 0.5, sy - size * 0.5, size + streak, size);
      }

      // 5. Wireframe & Neural Connections inside Sculpture
      ctx.lineWidth = 0.65;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      const step = era.shapeType === 'neural' ? 5 : 10;
      for (let i = TEXT_PARTICLES; i < satStart - step; i += step) {
        const x1 = screenX[i];
        const y1 = screenY[i];
        const x2 = screenX[i + 1];
        const y2 = screenY[i + 1];
        if ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) < 3800) {
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
      }
      ctx.stroke();

      // 6. Render the 6 Interactive Particle Information Satellites & Live Data Readouts
      era.particleNodes.forEach((node, nIdx) => {
        const perspective = 1.85 / (1.85 - node.anchorZ);
        const nx = centerX + node.anchorX * scaleX * perspective;
        const ny = centerY + (node.anchorY - 0.02) * scaleY * perspective;
        satelliteScreenPos[nIdx].x = nx;
        satelliteScreenPos[nIdx].y = ny;

        const isFocused = activeNodeIdx === nIdx;
        const dir = node.anchorX < 0 ? -1 : 1;

        // Draw Synaptic Beam from Satellite Node to Center Sculpture
        ctx.beginPath();
        ctx.strokeStyle = isFocused ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.14)';
        ctx.lineWidth = isFocused ? 1.4 : 0.8;
        ctx.moveTo(nx, ny);
        ctx.lineTo(centerX + dir * 45, centerY);
        ctx.stroke();

        // Travelling Data Packet Particle along the beam
        const packetT = (time * (isFocused ? 1.8 : 0.7) + nIdx * 0.17) % 1;
        const px = nx + (centerX + dir * 45 - nx) * packetT;
        const py = ny + (centerY - ny) * packetT;
        ctx.fillStyle = isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.65)';
        ctx.fillRect(px - 2, py - 2, 4, 4);

        // Reticle Box around the Satellite Particle Cluster
        const boxSize = isFocused ? 28 : 18;
        ctx.strokeStyle = isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = isFocused ? 1.4 : 0.9;
        ctx.strokeRect(nx - boxSize / 2, ny - boxSize / 2, boxSize, boxSize);

        // Center Node Dot
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(nx - 2.5, ny - 2.5, 5, 5);

        // Desktop / Tablet Particle Info Callout Label
        if (width >= 720) {
          const labelX = nx + dir * (boxSize / 2 + 10);
          ctx.textAlign = dir < 0 ? 'right' : 'left';

          // Line 1: Code + Year
          ctx.font = '700 9px "JetBrains Mono", monospace';
          ctx.fillStyle = isFocused ? '#ffffff' : '#a3a3a3';
          ctx.fillText(`[${node.code} // ${node.year}]`, labelX, ny - 12);

          // Line 2: Title
          ctx.font = '800 11px "DM Sans", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(node.title, labelX, ny + 1);

          // Line 3: Metric
          ctx.font = '600 9px "JetBrains Mono", monospace';
          ctx.fillStyle = isFocused ? '#e5e5e5' : '#737373';
          ctx.fillText(node.metric, labelX, ny + 13);

          // Expanded Detail Box when Hovered or Clicked
          if (isFocused) {
            ctx.font = '500 10px "DM Sans", sans-serif';
            ctx.fillStyle = '#d4d4d4';
            ctx.fillText(node.detail, labelX, ny + 27);
          }
        }
      });

      // 7. Draw Live Particle Code Matrix & Telemetry Strip on Canvas (Desktop)
      if (width >= 1024) {
        // Left Archival Code Artifacts Panel on Canvas
        const leftX = 32;
        const topY = height * 0.2;
        ctx.textAlign = 'left';
        ctx.font = '700 9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#737373';
        ctx.fillText(`// ARCHIVAL SYNTAX STREAM [${era.chapter}]`, leftX, topY);

        era.codeArtifacts.forEach((line, idx) => {
          ctx.font = '500 10px "JetBrains Mono", monospace';
          ctx.fillStyle = idx === 0 ? '#e5e5e5' : '#8a8a8a';
          ctx.fillText(line, leftX, topY + 18 + idx * 15);
        });

        // Right Quantitative Telemetry Readout on Canvas
        const rightX = width - 32;
        ctx.textAlign = 'right';
        ctx.font = '700 9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#737373';
        ctx.fillText(`// ERA TELEMETRY METRICS [${era.year}]`, rightX, topY);

        const metrics = [
          `WEIGHT: ${era.telemetry.pageWeight}`,
          `SPEED: ${era.telemetry.bandwidth}`,
          `STACK: ${era.telemetry.coreStack}`,
          `VIEW: ${era.telemetry.displayStandard}`,
          `INPUT: ${era.telemetry.inputParadigm}`,
        ];
        metrics.forEach((m, idx) => {
          ctx.font = '500 10px "JetBrains Mono", monospace';
          ctx.fillStyle = idx === 0 ? '#e5e5e5' : '#8a8a8a';
          ctx.fillText(m, rightX, topY + 18 + idx * 14);
        });

        // Histogram Label
        const histY = centerY + 0.36 * scaleY;
        ctx.textAlign = 'center';
        ctx.font = '600 9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#737373';
        ctx.fillText(
          `PARTICLE COMPLEXITY INDEX: ${era.telemetry.complexityScore}% // CLICK ANY SATELLITE NODE [01–06] TO MORPH PARTICLE WORD`,
          centerX,
          histY + 14
        );
      }

      // 8. Cursor Proximity Constellation Filaments
      if (mouse.active) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        let connected = 0;
        for (let i = 0; i < TOTAL_PARTICLES; i += 6) {
          const dx = screenX[i] - mouse.x;
          const dy = screenY[i] - mouse.y;
          if (dx * dx + dy * dy < 11000) {
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(screenX[i], screenY[i]);
            connected++;
            if (connected > 26) break;
          }
        }
        ctx.stroke();
      }

      // 9. Expanding Click Shockwave Ring
      if (shockwave.active) {
        shockwave.radius += 14;
        shockwave.alpha *= 0.91;
        ctx.strokeStyle = `rgba(255, 255, 255, ${shockwave.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.2;
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
