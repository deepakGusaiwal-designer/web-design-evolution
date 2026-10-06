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
 * Generates bespoke, content-matched 3D particle sculptures for all 27 Key Milestones (tierMode === 2)
 */
function generateMilestoneSculpture(
  shape: ParticleShapeType,
  baseMode: number,
  i: number,
  t: number
): [number, number, number] {
  const ribbon = ((i % 3) - 1) * 0.0042;
  const zLayer = (i % 2 === 0 ? 1 : -1) * 0.014;
  let x = 0;
  let y = 0;
  let z = 0;

  switch (shape) {
    case 'sphere': {
      if (baseMode === 0) {
        // 1945 Vannevar Bush's Memex ("THE MEMEX"): Dual Microfilm Projection Screens + Associative Memory Trail Arch
        if (t < 0.56) {
          const isRight = t >= 0.28;
          const localT = (t - (isRight ? 0.28 : 0)) / 0.28;
          const cx = isRight ? 0.135 : -0.135;
          const sw = 0.095;
          const sh = 0.11;
          const edge = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - edge;
          if (edge === 0) { x = cx - sw + u * sw * 2; y = -sh; }
          else if (edge === 1) { x = cx - sw + u * sw * 2; y = sh; }
          else if (edge === 2) { x = cx - sw; y = -sh + u * sh * 2; }
          else { x = cx + sw; y = -sh + u * sh * 2; }
          z = (y + sh) * 0.18 + zLayer;
        } else if (t < 0.80) {
          // Overhead Associative Trail Arch connecting left and right microfilm screens
          const u = (t - 0.56) / 0.24;
          const archIdx = i % 2;
          x = (u - 0.5) * 0.27;
          y = -0.11 - Math.sin(u * Math.PI) * (0.095 + archIdx * 0.025);
          z = Math.sin(u * Math.PI) * 0.06;
        } else {
          // Memex Desk Console & Index Levers
          const u = (t - 0.80) / 0.20;
          x = (u - 0.5) * 0.52;
          y = 0.145 + ribbon;
          z = 0.03 + zLayer;
        }
      } else if (baseMode === 1) {
        // 1965 Ted Nelson ("XANADU LINKS"): Parallel Documents + Bidirectional Crisscrossing Transclusion Bridges
        if (t < 0.48) {
          const isRight = t >= 0.24;
          const localT = (t - (isRight ? 0.24 : 0)) / 0.24;
          const cx = isRight ? 0.20 : -0.20;
          const pw = 0.065;
          const ph = 0.155;
          const edge = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - edge;
          if (edge === 0) { x = cx - pw + u * pw * 2; y = -ph; }
          else if (edge === 1) { x = cx - pw + u * pw * 2; y = ph; }
          else if (edge === 2) { x = cx - pw; y = -ph + u * ph * 2; }
          else { x = cx + pw; y = -ph + u * ph * 2; }
          z = (isRight ? -0.02 : 0.02) + zLayer;
        } else {
          // 5 Bidirectional Xanadu Link Bridges crossing between documents
          const localT = (t - 0.48) / 0.52;
          const bridgeIdx = Math.min(4, Math.floor(localT * 5));
          const u = localT * 5 - bridgeIdx;
          const yStart = -0.11 + bridgeIdx * 0.055;
          const yEnd = 0.11 - bridgeIdx * 0.055;
          x = -0.135 + u * 0.27;
          y = yStart + (yEnd - yStart) * u + ribbon;
          z = Math.sin(u * Math.PI) * 0.065 * (bridgeIdx % 2 === 0 ? 1 : -1);
        }
      } else {
        // 1969 ARPANET ("LO AND BEHOLD"): UCLA <-> SRI IMP Nodes + Monumental "LO" Packet Letters
        if (t < 0.32) {
          // Left (UCLA) & Right (SRI) IMP Network Nodes
          const isRight = t >= 0.16;
          const u = (t - (isRight ? 0.16 : 0)) / 0.16;
          const ang = u * Math.PI * 2;
          const cx = isRight ? 0.24 : -0.24;
          x = cx + Math.cos(ang) * 0.052;
          y = Math.sin(ang) * 0.052;
          z = zLayer;
        } else if (t < 0.54) {
          // Center Letter 'L'
          const u = (t - 0.32) / 0.22;
          if (u < 0.62) {
            x = -0.095 + ribbon * 1.2;
            y = -0.085 + (u / 0.62) * 0.17;
          } else {
            x = -0.095 + ((u - 0.62) / 0.38) * 0.085;
            y = 0.085 + ribbon * 1.2;
          }
          z = 0.025 + zLayer;
        } else if (t < 0.80) {
          // Center Letter 'O'
          const u = (t - 0.54) / 0.26;
          const ang = u * Math.PI * 2;
          x = 0.055 + Math.cos(ang) * (0.055 + ribbon);
          y = Math.sin(ang) * (0.085 + ribbon);
          z = 0.025 + zLayer;
        } else {
          // Top & Bottom ARPANET 50kbps Packet Transmission Lines
          const u = (t - 0.80) / 0.20;
          const isTop = u < 0.5;
          const lu = isTop ? u * 2 : (u - 0.5) * 2;
          x = -0.24 + lu * 0.48;
          y = isTop ? -0.135 : 0.135;
          z = Math.sin(lu * Math.PI * 4) * 0.02;
        }
      }
      break;
    }

    case 'terminal': {
      if (baseMode === 0) {
        // 1990 The NeXTcube Server ("NEXT CUBE"): 1-Foot Isometric 3D Black Magnesium Cube + Optical Drive Slot
        const s = 0.155;
        if (t < 0.72) {
          const localT = t / 0.72;
          const edgeIdx = Math.min(11, Math.floor(localT * 12));
          const u = (localT * 12 - edgeIdx) * 2 - 1;
          const edges: [number, number, number, number, number, number][] = [
            [-1, -1, -1, 1, -1, -1], [-1, 1, -1, 1, 1, -1], [-1, -1, 1, 1, -1, 1], [-1, 1, 1, 1, 1, 1],
            [-1, -1, -1, -1, 1, -1], [1, -1, -1, 1, 1, -1], [-1, -1, 1, -1, 1, 1], [1, -1, 1, 1, 1, 1],
            [-1, -1, -1, -1, -1, 1], [1, -1, -1, 1, -1, 1], [-1, 1, -1, -1, 1, 1], [1, 1, -1, 1, 1, 1],
          ];
          const e = edges[edgeIdx];
          const alpha = (u + 1) * 0.5;
          x = (e[0] + (e[3] - e[0]) * alpha) * s + ribbon;
          y = (e[1] + (e[4] - e[1]) * alpha) * s;
          z = (e[2] + (e[5] - e[2]) * alpha) * s;
        } else {
          // Front Magneto-Optical Drive Slot & "DO NOT POWER DOWN" Sticker Badge
          const localT = (t - 0.72) / 0.28;
          if (localT < 0.55) {
            const u = localT / 0.55;
            x = (u - 0.5) * 0.22;
            y = -0.055 + ribbon;
            z = s;
          } else {
            const u = (localT - 0.55) / 0.45;
            const ang = u * Math.PI * 2;
            x = 0.065 + Math.cos(ang) * 0.032;
            y = 0.055 + Math.sin(ang) * 0.022;
            z = s;
          }
        }
      } else if (baseMode === 1) {
        // 1991 info.cern.ch Goes Live ("INFO.CERN.CH"): Top CERN WWW Globe + 4 Global Server Tree Nodes
        if (t < 0.38) {
          const u = t / 0.38;
          const phi = Math.acos(1 - 2 * u);
          const theta = Math.PI * (1 + Math.sqrt(5)) * i;
          const r = 0.075;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = -0.105 + r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        } else if (t < 0.70) {
          // 4 Root Directory Branches from CERN Globe to 4 Server Nodes
          const localT = (t - 0.38) / 0.32;
          const bIdx = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - bIdx;
          const targetX = -0.24 + bIdx * 0.16;
          x = targetX * u + ribbon;
          y = -0.03 + u * 0.155;
          z = (bIdx - 1.5) * 0.025 * u;
        } else {
          // 4 Bottom Terminal Server Boxes
          const localT = (t - 0.70) / 0.30;
          const nIdx = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - nIdx;
          const ang = u * Math.PI * 2;
          const cx = -0.24 + nIdx * 0.16;
          x = cx + Math.cos(ang) * 0.038;
          y = 0.145 + Math.sin(ang) * 0.028;
          z = (nIdx - 1.5) * 0.025;
        }
      } else {
        // 1993 NCSA Mosaic 1.0 ("INLINE <IMG>"): Classic <IMG> Picture Frame + Sun + Twin Mountain Peaks
        if (t < 0.42) {
          // Outer Picture Frame Border
          const localT = t / 0.42;
          const fw = 0.23;
          const fh = 0.155;
          const edge = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - edge;
          if (edge === 0) { x = -fw + u * fw * 2; y = -fh + ribbon; }
          else if (edge === 1) { x = -fw + u * fw * 2; y = fh + ribbon; }
          else if (edge === 2) { x = -fw + ribbon; y = -fh + u * fh * 2; }
          else { x = fw + ribbon; y = -fh + u * fh * 2; }
          z = zLayer;
        } else if (t < 0.62) {
          // Upper-Left Sun Circle inside the <IMG> Frame
          const u = (t - 0.42) / 0.20;
          const ang = u * Math.PI * 2;
          const sr = 0.038 + ribbon * 0.8;
          x = -0.115 + Math.cos(ang) * sr;
          y = -0.065 + Math.sin(ang) * sr;
          z = 0.022 + zLayer * 0.5;
        } else {
          // Twin Mountain Landscape Peaks inside the <IMG> Frame
          const u = (t - 0.62) / 0.38;
          if (u < 0.25) {
            const s = u / 0.25;
            x = -0.19 + s * 0.12;
            y = 0.115 - s * 0.11 + ribbon;
          } else if (u < 0.45) {
            const s = (u - 0.25) / 0.20;
            x = -0.07 + s * 0.055;
            y = 0.005 + s * 0.055 + ribbon;
          } else if (u < 0.72) {
            const s = (u - 0.45) / 0.27;
            x = -0.015 + s * 0.095;
            y = 0.060 - s * 0.135 + ribbon;
          } else {
            const s = (u - 0.72) / 0.28;
            x = 0.080 + s * 0.115;
            y = -0.075 + s * 0.190 + ribbon;
          }
          z = 0.022 + zLayer * 0.5;
        }
      }
      break;
    }

    case 'table': {
      if (baseMode === 0) {
        // 1995 Netscape Frames & JS ("FRAMESETS"): 3-Pane Split <FRAMESET> Window + Scrollbars
        if (t < 0.44) {
          const localT = t / 0.44;
          const fw = 0.27;
          const fh = 0.165;
          const edge = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - edge;
          if (edge === 0) { x = -fw + u * fw * 2; y = -fh + ribbon; }
          else if (edge === 1) { x = -fw + u * fw * 2; y = fh + ribbon; }
          else if (edge === 2) { x = -fw + ribbon; y = -fh + u * fh * 2; }
          else { x = fw + ribbon; y = -fh + u * fh * 2; }
          z = zLayer;
        } else if (t < 0.64) {
          // Top Frame Divider Bar
          const u = (t - 0.44) / 0.20;
          x = -0.27 + u * 0.54;
          y = -0.085 + ribbon;
          z = 0.015 + zLayer;
        } else if (t < 0.82) {
          // Left Sidebar Frame Vertical Splitter + Scrollbar Thumb
          const u = (t - 0.64) / 0.18;
          x = -0.095 + ribbon;
          y = -0.085 + u * 0.25;
          z = 0.015 + zLayer;
        } else {
          // Inner Content Frame JS Braces / Lines
          const u = (t - 0.82) / 0.18;
          const row = i % 3;
          x = -0.04 + u * 0.25;
          y = -0.02 + row * 0.065 + ribbon;
          z = 0.02 + zLayer;
        }
      } else if (baseMode === 1) {
        // 1996 David Siegel ("SLICED PSD"): 3x3 Exploded Sliced Image Grid + Guillotine Cut Guides
        if (t < 0.72) {
          const localT = t / 0.72;
          const cellIdx = Math.min(8, Math.floor(localT * 9));
          const u = localT * 9 - cellIdx;
          const col = cellIdx % 3;
          const row = Math.floor(cellIdx / 3);
          const cx = (col - 1) * 0.165;
          const cy = (row - 1) * 0.108;
          const cw = 0.058;
          const ch = 0.036;
          const edge = Math.min(3, Math.floor(u * 4));
          const eu = u * 4 - edge;
          if (edge === 0) { x = cx - cw + eu * cw * 2; y = cy - ch; }
          else if (edge === 1) { x = cx - cw + eu * cw * 2; y = cy + ch; }
          else if (edge === 2) { x = cx - cw; y = cy - ch + eu * ch * 2; }
          else { x = cx + cw; y = cy - ch + eu * ch * 2; }
          z = (( cellIdx % 2 === 0 ) ? 0.018 : -0.018) + zLayer * 0.5;
        } else {
          // 4 Guillotine Slice Guide Lines (2 Horizontal + 2 Vertical)
          const localT = (t - 0.72) / 0.28;
          const lineIdx = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - lineIdx;
          if (lineIdx < 2) {
            x = -0.28 + u * 0.56;
            y = lineIdx === 0 ? -0.054 : 0.054;
          } else {
            x = lineIdx === 2 ? -0.0825 : 0.0825;
            y = -0.175 + u * 0.35;
          }
          z = 0.03;
        }
      } else {
        // 1997 GeoCities ("GUESTBOOKS"): 3D Open Guestbook Pages + Digital Quill Pen
        if (t < 0.62) {
          // Left & Right Angled Open Book Pages
          const isRight = t >= 0.31;
          const localT = (t - (isRight ? 0.31 : 0)) / 0.31;
          const sign = isRight ? 1 : -1;
          const edge = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - edge;
          const pw = 0.21;
          const ph = 0.145;
          let lx = 0;
          let ly = 0;
          if (edge === 0) { lx = u * pw; ly = -ph; }
          else if (edge === 1) { lx = u * pw; ly = ph; }
          else if (edge === 2) { lx = 0; ly = -ph + u * ph * 2; }
          else { lx = pw; ly = -ph + u * ph * 2; }
          x = sign * lx;
          y = ly - Math.sin((lx / pw) * Math.PI) * 0.018;
          z = Math.abs(lx) * 0.18 - 0.02;
        } else if (t < 0.84) {
          // Signature Ruled Lines on Left & Right Pages
          const localT = (t - 0.62) / 0.22;
          const lineIdx = Math.min(5, Math.floor(localT * 6));
          const u = localT * 6 - lineIdx;
          const sign = lineIdx < 3 ? -1 : 1;
          const row = lineIdx % 3;
          x = sign * (0.035 + u * 0.145);
          y = -0.075 + row * 0.068;
          z = Math.abs(x) * 0.18;
        } else {
          // Diagonal Signing Stylus / Quill Pen on Right Page
          const u = (t - 0.84) / 0.16;
          x = 0.08 + u * 0.13;
          y = 0.065 - u * 0.19 + ribbon;
          z = 0.045 + u * 0.04;
        }
      }
      break;
    }

    case 'cascade': {
      if (baseMode === 0) {
        // 2001 2Advanced Studios ("SKIP INTRO"): Sci-Fi Preloader HUD Ring + Fast-Forward ">>|" Icon
        if (t < 0.46) {
          // Concentric Segmented Sci-Fi HUD Rings
          const u = t / 0.46;
          const isOuter = u < 0.55;
          const ang = (isOuter ? u / 0.55 : (u - 0.55) / 0.45) * Math.PI * 2;
          const r = isOuter ? 0.195 : 0.155;
          x = Math.cos(ang) * (r + ribbon);
          y = Math.sin(ang) * (r + ribbon);
          z = (isOuter ? -0.015 : 0.015) + zLayer * 0.5;
        } else if (t < 0.86) {
          // Twin Fast-Forward Triangles ">>"
          const localT = (t - 0.46) / 0.40;
          const triIdx = localT < 0.5 ? 0 : 1;
          const u = triIdx === 0 ? localT * 2 : (localT - 0.5) * 2;
          const ox = triIdx === 0 ? -0.085 : 0.005;
          if (u < 0.34) {
            const s = u / 0.34;
            x = ox;
            y = -0.065 + s * 0.13;
          } else if (u < 0.67) {
            const s = (u - 0.34) / 0.33;
            x = ox + s * 0.075;
            y = -0.065 + s * 0.065;
          } else {
            const s = (u - 0.67) / 0.33;
            x = ox + 0.075 - s * 0.075;
            y = s * 0.065;
          }
          z = 0.028 + zLayer * 0.5;
        } else {
          // Vertical Stop Bar "|" on the right of ">>|"
          const u = (t - 0.86) / 0.14;
          x = 0.102 + ribbon * 1.4;
          y = -0.068 + u * 0.136;
          z = 0.028 + zLayer * 0.5;
        }
      } else if (baseMode === 1) {
        // 2003 CSS Zen Garden ("ZEN GARDEN"): 3D 6-Petal Blooming Lotus + Raked Sand Ripple Rings
        if (t < 0.64) {
          const u = t / 0.64;
          const ang = u * Math.PI * 2;
          const petalR = 0.055 + Math.abs(Math.cos(ang * 3)) * 0.115;
          x = Math.cos(ang) * petalR;
          y = -0.02 + Math.sin(ang) * petalR * 0.72;
          z = Math.abs(Math.cos(ang * 3)) * 0.045 + zLayer * 0.5;
        } else {
          // 2 Concentric Raked Zen Sand Rings below the Lotus
          const localT = (t - 0.64) / 0.36;
          const ringIdx = localT < 0.5 ? 0 : 1;
          const u = ringIdx === 0 ? localT * 2 : (localT - 0.5) * 2;
          const ang = u * Math.PI * 2;
          const rx = ringIdx === 0 ? 0.21 : 0.28;
          const rz = ringIdx === 0 ? 0.12 : 0.16;
          x = Math.cos(ang) * rx;
          y = 0.125 + ringIdx * 0.025;
          z = Math.sin(ang) * rz;
        }
      } else {
        // 2005 Gmail & Google Maps ("LIVE CANVAS"): 3D Teardrop Map Pin + Draggable Tile Grid
        if (t < 0.42) {
          // Map Pin Outer Teardrop Silhouette
          const u = t / 0.42;
          if (u < 0.62) {
            // Upper circular dome of pin (-210 deg to +30 deg)
            const s = u / 0.62;
            const ang = (-Math.PI * 1.15) + s * (Math.PI * 1.30);
            const pr = 0.082 + ribbon;
            x = Math.cos(ang) * pr;
            y = -0.085 + Math.sin(ang) * pr;
          } else if (u < 0.81) {
            // Right cone down to pin tip
            const s = (u - 0.62) / 0.19;
            x = 0.073 * (1 - s) + ribbon;
            y = -0.048 + s * 0.125;
          } else {
            // Left cone up from pin tip
            const s = (u - 0.81) / 0.19;
            x = -0.073 * s + ribbon;
            y = 0.077 - s * 0.125;
          }
          z = 0.025 + zLayer * 0.5;
        } else if (t < 0.58) {
          // Map Pin Inner Circle Hole
          const u = (t - 0.42) / 0.16;
          const ang = u * Math.PI * 2;
          x = Math.cos(ang) * (0.034 + ribbon);
          y = -0.085 + Math.sin(ang) * (0.034 + ribbon);
          z = 0.03 + zLayer * 0.5;
        } else {
          // Perspective Draggable Map Tile Grid below Pin
          const localT = (t - 0.58) / 0.42;
          const lineIdx = Math.min(7, Math.floor(localT * 8));
          const u = localT * 8 - lineIdx;
          if (lineIdx < 4) {
            const gz = -0.12 + (lineIdx / 3) * 0.24;
            x = (u - 0.5) * 0.46;
            y = 0.125 + gz * 0.22;
            z = gz;
          } else {
            const gx = -0.23 + ((lineIdx - 4) / 3) * 0.46;
            const gz = (u - 0.5) * 0.24;
            x = gx;
            y = 0.125 + gz * 0.22;
            z = gz;
          }
        }
      }
      break;
    }

    case 'responsive': {
      if (baseMode === 0) {
        // 2007 iPhone & Mobile Safari ("MOBILE SAFARI"): iPhone Chassis + Home Button + Safari Compass Rose
        if (t < 0.38) {
          const u = t / 0.38;
          const ang = u * Math.PI * 2;
          const pw = 0.145;
          const ph = 0.215;
          x = Math.sign(Math.cos(ang)) * Math.pow(Math.abs(Math.cos(ang)), 0.28) * pw;
          y = Math.sign(Math.sin(ang)) * Math.pow(Math.abs(Math.sin(ang)), 0.28) * ph;
          z = zLayer;
        } else if (t < 0.68) {
          // Safari Compass Outer Dial Circle
          const u = (t - 0.38) / 0.30;
          const ang = u * Math.PI * 2;
          const cr = 0.082 + ribbon;
          x = Math.cos(ang) * cr;
          y = -0.02 + Math.sin(ang) * cr;
          z = 0.022 + zLayer * 0.5;
        } else if (t < 0.90) {
          // Tilted Compass Diamond Needle (4 Edges)
          const localT = (t - 0.68) / 0.22;
          const edge = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - edge;
          const pts: [number, number][] = [
            [0.048, -0.068],
            [0.015, -0.005],
            [-0.048, 0.028],
            [-0.015, -0.035],
          ];
          const p1 = pts[edge];
          const p2 = pts[(edge + 1) % 4];
          x = p1[0] + (p2[0] - p1[0]) * u + ribbon;
          y = p1[1] + (p2[1] - p1[1]) * u;
          z = 0.03;
        } else {
          // Iconic Bottom Circular Home Button
          const u = (t - 0.90) / 0.10;
          const ang = u * Math.PI * 2;
          x = Math.cos(ang) * 0.022;
          y = 0.168 + Math.sin(ang) * 0.022;
          z = 0.022;
        }
      } else if (baseMode === 1) {
        // 2010 Responsive Web Design ("FLUID MEDIA"): Elastic Viewport + Left/Right "<-->" Resize Arrows
        if (t < 0.44) {
          const localT = t / 0.44;
          const fw = 0.175;
          const fh = 0.145;
          const edge = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - edge;
          if (edge === 0) { x = -fw + u * fw * 2; y = -fh + ribbon; }
          else if (edge === 1) { x = -fw + u * fw * 2; y = fh + ribbon; }
          else if (edge === 2) { x = -fw + ribbon; y = -fh + u * fh * 2; }
          else { x = fw + ribbon; y = -fh + u * fh * 2; }
          z = zLayer;
        } else if (t < 0.76) {
          // Left '<' and Right '>' Outward Resize Arrows
          const localT = (t - 0.44) / 0.32;
          const side = localT < 0.5 ? -1 : 1;
          const u = localT < 0.5 ? localT * 2 : (localT - 0.5) * 2;
          if (u < 0.5) {
            const s = u * 2;
            x = side * (0.28 - s * 0.055);
            y = -s * 0.055 + ribbon;
          } else {
            const s = (u - 0.5) * 2;
            x = side * (0.28 - s * 0.055);
            y = s * 0.055 + ribbon;
          }
          z = 0.025;
        } else {
          // 2 Inner Fluid Wave Media Bars
          const localT = (t - 0.76) / 0.24;
          const waveIdx = localT < 0.5 ? 0 : 1;
          const u = waveIdx === 0 ? localT * 2 : (localT - 0.5) * 2;
          x = (u - 0.5) * 0.28;
          y = (waveIdx === 0 ? -0.045 : 0.045) + Math.sin(u * Math.PI * 2) * 0.032;
          z = 0.02;
        }
      } else {
        // 2011 Twitter Bootstrap 1.0 ("MOBILE FIRST"): Concentric Mobile -> Tablet -> Desktop Breakpoint Frames
        const tier = i % 3;
        const dims = [
          { w: 0.085, h: 0.145, z: 0.055 },  // Mobile Core (Front)
          { w: 0.175, h: 0.165, z: 0.0 },    // Tablet Mid
          { w: 0.275, h: 0.185, z: -0.055 }, // Desktop 12-Col (Back)
        ];
        const d = dims[tier];
        const edge = Math.floor(i / 3) % 4;
        const u = ((i * 29) % 100) / 100;
        if (edge === 0) { x = -d.w + u * d.w * 2; y = -d.h + ribbon; }
        else if (edge === 1) { x = -d.w + u * d.w * 2; y = d.h + ribbon; }
        else if (edge === 2) { x = -d.w + ribbon; y = -d.h + u * d.h * 2; }
        else { x = d.w + ribbon; y = -d.h + u * d.h * 2; }
        z = d.z;
      }
      break;
    }

    case 'flat': {
      if (baseMode === 0) {
        // 2013 Apple iOS 7 Reset ("FROSTED BLUR"): Translucent Control Center Sheet + 4 Circular Toggles + Sliders
        if (t < 0.38) {
          const localT = t / 0.38;
          const fw = 0.23;
          const fh = 0.165;
          const edge = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - edge;
          if (edge === 0) { x = -fw + u * fw * 2; y = -fh; }
          else if (edge === 1) { x = -fw + u * fw * 2; y = fh; }
          else if (edge === 2) { x = -fw; y = -fh + u * fh * 2; }
          else { x = fw; y = -fh + u * fh * 2; }
          z = zLayer;
        } else if (t < 0.72) {
          // 4 Hairline Circular Quick-Toggle Icons across the top row
          const localT = (t - 0.38) / 0.34;
          const cIdx = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - cIdx;
          const ang = u * Math.PI * 2;
          const cx = -0.142 + cIdx * 0.095;
          x = cx + Math.cos(ang) * 0.032;
          y = -0.075 + Math.sin(ang) * 0.032;
          z = 0.025;
        } else {
          // 2 Horizontal Brightness & Volume Slider Tracks + Knobs
          const localT = (t - 0.72) / 0.28;
          const sIdx = localT < 0.5 ? 0 : 1;
          const u = sIdx === 0 ? localT * 2 : (localT - 0.5) * 2;
          const sy = sIdx === 0 ? 0.025 : 0.095;
          if (u < 0.75) {
            x = -0.165 + (u / 0.75) * 0.33;
            y = sy + ribbon;
          } else {
            const ang = ((u - 0.75) / 0.25) * Math.PI * 2;
            const knobX = sIdx === 0 ? 0.045 : -0.035;
            x = knobX + Math.cos(ang) * 0.018;
            y = sy + Math.sin(ang) * 0.018;
          }
          z = 0.03;
        }
      } else if (baseMode === 1) {
        // 2014 Google Material Design ("QUANTUM PAPER"): Elevated Quantum Paper Cards + Floating '+' FAB & Ink Ripple
        if (t < 0.48) {
          // 2 Stepped Quantum Paper Cards
          const cardIdx = t < 0.24 ? 0 : 1;
          const localT = (t - cardIdx * 0.24) / 0.24;
          const ox = cardIdx === 0 ? -0.035 : 0.025;
          const oy = cardIdx === 0 ? -0.025 : 0.020;
          const cw = 0.21;
          const ch = 0.135;
          const edge = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - edge;
          if (edge === 0) { x = ox - cw + u * cw * 2; y = oy - ch; }
          else if (edge === 1) { x = ox - cw + u * cw * 2; y = oy + ch; }
          else if (edge === 2) { x = ox - cw; y = oy - ch + u * ch * 2; }
          else { x = ox + cw; y = oy - ch + u * ch * 2; }
          z = cardIdx === 0 ? -0.035 : 0.01;
        } else if (t < 0.82) {
          // Floating Action Button (FAB) Circle + Concentric Ink Ripple Ring
          const localT = (t - 0.48) / 0.34;
          const isOuterRipple = localT >= 0.55;
          const u = isOuterRipple ? (localT - 0.55) / 0.45 : localT / 0.55;
          const ang = u * Math.PI * 2;
          const r = isOuterRipple ? 0.095 : 0.052;
          x = 0.105 + Math.cos(ang) * (r + ribbon);
          y = 0.055 + Math.sin(ang) * (r + ribbon);
          z = isOuterRipple ? 0.035 : 0.055;
        } else {
          // '+' Plus Icon inside the Floating Action Button
          const localT = (t - 0.82) / 0.18;
          if (localT < 0.5) {
            x = 0.105 + (localT * 2 - 0.5) * 0.052;
            y = 0.055 + ribbon;
          } else {
            x = 0.105 + ribbon;
            y = 0.055 + ((localT - 0.5) * 2 - 0.5) * 0.052;
          }
          z = 0.062;
        }
      } else {
        // 2015 Figma & React Era ("COMPONENT UI"): 3 Intersecting React Atomic Orbits + 4-Diamond Component Icon
        if (t < 0.72) {
          const localT = t / 0.72;
          const orbitIdx = Math.min(2, Math.floor(localT * 3));
          const u = localT * 3 - orbitIdx;
          const ang = u * Math.PI * 2;
          const tilt = (orbitIdx * Math.PI) / 3;
          const ex = Math.cos(ang) * 0.245;
          const ey = Math.sin(ang) * 0.088;
          x = ex * Math.cos(tilt) - ey * Math.sin(tilt);
          y = ex * Math.sin(tilt) + ey * Math.cos(tilt);
          z = Math.sin(ang * 2 + orbitIdx) * 0.045;
        } else {
          // Central 4-Diamond Component Symbol (❖)
          const localT = (t - 0.72) / 0.28;
          const dIdx = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - dIdx;
          const offsets: [number, number][] = [
            [0, -0.042],
            [0.042, 0],
            [0, 0.042],
            [-0.042, 0],
          ];
          const [dcx, dcy] = offsets[dIdx];
          const edge = Math.min(3, Math.floor(u * 4));
          const eu = u * 4 - edge;
          const r = 0.022;
          const pts: [number, number][] = [[0, -r], [r, 0], [0, r], [-r, 0]];
          const p1 = pts[edge];
          const p2 = pts[(edge + 1) % 4];
          x = dcx + p1[0] + (p2[0] - p1[0]) * eu;
          y = dcy + p1[1] + (p2[1] - p1[1]) * eu;
          z = 0.035;
        }
      }
      break;
    }

    case 'wave3d': {
      if (baseMode === 0) {
        // 2016 Three.js Scene Graphs ("SCENE GRAPH"): 3D X/Y/Z Axes Gizmo + Wireframe Octahedron Mesh
        if (t < 0.36) {
          // 3 Orthogonal X, Y, Z Coordinate Axes
          const localT = t / 0.36;
          const axis = Math.min(2, Math.floor(localT * 3));
          const u = (localT * 3 - axis) * 2 - 1;
          if (axis === 0) { x = u * 0.26; y = ribbon; z = 0; }
          else if (axis === 1) { x = ribbon; y = u * 0.21; z = 0; }
          else { x = 0; y = ribbon; z = u * 0.26; }
        } else {
          // Central 3D Wireframe Octahedron (12 Edges)
          const localT = (t - 0.36) / 0.64;
          const edgeIdx = Math.min(11, Math.floor(localT * 12));
          const u = localT * 12 - edgeIdx;
          const r = 0.165;
          const verts: [number, number, number][] = [
            [0, -r, 0], [0, r, 0], [-r, 0, 0], [r, 0, 0], [0, 0, -r], [0, 0, r],
          ];
          const pairs: [number, number][] = [
            [0, 2], [0, 3], [0, 4], [0, 5],
            [1, 2], [1, 3], [1, 4], [1, 5],
            [2, 4], [4, 3], [3, 5], [5, 2],
          ];
          const [v1, v2] = pairs[edgeIdx];
          x = verts[v1][0] + (verts[v2][0] - verts[v1][0]) * u;
          y = verts[v1][1] + (verts[v2][1] - verts[v1][1]) * u;
          z = verts[v1][2] + (verts[v2][2] - verts[v1][2]) * u;
        }
      } else if (baseMode === 1) {
        // 2019 Editorial Scrollytelling ("CAMERA RIGS"): 3D Camera Frustum Pyramid + Curved Dolly Track
        if (t < 0.68) {
          const localT = t / 0.68;
          const edgeIdx = Math.min(7, Math.floor(localT * 8));
          const u = localT * 8 - edgeIdx;
          const apex: [number, number, number] = [-0.21, -0.02, 0];
          const far: [number, number, number][] = [
            [0.19, -0.13, -0.11],
            [0.19, 0.09, -0.11],
            [0.19, 0.09, 0.11],
            [0.19, -0.13, 0.11],
          ];
          if (edgeIdx < 4) {
            const fp = far[edgeIdx];
            x = apex[0] + (fp[0] - apex[0]) * u;
            y = apex[1] + (fp[1] - apex[1]) * u;
            z = apex[2] + (fp[2] - apex[2]) * u;
          } else {
            const p1 = far[edgeIdx - 4];
            const p2 = far[(edgeIdx - 3) % 4];
            x = p1[0] + (p2[0] - p1[0]) * u;
            y = p1[1] + (p2[1] - p1[1]) * u;
            z = p1[2] + (p2[2] - p1[2]) * u;
          }
        } else {
          // Curved Spline Dolly Rails Underneath
          const localT = (t - 0.68) / 0.32;
          const rail = localT < 0.5 ? -1 : 1;
          const u = localT < 0.5 ? localT * 2 : (localT - 0.5) * 2;
          x = (u - 0.5) * 0.54;
          y = 0.145 + Math.cos(u * Math.PI) * 0.025;
          z = rail * 0.045 + Math.sin(u * Math.PI) * 0.06;
        }
      } else {
        // 2022 WebGPU Compute Shaders ("GPU COMPUTE"): Silicon GPU Die Frame + 6x6 Parallel Compute Cores + Pins
        if (t < 0.28) {
          const localT = t / 0.28;
          const s = 0.155;
          const edge = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - edge;
          if (edge === 0) { x = -s + u * s * 2; y = -s; }
          else if (edge === 1) { x = -s + u * s * 2; y = s; }
          else if (edge === 2) { x = -s; y = -s + u * s * 2; }
          else { x = s; y = -s + u * s * 2; }
          z = zLayer;
        } else if (t < 0.72) {
          // 6x6 Parallel GPU Compute Core Matrix
          const localT = (t - 0.28) / 0.44;
          const coreIdx = Math.min(35, Math.floor(localT * 36));
          const col = coreIdx % 6;
          const row = Math.floor(coreIdx / 6);
          x = -0.105 + (col / 5) * 0.21 + ribbon;
          y = -0.105 + (row / 5) * 0.21 + ribbon;
          z = ((col + row) % 2 === 0 ? 0.022 : -0.022);
        } else {
          // Perimeter Silicon Contact Pins on all 4 sides
          const localT = (t - 0.72) / 0.28;
          const pinIdx = Math.min(31, Math.floor(localT * 32));
          const u = localT * 32 - pinIdx;
          const side = Math.floor(pinIdx / 8);
          const pos = -0.12 + ((pinIdx % 8) / 7) * 0.24;
          const len = 0.155 + u * 0.055;
          if (side === 0) { x = pos; y = -len; }
          else if (side === 1) { x = pos; y = len; }
          else if (side === 2) { x = -len; y = pos; }
          else { x = len; y = pos; }
          z = 0;
        }
      }
      break;
    }

    case 'neural': {
      if (baseMode === 0) {
        // 2023 Generative Code Synthesis ("TEXT TO APP"): Prompt Input "[ >_ ]" -> Neural Beams -> Live App Window
        if (t < 0.34) {
          // Left Prompt Input Box + '>' Chevron
          const localT = t / 0.34;
          if (localT < 0.7) {
            const u = localT / 0.7;
            const edge = Math.min(3, Math.floor(u * 4));
            const eu = u * 4 - edge;
            const cx = -0.185;
            const bw = 0.085;
            const bh = 0.055;
            if (edge === 0) { x = cx - bw + eu * bw * 2; y = -bh; }
            else if (edge === 1) { x = cx - bw + eu * bw * 2; y = bh; }
            else if (edge === 2) { x = cx - bw; y = -bh + eu * bh * 2; }
            else { x = cx + bw; y = -bh + eu * bh * 2; }
          } else {
            const u = (localT - 0.7) / 0.3;
            x = -0.22 + (u < 0.5 ? u * 2 : (1 - u) * 2) * 0.04;
            y = -0.025 + u * 0.05;
          }
          z = zLayer;
        } else if (t < 0.54) {
          // 3 Neural Compilation Streams Bridging Prompt -> App
          const localT = (t - 0.34) / 0.20;
          const stream = Math.min(2, Math.floor(localT * 3));
          const u = localT * 3 - stream;
          x = -0.095 + u * 0.15;
          y = (stream - 1) * 0.045 + Math.sin(u * Math.PI) * 0.025;
          z = Math.sin(u * Math.PI) * 0.04;
        } else {
          // Right Synthesized Multi-Card Application View
          const localT = (t - 0.54) / 0.46;
          const cx = 0.165;
          const aw = 0.105;
          const ah = 0.145;
          if (localT < 0.6) {
            const u = localT / 0.6;
            const edge = Math.min(3, Math.floor(u * 4));
            const eu = u * 4 - edge;
            if (edge === 0) { x = cx - aw + eu * aw * 2; y = -ah; }
            else if (edge === 1) { x = cx - aw + eu * aw * 2; y = ah; }
            else if (edge === 2) { x = cx - aw; y = -ah + eu * ah * 2; }
            else { x = cx + aw; y = -ah + eu * ah * 2; }
          } else {
            const u = (localT - 0.6) / 0.4;
            const row = i % 3;
            x = cx - 0.075 + u * 0.15;
            y = -0.075 + row * 0.075 + ribbon;
          }
          z = 0.02 + zLayer;
        }
      } else if (baseMode === 1) {
        // 2024 Live Artifact Canvases ("LIVE ARTIFACT"): Split Sandbox Frame + 3D Bar Chart + Live Wave Widget
        if (t < 0.42) {
          const localT = t / 0.42;
          const fw = 0.265;
          const fh = 0.155;
          const edge = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - edge;
          if (edge === 0) { x = -fw + u * fw * 2; y = -fh; }
          else if (edge === 1) { x = -fw + u * fw * 2; y = fh; }
          else if (edge === 2) { x = -fw; y = -fh + u * fh * 2; }
          else { x = fw; y = -fh + u * fh * 2; }
          z = zLayer;
        } else if (t < 0.72) {
          // 4 Ascending Interactive Data Bars on Left Half
          const localT = (t - 0.42) / 0.30;
          const barIdx = Math.min(3, Math.floor(localT * 4));
          const u = localT * 4 - barIdx;
          const heights = [0.07, 0.13, 0.18, 0.23];
          const bh = heights[barIdx];
          x = -0.20 + barIdx * 0.048 + ribbon * 1.5;
          y = 0.115 - u * bh;
          z = 0.025;
        } else {
          // Live Sine-Wave & Dial Widget on Right Half
          const u = (t - 0.72) / 0.28;
          x = 0.02 + u * 0.20;
          y = -0.01 + Math.sin(u * Math.PI * 3) * 0.075 + ribbon;
          z = 0.03;
        }
      } else {
        // 2025 Multi-Agent Swarms ("AGENT SWARM"): 6-Node Hexagonal Autonomous Mesh + Central Orchestrator
        if (t < 0.56) {
          // 6 Autonomous Agent Rings at Hexagon Vertices + Central Hub
          const localT = t / 0.56;
          const nodeIdx = Math.min(6, Math.floor(localT * 7));
          const u = localT * 7 - nodeIdx;
          const ang = u * Math.PI * 2;
          if (nodeIdx === 0) {
            x = Math.cos(ang) * 0.042;
            y = Math.sin(ang) * 0.042;
            z = 0.03;
          } else {
            const hexAngle = ((nodeIdx - 1) * Math.PI) / 3;
            const hcx = Math.cos(hexAngle) * 0.215;
            const hcy = Math.sin(hexAngle) * 0.155;
            x = hcx + Math.cos(ang) * 0.032;
            y = hcy + Math.sin(ang) * 0.032;
            z = (nodeIdx % 2 === 0 ? 0.035 : -0.035);
          }
        } else {
          // 6 Radial Orchestrator Spokes + 6 Hexagonal Perimeter Links
          const localT = (t - 0.56) / 0.44;
          const linkIdx = Math.min(11, Math.floor(localT * 12));
          const u = localT * 12 - linkIdx;
          if (linkIdx < 6) {
            const a = (linkIdx * Math.PI) / 3;
            x = Math.cos(a) * 0.215 * u;
            y = Math.sin(a) * 0.155 * u;
            z = 0;
          } else {
            const a1 = ((linkIdx - 6) * Math.PI) / 3;
            const a2 = ((linkIdx - 5) * Math.PI) / 3;
            x = Math.cos(a1) * 0.215 + (Math.cos(a2) * 0.215 - Math.cos(a1) * 0.215) * u;
            y = Math.sin(a1) * 0.155 + (Math.sin(a2) * 0.155 - Math.sin(a1) * 0.155) * u;
            z = 0;
          }
        }
      }
      break;
    }

    case 'singularity': {
      if (baseMode === 0) {
        // 2026 Spatial WebXR Native ("SPATIAL DOM"): 3 Curved Panoramic Room-Scale Glass Windows
        const winIdx = i % 3;
        const localT = t;
        const edge = Math.min(3, Math.floor((localT * 12) % 4));
        const u = (localT * 12) % 1;
        const baseAngle = (winIdx - 1) * 0.68;
        const spanAngle = 0.26;
        const wh = 0.115;
        let ang = baseAngle;
        let wy = 0;
        if (edge === 0) { ang = baseAngle - spanAngle + u * spanAngle * 2; wy = -wh; }
        else if (edge === 1) { ang = baseAngle - spanAngle + u * spanAngle * 2; wy = wh; }
        else if (edge === 2) { ang = baseAngle - spanAngle; wy = -wh + u * wh * 2; }
        else { ang = baseAngle + spanAngle; wy = -wh + u * wh * 2; }
        const arcR = 0.30;
        x = Math.sin(ang) * arcR;
        y = wy + ribbon;
        z = Math.cos(ang) * arcR - 0.24;
      } else if (baseMode === 1) {
        // 2028 Synaptic Intent Link ("SYNAPTIC LINK"): Biometric Retinal Focus Reticle + Neural Wave Filaments
        if (t < 0.56) {
          const localT = t / 0.56;
          const isOuter = localT < 0.55;
          const u = isOuter ? localT / 0.55 : (localT - 0.55) / 0.45;
          const ang = u * Math.PI * 2;
          const r = isOuter ? 0.145 : 0.068;
          x = Math.cos(ang) * (r + ribbon);
          y = Math.sin(ang) * (r + ribbon);
          z = isOuter ? -0.015 : 0.025;
        } else {
          // Left/Right Synaptic Intent Waves + Reticle Crosshairs
          const localT = (t - 0.56) / 0.44;
          if (localT < 0.5) {
            const u = localT * 2;
            x = (u - 0.5) * 0.56;
            y = Math.sin(u * Math.PI * 6) * 0.045 * (1 - Math.abs(u - 0.5) * 1.4);
            z = Math.cos(u * Math.PI * 6) * 0.045;
          } else {
            const u = (localT - 0.5) * 2;
            const isVert = u < 0.5;
            const s = (isVert ? u * 2 : (u - 0.5) * 2) * 2 - 1;
            x = isVert ? 0 : s * 0.19;
            y = isVert ? s * 0.19 : 0;
            z = 0.02;
          }
        }
      } else {
        // ∞ Pure Living Light ("PURE LIGHT"): 3D Lemniscate Infinity Symbol (∞) + Radial Photon Beams
        if (t < 0.72) {
          const u = t / 0.72;
          const a = u * Math.PI * 2;
          const denom = 1 + Math.sin(a) * Math.sin(a);
          const scale = 0.275;
          x = (scale * Math.cos(a)) / denom + ribbon;
          y = (scale * Math.sin(a) * Math.cos(a)) / denom * 1.15 + ribbon;
          z = Math.sin(a * 2) * 0.055;
        } else {
          // 12 Radial Photon Starburst Rays
          const localT = (t - 0.72) / 0.28;
          const rayIdx = Math.min(11, Math.floor(localT * 12));
          const u = localT * 12 - rayIdx;
          const ang = (rayIdx / 12) * Math.PI * 2;
          const r = 0.14 + u * 0.14;
          x = Math.cos(ang) * r * 1.25;
          y = Math.sin(ang) * r * 0.85;
          z = (rayIdx % 2 === 0 ? 1 : -1) * u * 0.06;
        }
      }
      break;
    }
  }

  return [x, y, z];
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

    if (tierMode === 2) {
      [x, y, z] = generateMilestoneSculpture(shape, baseMode, i, t);
      coords[i * 3] = x;
      coords[i * 3 + 1] = y + 0.24;
      coords[i * 3 + 2] = z;
      continue;
    }

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
          // Variant 2 ("THE ANCHOR TAG"): Volumetric 3D </a> Tag Sculpture + Hypertext Underline
          const thick = (((i * 13) % 100) / 100 - 0.5) * 0.022;
          const thickY = (((i * 19) % 100) / 100 - 0.5) * 0.022;
          const depthZ = (((i * 29) % 100) / 100 - 0.5) * 0.052;

          if (t < 0.23) {
            // 1. '<' Left Chevron Bracket (x: -0.34 to -0.19, y: -0.12 to +0.12)
            const localT = t / 0.23;
            if (localT < 0.5) {
              const s = localT * 2; // top-right (-0.19, -0.12) -> tip (-0.34, 0)
              x = -0.19 - s * 0.15 + thick * 0.5;
              y = -0.12 + s * 0.12 + thickY;
            } else {
              const s = (localT - 0.5) * 2; // tip (-0.34, 0) -> bottom-right (-0.19, +0.12)
              x = -0.34 + s * 0.15 + thick * 0.5;
              y = s * 0.12 + thickY;
            }
            z = depthZ;
          } else if (t < 0.43) {
            // 2. '/' Forward Slash (bottom-left -0.14,+0.14 to top-right -0.02,-0.14)
            const s = (t - 0.23) / 0.20;
            x = -0.14 + s * 0.12 + thick * 0.85;
            y = 0.14 - s * 0.28 + thickY * 0.4;
            z = depthZ;
          } else if (t < 0.72) {
            // 3. 'a' Lowercase Glyph (oval bowl + right vertical stem, x: 0.02 to 0.145)
            const localT = (t - 0.43) / 0.29;
            if (localT < 0.72) {
              const angle = (localT / 0.72) * Math.PI * 2;
              const rx = 0.058 + thick * 0.45;
              const ry = 0.082 + thickY * 0.45;
              x = 0.078 + Math.cos(angle) * rx;
              y = 0.022 + Math.sin(angle) * ry;
            } else {
              const stemT = (localT - 0.72) / 0.28;
              x = 0.138 + thick * 0.75;
              y = -0.062 + stemT * 0.175;
            }
            z = depthZ;
          } else if (t < 0.92) {
            // 4. '>' Right Chevron Bracket (x: 0.20 to 0.35, y: -0.12 to +0.12)
            const localT = (t - 0.72) / 0.20;
            if (localT < 0.5) {
              const s = localT * 2; // top-left (0.20, -0.12) -> tip (0.35, 0)
              x = 0.20 + s * 0.15 + thick * 0.5;
              y = -0.12 + s * 0.12 + thickY;
            } else {
              const s = (localT - 0.5) * 2; // tip (0.35, 0) -> bottom-left (0.20, +0.12)
              x = 0.35 - s * 0.15 + thick * 0.5;
              y = s * 0.12 + thickY;
            }
            z = depthZ;
          } else {
            // 5. Classic Hypertext Underline Bar beneath </a>
            const s = (t - 0.92) / 0.08;
            x = -0.34 + s * 0.69;
            y = 0.168 + thickY * 0.35;
            z = depthZ * 0.5;
          }
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
          // Variant 2 ("BLINK & MARQUEE"): Continuous 3-Block <MARQUEE> Ticker + GeoCities Orbit Ring
          const marqueeCount = Math.floor(count * 0.66);
          if (i < marqueeCount) {
            const perPane = Math.floor(marqueeCount / 3);
            const pane = Math.min(2, Math.floor(i / perPane));
            const localI = i - pane * perPane;
            const rows = 16;
            const cols = Math.max(1, Math.floor(perPane / rows));
            // Column-major ordering so each vertical column wraps together on the same frame
            const row = localI % rows;
            const col = Math.floor(localI / rows) % cols;
            const cx = (pane - 1) * 0.21; // -0.21, 0.0, +0.21 (periodic span = 0.63)
            const lx = (col / Math.max(1, cols - 1) - 0.5) * 0.15;
            const ly = (row / (rows - 1) - 0.5) * 0.23;
            x = cx + lx;
            y = ly;
            z = 0;
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
          // Variant 0 ("THE CASCADE"): 3D CSS Shield Emblem + { } Curly Braces + Cascading Style Sheets
          const thick = (((i * 13) % 100) / 100 - 0.5) * 0.015;
          const thickY = (((i * 19) % 100) / 100 - 0.5) * 0.015;
          const depthZ = (((i * 29) % 100) / 100 - 0.5) * 0.032;

          if (t < 0.30) {
            // 1. Iconic 5-Sided CSS Shield Crest (Outer Shield + Inner Bevel Crest)
            const shieldLayer = t < 0.17 ? 0 : 1;
            const localT = shieldLayer === 0 ? t / 0.17 : (t - 0.17) / 0.13;
            const scale = shieldLayer === 0 ? 1.0 : 0.84;
            const verts: [number, number][] = [
              [-0.175 * scale, -0.155 * scale],
              [0.175 * scale, -0.155 * scale],
              [0.142 * scale, 0.075 * scale],
              [0.0, 0.178 * scale],
              [-0.142 * scale, 0.075 * scale],
            ];
            const segFloat = localT * 5;
            const segIdx = Math.min(4, Math.floor(segFloat));
            const s = segFloat - segIdx;
            const vA = verts[segIdx];
            const vB = verts[(segIdx + 1) % 5];
            x = vA[0] + (vB[0] - vA[0]) * s + thick;
            y = vA[1] + (vB[1] - vA[1]) * s + thickY;
            z = (shieldLayer === 0 ? 0.035 : -0.015) + depthZ;
          } else if (t < 0.46) {
            // 2. Left CSS Curly Brace '{' inside the Shield
            const s = (t - 0.30) / 0.16;
            if (s < 0.18) {
              const u = s / 0.18;
              x = -0.055 - u * 0.030 + thick * 0.6;
              y = -0.095 + u * 0.016 + thickY * 0.6;
            } else if (s < 0.42) {
              const u = (s - 0.18) / 0.24;
              x = -0.085 + thick * 0.6;
              y = -0.079 + u * 0.046;
            } else if (s < 0.58) {
              const u = (s - 0.42) / 0.16;
              const cusp = u < 0.5 ? u * 2 : (1 - u) * 2;
              x = -0.085 - cusp * 0.026 + thick * 0.5;
              y = -0.033 + u * 0.026 + thickY * 0.5;
            } else if (s < 0.82) {
              const u = (s - 0.58) / 0.24;
              x = -0.085 + thick * 0.6;
              y = -0.007 + u * 0.046;
            } else {
              const u = (s - 0.82) / 0.18;
              x = -0.085 + u * 0.030 + thick * 0.6;
              y = 0.039 + u * 0.016 + thickY * 0.6;
            }
            z = 0.045 + depthZ * 0.6;
          } else if (t < 0.62) {
            // 3. Right CSS Curly Brace '}' inside the Shield
            const s = (t - 0.46) / 0.16;
            if (s < 0.18) {
              const u = s / 0.18;
              x = 0.055 + u * 0.030 + thick * 0.6;
              y = -0.095 + u * 0.016 + thickY * 0.6;
            } else if (s < 0.42) {
              const u = (s - 0.18) / 0.24;
              x = 0.085 + thick * 0.6;
              y = -0.079 + u * 0.046;
            } else if (s < 0.58) {
              const u = (s - 0.42) / 0.16;
              const cusp = u < 0.5 ? u * 2 : (1 - u) * 2;
              x = 0.085 + cusp * 0.026 + thick * 0.5;
              y = -0.033 + u * 0.026 + thickY * 0.5;
            } else if (s < 0.82) {
              const u = (s - 0.58) / 0.24;
              x = 0.085 + thick * 0.6;
              y = -0.007 + u * 0.046;
            } else {
              const u = (s - 0.82) / 0.18;
              x = 0.085 - u * 0.030 + thick * 0.6;
              y = 0.039 + u * 0.016 + thickY * 0.6;
            }
            z = 0.045 + depthZ * 0.6;
          } else if (t < 0.76) {
            // 4. 3 Cascading CSS Property Bars inside '{ }'
            const localT = (t - 0.62) / 0.14;
            const barIdx = Math.min(2, Math.floor(localT * 3));
            const s = (localT * 3) - barIdx;
            const barW = barIdx === 1 ? 0.046 : 0.036;
            x = -barW + s * barW * 2;
            y = -0.056 + barIdx * 0.038 + thickY * 0.5;
            z = 0.05 + depthZ * 0.5;
          } else {
            // 5. 3 Cascading Isometric Style Sheet Layers Flanking the CSS Shield
            const localT = (t - 0.76) / 0.24;
            const sheetIdx = Math.min(2, Math.floor(localT * 3));
            const s = (localT * 3) - sheetIdx;
            const side = sheetIdx % 2 === 0 ? -1 : 1;
            const cx = side * (0.24 + sheetIdx * 0.025);
            const cy = -0.05 + sheetIdx * 0.055;
            const sw = 0.068;
            const sh = 0.085;
            const edgeFloat = s * 4;
            const edge = Math.min(3, Math.floor(edgeFloat));
            const u = edgeFloat - edge;
            if (edge === 0) { x = cx - sw + u * sw * 2; y = cy - sh; }
            else if (edge === 1) { x = cx + sw; y = cy - sh + u * sh * 2; }
            else if (edge === 2) { x = cx + sw - u * sw * 2; y = cy + sh; }
            else { x = cx - sw; y = cy + sh - u * sh * 2; }
            z = -0.05 - sheetIdx * 0.045 + depthZ * 0.5;
          }
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
          // Variant 2: 3D Retina Display Monitor & Optic Eye Icon
          const ribbon = ((i % 3) - 1) * 0.0042;
          const zLayer = (i % 2 === 0 ? 1 : -1) * 0.012;

          if (t < 0.28) {
            // 1. Rounded Monitor Outer Bezel (with signature right-edge architectural gap)
            const localT = t / 0.28;
            const cr = 0.028;
            if (localT < 0.26) {
              // Top horizontal edge
              const u = localT / 0.26;
              x = -0.272 + u * 0.544;
              y = -0.185 + ribbon;
            } else if (localT < 0.52) {
              // Bottom horizontal edge
              const u = (localT - 0.26) / 0.26;
              x = -0.272 + u * 0.544;
              y = 0.095 + ribbon;
            } else if (localT < 0.68) {
              // Left vertical edge
              const u = (localT - 0.52) / 0.16;
              x = -0.30 + ribbon;
              y = -0.157 + u * 0.224;
            } else if (localT < 0.76) {
              // Right vertical edge (upper segment above break)
              const u = (localT - 0.68) / 0.08;
              x = 0.30 + ribbon;
              y = -0.157 + u * 0.089;
            } else if (localT < 0.84) {
              // Right vertical edge (lower segment below break)
              const u = (localT - 0.76) / 0.08;
              x = 0.30 + ribbon;
              y = -0.018 + u * 0.085;
            } else {
              // 4 Rounded quarter-circle corners
              const cT = (localT - 0.84) / 0.16;
              const cornerIdx = Math.min(3, Math.floor(cT * 4));
              const u = cT * 4 - cornerIdx;
              const baseAngles = [Math.PI, Math.PI * 1.5, 0, Math.PI * 0.5];
              const cxArr = [-0.272, 0.272, 0.272, -0.272];
              const cyArr = [-0.157, -0.157, 0.067, 0.067];
              const ang = baseAngles[cornerIdx] + u * (Math.PI * 0.5);
              x = cxArr[cornerIdx] + Math.cos(ang) * (cr + ribbon);
              y = cyArr[cornerIdx] + Math.sin(ang) * (cr + ribbon);
            }
            z = zLayer;
          } else if (t < 0.48) {
            // 2. Top & Bottom Bezel Divider Lines + Centered Inner Bars
            const localT = (t - 0.28) / 0.20;
            if (localT < 0.30) {
              // Top full-width divider line
              const u = localT / 0.30;
              x = -0.30 + u * 0.60;
              y = -0.130 + ribbon * 0.8;
            } else if (localT < 0.50) {
              // Top centered accent bar
              const u = (localT - 0.30) / 0.20;
              x = -0.185 + u * 0.370;
              y = -0.158 + ribbon;
            } else if (localT < 0.80) {
              // Bottom full-width chin divider line
              const u = (localT - 0.50) / 0.30;
              x = -0.30 + u * 0.60;
              y = 0.040 + ribbon * 0.8;
            } else {
              // Bottom centered accent bar
              const u = (localT - 0.80) / 0.20;
              x = -0.185 + u * 0.370;
              y = 0.068 + ribbon;
            }
            z = zLayer;
          } else if (t < 0.66) {
            // 3. Central Retina Almond Eye Outline (Upper & Lower Arches)
            const localT = (t - 0.48) / 0.18;
            const isUpper = localT < 0.5;
            const u = isUpper ? localT * 2 : (localT - 0.5) * 2;
            const archSign = isUpper ? -1 : 1;
            x = (u - 0.5) * 0.360;
            y = -0.045 + archSign * Math.sin(u * Math.PI) * 0.066 + ribbon;
            z = 0.024 + zLayer * 0.5;
          } else if (t < 0.84) {
            // 4. Retina Iris Ring with Dual Opposing Crescent Glint Cutouts
            const localT = (t - 0.66) / 0.18;
            const eyeCy = -0.045;
            const irisR = 0.046;
            if (localT < 0.56) {
              // Outer Iris Ring arcs (between top-right and bottom-left crescent notches)
              const subT = localT / 0.56;
              const arcHalf = subT < 0.5 ? 0 : 1;
              const u = arcHalf === 0 ? subT * 2 : (subT - 0.5) * 2;
              const startAngle = arcHalf === 0 ? 0.05 : 3.19;
              const ang = startAngle + u * 1.90;
              x = Math.cos(ang) * (irisR + ribbon * 0.85);
              y = eyeCy + Math.sin(ang) * (irisR + ribbon * 0.85);
            } else {
              // Dual inward-curving crescent glint cutouts (top-right & bottom-left)
              const subT = (localT - 0.56) / 0.44;
              const notchIdx = subT < 0.5 ? 0 : 1;
              const u = notchIdx === 0 ? subT * 2 : (subT - 0.5) * 2;
              const notchCenterAngle = notchIdx === 0 ? -0.55 : 2.59;
              const ncx = Math.cos(notchCenterAngle) * irisR;
              const ncy = eyeCy + Math.sin(notchCenterAngle) * irisR;
              const inwardBase = notchCenterAngle + Math.PI - 0.95;
              const ang = inwardBase + u * 1.90;
              const notchR = 0.025 + ribbon * 0.7;
              x = ncx + Math.cos(ang) * notchR;
              y = ncy + Math.sin(ang) * notchR;
            }
            z = 0.032 + zLayer * 0.5;
          } else {
            // 5. Angled Monitor Neck Struts & Rounded Pill Stand Base
            const localT = (t - 0.84) / 0.16;
            if (localT < 0.34) {
              // Left & Right sloped neck struts
              const subT = localT / 0.34;
              const sideSign = subT < 0.5 ? -1 : 1;
              const u = subT < 0.5 ? subT * 2 : (subT - 0.5) * 2;
              x = sideSign * (0.068 + u * 0.024) + ribbon;
              y = 0.095 + u * 0.067;
            } else if (localT < 0.62) {
              // Pill Base top horizontal edge
              const u = (localT - 0.34) / 0.28;
              x = -0.132 + u * 0.264;
              y = 0.162 + ribbon * 0.85;
            } else if (localT < 0.90) {
              // Pill Base bottom horizontal edge
              const u = (localT - 0.62) / 0.28;
              x = -0.132 + u * 0.264;
              y = 0.198 + ribbon * 0.85;
            } else {
              // Pill Base left & right semicircular caps
              const subT = (localT - 0.90) / 0.10;
              const isLeftCap = subT < 0.5;
              const u = isLeftCap ? subT * 2 : (subT - 0.5) * 2;
              const ang = (isLeftCap ? Math.PI * 0.5 : -Math.PI * 0.5) + u * Math.PI;
              const capCx = isLeftCap ? -0.132 : 0.132;
              x = capCx + Math.cos(ang) * (0.018 + ribbon * 0.7);
              y = 0.180 + Math.sin(ang) * (0.018 + ribbon * 0.7);
            }
            z = zLayer;
          }
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
        const sculptVar = activeStory.sculptVariant;
        const isPhaseTier = sculptVar < 3;
        const isMilestoneTier = sculptVar >= 6;
        const baseVariant = sculptVar % 3;

        // 3. Smooth Interactive 3D Rotation for Central Sculpture (with Click Spin Impulse & Scroll Yaw)
        const isFlatPlane =
          era.shapeType === 'flat' && (baseVariant === 0 || baseVariant === 2);
        const rotY =
          (isMilestoneTier ||
          era.shapeType === 'terminal' ||
          era.shapeType === 'table' ||
          era.shapeType === 'responsive' ||
          isFlatPlane
            ? Math.sin(time * 0.5) * 0.14 + mouse.smoothNormX * 0.18
            : time * 0.26 + mouse.smoothNormX * 0.34) +
          vortex.sculptSpinAngle +
          starTrackVel * 1.4;

        const rotX =
          !isMilestoneTier && era.shapeType === 'wave3d'
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
            if (isMilestoneTier) {
              // Subtle 3D harmonic breathing & depth shimmer for all 27 Key Milestone sculptures
              ty += Math.sin(time * 2.2 + tx * 6.0) * 0.011;
              tz += Math.cos(time * 2.2 + (ty - 0.24) * 6.0) * 0.016;
            } else if (era.shapeType === 'wave3d' && baseVariant === 0) {
              const d = Math.sqrt(tx * tx + tz * tz);
              ty = Math.sin(d * 14.0 - time * 3.0) * 0.09 + 0.24;
            } else if (era.shapeType === 'cascade') {
              if (baseVariant === 0) {
                const relT = (i - TEXT_PARTICLES) / SCULPT_PARTICLES;
                if (relT < 0.30) {
                  // CSS Shield Crest: smooth 3D levitation & bevel wave
                  ty += Math.sin(time * 2.6 + tx * 5.0) * 0.014;
                  tz += Math.cos(time * 2.6 + ty * 6.0) * 0.022;
                } else if (relT < 0.62) {
                  // '{ }' Curly Braces: rhythmic horizontal breathing pulse
                  const bracePulse = 1.0 + Math.sin(time * 3.4) * 0.09;
                  tx *= bracePulse;
                  ty += Math.sin(time * 2.6) * 0.014;
                } else if (relT < 0.76) {
                  // 3 Inner CSS Rule Bars: continuous downward waterfall cascade
                  const localT = (relT - 0.62) / 0.14;
                  const barIdx = Math.min(2, Math.floor(localT * 3));
                  const flow = ((time * 0.65 + barIdx * 0.333) % 1.0) - 0.5;
                  ty = 0.24 - 0.02 + flow * 0.115;
                  tz += Math.cos(flow * Math.PI) * 0.035;
                } else {
                  // 3 Flanking Cascading Style Sheet Frames: sequential 3D cascade wave
                  const localT = (relT - 0.76) / 0.24;
                  const sheetIdx = Math.min(2, Math.floor(localT * 3));
                  const wave = Math.sin(time * 3.5 - sheetIdx * 1.35);
                  ty += wave * 0.034;
                  tz += Math.cos(time * 3.5 - sheetIdx * 1.35) * 0.042;
                }
              } else {
                ty += Math.sin(tx * 12.0 + time * 3.6) * 0.035;
              }
            } else if (era.shapeType === 'flat' && baseVariant === 2) {
              // Live Retina Display Eye & Iris Optical Tracking Animation
              const relT = (i - TEXT_PARTICLES) / SCULPT_PARTICLES;
              if (relT >= 0.48 && relT < 0.66) {
                // Eyelid arches: subtle vertical breathing & Z-depth pulse
                const eyeCenterY = 0.24 - 0.045;
                const blinkScale = 1.0 + Math.sin(time * 2.4) * 0.07;
                ty = eyeCenterY + (ty - eyeCenterY) * blinkScale;
                tz += Math.sin(time * 2.4) * 0.016;
              } else if (relT >= 0.66 && relT < 0.84) {
                // Retina Iris & Crescent Glint: interactive optical gaze + harmonic focus pulse
                const gazeX = Math.sin(time * 1.9) * 0.016 + mouse.smoothNormX * 0.024;
                const gazeY = Math.cos(time * 1.4) * 0.008 + mouse.smoothNormY * 0.012;
                tx += gazeX;
                ty += gazeY;
                tz += 0.018 + Math.cos(time * 2.8) * 0.018;
              }
            } else if (
              isPhaseTier &&
              era.shapeType === 'table' &&
              baseVariant === 2 &&
              i - TEXT_PARTICLES < Math.floor(SCULPT_PARTICLES * 0.66)
            ) {
              // Continuous <MARQUEE> horizontal scroll for the 3 triptych blocks
              const marqueeStep = 0.0022 + Math.abs(starTrackVel) * 0.35;
              targets[i3] -= marqueeStep;
              if (targets[i3] < -0.315) {
                const wrapSpan = 0.63;
                targets[i3] += wrapSpan;
                current[i3] += wrapSpan * cosY;
                current[i3 + 1] -= wrapSpan * sinY * sinX;
                current[i3 + 2] += wrapSpan * sinY * cosX;
                vel[i3] = 0;
              }
              tx = targets[i3];
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

          // Subtle galactic core halo (keeps space pure #000000 black)
          const nebGrad = ctx.createRadialGradient(gx, gy, 1, gx, gy, grx * 0.65);
          nebGrad.addColorStop(0, 'rgba(255, 255, 255, 0.045)');
          nebGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.012)');
          nebGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = nebGrad;
          ctx.beginPath();
          ctx.arc(gx, gy, grx * 0.65, 0, Math.PI * 2);
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

          const curOverride = stateRef.current.overrideWord;
          const activeMilestone = curOverride
            ? era.milestones.find((m) => m.particleWord === curOverride)
            : undefined;
          const activeSpec = curOverride
            ? era.specs.find((s) => s.particleWord === curOverride)
            : undefined;

          era.sculptureCallouts.forEach((callout, cIdx) => {
            let line1 =
              cIdx === 0
                ? `${callout.code}.V${activeStory.sculptVariant + 1} // ${callout.title}`
                : `${callout.code} // ${callout.title}`;
            let line2 = callout.value;

            if (activeMilestone) {
              const mLabels: [string, string][] = [
                [`MS.${activeMilestone.year} // KEY MILESTONE`, activeMilestone.title],
                [`NODE.02 // PARTICLE GLYPH`, `Active: [${activeMilestone.particleWord}]`],
                [`HIST.03 // ${activeMilestone.year} ARCHIVE`, activeMilestone.story.line1],
                [`IMPACT.04 // EVOLUTION`, activeMilestone.story.line2],
              ];
              [line1, line2] = mLabels[cIdx] || [line1, line2];
            } else if (activeSpec) {
              const sLabels: [string, string][] = [
                [`SPEC.01 // ${activeSpec.label}`, activeSpec.value],
                [`NODE.02 // PARTICLE GLYPH`, `Active: [${activeSpec.particleWord}]`],
                [`ARCH.03 // SPECIFICATION`, activeSpec.story.line1],
                [`SYST.04 // IMPLEMENTATION`, activeSpec.story.line2],
              ];
              [line1, line2] = sLabels[cIdx] || [line1, line2];
            }

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

            // Pure Pitch-Black Onyx Liquid Glass Diagonal + Upper Dome Gloss Surface
            const boxGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
            boxGrad.addColorStop(0, 'rgba(10, 10, 10, 0.90)');
            boxGrad.addColorStop(0.35, 'rgba(3, 3, 3, 0.93)');
            boxGrad.addColorStop(0.70, 'rgba(0, 0, 0, 0.95)');
            boxGrad.addColorStop(1, 'rgba(8, 8, 8, 0.92)');

            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardW, cardH, 11);
            ctx.fillStyle = boxGrad;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.lineWidth = 0.75;
            ctx.stroke();

            // Upper curved liquid dome gloss reflection (subtle on pure black)
            const domeGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH * 0.46);
            domeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
            domeGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.015)');
            domeGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.beginPath();
            ctx.roundRect(cardX + 1.5, cardY + 1.5, cardW - 3, cardH * 0.44, [9, 9, 22, 22]);
            ctx.fillStyle = domeGrad;
            ctx.fill();

            // Top curved liquid meniscus hairline specular highlight arc
            const topSpec = ctx.createLinearGradient(cardX + 12, cardY, cardX + cardW - 12, cardY);
            topSpec.addColorStop(0, 'rgba(255, 255, 255, 0)');
            topSpec.addColorStop(0.5, 'rgba(255, 255, 255, 0.28)');
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
            botSpec.addColorStop(0.5, 'rgba(255, 255, 255, 0.14)');
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
