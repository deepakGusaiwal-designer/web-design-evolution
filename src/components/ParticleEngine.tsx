import React, { useEffect, useRef } from 'react';
import { ERAS, type ParticleShapeType } from '../data/eras';

interface ParticleEngineProps {
  activeEraIndex: number;
  scrollProgress: number; // 0 to 1 across entire horizontal track
  scrollVelocity: number; // horizontal scroll speed
  isAltMode: boolean;     // interactive toggle per era
  customWord: string;     // user-typed word for Era 08
  onCanvasClick?: () => void;
}

const TOTAL_PARTICLES = 4800;
const TEXT_PARTICLES = 2100;      // 0 .. 2099: Rasterized Typography & Era Year
const SCULPT_PARTICLES = 2100;    // 2100 .. 4199: 3D Era Architectural Sculpture
// 4200 .. 4799 (600 particles): Horizontal Parallax Stream

/**
 * Samples text onto an offscreen canvas and returns normalized [-1, 1] coordinates
 */
function sampleTextCoordinates(
  mainText: string,
  subText: string,
  count: number
): Float32Array {
  const result = new Float32Array(count * 3);
  const canvas = document.createElement('canvas');
  const w = 900;
  const h = 280;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (!ctx) return result;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  // Draw small sub-header at top
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText(subText, w / 2, 46);

  // Draw monumental main word
  const fontSize = mainText.length > 10 ? 96 : mainText.length > 7 ? 114 : 132;
  ctx.font = `900 ${fontSize}px "DM Sans", sans-serif`;
  ctx.fillText(mainText.toUpperCase(), w / 2, 165);

  const imgData = ctx.getImageData(0, 0, w, h).data;
  const validPixels: { x: number; y: number; isHeader: boolean }[] = [];

  // Step by 2 pixels for dense sampling
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const idx = (y * w + x) * 4;
      if (imgData[idx] > 128) {
        validPixels.push({
          x: (x / w) * 2 - 1, // -1 to 1
          y: (y / h) * 2 - 1, // -1 to 1
          isHeader: y < 80,
        });
      }
    }
  }

  if (validPixels.length === 0) return result;

  for (let i = 0; i < count; i++) {
    const sample = validPixels[(i * 73) % validPixels.length];
    const jitterX = (Math.random() - 0.5) * 0.004;
    const jitterY = (Math.random() - 0.5) * 0.004;

    // Position text cluster in the upper-middle of the viewport
    result[i * 3] = sample.x * 0.72 + jitterX;
    result[i * 3 + 1] = sample.y * 0.22 - 0.52 + jitterY;
    result[i * 3 + 2] = sample.isHeader ? -0.05 : (Math.random() - 0.5) * 0.04;
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
        // 3D Orbital Globe with Equatorial Rings
        if (i < count * 0.72) {
          const phi = Math.acos(1 - (2 * (i % Math.floor(count * 0.72))) / (count * 0.72));
          const theta = Math.PI * (1 + Math.sqrt(5)) * i;
          const r = altMode ? 0.48 + (i % 5) * 0.06 : 0.38;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        } else {
          // Orbital data ring
          const angle = t * Math.PI * 24;
          const ringR = altMode ? 0.68 : 0.54 + (i % 3) * 0.04;
          x = Math.cos(angle) * ringR;
          y = Math.sin(angle) * ringR * 0.28;
          z = Math.sin(angle) * ringR;
        }
        break;
      }

      case 'terminal': {
        // 1989 CRT Terminal Screen + 80x24 Monospace [TAB] Matrix
        if (i < count * 0.25) {
          // Outer CRT Bezel Wireframe
          const edge = i % 4;
          const p = ((i * 13) % 100) / 100;
          const w = 0.62;
          const h = 0.36;
          if (edge === 0) { x = -w + p * w * 2; y = -h; }
          else if (edge === 1) { x = -w + p * w * 2; y = h; }
          else if (edge === 2) { x = -w; y = -h + p * h * 2; }
          else { x = w; y = -h + p * h * 2; }
          z = -0.05;
        } else {
          // Monospace character rows & columns shifted by [TAB] key in altMode
          const row = i % 14;
          const col = Math.floor(i / 14) % 42;
          const tabShift = altMode ? ((row % 3) + 1) * 0.08 : 0;
          x = -0.52 + (col / 42) * 0.96 + tabShift;
          y = -0.28 + (row / 14) * 0.56;
          z = altMode ? Math.sin(col * 0.3) * 0.08 : 0;
        }
        break;
      }

      case 'table': {
        // 1994 Nested <table> Bento Grid Wireframe
        const cellIndex = i % 5;
        const p = ((i * 29) % 200) / 200;
        const edge = i % 4;
        // 5 classic table cells: Header, Left Nav, Main Content, Right Ad, Footer
        const cells = [
          { cx: 0.0, cy: -0.26, cw: 0.58, ch: 0.07, cz: 0 },     // Header <tr>
          { cx: -0.4, cy: 0.02, cw: 0.18, ch: 0.18, cz: 0.05 },  // Sidebar <td>
          { cx: 0.02, cy: 0.02, cw: 0.22, ch: 0.18, cz: -0.04 }, // Main <td>
          { cx: 0.42, cy: 0.02, cw: 0.16, ch: 0.18, cz: 0.06 },  // Spacer/Ad <td>
          { cx: 0.0, cy: 0.28, cw: 0.58, ch: 0.06, cz: -0.02 },  // Footer <tr>
        ];
        const c = cells[cellIndex];
        const explode = altMode ? 1.35 : 1.0;
        const zBoost = altMode ? (cellIndex - 2) * 0.18 : c.cz;

        if (i % 3 === 0) {
          // Interior grid dots
          x = c.cx * explode + (Math.random() - 0.5) * c.cw * 1.8;
          y = c.cy * explode + (Math.random() - 0.5) * c.ch * 1.8;
        } else {
          // Sharp cell border lines
          if (edge === 0) { x = c.cx * explode - c.cw + p * c.cw * 2; y = c.cy * explode - c.ch; }
          else if (edge === 1) { x = c.cx * explode - c.cw + p * c.cw * 2; y = c.cy * explode + c.ch; }
          else if (edge === 2) { x = c.cx * explode - c.cw; y = c.cy * explode - c.ch + p * c.ch * 2; }
          else { x = c.cx * explode + c.cw; y = c.cy * explode - c.ch + p * c.ch * 2; }
        }
        z = zBoost;
        break;
      }

      case 'cascade': {
        // 1996 CSS Cascading 3D Planes + 1999 Flash Soundwave
        const layer = i % 3; // 0: HTML DOM, 1: CSS Style Sheet, 2: Flash Wave
        const spread = altMode ? 0.34 : 0.14;
        const lx = (layer - 1) * spread;
        const lz = (layer - 1) * (altMode ? 0.28 : 0.12);

        if (layer < 2) {
          // Isometric style sheets
          const gx = ((i * 17) % 28) / 28 - 0.5;
          const gy = (Math.floor(i / 28) % 24) / 24 - 0.5;
          x = lx + gx * 0.65;
          y = gy * 0.48;
          z = lz + gx * 0.25;
        } else {
          // Flash vector audio waveform ribbon
          const waveX = (t - 0.5) * 1.3;
          const freq = altMode ? 18.0 : 10.0;
          x = waveX;
          y = Math.sin(waveX * freq + (i % 7)) * 0.22;
          z = lz + Math.cos(waveX * 8.0) * 0.15;
        }
        break;
      }

      case 'responsive': {
        // 2007-2010: 12-Column Desktop Grid <-> Mobile Handset Viewport
        if (!altMode) {
          // 12-Column Responsive Desktop Grid
          const col = i % 12;
          const row = Math.floor(i / 12);
          const maxRows = Math.ceil(count / 12);
          const colCenter = -0.6 + (col / 11) * 1.2;
          x = colCenter + ((i % 2) - 0.5) * 0.04;
          y = ((row / maxRows) - 0.5) * 0.62;
          z = Math.sin(col * 0.5) * 0.04;
        } else {
          // Mobile Smartphone Viewport Frame + Single Column Touch Feed
          if (i < count * 0.35) {
            // Rounded Phone Bezel
            const p = i / (count * 0.35);
            const angle = p * Math.PI * 2;
            const pw = 0.24;
            const ph = 0.42;
            // Superellipse mobile phone contour
            x = Math.sign(Math.cos(angle)) * Math.pow(Math.abs(Math.cos(angle)), 0.35) * pw;
            y = Math.sign(Math.sin(angle)) * Math.pow(Math.abs(Math.sin(angle)), 0.35) * ph;
            z = 0.05;
          } else {
            // Stacked mobile cards inside viewport
            const cardIdx = i % 3;
            const cy = -0.22 + cardIdx * 0.22;
            x = (Math.random() - 0.5) * 0.36;
            y = cy + (Math.random() - 0.5) * 0.14;
            z = 0;
          }
        }
        break;
      }

      case 'flat': {
        // 2013 Skeuomorphic 3D Beveled Cube <-> Compressed 2D Flat Swiss Grid
        const side = Math.cbrt(count);
        const ix = (i % side) / side - 0.5;
        const iy = (Math.floor(i / side) % side) / side - 0.5;
        const iz = (Math.floor(i / (side * side)) % side) / side - 0.5;

        if (!altMode) {
          // Crisp 2D Flat Swiss Bauhaus Plane (Z = 0)
          const tile = i % 4;
          const tx = (tile % 2 === 0 ? -0.28 : 0.28) + ix * 0.44;
          const ty = (tile < 2 ? -0.18 : 0.18) + iy * 0.28;
          x = tx;
          y = ty;
          z = 0.0; // Strictly flat 2D!
        } else {
          // Heavy Extruded 3D Volume Cube
          x = ix * 0.65;
          y = iy * 0.65;
          z = iz * 0.65;
        }
        break;
      }

      case 'wave3d': {
        // 2019 WebGL Silicon GPU Shader Topographical Wave + Torus
        const cols = 48;
        const rows = Math.floor(count / cols);
        const u = (i % cols) / cols - 0.5;
        const v = Math.floor(i / cols) / rows - 0.5;

        if (altMode) {
          // 3D Torus Knot / Shader Tube
          const a = t * Math.PI * 2 * 3;
          const b = t * Math.PI * 2 * 7;
          const r = 0.32 + 0.14 * Math.cos(b);
          x = r * Math.cos(a) * 1.3;
          y = r * Math.sin(a) * 0.85;
          z = 0.18 * Math.sin(b);
        } else {
          // Topographical GPU Wave Surface
          const dist = Math.sqrt(u * u + v * v);
          x = u * 1.35;
          z = v * 0.95;
          y = Math.sin(dist * 14.0) * 0.18;
        }
        break;
      }

      case 'neural': {
        // 2024 AI Synaptic Neural Constellation
        const cluster = i % 7;
        const centers = [
          [0, 0, 0],
          [-0.45, -0.18, 0.12],
          [0.45, -0.18, -0.12],
          [-0.35, 0.22, -0.15],
          [0.35, 0.22, 0.15],
          [0, -0.28, 0.2],
          [0, 0.28, -0.2],
        ];
        const [cx, cy, cz] = centers[cluster];
        const rad = (altMode ? 0.24 : 0.16) * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        x = cx + rad * Math.sin(phi) * Math.cos(theta);
        y = cy + rad * Math.sin(phi) * Math.sin(theta);
        z = cz + rad * Math.cos(phi);
        break;
      }

      case 'singularity': {
        // 2026+ Cosmic Singularity Vortex / Supernova
        const arm = i % 4;
        const radius = Math.pow(t, 0.65) * (altMode ? 0.95 : 0.58);
        const spin = radius * (altMode ? 4.0 : 12.0) + (arm * Math.PI) / 2;

        x = Math.cos(spin) * radius * 1.2;
        y = (Math.random() - 0.5) * (altMode ? 0.65 : 0.12 * (1 - t * 0.7));
        z = Math.sin(spin) * radius;
        break;
      }
    }

    // Center the 3D sculpture in the middle-vertical band of the screen
    coords[i * 3] = x;
    coords[i * 3 + 1] = y + 0.02;
    coords[i * 3 + 2] = z;
  }

  return coords;
}

