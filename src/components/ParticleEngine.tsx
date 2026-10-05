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

interface EraParticlePalette {
  buckets: readonly [string, string, string, string, string, string];
  filament: string;
  accentHex: string;
  accentRgb: string;
}

/**
 * Minimal, historically authentic particle color palettes for each Era.
 * Preserves high-contrast white/silver readability while weaving in subtle era-specific accent particles.
 */
const ERA_PARTICLE_PALETTES: readonly EraParticlePalette[] = [
  // Era 00: Prologue (1989 — ∞) — Pure White + Ice Cyan & Celestial Silver
  {
    buckets: [
      'rgba(255, 255, 255, 0.99)', // 0: Crisp White Core
      'rgba(228, 240, 250, 0.94)', // 1: Cool Silver-White Story
      'rgba(125, 211, 252, 0.95)', // 2: Primary Minimal Accent (Ice Cyan)
      'rgba(196, 181, 253, 0.88)', // 3: Secondary Minimal Accent (Celestial Violet)
      'rgba(155, 175, 195, 0.78)', // 4: Mid Sculpture Slate
      'rgba(95, 115, 135, 0.34)',  // 5: Deep Ambient Dust
    ],
    filament: 'rgba(125, 211, 252, 0.16)',
    accentHex: '#7dd3fc',
    accentRgb: '125, 211, 252',
  },
  // Era 01: The Dark Ages (1989 — 1994) — Pure White + CRT Phosphor Emerald
  {
    buckets: [
      'rgba(255, 255, 255, 0.99)',
      'rgba(220, 245, 232, 0.94)',
      'rgba(52, 211, 153, 0.95)',  // CRT Phosphor Emerald
      'rgba(110, 231, 183, 0.88)', // Terminal Mint
      'rgba(130, 185, 160, 0.78)',
      'rgba(70, 120, 95, 0.34)',
    ],
    filament: 'rgba(52, 211, 153, 0.16)',
    accentHex: '#34d399',
    accentRgb: '52, 211, 153',
  },
  // Era 02: Tables & GeoCities (1995 — 1999) — Pure White + Web-Safe Amber & Hyperlink Blue
  {
    buckets: [
      'rgba(255, 255, 255, 0.99)',
      'rgba(245, 238, 225, 0.94)',
      'rgba(251, 191, 36, 0.95)',  // Web-Safe Gold Amber
      'rgba(96, 165, 250, 0.90)',  // Classic Hyperlink Cobalt
      'rgba(185, 170, 145, 0.78)',
      'rgba(115, 105, 90, 0.34)',
    ],
    filament: 'rgba(251, 191, 36, 0.16)',
    accentHex: '#fbbf24',
    accentRgb: '251, 191, 36',
  },
  // Era 03: CSS Zen & Flash Era (2000 — 2006) — Pure White + Flash Coral & Aqua Chrome
  {
    buckets: [
      'rgba(255, 255, 255, 0.99)',
      'rgba(245, 232, 238, 0.94)',
      'rgba(251, 113, 133, 0.95)', // Flash MX Crimson Rose
      'rgba(56, 189, 248, 0.90)',  // Web 2.0 Aqua Chrome
      'rgba(190, 155, 168, 0.78)',
      'rgba(115, 90, 105, 0.34)',
    ],
    filament: 'rgba(251, 113, 133, 0.16)',
    accentHex: '#fb7185',
    accentRgb: '251, 113, 133',
  },
  // Era 04: Mobile & Responsive (2007 — 2011) — Pure White + Capacitive Sky & Grid Violet
  {
    buckets: [
      'rgba(255, 255, 255, 0.99)',
      'rgba(228, 238, 252, 0.94)',
      'rgba(56, 189, 248, 0.95)',  // Capacitive Sky Blue
      'rgba(167, 139, 250, 0.88)', // 960 Grid Lavender
      'rgba(150, 175, 205, 0.78)',
      'rgba(85, 105, 135, 0.34)',
    ],
    filament: 'rgba(56, 189, 248, 0.16)',
    accentHex: '#38bdf8',
    accentRgb: '56, 189, 248',
  },
  // Era 05: Flat & Design Systems (2012 — 2015) — Pure White + Swiss Coral & Bauhaus Teal
  {
    buckets: [
      'rgba(255, 255, 255, 0.99)',
      'rgba(242, 238, 238, 0.94)',
      'rgba(248, 113, 113, 0.95)', // Swiss Vermilion Red
      'rgba(45, 212, 191, 0.88)',  // Bauhaus Token Teal
      'rgba(185, 165, 165, 0.78)',
      'rgba(110, 95, 95, 0.34)',
    ],
    filament: 'rgba(45, 212, 191, 0.16)',
    accentHex: '#2dd4bf',
    accentRgb: '45, 212, 191',
  },
  // Era 06: WebGL & Scrollytelling (2016 — 2022) — Pure White + GLSL Violet & Shader Cyan
  {
    buckets: [
      'rgba(255, 255, 255, 0.99)',
      'rgba(238, 230, 252, 0.94)',
      'rgba(192, 132, 252, 0.95)', // GLSL Normal-Map Violet
      'rgba(34, 211, 238, 0.90)',  // Fragment Shader Cyan
      'rgba(170, 150, 205, 0.78)',
      'rgba(100, 85, 130, 0.34)',
    ],
    filament: 'rgba(192, 132, 252, 0.17)',
    accentHex: '#c084fc',
    accentRgb: '192, 132, 252',
  },
  // Era 07: AI-Native & Generative UI (2023 — 2025) — Pure White + Synaptic Gold & Neural Indigo
  {
    buckets: [
      'rgba(255, 255, 255, 0.99)',
      'rgba(245, 238, 230, 0.94)',
      'rgba(251, 191, 36, 0.95)',  // Synaptic Attention Gold
      'rgba(129, 140, 248, 0.90)', // Latent Space Indigo
      'rgba(185, 175, 160, 0.78)',
      'rgba(110, 100, 95, 0.34)',
    ],
    filament: 'rgba(251, 191, 36, 0.16)',
    accentHex: '#fbbf24',
    accentRgb: '251, 191, 36',
  },
  // Era 08: The Spatial Horizon (2026+) — Pure White + Biophotonic Rose & Holographic Mint
  {
    buckets: [
      'rgba(255, 255, 255, 0.99)',
      'rgba(245, 232, 242, 0.94)',
      'rgba(244, 114, 182, 0.95)', // Biophotonic Rose-Quartz
      'rgba(94, 234, 212, 0.90)',  // Holographic Spatial Mint
      'rgba(185, 160, 180, 0.78)',
      'rgba(110, 90, 110, 0.34)',
    ],
    filament: 'rgba(244, 114, 182, 0.17)',
    accentHex: '#f472b6',
    accentRgb: '244, 114, 182',
  },
];

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

        const activeStory = activeStoryRef.current;
        const baseVariant = activeStory.sculptVariant % 3;

        // 3. Smooth Interactive 3D Rotation for Central Sculpture (with Click Spin Impulse)
        const isFlatPlane = era.shapeType === 'flat' && baseVariant === 0;
        const rotY =
          (era.shapeType === 'terminal' ||
          era.shapeType === 'table' ||
          era.shapeType === 'responsive' ||
          isFlatPlane
            ? Math.sin(time * 0.5) * 0.14 + mouse.smoothNormX * 0.18
            : time * 0.26 + mouse.smoothNormX * 0.34) + vortex.sculptSpinAngle;

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

          const vShift = activeStory.sculptVariant;
          if (hoverBoost > 0.2) {
            bucketIndices[i] = i % 2 === 0 ? 2 : 3;
          } else if (i < TEXT_PARTICLES) {
            const tier = textTiers[i]; // 0 = Headline, 1 = Story Lines, 2 = Kicker
            if (tier === 0) {
              bucketIndices[i] = (i + vShift) % 6 === 0 ? 2 : 0;
            } else if (tier === 1) {
              bucketIndices[i] = (i + vShift) % 6 === 0 ? 3 : 1;
            } else {
              bucketIndices[i] = i % 3 === 0 ? 3 : 2;
            }
          } else {
            const lum = shades[i] * perspective;
            if (lum > 0.8) {
              bucketIndices[i] = (i + vShift) % 3 === 0 ? 2 : 0;
            } else if (lum > 0.58) {
              bucketIndices[i] = (i + vShift) % 3 === 0 ? 3 : 1;
            } else if (lum > 0.35) {
              bucketIndices[i] = 4;
            } else {
              bucketIndices[i] = 5;
            }
          }
        }

        const palette = ERA_PARTICLE_PALETTES[eraIdx] || ERA_PARTICLE_PALETTES[0];

        // 4B. Batched Path Draw (6 fill() calls for all 9,600 particles)
        for (let b = 0; b < 6; b++) {
          ctx.fillStyle = palette.buckets[b];
          ctx.beginPath();
          const startIdx = b >= 4 ? TEXT_PARTICLES : 0;
          for (let i = startIdx; i < TOTAL_PARTICLES; i++) {
            if (bucketIndices[i] === b) {
              const sz = drawSizes[i];
              ctx.rect(screenX[i] - sz * 0.5, screenY[i] - sz * 0.5, sz + streak, sz);
            }
          }
          ctx.fill();
        }

        // 5. Subtle Era-Tinted Structural Filaments inside the 3D Sculpture
        ctx.lineWidth = 0.65;
        ctx.strokeStyle = palette.filament;
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
          const cardH = 48;

          era.sculptureCallouts.forEach((callout, cIdx) => {
            const line1 =
              cIdx === 0
                ? `${callout.code}.V${activeStory.sculptVariant + 1} // ${activeStory.word}`
                : cIdx === 2
                  ? `${callout.code} // ${phase.word}`
                  : `${callout.code} // ${callout.title}`;
            const line2 =
              cIdx === 0
                ? activeStory.kicker
                : cIdx === 2
                  ? phase.caption
                  : callout.value;

            // Measure exact text widths so the glass box always wraps the text with generous padding
            ctx.font = '700 10px "JetBrains Mono", monospace';
            const w1 = ctx.measureText(line1).width;
            ctx.font = '500 11px "DM Sans", sans-serif';
            const w2 = ctx.measureText(line2).width;

            const cardW = Math.max(188, Math.ceil(Math.max(w1, w2)) + 28);
            const maxOuterRadius = Math.max(300, Math.min(430, width * 0.5 - 312));
            const innerOffset = Math.max(105, maxOuterRadius - cardW);

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
            const cardEdgeX = centerX + dir * innerOffset;
            const cardX = isLeft ? cardEdgeX - cardW : cardEdgeX;
            const cardY = cardCenterY - cardH / 2;
            const elbowX = cardEdgeX - dir * 18;

            ctx.fillStyle = palette.accentHex;
            ctx.fillRect(ax - 2.5, ay - 2.5, 5, 5);
            ctx.strokeStyle = `rgba(${palette.accentRgb}, 0.65)`;
            ctx.lineWidth = 1;
            ctx.strokeRect(ax - 5.5, ay - 5.5, 11, 11);

            ctx.beginPath();
            ctx.strokeStyle = `rgba(${palette.accentRgb}, 0.38)`;
            ctx.lineWidth = 1;
            ctx.moveTo(ax, ay);
            ctx.lineTo(elbowX, cardCenterY);
            ctx.lineTo(cardEdgeX, cardCenterY);
            ctx.stroke();

            const boxGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
            boxGrad.addColorStop(0, 'rgba(255, 255, 255, 0.11)');
            boxGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)');
            boxGrad.addColorStop(1, 'rgba(8, 8, 8, 0.62)');

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

            ctx.fillStyle = palette.accentHex;
            ctx.fillRect(isLeft ? cardEdgeX - 2.5 : cardEdgeX + 0.5, cardY + 8, 2, cardH - 16);

            const textX = isLeft ? cardEdgeX - 13 : cardEdgeX + 13;
            ctx.textAlign = isLeft ? 'right' : 'left';
            ctx.textBaseline = 'middle';

            ctx.font = '700 10px "JetBrains Mono", monospace';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(line1, textX, cardY + 16);

            ctx.font = '500 11px "DM Sans", sans-serif';
            ctx.fillStyle = '#e5e5e5';
            ctx.fillText(line2, textX, cardY + 33);
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
            ctx.strokeStyle = `rgba(${palette.accentRgb}, ${(s * 0.48).toFixed(3)})`;
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

            // Crisp Era-accented square vertex anchors on linked constellation particles
            ctx.fillStyle = `rgba(${palette.accentRgb}, ${(s * 0.95).toFixed(3)})`;
            for (let n = 0; n < vortex.nodeCount; n++) {
              const pIdx = vortexNodes[n];
              ctx.fillRect(screenX[pIdx] - 2, screenY[pIdx] - 2, 4, 4);
            }
          }

          // 7B. Precision Architectural Lock-On Crosshair & Contracting Corner Brackets
          const bracketSpread = 14 + (1 - s) * 26;
          const bracketLen = 7;
          ctx.strokeStyle = `rgba(${palette.accentRgb}, ${(s * 0.88).toFixed(3)})`;
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
          ctx.fillStyle = `rgba(255, 255, 255, ${(s * 0.95).toFixed(3)})`;
          const coordStr = `VORTEX LOCK // ${vortex.normX >= 0 ? '+' : ''}${vortex.normX.toFixed(2)}X ${vortex.normY >= 0 ? '+' : ''}${vortex.normY.toFixed(2)}Y`;
          ctx.fillText(coordStr, tagX, vy - 7);
          ctx.fillStyle = `rgba(${palette.accentRgb}, ${(s * 0.85).toFixed(3)})`;
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
