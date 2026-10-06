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

const TOTAL_PARTICLES = 9950;
const TEXT_PARTICLES = 7200;   // 0 .. 7199: 4-Line Multi-Tier Particle Story
const SCULPT_PARTICLES = 2000; // 7200 .. 9199: Central 3D Architectural Sculpture
// 9200 .. 9949 (750 particles): 3-Plane Deep Space Star-Track (Far Cluster, Mid Field, Near Foreground)


const BUCKET_STYLES = [
  'rgba(255, 255, 255, 0.99)', // Bucket 0: Pure White Headline & Hovered Particles
  'rgba(228, 228, 228, 0.93)', // Bucket 1: Crisp Silver-White Story Narrative Lines 1 & 2
  'rgba(170, 170, 170, 0.85)', // Bucket 2: Architectural Gray Chapter Kicker & Mid Sculpture
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
  ctx.font = '800 21px "DM Sans", sans-serif';
  ctx.fillText(story.kicker.toUpperCase(), w / 2, 46);

  // Tier 0 (Encoded in Green channel): Monumental Story Headline
  ctx.fillStyle = '#00ff00';
  const headText = story.word.toUpperCase();
  const headLen = headText.length;
  const headSize = headLen > 13 ? 72 : headLen > 10 ? 82 : 90;
  ctx.font = `900 ${headSize}px "DM Sans", sans-serif`;
  ctx.fillText(headText, w / 2, 144);

  // Tier 1 (Encoded in Blue channel): Two-Line Narrative Story in Particles
  ctx.fillStyle = '#0000ff';
  ctx.font = '700 30px "DM Sans", sans-serif';
  ctx.fillText(story.line1.toUpperCase(), w / 2, 264);
  ctx.fillText(story.line2.toUpperCase(), w / 2, 320);

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
  const baseMode = variant % 3; // 0 = Phase A / Spec 1 / Milestone 1, 1 = B / 2 / 2, 2 = C / 3 / 3
  const tierMode = Math.floor(variant / 3); // 0 = Phase, 1 = Spec Override, 2 = Milestone Override

  for (let i = 0; i < count; i++) {
    const t = i / count;
    let x = 0;
    let y = 0;
    let z = 0;

    switch (shape) {
      case 'sphere': {
        if (baseMode === 0) {
          // Variant 0: Fibonacci Geodesic Globe + Equatorial Data Ring
          if (i < count * 0.72) {
            const sub = Math.floor(count * 0.72);
            const phi = Math.acos(1 - (2 * (i % sub)) / sub);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const r = 0.21;
            x = r * Math.sin(phi) * Math.cos(theta);
            y = r * Math.sin(phi) * Math.sin(theta);
            z = r * Math.cos(phi);
          } else {
            const angle = t * Math.PI * 24;
            x = Math.cos(angle) * 0.33;
            y = Math.sin(angle) * 0.06;
            z = Math.sin(angle) * 0.33;
          }
        } else if (baseMode === 1) {
          // Variant 1: Intertwined Double-Helix Hypertext Torus
          const strand = i % 2 === 0 ? 1 : -1;
          const angle = t * Math.PI * 8;
          const majorR = 0.24;
          const minorR = 0.075;
          x = (majorR + minorR * Math.cos(angle * 3) * strand) * Math.cos(angle);
          y = minorR * Math.sin(angle * 3) * strand * 1.4;
          z = (majorR + minorR * Math.cos(angle * 3) * strand) * Math.sin(angle);
        } else {
          // Variant 2: 3 Orthogonal Gyroscopic Archive Rings + Dense Core
          const ring = i % 4;
          const angle = t * Math.PI * 16;
          if (ring === 0) {
            const phi = Math.acos(1 - 2 * t);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            x = 0.12 * Math.sin(phi) * Math.cos(theta);
            y = 0.12 * Math.sin(phi) * Math.sin(theta);
            z = 0.12 * Math.cos(phi);
          } else if (ring === 1) {
            x = Math.cos(angle) * 0.29;
            y = Math.sin(angle) * 0.29 * 0.25;
            z = Math.sin(angle) * 0.29;
          } else if (ring === 2) {
            x = Math.cos(angle) * 0.26 * 0.25;
            y = Math.sin(angle) * 0.26;
            z = Math.cos(angle) * 0.26;
          } else {
            x = Math.cos(angle) * 0.32;
            y = Math.sin(angle) * 0.18;
            z = -Math.cos(angle) * 0.22;
          }
        }
        break;
      }

      case 'terminal': {
        if (baseMode === 0) {
          // Variant 0: NeXTcube Workstation Bezel + 80x24 Monospace Rows
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
            x = -0.26 + (col / 34) * 0.52;
            y = -0.14 + (row / 10) * 0.28;
            z = 0;
          }
        } else if (baseMode === 1) {
          // Variant 1: 3D Cathode-Ray Tube (CRT) Electron Funnel Cone
          const depth = (i % 25) / 24; // 0 (front glass) to 1 (electron gun neck)
          const radius = 0.05 + (1 - depth) * 0.23;
          const angle = t * Math.PI * 40;
          x = Math.sign(Math.cos(angle)) * Math.pow(Math.abs(Math.cos(angle)), 0.55) * radius * 1.25;
          y = Math.sign(Math.sin(angle)) * Math.pow(Math.abs(Math.sin(angle)), 0.55) * radius * 0.85;
          z = 0.16 - depth * 0.34;
        } else {
          // Variant 2: 4 Linked Hypertext Server Terminals in 3D Space
          const node = i % 4;
          const centers = [
            [-0.20, -0.09, 0.06],
            [0.20, -0.09, -0.06],
            [-0.18, 0.10, -0.06],
            [0.18, 0.10, 0.06],
          ];
          const [cx, cy, cz] = centers[node];
          const localP = ((i * 19) % 100) / 100;
          const edge = Math.floor(i / 4) % 4;
          const w = 0.095;
          const h = 0.062;
          if (edge === 0) { x = cx - w + localP * w * 2; y = cy - h; }
          else if (edge === 1) { x = cx - w + localP * w * 2; y = cy + h; }
          else if (edge === 2) { x = cx - w; y = cy - h + localP * h * 2; }
          else { x = cx + w; y = cy - h + localP * h * 2; }
          z = cz;
        }
        break;
      }

      case 'table': {
        if (baseMode === 0) {
          // Variant 0: Classic 5-Cell <TABLE> Holy Grail Grid
          const cellIndex = i % 5;
          const p = ((i * 29) % 200) / 200;
          const edge = i % 4;
          const cells = [
            { cx: 0.0, cy: -0.14, cw: 0.28, ch: 0.038, cz: 0 },
            { cx: -0.19, cy: 0.01, cw: 0.08, ch: 0.09, cz: 0.02 },
            { cx: 0.01, cy: 0.01, cw: 0.10, ch: 0.09, cz: -0.02 },
            { cx: 0.20, cy: 0.01, cw: 0.07, ch: 0.09, cz: 0.02 },
            { cx: 0.0, cy: 0.15, cw: 0.28, ch: 0.03, cz: 0 },
          ];
          const c = cells[cellIndex];
          if (edge === 0) { x = c.cx - c.cw + p * c.cw * 2; y = c.cy - c.ch; }
          else if (edge === 1) { x = c.cx - c.cw + p * c.cw * 2; y = c.cy + c.ch; }
          else if (edge === 2) { x = c.cx - c.cw; y = c.cy - c.ch + p * c.ch * 2; }
          else { x = c.cx + c.cw; y = c.cy - c.ch + p * c.ch * 2; }
          z = c.cz;
        } else if (baseMode === 1) {
          // Variant 1: Exploded 3x3 Isometric Sliced Image Matrix
          const tileIdx = i % 9;
          const col = (tileIdx % 3) - 1;
          const row = Math.floor(tileIdx / 3) - 1;
          const p = ((i * 31) % 100) / 100;
          const edge = Math.floor(i / 9) % 4;
          const cw = 0.078;
          const ch = 0.052;
          const cx = col * 0.19;
          const cy = row * 0.13;
          const cz = ((tileIdx % 3) - 1) * 0.09;
          if (edge === 0) { x = cx - cw + p * cw * 2; y = cy - ch; }
          else if (edge === 1) { x = cx - cw + p * cw * 2; y = cy + ch; }
          else if (edge === 2) { x = cx - cw; y = cy - ch + p * ch * 2; }
          else { x = cx + cw; y = cy - ch + p * ch * 2; }
          z = cz;
        } else {
          // Variant 2: GeoCities Starfield Ring + Angled Triptych Frameset
          if (i < count * 0.65) {
            const pane = i % 3;
            const cx = (pane - 1) * 0.21;
            const lx = (((i * 17) % 100) / 100 - 0.5) * 0.16;
            const ly = ((Math.floor(i / 12) % 16) / 16 - 0.5) * 0.24;
            x = cx + lx;
            y = ly;
            z = Math.abs(pane - 1) * 0.08 - 0.04;
          } else {
            const angle = t * Math.PI * 28;
            x = Math.cos(angle) * 0.35;
            y = Math.sin(angle * 2) * 0.12;
            z = Math.sin(angle) * 0.25;
          }
        }
        break;
      }

      case 'cascade': {
        if (baseMode === 0) {
          // Variant 0: 3 Parallel Floating Z-Index Style Planes
          const layer = i % 3;
          const lx = (layer - 1) * 0.12;
          const lz = (layer - 1) * 0.11;
          const gx = ((i * 17) % 24) / 24 - 0.5;
          const gy = (Math.floor(i / 24) % 18) / 18 - 0.5;
          x = lx + gx * 0.34;
          y = gy * 0.22;
          z = lz + gx * 0.1;
        } else if (baseMode === 1) {
          // Variant 1: Flash MX 3D Vector Waveform & Audio Equalizer Tunnel
          const ribbon = i % 5;
          const waveX = (t - 0.5) * 0.68;
          const phaseShift = ribbon * 0.9;
          x = waveX;
          y = Math.sin(waveX * 15.0 + phaseShift) * 0.14;
          z = (ribbon - 2) * 0.065 + Math.cos(waveX * 10.0 + phaseShift) * 0.06;
        } else {
          // Variant 2: Web 2.0 Asynchronous Dual-Vortex AJAX Data Stream
          const loop = i % 2 === 0 ? 1 : -1;
          const angle = t * Math.PI * 14;
          const radius = 0.12 + 0.18 * Math.sin(t * Math.PI);
          x = Math.cos(angle) * radius * 1.25;
          y = loop * Math.sin(angle * 2) * 0.13;
          z = Math.sin(angle) * radius;
        }
        break;
      }

      case 'responsive': {
        if (baseMode === 0) {
          // Variant 0: 12-Column 960.gs Proportional Architectural Grid
          const cols = 12;
          const col = i % cols;
          const row = Math.floor(i / cols);
          const maxRows = Math.ceil(count / cols);
          const colCenter = -0.29 + (col / (cols - 1)) * 0.58;
          x = colCenter + ((i % 2) - 0.5) * 0.014;
          y = (row / maxRows - 0.5) * 0.3;
          z = Math.sin(col * 0.5) * 0.02;
        } else if (baseMode === 1) {
          // Variant 1: Capacitive iPhone Bezel + 3 Stacked Touch Cards
          if (i < count * 0.42) {
            const p = i / (count * 0.42);
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
        } else {
          // Variant 2: Multi-Device Triptych (Desktop + Tablet + Mobile Viewports)
          const dev = i % 3;
          const devices = [
            { cx: -0.22, cy: 0.0, w: 0.13, h: 0.095, z: -0.03 }, // Desktop
            { cx: 0.04, cy: 0.02, w: 0.085, h: 0.115, z: 0.01 },  // Tablet
            { cx: 0.23, cy: 0.04, w: 0.048, h: 0.095, z: 0.05 },  // Mobile
          ];
          const d = devices[dev];
          const edge = Math.floor(i / 3) % 4;
          const p = ((i * 23) % 100) / 100;
          if (edge === 0) { x = d.cx - d.w + p * d.w * 2; y = d.cy - d.h; }
          else if (edge === 1) { x = d.cx - d.w + p * d.w * 2; y = d.cy + d.h; }
          else if (edge === 2) { x = d.cx - d.w; y = d.cy - d.h + p * d.h * 2; }
          else { x = d.cx + d.w; y = d.cy - d.h + p * d.h * 2; }
          z = d.z;
        }
        break;
      }

      case 'flat': {
        const side = Math.cbrt(count);
        const ix = (i % side) / side - 0.5;
        const iy = (Math.floor(i / side) % side) / side - 0.5;
        const iz = (Math.floor(i / (side * side)) % side) / side - 0.5;

        if (baseMode === 0) {
          // Variant 0: 4 Modular Swiss Bento Grid Quadrants
          const tile = i % 4;
          x = (tile % 2 === 0 ? -0.15 : 0.15) + ix * 0.22;
          y = (tile < 2 ? -0.09 : 0.09) + iy * 0.14;
          z = 0.0;
        } else if (baseMode === 1) {
          // Variant 1: 3D Atomic Design Crystalline Lattice Cube
          x = ix * 0.30;
          y = iy * 0.30;
          z = iz * 0.30;
        } else {
          // Variant 2: Isometric Z-Elevation Material Paper Stack (4 Stacked Horizontal Decks)
          const deck = i % 4;
          const gx = ((i * 13) % 28) / 28 - 0.5;
          const gz = (Math.floor(i / 28) % 20) / 20 - 0.5;
          x = gx * 0.44 + (deck - 1.5) * 0.03;
          y = (deck - 1.5) * 0.075;
          z = gz * 0.32;
        }
        break;
      }

      case 'wave3d': {
        const cols = 42;
        const rows = Math.floor(count / cols);
        const u = (i % cols) / cols - 0.5;
        const v = Math.floor(i / cols) / rows - 0.5;

        if (baseMode === 0) {
          // Variant 0: Undulating GPU Vertex Displacement Terrain
          const dist = Math.sqrt(u * u + v * v);
          x = u * 0.66;
          z = v * 0.52;
          y = Math.sin(dist * 14.0) * 0.095;
        } else if (baseMode === 1) {
          // Variant 1: Parametric 3D Torus Knot (p=3, q=7)
          const a = t * Math.PI * 2 * 3;
          const b = t * Math.PI * 2 * 7;
          const r = 0.17 + 0.065 * Math.cos(b);
          x = r * Math.cos(a) * 0.78;
          y = r * Math.sin(a) * 0.48;
          z = 0.08 * Math.sin(b);
        } else {
          // Variant 2: 3D Scrollytelling Camera Tunnel / Dolly Helix
          const ringIdx = i % 16;
          const depthT = ringIdx / 15; // 0 to 1
          const ringR = 0.07 + depthT * 0.24;
          const angle = t * Math.PI * 30;
          x = Math.cos(angle) * ringR * 1.2;
          y = Math.sin(angle) * ringR * 0.85;
          z = (depthT - 0.5) * 0.46;
        }
        break;
      }

      case 'neural': {
        if (baseMode === 0) {
          // Variant 0: 7-Cluster Synaptic Cortex Topology
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
          const rad = 0.075 * Math.cbrt(Math.random());
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          x = cx + rad * Math.sin(phi) * Math.cos(theta);
          y = cy + rad * Math.sin(phi) * Math.sin(theta);
          z = cz + rad * Math.cos(phi);
        } else if (baseMode === 1) {
          // Variant 1: 4-Layer Deep Transformer Tensor Planes (Input -> Attention -> Output)
          const layer = i % 4;
          const lx = -0.27 + layer * 0.18;
          const gy = (((i * 11) % 16) / 15 - 0.5) * 0.26;
          const gz = ((Math.floor(i / 16) % 12) / 11 - 0.5) * 0.24;
          x = lx;
          y = gy;
          z = gz;
        } else {
          // Variant 2: Autonomous Multi-Agent Orbital Swarm (Core + 6 Orbiting Agent Rings)
          const agent = i % 7;
          if (agent === 0) {
            const phi = Math.acos(1 - 2 * t);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            x = 0.08 * Math.sin(phi) * Math.cos(theta);
            y = 0.08 * Math.sin(phi) * Math.sin(theta);
            z = 0.08 * Math.cos(phi);
          } else {
            const orbitAngle = (agent / 6) * Math.PI * 2 + t * Math.PI * 6;
            const orbitR = 0.14 + (agent % 3) * 0.07;
            x = Math.cos(orbitAngle) * orbitR * 1.15;
            y = Math.sin(orbitAngle * 2) * 0.13 * (agent % 2 === 0 ? 1 : -1);
            z = Math.sin(orbitAngle) * orbitR;
          }
        }
        break;
      }

      case 'singularity': {
        if (baseMode === 0) {
          // Variant 0: 4-Arm Galactic Logarithmic Singularity Spiral
          const arm = i % 4;
          const radius = Math.pow(t, 0.65) * 0.30;
          const spin = radius * 12.0 + (arm * Math.PI) / 2;
          x = Math.cos(spin) * radius * 0.85;
          y = (Math.random() - 0.5) * 0.055 * (1 - t * 0.7);
          z = Math.sin(spin) * radius;
        } else if (baseMode === 1) {
          // Variant 1: Einstein-Rosen Spatial Wormhole Hourglass Bridge
          const u = (t - 0.5) * 2; // -1 to 1
          const waistR = 0.065 + u * u * 0.24;
          const angle = i * 0.38;
          x = Math.cos(angle) * waistR * 1.15;
          y = u * 0.19;
          z = Math.sin(angle) * waistR;
        } else {
          // Variant 2: 4D Tesseract Hypercube (Inner Cube + Outer Cube + 8 Diagonal Bridges)
          const edgeIdx = i % 32;
          const p = ((i * 23) % 100) / 100 * 2 - 1; // -1 to 1
          const edges: [number, number, number, number, number, number][] = [
            [-1, -1, -1, 1, -1, -1], [-1, 1, -1, 1, 1, -1], [-1, -1, 1, 1, -1, 1], [-1, 1, 1, 1, 1, 1],
            [-1, -1, -1, -1, 1, -1], [1, -1, -1, 1, 1, -1], [-1, -1, 1, -1, 1, 1], [1, -1, 1, 1, 1, 1],
            [-1, -1, -1, -1, -1, 1], [1, -1, -1, 1, -1, 1], [-1, 1, -1, -1, 1, 1], [1, 1, -1, 1, 1, 1],
          ];
          const alpha = (p + 1) * 0.5;
          if (edgeIdx < 12) {
            const e = edges[edgeIdx];
            const s = 0.21;
            x = (e[0] + (e[3] - e[0]) * alpha) * s;
            y = (e[1] + (e[4] - e[1]) * alpha) * s * 0.82;
            z = (e[2] + (e[5] - e[2]) * alpha) * s;
          } else if (edgeIdx < 24) {
            const e = edges[edgeIdx - 12];
            const s = 0.095;
            x = (e[0] + (e[3] - e[0]) * alpha) * s;
            y = (e[1] + (e[4] - e[1]) * alpha) * s * 0.82;
            z = (e[2] + (e[5] - e[2]) * alpha) * s;
          } else {
            const corner = edgeIdx - 24;
            const cx = corner & 1 ? 1 : -1;
            const cy = corner & 2 ? 1 : -1;
            const cz = corner & 4 ? 1 : -1;
            const s = 0.095 + alpha * (0.21 - 0.095);
            x = cx * s;
            y = cy * s * 0.82;
            z = cz * s;
          }
        }
        break;
      }
    }

    // Apply subtle architectural harmonic twist when viewing a Spec (tierMode=1) or Milestone (tierMode=2)
    if (tierMode === 1) {
      const angle = y * 1.6;
      const rx = x * Math.cos(angle) - z * Math.sin(angle);
      const rz = x * Math.sin(angle) + z * Math.cos(angle);
      x = rx * 1.06;
      z = rz * 1.06;
    } else if (tierMode === 2) {
      const angle = x * 1.8;
      const ry = y * Math.cos(angle) - z * Math.sin(angle);
      const rz = y * Math.sin(angle) + z * Math.cos(angle);
      y = ry * 1.05;
      z = rz * 1.08;
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

    const activeStoryRef = useRef<ParticleNodeStory>({
      kicker: ERAS[0].phases[0].tag,
      word: ERAS[0].phases[0].word,
      line1: ERAS[0].phases[0].line1,
      line2: ERAS[0].phases[0].line2,
      sculptVariant: 0,
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
        sculptVariant: phase.sculptVariant,
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
            sculptVariant: phase.sculptVariant,
          };
        }
      } else if (activeEraIndex === 8 && customWord.trim().length > 0) {
        const cleanWord = customWord.trim().toUpperCase().slice(0, 12);
        const charHash = cleanWord
          .split('')
          .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
        const customLines: [string, string][] = [
          [`"${cleanWord}" MATERIALIZES IN LIVING LIGHT`, 'SCULPTED ACROSS SEVEN THOUSAND PARTICLES'],
          [`YOUR INTENT "${cleanWord}" BECOMES ARCHITECTURE`, 'FLOATING IN THREE DIMENSIONAL SPACE'],
          [`FROM 1989 CERN TO "${cleanWord}" IN 2026`, 'THE NEXT HORIZON OF THE WEB IS YOURS'],
        ];
        const [cLine1, cLine2] = customLines[charHash % customLines.length];

        activeStory = {
          kicker: `CHAPTER 08 · LIVE SYNTHESIS [${cleanWord.length} CHARS]`,
          word: cleanWord,
          line1: cLine1,
          line2: cLine2,
          sculptVariant: charHash % 9,
        };
      }

      activeStoryRef.current = activeStory;

      const { coords: textTargets, tiers } = sampleMultiLineParticleStory(
        activeStory,
        TEXT_PARTICLES
      );
      textTiersRef.current.set(tiers);

      const sculptTargets = generateSculptureCoordinates(
        era.shapeType,
        activeStory.sculptVariant,
        SCULPT_PARTICLES
      );

      const targets = targetsRef.current;
      const sizes = sizesRef.current;
      targets.set(textTargets, 0);
      targets.set(sculptTargets, TEXT_PARTICLES * 3);

      // Assign smaller, finer dot sizes per story tier (Headline = 1.55px, Story = 1.22px, Kicker = 1.12px)
      for (let i = 0; i < TEXT_PARTICLES; i++) {
        const tier = tiers[i];
        sizes[i] = tier === 0 ? 1.55 : tier === 1 ? 1.22 : 1.12;
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

      const farEnd = streamStart + 320; // 320 Far-field micro stars
      const midEnd = farEnd + 280;      // 280 Mid-field stars (remaining 150 = Near-field foreground stars)

      for (let i = 0; i < TOTAL_PARTICLES; i++) {
        const initX = (Math.random() - 0.5) * 2.7;
        const initY = (Math.random() - 0.5) * 1.95;
        let initZ = (Math.random() - 0.5) * 0.9;

        if (i < TEXT_PARTICLES) {
          shades[i] = 1.0;
          sizes[i] = 1.3;
        } else if (i < streamStart) {
          shades[i] = 0.55 + Math.random() * 0.45;
          sizes[i] = 1.45 + Math.random() * 0.75;
        } else if (i < farEnd) {
          // Plane 1: Far-Field Deep Space Micro-Stars (z: -1.15 to -0.45)
          initZ = -1.15 + Math.random() * 0.70;
          targets[i * 3] = initX;
          targets[i * 3 + 1] = initY;
          targets[i * 3 + 2] = initZ;
          shades[i] = 0.16 + Math.random() * 0.22;
          sizes[i] = 0.75 + Math.random() * 0.45;
        } else if (i < midEnd) {
          // Plane 2: Mid-Field Star-Track (z: -0.45 to +0.18)
          initZ = -0.45 + Math.random() * 0.63;
          targets[i * 3] = initX;
          targets[i * 3 + 1] = initY;
          targets[i * 3 + 2] = initZ;
          shades[i] = 0.32 + Math.random() * 0.34;
          sizes[i] = 1.15 + Math.random() * 0.55;
        } else {
          // Plane 3: Near-Field High-Parallax Foreground Stars (z: +0.18 to +0.68)
          initZ = 0.18 + Math.random() * 0.50;
          targets[i * 3] = initX;
          targets[i * 3 + 1] = initY;
          targets[i * 3 + 2] = initZ;
          shades[i] = 0.55 + Math.random() * 0.42;
          sizes[i] = 1.55 + Math.random() * 0.75;
        }

        current[i * 3] = initX;
        current[i * 3 + 1] = initY;
        current[i * 3 + 2] = initZ;
      }

      let lastScrollProgress = motionRef.current.progress;
      let starTrackDir = 1; // +1 = scrolling right/forward (stars track left), -1 = scrolling left/backward (stars track right)
      let starTrackVel = 0;

      // 4 Distant Deep-Field Spiral Galaxies & Nebulae (z: -0.95 to -0.70, ultra-slow parallax)
      const galaxies = [
        { x: -0.88, y: -0.52, z: -0.92, rx: 46, ry: 15, tilt: -0.38, rotSpeed: 0.12 },
        { x: 0.76, y: -0.58, z: -0.86, rx: 54, ry: 17, tilt: 0.31, rotSpeed: -0.09 },
        { x: -0.64, y: 0.56, z: -0.88, rx: 40, ry: 13, tilt: 0.44, rotSpeed: 0.14 },
        { x: 0.84, y: 0.48, z: -0.78, rx: 48, ry: 16, tilt: -0.26, rotSpeed: -0.11 },
      ];

      // 11 Multi-Depth Monochrome Celestial Planets (from distant exoplanets to foreground ringed worlds)
      const planets = [
        { x: -0.42, y: -0.82, z: -0.68, r: 2.3, hasRing: false, ringTilt: 0, hasMoon: false, moonSpeed: 0, phase: 0.8 },
        { x: 0.58, y: 0.78, z: -0.62, r: 2.6, hasRing: false, ringTilt: 0, hasMoon: false, moonSpeed: 0, phase: 2.1 },
        { x: -1.18, y: -0.12, z: -0.52, r: 3.0, hasRing: true, ringTilt: 0.36, hasMoon: false, moonSpeed: 0, phase: 4.2 },
        { x: -0.14, y: -0.76, z: -0.34, r: 3.5, hasRing: false, ringTilt: 0, hasMoon: false, moonSpeed: 0, phase: 2.5 },
        { x: -0.82, y: 0.22, z: -0.28, r: 3.8, hasRing: false, ringTilt: 0, hasMoon: false, moonSpeed: 0, phase: 1.1 },
        { x: -0.52, y: 0.66, z: -0.20, r: 4.2, hasRing: false, ringTilt: 0, hasMoon: true, moonSpeed: 1.3, phase: 1.8 },
        { x: 1.16, y: -0.28, z: -0.16, r: 4.5, hasRing: true, ringTilt: -0.42, hasMoon: false, moonSpeed: 0, phase: 5.4 },
        { x: 0.92, y: -0.72, z: -0.08, r: 4.8, hasRing: false, ringTilt: 0, hasMoon: true, moonSpeed: 1.05, phase: 2.9 },
        { x: 0.78, y: 0.58, z: 0.14, r: 5.2, hasRing: false, ringTilt: 0, hasMoon: true, moonSpeed: 1.15, phase: 4.9 },
        { x: -1.05, y: -0.68, z: 0.20, r: 6.4, hasRing: true, ringTilt: -0.32, hasMoon: true, moonSpeed: 0.9, phase: 0.4 },
        { x: 0.34, y: -0.62, z: 0.28, r: 7.6, hasRing: true, ringTilt: 0.28, hasMoon: true, moonSpeed: 0.75, phase: 3.7 },
      ];

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

      const vortexNodes = new Int32Array(24);
      const vortex = {
        x: 0,
        y: 0,
        normX: 0,
        normY: 0,
        strength: 0,
        nodeCount: 0,
        sculptSpinAngle: 0,
        sculptSpinVel: 0,
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

        const clickNormX = (e.clientX / width) * 2 - 1;
        const clickNormY = (e.clientY / height) * 2 - 1;

        vortex.x = e.clientX;
        vortex.y = e.clientY;
        vortex.normX = clickNormX;
        vortex.normY = clickNormY;
        vortex.strength = 1.0;
        vortex.active = true;
        // Impart a crisp 3D rotational spin impulse to the central sculpture
        vortex.sculptSpinVel += clickNormX >= 0 ? 0.055 : -0.055;

        const vel = velocityRef.current;
        let captured = 0;
        // Step through particles to apply tangential 3D vortex swirl + capture constellation nodes
        const stride = Math.max(1, Math.floor(TOTAL_PARTICLES / 480));

        for (let i = 0; i < TOTAL_PARTICLES; i++) {
          const dx = current[i * 3] - clickNormX;
          const dy = current[i * 3 + 1] - clickNormY;
          const distSq = dx * dx + dy * dy + 0.004;

          if (distSq < 0.38) {
            const dist = Math.sqrt(distSq);
            const falloff = 1 - distSq / 0.38;
            // Tangential orbital swirl vector (-dy, dx) + inward gravitational pull (-dx, -dy)
            const tangentX = -dy / dist;
            const tangentY = dx / dist;
            const pullX = -dx / dist;
            const pullY = -dy / dist;

            const swirlForce = 0.046 * falloff;
            const pullForce = 0.024 * falloff;

            vel[i * 3] += tangentX * swirlForce + pullX * pullForce;
            vel[i * 3 + 1] += tangentY * swirlForce + pullY * pullForce;
            // Quantum Z-depth lift toward the camera
            vel[i * 3 + 2] += (0.05 * falloff) * (i % 2 === 0 ? 1 : -0.7);

            if (captured < 24 && i % stride === 0 && distSq < 0.24) {
              vortexNodes[captured++] = i;
            }
          }
        }
        vortex.nodeCount = captured;

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

        vortex.sculptSpinAngle += vortex.sculptSpinVel;
        vortex.sculptSpinVel *= 0.93;

        const { activeEraIndex: eraIdx } = stateRef.current;
        const sVel = motionRef.current.velocity;
        const prog = motionRef.current.progress;
        const deltaProg = prog - lastScrollProgress;
        lastScrollProgress = prog;

        // Compute signed horizontal Star-Track velocity (positive = scrolling right, negative = scrolling left)
        const rawScrollDrive = deltaProg * 44 + sVel * 0.0055;
        if (Math.abs(rawScrollDrive) > 0.0002) {
          starTrackDir = rawScrollDrive > 0 ? 1 : -1;
        }
        starTrackVel += (Math.max(-0.14, Math.min(0.14, rawScrollDrive)) - starTrackVel) * 0.18;

        const era = ERAS[eraIdx] || ERAS[0];

        // 1. Transparent Clear so WebGL Water Shader Shines Through
        ctx.clearRect(0, 0, width, height);

        const isMobile = width < 1024;
        const equatorY = isMobile ? height * 0.315 : height * 0.52;

        // 2. Subtle Architectural Equator Hairline Separating Story & Sculpture
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, equatorY);
        ctx.lineTo(width, equatorY);
        ctx.stroke();

        const activeStory = activeStoryRef.current;
        const baseVariant = activeStory.sculptVariant % 3;

        // 3. Smooth Interactive 3D Rotation for Central Sculpture (with Click Spin Impulse & Scroll Yaw)
        const isFlatPlane = era.shapeType === 'flat' && baseVariant === 0;
        const rotY =
          (era.shapeType === 'terminal' ||
          era.shapeType === 'table' ||
          era.shapeType === 'responsive' ||
          isFlatPlane
            ? Math.sin(time * 0.5) * 0.14 + mouse.smoothNormX * 0.18
            : time * 0.26 + mouse.smoothNormX * 0.34) +
          vortex.sculptSpinAngle +
          starTrackVel * 1.4;

        const rotX =
          era.shapeType === 'wave3d'
            ? 0.38 + mouse.smoothNormY * 0.15
            : Math.cos(time * 0.38) * 0.07 + mouse.smoothNormY * 0.14;

        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        const vel = velocityRef.current;
        const sideReservedPx = isMobile
          ? 12
          : width < 1280
            ? 258
            : width < 1536
              ? 294
              : 332;
        const availCenterW = Math.max(260, width - sideReservedPx * 2);

        const scaleX = Math.min(width * 0.46, 720);
        const scaleY = Math.min(height * 0.46, 490);
        const centerX = width * 0.5;
        const centerY = height * 0.5;

        // Locked aspect-ratio typography & isotropic 1:1 3D sculpture scales across ALL resolutions
        const textScaleX = isMobile
          ? Math.min(width * 1.12, height * 0.64, 680)
          : Math.min(availCenterW * 1.04, height * 0.72, 720);
        const textScaleY = textScaleX * 0.68;
        const textCenterY = isMobile
          ? Math.max(154, height * 0.205)
          : centerY - 0.31 * Math.min(height * 0.45, 480);

        const sculptScaleX = isMobile
          ? Math.min(width * 0.64, height * 0.27, 420)
          : Math.min(availCenterW * 0.62, height * 0.44, 520);
        const sculptScaleY = isMobile ? sculptScaleX : sculptScaleX * 0.92;
        const sculptCenterY = isMobile
          ? height * 0.455
          : centerY + 0.24 * Math.min(height * 0.45, 480);
        const mobileDotScale = width < 640 ? 0.74 : width < 1280 ? 0.88 : 1.0;

        const horizontalWind = Math.max(-0.07, Math.min(0.07, -starTrackVel * 0.45));
        const morphBoost = morphBoostRef.current.value;

        // 4. Update & Project All 9,600 Particles
        for (let i = 0; i < TOTAL_PARTICLES; i++) {
          const i3 = i * 3;
          let tx = targets[i3];
          let ty = targets[i3 + 1];
          let tz = targets[i3 + 2];

          if (i >= TEXT_PARTICLES && i < streamStart) {
            if (era.shapeType === 'wave3d' && baseVariant === 0) {
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
            // 3-Plane Parallax Star-Track: Far (0.22x), Mid (0.9x), Near (1.85x) speed
            const depthSpeed = Math.max(0.18, 0.22 + (targets[i3 + 2] + 1.15) * 0.92);
            const starStepX = (0.0013 * starTrackDir + starTrackVel * 0.95) * depthSpeed;
            targets[i3] -= starStepX;

            // Seamless wrap-around on both left and right edges without spring slingshot
            if (targets[i3] < -1.38) {
              targets[i3] += 2.76;
              current[i3] += 2.76;
              vel[i3] = 0;
            } else if (targets[i3] > 1.38) {
              targets[i3] -= 2.76;
              current[i3] -= 2.76;
              vel[i3] = 0;
            }
            tx = targets[i3];
            ty += Math.sin(tx * 3.6 + time * 1.2 + (i % 17) * 0.3) * 0.018 * depthSpeed;
          }

          const spring = (i < TEXT_PARTICLES ? 0.16 : i < streamStart ? 0.11 : 0.22) + morphBoost;
          vel[i3] = (vel[i3] + (tx - current[i3]) * spring + horizontalWind * 0.06) * 0.74;
          vel[i3 + 1] = (vel[i3 + 1] + (ty - current[i3 + 1]) * spring) * 0.74;
          vel[i3 + 2] = (vel[i3 + 2] + (tz - current[i3 + 2]) * spring) * 0.74;

          current[i3] += vel[i3];
          current[i3 + 1] += vel[i3 + 1];
          current[i3 + 2] += vel[i3 + 2];

          const perspective = 1.85 / (1.85 - current[i3 + 2]);
          let sx: number;
          let sy: number;

          if (i < TEXT_PARTICLES) {
            sx = centerX + current[i3] * textScaleX * perspective;
            sy = textCenterY + (current[i3 + 1] + 0.31) * textScaleY * perspective;
          } else if (i < streamStart) {
            sx = centerX + current[i3] * sculptScaleX * perspective;
            sy = sculptCenterY + (current[i3 + 1] - 0.24) * sculptScaleY * perspective;
          } else {
            // 3D Stereoscopic Pointer Parallax for Deep-Space Starfield
            const depthParallax = (current[i3 + 2] + 1.25) * 0.65;
            sx =
              centerX +
              current[i3] * scaleX * perspective -
              mouse.smoothNormX * depthParallax * 28;
            sy =
              centerY +
              current[i3 + 1] * scaleY * perspective -
              mouse.smoothNormY * depthParallax * 18;
          }

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

          const baseSize =
            i < TEXT_PARTICLES
              ? sizes[i] * mobileDotScale
              : sizes[i] * perspective * 0.92;
          drawSizes[i] = baseSize * (1 + hoverBoost * 0.45);

          if (hoverBoost > 0.25) {
            bucketIndices[i] = 0;
          } else if (i < TEXT_PARTICLES) {
            bucketIndices[i] = textTiers[i]; // 0 = Headline, 1 = Story Lines, 2 = Kicker
          } else {
            const lum = shades[i] * perspective;
            bucketIndices[i] = lum > 0.78 ? 0 : lum > 0.56 ? 1 : lum > 0.34 ? 2 : 3;
          }
        }

        // 4A. PLANE 0: Deep-Void Perspective Celestial Rings & Distant Spiral Galaxies
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.032)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(
          centerX - mouse.smoothNormX * 8,
          centerY - mouse.smoothNormY * 5,
          Math.min(width * 0.62, 860),
          Math.min(height * 0.28, 240),
          -0.12 + mouse.smoothNormX * 0.03,
          0,
          Math.PI * 2
        );
        ctx.ellipse(
          centerX - mouse.smoothNormX * 12,
          centerY - mouse.smoothNormY * 8,
          Math.min(width * 0.44, 620),
          Math.min(height * 0.42, 340),
          0.18 - mouse.smoothNormY * 0.03,
          0,
          Math.PI * 2
        );
        ctx.stroke();

        // Distant Tilted Spiral Galaxies & Nebulae (z ≈ -0.9)
        for (let gIdx = 0; gIdx < galaxies.length; gIdx++) {
          const g = galaxies[gIdx];
          const gSpeed = 0.16 + (g.z + 1.0) * 0.35;
          g.x -= (0.00055 * starTrackDir + starTrackVel * 0.45) * gSpeed;
          if (g.x < -1.35) g.x += 2.7;
          else if (g.x > 1.35) g.x -= 2.7;

          const gPersp = 1.85 / (1.85 - g.z);
          const gx = centerX + g.x * scaleX * gPersp - mouse.smoothNormX * 6;
          const gy = centerY + g.y * scaleY * gPersp - mouse.smoothNormY * 4;
          const grx = g.rx * (isMobile ? 0.68 : 1.0);
          const gry = g.ry * (isMobile ? 0.68 : 1.0);

          // Soft volumetric galactic nebula mist
          const nebGrad = ctx.createRadialGradient(gx, gy, 1, gx, gy, grx * 1.45);
          nebGrad.addColorStop(0, 'rgba(255, 255, 255, 0.11)');
          nebGrad.addColorStop(0.45, 'rgba(200, 200, 200, 0.035)');
          nebGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = nebGrad;
          ctx.beginPath();
          ctx.arc(gx, gy, grx * 1.45, 0, Math.PI * 2);
          ctx.fill();

          // Concentric tilted galactic arms
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.11)';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.ellipse(gx, gy, grx, gry, g.tilt + Math.sin(time * g.rotSpeed) * 0.05, 0, Math.PI * 1.65);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.ellipse(gx, gy, grx * 0.56, gry * 0.56, g.tilt - 0.15, Math.PI * 0.4, Math.PI * 2.1);
          ctx.stroke();

          // Bright galactic core nucleus
          ctx.fillStyle = 'rgba(255, 255, 255, 0.48)';
          ctx.beginPath();
          ctx.arc(gx, gy, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }

        // 4B. PLANE 1: Far-Field Deep-Space Micro-Stars & Faint Constellation Filaments
        const signedStreakBase = starTrackDir * 2.0 + starTrackVel * 460;

        // Faint deep-space constellation web connecting nearby far-field stars
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.042)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let i = streamStart; i < farEnd - 3; i += 3) {
          const x1 = screenX[i];
          const y1 = screenY[i];
          const x2 = screenX[i + 1];
          const y2 = screenY[i + 1];
          const dSq = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
          if (dSq < 9500 && dSq > 140) {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
          }
        }
        ctx.stroke();

        // Far-Field Micro-Star Trails & Pinpoint Heads
        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.beginPath();
        for (let i = streamStart; i < farEnd; i++) {
          const sz = drawSizes[i];
          const trail = signedStreakBase * (sz * 0.28);
          if (trail >= 0) {
            ctx.rect(screenX[i] - sz * 0.5, screenY[i] - sz * 0.35, sz + trail, sz * 0.65);
          } else {
            ctx.rect(screenX[i] - sz * 0.5 + trail, screenY[i] - sz * 0.35, sz - trail, sz * 0.65);
          }
        }
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.20)';
        ctx.beginPath();
        for (let i = streamStart; i < farEnd; i++) {
          const sz = drawSizes[i];
          ctx.rect(screenX[i] - sz * 0.5, screenY[i] - sz * 0.5, sz, sz);
        }
        ctx.fill();

        // 4C. PLANE 2: Mid-Field Star-Track & 11 Multi-Depth Monochrome Planets
        ctx.fillStyle = 'rgba(255, 255, 255, 0.13)';
        ctx.beginPath();
        for (let i = farEnd; i < midEnd; i++) {
          const sz = drawSizes[i];
          const trail = signedStreakBase * (sz * 0.50);
          if (trail >= 0) {
            ctx.rect(screenX[i] - sz * 0.5, screenY[i] - sz * 0.35, sz + trail, sz * 0.65);
          } else {
            ctx.rect(screenX[i] - sz * 0.5 + trail, screenY[i] - sz * 0.35, sz - trail, sz * 0.65);
          }
        }
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
        ctx.beginPath();
        for (let i = farEnd; i < midEnd; i++) {
          const sz = drawSizes[i];
          ctx.rect(screenX[i] - sz * 0.5, screenY[i] - sz * 0.5, sz, sz);
        }
        ctx.fill();

        // 11 Multi-Depth Monochrome Planets (with Stereoscopic Parallax, Rings & Tiny Moons)
        for (let pIdx = 0; pIdx < planets.length; pIdx++) {
          const p = planets[pIdx];
          const depthSpeed = Math.max(0.22, 0.48 + (p.z + 0.5) * 1.05);
          p.x -= (0.00095 * starTrackDir + starTrackVel * 0.82) * depthSpeed;
          if (p.x < -1.38) p.x += 2.76;
          else if (p.x > 1.38) p.x -= 2.76;

          const pPersp = 1.85 / (1.85 - p.z);
          const pParallax = (p.z + 1.1) * 0.65;
          const px =
            centerX +
            p.x * scaleX * pPersp -
            mouse.smoothNormX * pParallax * 26;
          const py =
            centerY +
            (p.y + Math.sin(time * 0.65 + p.phase) * 0.015) * scaleY * pPersp -
            mouse.smoothNormY * pParallax * 16;
          const pr = p.r * pPersp * (isMobile ? 0.82 : 1.0);
          const pDepthAlpha = Math.max(0.45, Math.min(1.0, 0.72 + p.z * 0.55));

          // Subtle atmospheric outer glow
          const haloGrad = ctx.createRadialGradient(px, py, pr * 0.6, px, py, pr * 2.35);
          haloGrad.addColorStop(0, `rgba(255, 255, 255, ${(0.14 * pDepthAlpha).toFixed(3)})`);
          haloGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(px, py, pr * 2.35, 0, Math.PI * 2);
          ctx.fill();

          // Opaque 3D monochrome spherical body (sunlit top-left crescent to dark core shadow)
          const sphereGrad = ctx.createRadialGradient(
            px - pr * 0.35,
            py - pr * 0.35,
            pr * 0.12,
            px,
            py,
            pr
          );
          sphereGrad.addColorStop(0, `rgba(235, 235, 235, ${(0.84 * pDepthAlpha).toFixed(2)})`);
          sphereGrad.addColorStop(0.48, `rgba(120, 120, 120, ${(0.72 * pDepthAlpha).toFixed(2)})`);
          sphereGrad.addColorStop(1, 'rgba(8, 8, 8, 0.95)');

          ctx.fillStyle = sphereGrad;
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.28 * pDepthAlpha).toFixed(2)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();

          // Optional tilted planetary rings
          if (p.hasRing) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${(0.32 * pDepthAlpha).toFixed(2)})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.ellipse(px, py, pr * 2.15, pr * 0.52, p.ringTilt, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = `rgba(255, 255, 255, ${(0.15 * pDepthAlpha).toFixed(2)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.ellipse(px, py, pr * 1.65, pr * 0.38, p.ringTilt, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Optional tiny orbiting monochrome moon
          if (p.hasMoon) {
            const orbitR = pr * 2.35;
            const mAngle = time * p.moonSpeed + p.phase;
            const mx = px + Math.cos(mAngle) * orbitR;
            const my = py + Math.sin(mAngle) * (orbitR * 0.42);
            const mr = Math.max(1.1, pr * 0.22);

            ctx.fillStyle = `rgba(225, 225, 225, ${(0.75 * pDepthAlpha).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(mx, my, mr, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 4D. PLANE 3: Near-Field High-Parallax Foreground Star-Tracks & 4-Point Starlight Cross-Flares
        ctx.fillStyle = 'rgba(255, 255, 255, 0.21)';
        ctx.beginPath();
        for (let i = midEnd; i < TOTAL_PARTICLES; i++) {
          const sz = drawSizes[i];
          const trail = signedStreakBase * (sz * 0.78);
          if (trail >= 0) {
            ctx.rect(screenX[i] - sz * 0.5, screenY[i] - sz * 0.35, sz + trail, sz * 0.65);
          } else {
            ctx.rect(screenX[i] - sz * 0.5 + trail, screenY[i] - sz * 0.35, sz - trail, sz * 0.65);
          }
        }
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
        ctx.beginPath();
        for (let i = midEnd; i < TOTAL_PARTICLES; i++) {
          const sz = drawSizes[i];
          ctx.rect(screenX[i] - sz * 0.5, screenY[i] - sz * 0.5, sz, sz);
        }
        ctx.fill();

        // Crisp 4-point diffraction star-crosses on closest foreground stars
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.26)';
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        for (let i = midEnd; i < TOTAL_PARTICLES; i += 5) {
          const sx = screenX[i];
          const sy = screenY[i];
          const flareR = drawSizes[i] * 2.6;
          ctx.moveTo(sx - flareR, sy);
          ctx.lineTo(sx + flareR, sy);
          ctx.moveTo(sx, sy - flareR);
          ctx.lineTo(sx, sy + flareR);
        }
        ctx.stroke();

        // 4E. Batched Path Draw for Foreground Story & Sculpture Particles (Crisp Nodes)
        for (let b = 0; b < 4; b++) {
          ctx.fillStyle = BUCKET_STYLES[b];
          ctx.beginPath();
          const startIdx = b === 3 ? TEXT_PARTICLES : 0;
          for (let i = startIdx; i < streamStart; i++) {
            if (bucketIndices[i] === b) {
              const sz = drawSizes[i];
              ctx.rect(screenX[i] - sz * 0.5, screenY[i] - sz * 0.5, sz, sz);
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
        if (width >= 1024) {
          let leftSlot = 0;
          let rightSlot = 0;
          const isCompactDesktop = width < 1380;
          const cardH = isCompactDesktop ? 42 : 46;
          const font1 = isCompactDesktop
            ? '700 9.5px "JetBrains Mono", monospace'
            : '700 10px "JetBrains Mono", monospace';
          const font2 = isCompactDesktop
            ? '600 10.5px "DM Sans", sans-serif'
            : '600 11px "DM Sans", sans-serif';
          const safeMaxOuterOffset = Math.max(180, centerX - sideReservedPx - 12);

          era.sculptureCallouts.forEach((callout, cIdx) => {
            const line1 =
              cIdx === 0
                ? `${callout.code}.V${activeStory.sculptVariant + 1} // ${callout.title}`
                : `${callout.code} // ${callout.title}`;
            const line2 = callout.value;

            // Measure exact text widths using the exact fonts used for rendering
            ctx.font = font1;
            const w1 = ctx.measureText(line1).width;
            ctx.font = font2;
            const w2 = ctx.measureText(line2).width;

            const desiredW = Math.max(
              isCompactDesktop ? 156 : 176,
              Math.ceil(Math.max(w1, w2)) + 24
            );
            const minInnerOffset = isCompactDesktop
              ? Math.max(68, sculptScaleX * 0.19)
              : Math.max(118, sculptScaleX * 0.29);
            const maxCardW = Math.max(138, safeMaxOuterOffset - minInnerOffset);
            const cardW = Math.min(desiredW, maxCardW);
            const innerOffset = isCompactDesktop
              ? Math.max(minInnerOffset, safeMaxOuterOffset - cardW - 4)
              : Math.max(
                  minInnerOffset,
                  Math.min(sculptScaleX * 0.35, safeMaxOuterOffset - cardW)
                );

            const rx = callout.x * cosY - callout.z * sinY;
            const rz1 = callout.x * sinY + callout.z * cosY;
            const ry = callout.y * cosX - rz1 * sinX;
            const rz2 = callout.y * sinX + rz1 * cosX;

            const perspective = 1.85 / (1.85 - rz2);
            const ax = centerX + rx * sculptScaleX * perspective;
            const ay = sculptCenterY + ry * sculptScaleY * perspective;

            const isLeft = callout.side === 'left';
            const slotIdx = isLeft ? leftSlot++ : rightSlot++;
            const dir = isLeft ? -1 : 1;

            // Stationary lower-stage vertical slots aligned cleanly around the 3D sculpture
            const slotOffsetY = isCompactDesktop
              ? slotIdx === 0
                ? -0.20 * sculptScaleY
                : 0.22 * sculptScaleY
              : slotIdx === 0
                ? -0.12 * sculptScaleY
                : 0.16 * sculptScaleY;
            const cardCenterY = Math.min(
              height - 82,
              Math.max(equatorY + 26, sculptCenterY + slotOffsetY)
            );
            const cardEdgeX = centerX + dir * innerOffset;
            const cardX = isLeft ? cardEdgeX - cardW : cardEdgeX;
            const cardY = cardCenterY - cardH / 2;
            const elbowX = cardEdgeX - dir * 14;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(ax - 2, ay - 2, 4, 4);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.lineWidth = 0.85;
            ctx.strokeRect(ax - 5, ay - 5, 10, 10);

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.lineWidth = 0.85;
            ctx.moveTo(ax, ay);
            ctx.lineTo(elbowX, cardCenterY);
            ctx.lineTo(cardEdgeX, cardCenterY);
            ctx.stroke();

            // Tinted Smoked-Crystal Liquid Glass Diagonal + Upper Dome Gloss Surface
            const boxGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
            boxGrad.addColorStop(0, 'rgba(26, 36, 52, 0.88)');
            boxGrad.addColorStop(0.32, 'rgba(14, 20, 30, 0.90)');
            boxGrad.addColorStop(0.68, 'rgba(10, 14, 22, 0.92)');
            boxGrad.addColorStop(1, 'rgba(22, 32, 46, 0.88)');

            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardW, cardH, 11);
            ctx.fillStyle = boxGrad;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
            ctx.lineWidth = 0.75;
            ctx.stroke();

            // Upper curved liquid dome gloss reflection (subtle so text is 100% crisp)
            const domeGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH * 0.46);
            domeGrad.addColorStop(0, 'rgba(225, 238, 255, 0.10)');
            domeGrad.addColorStop(0.6, 'rgba(215, 232, 255, 0.03)');
            domeGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.beginPath();
            ctx.roundRect(cardX + 1.5, cardY + 1.5, cardW - 3, cardH * 0.44, [9, 9, 22, 22]);
            ctx.fillStyle = domeGrad;
            ctx.fill();

            // Top curved liquid meniscus hairline specular highlight arc
            const topSpec = ctx.createLinearGradient(cardX + 12, cardY, cardX + cardW - 12, cardY);
            topSpec.addColorStop(0, 'rgba(255, 255, 255, 0)');
            topSpec.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
            topSpec.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.beginPath();
            ctx.moveTo(cardX + 12, cardY + 0.5);
            ctx.lineTo(cardX + cardW - 12, cardY + 0.5);
            ctx.strokeStyle = topSpec;
            ctx.lineWidth = 0.75;
            ctx.stroke();

            // Bottom internal caustic counter-reflection
            const botSpec = ctx.createLinearGradient(cardX + 20, cardY + cardH, cardX + cardW - 20, cardY + cardH);
            botSpec.addColorStop(0, 'rgba(255, 255, 255, 0)');
            botSpec.addColorStop(0.5, 'rgba(215, 232, 255, 0.18)');
            botSpec.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.beginPath();
            ctx.moveTo(cardX + 20, cardY + cardH - 0.5);
            ctx.lineTo(cardX + cardW - 20, cardY + cardH - 0.5);
            ctx.strokeStyle = botSpec;
            ctx.lineWidth = 0.75;
            ctx.stroke();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
            ctx.beginPath();
            ctx.roundRect(
              isLeft ? cardEdgeX - 2 : cardEdgeX + 0.5,
              cardY + 9,
              1.25,
              cardH - 18,
              2
            );
            ctx.fill();

            const textX = isLeft ? cardEdgeX - 11 : cardEdgeX + 11;
            const maxTextW = Math.max(80, cardW - 20);
            ctx.textAlign = isLeft ? 'right' : 'left';
            ctx.textBaseline = 'middle';

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(cardX + 2, cardY + 2, cardW - 4, cardH - 4, 9);
            ctx.clip();

            ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetY = 1;

            ctx.font = font1;
            ctx.fillStyle = '#ffffff';
            ctx.fillText(line1, textX, cardY + cardH * 0.34, maxTextW);

            ctx.font = font2;
            ctx.fillStyle = '#f3f4f6';
            ctx.fillText(line2, textX, cardY + cardH * 0.70, maxTextW);
            ctx.restore();
          });
        }

        // 7. Quantum Vortex Constellation Lattice & Architectural Telemetry Lock-On (No Ripple Rings)
        if (vortex.active) {
          vortex.strength *= 0.94;
          const s = vortex.strength;
          const vx = vortex.x;
          const vy = vortex.y;

          // 7A. Dynamic Neural Constellation Web linking click origin to swirling particles
          if (vortex.nodeCount > 0) {
            ctx.lineWidth = 0.85;
            ctx.strokeStyle = `rgba(255, 255, 255, ${(s * 0.42).toFixed(3)})`;
            ctx.beginPath();
            for (let n = 0; n < vortex.nodeCount; n++) {
              const pIdx = vortexNodes[n];
              const px = screenX[pIdx];
              const py = screenY[pIdx];
              ctx.moveTo(vx, vy);
              ctx.lineTo(px, py);

              if (n > 0) {
                const prevIdx = vortexNodes[n - 1];
                ctx.moveTo(screenX[prevIdx], screenY[prevIdx]);
                ctx.lineTo(px, py);
              }
            }
            ctx.stroke();

            // Crisp monochrome square vertex anchors on linked constellation particles
            ctx.fillStyle = `rgba(255, 255, 255, ${(s * 0.95).toFixed(3)})`;
            for (let n = 0; n < vortex.nodeCount; n++) {
              const pIdx = vortexNodes[n];
              ctx.fillRect(screenX[pIdx] - 2, screenY[pIdx] - 2, 4, 4);
            }
          }

          // 7B. Precision Architectural Lock-On Crosshair & Contracting Corner Brackets
          const bracketSpread = 14 + (1 - s) * 26;
          const bracketLen = 7;
          ctx.strokeStyle = `rgba(255, 255, 255, ${(s * 0.85).toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();

          // Top-Left L-Bracket
          ctx.moveTo(vx - bracketSpread, vy - bracketSpread + bracketLen);
          ctx.lineTo(vx - bracketSpread, vy - bracketSpread);
          ctx.lineTo(vx - bracketSpread + bracketLen, vy - bracketSpread);

          // Top-Right L-Bracket
          ctx.moveTo(vx + bracketSpread - bracketLen, vy - bracketSpread);
          ctx.lineTo(vx + bracketSpread, vy - bracketSpread);
          ctx.lineTo(vx + bracketSpread, vy - bracketSpread + bracketLen);

          // Bottom-Right L-Bracket
          ctx.moveTo(vx + bracketSpread, vy + bracketSpread - bracketLen);
          ctx.lineTo(vx + bracketSpread, vy + bracketSpread);
          ctx.lineTo(vx + bracketSpread - bracketLen, vy + bracketSpread);

          // Bottom-Left L-Bracket
          ctx.moveTo(vx - bracketSpread + bracketLen, vy + bracketSpread);
          ctx.lineTo(vx - bracketSpread, vy + bracketSpread);
          ctx.lineTo(vx - bracketSpread, vy + bracketSpread - bracketLen);

          // Orthogonal Laser Axis Hairlines
          const axisOuter = bracketSpread + 14;
          ctx.moveTo(vx - axisOuter, vy);
          ctx.lineTo(vx - 6, vy);
          ctx.moveTo(vx + 6, vy);
          ctx.lineTo(vx + axisOuter, vy);
          ctx.moveTo(vx, vy - axisOuter);
          ctx.lineTo(vx, vy - 6);
          ctx.moveTo(vx, vy + 6);
          ctx.lineTo(vx + 0, vy + axisOuter);
          ctx.stroke();

          // Rotating Geometric Diamond Core at Click Vertex
          ctx.save();
          ctx.translate(vx, vy);
          ctx.rotate(Math.PI * 0.25 + (1 - s) * 2.4);
          ctx.strokeStyle = `rgba(255, 255, 255, ${(s * 0.95).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(-4.5, -4.5, 9, 9);
          ctx.restore();

          // Live Coordinate & Synaptic Node Telemetry Tag
          const tagSide = vx > width - 210 ? -1 : 1;
          const tagX = vx + tagSide * (bracketSpread + 12);
          ctx.textAlign = tagSide === 1 ? 'left' : 'right';
          ctx.textBaseline = 'middle';
          ctx.font = '700 9px "JetBrains Mono", monospace';
          ctx.fillStyle = `rgba(255, 255, 255, ${(s * 0.9).toFixed(3)})`;
          const coordStr = `VORTEX LOCK // ${vortex.normX >= 0 ? '+' : ''}${vortex.normX.toFixed(2)}X ${vortex.normY >= 0 ? '+' : ''}${vortex.normY.toFixed(2)}Y`;
          ctx.fillText(coordStr, tagX, vy - 7);
          ctx.fillStyle = `rgba(210, 210, 210, ${(s * 0.72).toFixed(3)})`;
          ctx.fillText(`CONSTELLATION // ${vortex.nodeCount} NODES LINKED`, tagX, vy + 6);

          if (vortex.strength < 0.02) {
            vortex.active = false;
          }
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