export const ParticleEngine: React.FC<ParticleEngineProps> = ({
  activeEraIndex,
  scrollProgress,
  scrollVelocity,
  isAltMode,
  customWord,
  onCanvasClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Live reactive refs for the 60fps animation loop
  const stateRef = useRef({
    activeEraIndex,
    scrollProgress,
    scrollVelocity,
    isAltMode,
    customWord,
    onCanvasClick,
  });

  useEffect(() => {
    stateRef.current = {
      activeEraIndex,
      scrollProgress,
      scrollVelocity,
      isAltMode,
      customWord,
      onCanvasClick,
    };
  }, [activeEraIndex, scrollProgress, scrollVelocity, isAltMode, customWord, onCanvasClick]);

  // Target buffer cache
  const targetsRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES * 3));
  const currentRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES * 3));
  const velocityRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES * 3));
  const shadesRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES));
  const sizesRef = useRef<Float32Array>(new Float32Array(TOTAL_PARTICLES));

  // Recompute target positions whenever activeEraIndex, isAltMode, or customWord changes
  useEffect(() => {
    const era = ERAS[activeEraIndex] || ERAS[0];
    const displayWord =
      activeEraIndex === 8 && customWord.trim().length > 0
        ? customWord.trim().slice(0, 14)
        : isAltMode
          ? era.particleAltWord
          : era.particleWord;

    const subHeader = `CHAPTER ${era.chapter} // ${era.year} // ${era.particleSubtext}`;

    // 1. Sample Typography Particles (0 .. TEXT_PARTICLES - 1)
    const textTargets = sampleTextCoordinates(displayWord, subHeader, TEXT_PARTICLES);

    // 2. Generate 3D Sculpture Particles (TEXT_PARTICLES .. TEXT_PARTICLES + SCULPT_PARTICLES - 1)
    const sculptTargets = generateSculptureCoordinates(era.shapeType, isAltMode, SCULPT_PARTICLES);

    const targets = targetsRef.current;
    for (let i = 0; i < TEXT_PARTICLES * 3; i++) {
      targets[i] = textTargets[i];
    }
    for (let i = 0; i < SCULPT_PARTICLES * 3; i++) {
      targets[TEXT_PARTICLES * 3 + i] = sculptTargets[i];
    }

    // 3. Ambient Horizontal Stream Particles (4200 .. 4799)
    for (let i = TEXT_PARTICLES + SCULPT_PARTICLES; i < TOTAL_PARTICLES; i++) {
      targets[i * 3] = (Math.random() - 0.5) * 2.2;
      targets[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
      targets[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
  }, [activeEraIndex, isAltMode, customWord]);

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

    // Initialize particles dispersed in monochrome space
    const current = currentRef.current;
    const targets = targetsRef.current;
    const shades = shadesRef.current;
    const sizes = sizesRef.current;

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      current[i * 3] = (Math.random() - 0.5) * 2.5;
      current[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
      current[i * 3 + 2] = (Math.random() - 0.5) * 1.2;

      // Monochrome brightness: Text particles are crisp white (0.9-1.0), sculpture particles are layered gray/white (0.45-0.95)
      if (i < TEXT_PARTICLES) {
        shades[i] = 0.85 + Math.random() * 0.15;
        sizes[i] = 1.6 + Math.random() * 0.7;
      } else if (i < TEXT_PARTICLES + SCULPT_PARTICLES) {
        shades[i] = 0.4 + Math.random() * 0.55;
        sizes[i] = 1.4 + Math.random() * 1.1;
      } else {
        shades[i] = 0.15 + Math.random() * 0.35;
        sizes[i] = 1.0 + Math.random() * 0.8;
      }
    }

    // Mouse & Shockwave state
    const mouse = {
      x: -9999,
      y: -9999,
      normX: 0,
      normY: 0,
      vx: 0,
      vy: 0,
      prevX: 0,
      prevY: 0,
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
      mouse.vx = e.clientX - mouse.prevX;
      mouse.vy = e.clientY - mouse.prevY;
      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.normX = (e.clientX / width) * 2 - 1;
      mouse.normY = (e.clientY / height) * 2 - 1;
      mouse.active = true;
    };

    const onPointerDown = (e: PointerEvent) => {
      // Ignore clicks on UI buttons/inputs
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.closest('button') || target.closest('input'))) {
        return;
      }
      shockwave.x = e.clientX;
      shockwave.y = e.clientY;
      shockwave.radius = 5;
      shockwave.alpha = 0.9;
      shockwave.active = true;

      // Radial impulse on particles near click
      const clickNormX = (e.clientX / width) * 2 - 1;
      const clickNormY = (e.clientY / height) * 2 - 1;
      const vel = velocityRef.current;

      for (let i = 0; i < TOTAL_PARTICLES; i++) {
        const dx = current[i * 3] - clickNormX;
        const dy = current[i * 3 + 1] - clickNormY;
        const distSq = dx * dx + dy * dy + 0.01;
        if (distSq < 0.35) {
          const force = (0.045 / Math.sqrt(distSq)) * (1 - distSq / 0.35);
          vel[i * 3] += (dx / Math.sqrt(distSq)) * force;
          vel[i * 3 + 1] += (dy / Math.sqrt(distSq)) * force;
          vel[i * 3 + 2] += (Math.random() - 0.5) * 0.04;
        }
      }

      stateRef.current.onCanvasClick?.();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    let rafId: number;
    let time = 0;

    // Pre-allocated screen coordinates for filament drawing
    const screenX = new Float32Array(TOTAL_PARTICLES);
    const screenY = new Float32Array(TOTAL_PARTICLES);

    const render = () => {
      time += 0.014;
      const { activeEraIndex: eraIdx, scrollVelocity: sVel, isAltMode: alt } = stateRef.current;
      const era = ERAS[eraIdx] || ERAS[0];

      // 1. Pure Obsidian Black Background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle Monochrome Architectural Grid & Axis Hairlines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridStep = 80;
      const parallaxOffset = ((stateRef.current.scrollProgress * 2400) % gridStep);

      ctx.beginPath();
      for (let gx = -parallaxOffset; gx < width; gx += gridStep) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
      }
      // Horizontal center equator hairline
      ctx.moveTo(0, height * 0.5);
      ctx.lineTo(width, height * 0.5);
      ctx.stroke();

      // 3. 3D Rotation angles for the Era Sculpture
      const rotY =
        era.shapeType === 'terminal' || era.shapeType === 'table' || (era.shapeType === 'flat' && !alt)
          ? Math.sin(time * 0.5) * 0.18 + (mouse.active ? mouse.normX * 0.22 : 0)
          : time * 0.32 + (mouse.active ? mouse.normX * 0.45 : 0);

      const rotX =
        era.shapeType === 'wave3d'
          ? 0.45 + (mouse.active ? mouse.normY * 0.2 : 0)
          : Math.cos(time * 0.4) * 0.1 + (mouse.active ? mouse.normY * 0.2 : 0);

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const vel = velocityRef.current;
      const scaleX = Math.min(width * 0.48, 680);
      const scaleY = Math.min(height * 0.46, 480);
      const centerX = width * 0.5;
      const centerY = height * 0.48;

      // Horizontal scroll velocity wind effect
      const horizontalWind = Math.max(-0.08, Math.min(0.08, sVel * -0.0018));

      // 4. Update & Project All Particles
      for (let i = 0; i < TOTAL_PARTICLES; i++) {
        const i3 = i * 3;
        let tx = targets[i3];
        let ty = targets[i3 + 1];
        let tz = targets[i3 + 2];

        if (i >= TEXT_PARTICLES && i < TEXT_PARTICLES + SCULPT_PARTICLES) {
          // Dynamic live animation on the 3D sculpture
          if (era.shapeType === 'wave3d' && !alt) {
            const d = Math.sqrt(tx * tx + tz * tz);
            ty = Math.sin(d * 14.0 - time * 3.2) * 0.14;
          } else if (era.shapeType === 'cascade' && i % 3 === 2) {
            ty = Math.sin(tx * 12.0 + time * 4.0) * 0.18;
          }

          // Apply 3D rotation to sculpture particles
          const rx = tx * cosY - tz * sinY;
          const rz1 = tx * sinY + tz * cosY;
          const ry = ty * cosX - rz1 * sinX;
          const rz2 = ty * sinX + rz1 * cosX;

          tx = rx;
          ty = ry + 0.04;
          tz = rz2;
        } else if (i >= TEXT_PARTICLES + SCULPT_PARTICLES) {
          // Ambient horizontal stream wraps around X-axis
          targets[i3] -= 0.0015 + horizontalWind * 0.4;
          if (targets[i3] < -1.2) targets[i3] = 1.2;
          if (targets[i3] > 1.2) targets[i3] = -1.2;
          tx = targets[i3];
        }

        // Spring physics toward target + horizontal scroll streak
        const spring = i < TEXT_PARTICLES ? 0.11 : 0.085;
        vel[i3] = (vel[i3] + (tx - current[i3]) * spring + horizontalWind * 0.12) * 0.78;
        vel[i3 + 1] = (vel[i3 + 1] + (ty - current[i3 + 1]) * spring) * 0.78;
        vel[i3 + 2] = (vel[i3 + 2] + (tz - current[i3 + 2]) * spring) * 0.78;

        current[i3] += vel[i3];
        current[i3 + 1] += vel[i3 + 1];
        current[i3 + 2] += vel[i3 + 2];

        // Perspective projection
        const perspective = 1.8 / (1.8 - current[i3 + 2]);
        let sx = centerX + current[i3] * scaleX * perspective;
        let sy = centerY + current[i3 + 1] * scaleY * perspective;

        // Cursor Magnetic / Repulsion Field in Screen Space
        if (mouse.active) {
          const dx = sx - mouse.x;
          const dy = sy - mouse.y;
          const distSq = dx * dx + dy * dy;
          const maxR = 135;
          if (distSq < maxR * maxR && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const factor = (1 - dist / maxR);
            // Gentle vortex + repulsion
            sx += (dx / dist) * factor * 26 - (dy / dist) * factor * 10;
            sy += (dy / dist) * factor * 26 + (dx / dist) * factor * 10;
          }
        }

        screenX[i] = sx;
        screenY[i] = sy;

        // Render Monochrome Particle (White, Silver, Gray)
        const depthBoost = Math.max(0.2, Math.min(1.2, perspective));
        const brightness = Math.min(255, Math.floor(shades[i] * depthBoost * 255));
        const alpha = i < TEXT_PARTICLES ? 0.92 : Math.min(0.9, shades[i] * depthBoost);
        const size = sizes[i] * (i < TEXT_PARTICLES ? 1.0 : perspective * 0.95);

        // Streak horizontally when scrolling fast
        const streak = Math.min(18, Math.abs(sVel) * 0.35);

        ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha.toFixed(2)})`;
        ctx.fillRect(sx - size * 0.5, sy - size * 0.5, size + streak, size);
      }

      // 5. Draw Monochrome Synaptic / Structural Connections
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.11)';
      ctx.beginPath();

      // Connect subset of sculpture nodes for wireframe / neural feel
      const step = era.shapeType === 'neural' ? 6 : 11;
      for (let i = TEXT_PARTICLES; i < TEXT_PARTICLES + SCULPT_PARTICLES - step; i += step) {
        const x1 = screenX[i];
        const y1 = screenY[i];
        const x2 = screenX[i + 1];
        const y2 = screenY[i + 1];
        const dSq = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        if (dSq < 4200) {
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
      }
      ctx.stroke();

      // 6. Draw Cursor Proximity Constellation Filaments
      if (mouse.active) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        let connected = 0;
        for (let i = 0; i < TOTAL_PARTICLES; i += 5) {
          const dx = screenX[i] - mouse.x;
          const dy = screenY[i] - mouse.y;
          if (dx * dx + dy * dy < 12000) {
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(screenX[i], screenY[i]);
            connected++;
            if (connected > 28) break;
          }
        }
        ctx.stroke();
      }

      // 7. Render Expanding Click Shockwave Ring
      if (shockwave.active) {
        shockwave.radius += 14;
        shockwave.alpha *= 0.92;
        ctx.strokeStyle = `rgba(255, 255, 255, ${shockwave.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(shockwave.x, shockwave.y, shockwave.radius, 0, Math.PI * 2);
        ctx.stroke();
        if (shockwave.alpha < 0.02) shockwave.active = false;
      }

      // 8. Draw Architectural Particle Callout Annotations on Desktop
      if (width >= 768) {
        ctx.font = '600 10px "JetBrains Mono", monospace';
        era.callouts.forEach((callout, idx) => {
          const ax = centerX + callout.anchorX * scaleX * 0.72;
          const ay = centerY + callout.anchorY * scaleY * 0.72 + Math.sin(time * 1.5 + idx) * 4;
          const dir = callout.anchorX < 0 ? -1 : 1;
          const elbowX = ax + dir * 36;
          const elbowY = ay - 18;
          const endX = elbowX + dir * 115;

          // Anchor target node
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(ax - 2.5, ay - 2.5, 5, 5);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 1;
          ctx.strokeRect(ax - 6, ay - 6, 12, 12);

          // Leader line
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(elbowX, elbowY);
          ctx.lineTo(endX, elbowY);
          ctx.stroke();

          // Callout text
          ctx.textAlign = dir < 0 ? 'right' : 'left';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(callout.label, elbowX + dir * 6, elbowY - 6);
          ctx.fillStyle = '#a3a3a3';
          ctx.fillText(callout.detail, elbowX + dir * 6, elbowY + 12);
        });
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
