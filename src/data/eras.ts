export type ParticleShapeType =
  | 'sphere'
  | 'terminal'
  | 'table'
  | 'cascade'
  | 'responsive'
  | 'flat'
  | 'wave3d'
  | 'neural'
  | 'singularity';

export interface ParticlePhase {
  tag: string;
  word: string;
  caption: string;
  sculptVariant: number; // 0, 1, or 2
}

export interface SculptureCallout {
  code: string;
  title: string;
  value: string;
  /** 3D coordinate on the sculpture (-0.4 to 0.4) */
  x: number;
  y: number;
  z: number;
  side: 'left' | 'right';
}

export interface EraData {
  index: number;
  id: string;
  chapter: string;
  year: string;
  shapeType: ParticleShapeType;
  title: string;
  quote: string;
  summary: string;
  phases: [ParticlePhase, ParticlePhase, ParticlePhase];
  sculptureCallouts: [SculptureCallout, SculptureCallout, SculptureCallout, SculptureCallout];
  specs: { label: string; value: string; particleWord: string }[];
  milestones: { year: string; title: string; desc: string; particleWord: string }[];
}

export const ERAS: EraData[] = [
  {
    index: 0,
    id: 'prologue',
    chapter: '00',
    year: '1989 — ∞',
    shapeType: 'sphere',
    title: 'The Web Evolved',
    quote: '“The web stopped being a document. It became an experience.”',
    summary:
      'Scroll horizontally through 37 years of web design history. Every era is formed by 6,000 monochrome particles morphing from static 1989 CERN terminals into 3D shaders and generative AI.',
    phases: [
      { tag: 'PHASE 00.A // GENESIS', word: 'THE WEB', caption: 'FROM STATIC DOCUMENTS TO LIVING SPACES', sculptVariant: 0 },
      { tag: 'PHASE 00.B // EVOLUTION', word: 'EVOLVED', caption: '1989 TERMINAL → 2026 SPATIAL HORIZON', sculptVariant: 1 },
      { tag: 'PHASE 00.C // MEDIUM', word: 'EXPERIENCE', caption: 'SCROLL HORIZONTALLY TO EXPLORE TIMELINE', sculptVariant: 2 },
    ],
    sculptureCallouts: [
      { code: 'CORE.01', title: 'HYPERLINK TOPOLOGY', value: 'Global Information Mesh', x: -0.22, y: -0.14, z: 0.1, side: 'left' },
      { code: 'CORE.02', title: 'ORBITAL DATA RING', value: '37 Years of Web Standards', x: -0.32, y: 0.14, z: -0.1, side: 'left' },
      { code: 'CORE.03', title: 'PARTICLE DENSITY', value: '6,000 Monochrome Nodes', x: 0.24, y: -0.12, z: -0.1, side: 'right' },
      { code: 'CORE.04', title: 'SPATIAL HORIZON', value: 'HTML → CSS → GPU → AI', x: 0.3, y: 0.16, z: 0.12, side: 'right' },
    ],
    specs: [
      { label: 'TIMESPAN', value: '1989 — 2026+', particleWord: '37 YEARS' },
      { label: 'PARTICLES', value: '6,000 NODES', particleWord: '6000 PTS' },
      { label: 'NAVIGATION', value: 'HORIZONTAL X', particleWord: 'X-SCROLL' },
    ],
    milestones: [
      { year: '1989', title: 'The Document Web', desc: 'Read-only academic hypertext on monochrome CRTs.', particleWord: 'DOCUMENT' },
      { year: '2007', title: 'The Responsive Web', desc: 'Fluid grids adapting across desktop and mobile glass.', particleWord: 'FLUID UI' },
      { year: '2026', title: 'The Generative Web', desc: 'Interfaces synthesized live from human intent.', particleWord: 'INTENT' },
    ],
  },
  {
    index: 1,
    id: 'dark-ages',
    chapter: '01',
    year: '1989 — 1991',
    shapeType: 'terminal',
    title: 'The Terminal Dark Ages',
    quote: '“Designers worked with black screens, pixelated text, and the TAB key.”',
    summary:
      'Before graphical browsers existed, layouts lived on black 80×24 CRT terminals aligned with hardware [TAB] stops. On August 6, 1991, Tim Berners-Lee published the first website at CERN.',
    phases: [
      { tag: 'PHASE 01.A // ORIGIN', word: '1989 CERN', caption: 'TIM BERNERS-LEE HYPERTEXT PROPOSAL', sculptVariant: 0 },
      { tag: 'PHASE 01.B // ALIGNMENT', word: '[TAB] KEY', caption: '80×24 MONOSPACE CHARACTER MATRIX', sculptVariant: 1 },
      { tag: 'PHASE 01.C // MARKUP', word: '<A HREF>', caption: '18 ORIGINAL HTML TAGS // INFO.CERN.CH', sculptVariant: 2 },
    ],
    sculptureCallouts: [
      { code: 'CRT.01', title: '80×24 CHAR MATRIX', value: 'VT100 Monochrome Phosphor', x: -0.32, y: -0.15, z: 0, side: 'left' },
      { code: 'CRT.02', title: 'HARDWARE [TAB] KEY', value: '8-Space Column Indentation', x: -0.28, y: 0.14, z: 0, side: 'left' },
      { code: 'CRT.03', title: '18 ORIGINAL TAGS', value: '<H1>, <P>, <UL>, <LI>, <A>', x: 0.32, y: -0.14, z: 0, side: 'right' },
      { code: 'CRT.04', title: 'HTTP/0.9 PROTOCOL', value: 'info.cern.ch (Aug 6, 1991)', x: 0.28, y: 0.15, z: 0, side: 'right' },
    ],
    specs: [
      { label: 'DISPLAY', value: '80 × 24 CRT', particleWord: '80 X 24' },
      { label: 'PROTOCOL', value: 'HTTP / 0.9', particleWord: 'HTTP 0.9' },
      { label: 'WEIGHT', value: '2.1 KB ASCII', particleWord: '2.1 KB' },
    ],
    milestones: [
      { year: '1989', title: 'CERN Proposal', desc: 'Tim Berners-Lee conceives a global hypertext mesh.', particleWord: 'CERN 89' },
      { year: '1990', title: 'NeXTcube Server', desc: 'First web server and WorldWideWeb.app browser.', particleWord: 'NEXTCUBE' },
      { year: '1991', title: 'First Website Live', desc: 'Pure text document launches with zero images or CSS.', particleWord: 'HTML 1.0' },
    ],
  },
  {
    index: 2,
    id: 'tables-era',
    chapter: '02',
    year: '1993 — 1995',
    shapeType: 'table',
    title: 'Mosaic & Table Layouts',
    quote: '“Designers bent data tables into multi-column grids held together by 1×1 transparent GIFs.”',
    summary:
      'NCSA Mosaic introduced inline <img> graphics in 1993. Lacking a layout system, pioneers hacked HTML <table> cells and propped them open with invisible 1×1 pixel spacer GIFs.',
    phases: [
      { tag: 'PHASE 02.A // BROWSER', word: 'MOSAIC 1.0', caption: 'FIRST INLINE <IMG> GRAPHICAL BROWSER', sculptVariant: 0 },
      { tag: 'PHASE 02.B // STRUCTURE', word: '<TABLE>', caption: 'NESTED <TR> & <TD> MULTI-COLUMN GRIDS', sculptVariant: 1 },
      { tag: 'PHASE 02.C // HACK', word: 'SPACER.GIF', caption: '1×1 TRANSPARENT PIXEL STRUCTURAL STRUTS', sculptVariant: 2 },
    ],
    sculptureCallouts: [
      { code: 'TBL.01', title: 'BANNER <TR> ROW', value: 'Colspan=3 Sliced Header GIF', x: -0.26, y: -0.18, z: 0, side: 'left' },
      { code: 'TBL.02', title: 'SIDEBAR <TD> CELL', value: 'Fixed 140px Navigation Column', x: -0.28, y: 0.08, z: 0.03, side: 'left' },
      { code: 'TBL.03', title: '216 WEB-SAFE HEX', value: '8-Bit Dither-Free Color Palette', x: 0.28, y: -0.14, z: -0.02, side: 'right' },
      { code: 'TBL.04', title: '1×1 SPACER.GIF', value: 'Invisible Pixel Width Enforcer', x: 0.28, y: 0.16, z: 0.04, side: 'right' },
    ],
    specs: [
      { label: 'VIEWPORT', value: '640 × 480 VGA', particleWord: '640 X 480' },
      { label: 'PALETTE', value: '216 WEB-SAFE', particleWord: '216 HEX' },
      { label: 'MODEM', value: '28.8 KBPS', particleWord: '28.8K' },
    ],
    milestones: [
      { year: '1993', title: 'NCSA Mosaic', desc: 'Inline <img> tag brings graphics alongside text.', particleWord: '<IMG>' },
      { year: '1994', title: 'Netscape & W3C', desc: 'Open web standards formed to unify HTML.', particleWord: 'W3C ORG' },
      { year: '1995', title: 'Table Slicing', desc: 'Photoshop mockups sliced into borderless table grids.', particleWord: '<TD> GRID' },
    ],
  },
  {
    index: 3,
    id: 'css-flash',
    chapter: '03',
    year: '1996 — 2002',
    shapeType: 'cascade',
    title: 'Cascading Style & Flash',
    quote: '“Design became a language—while Flash turned the browser into a cinematic stage.”',
    summary:
      'CSS1 separated visual presentation from HTML markup in 1996. Simultaneously, Macromedia Flash unlocked vector timelines, streaming MP3 audio, and interactive "[SKIP INTRO]" portals.',
    phases: [
      { tag: 'PHASE 03.A // STYLESHEET', word: '{ CSS 1 }', caption: 'SEPARATION OF STRUCTURE & PRESENTATION', sculptVariant: 0 },
      { tag: 'PHASE 03.B // MOTION', word: 'FLASH SWF', caption: 'VECTOR TIMELINES & STREAMING AUDIO', sculptVariant: 1 },
      { tag: 'PHASE 03.C // ARCHITECTURE', word: 'BOX MODEL', caption: 'MARGIN, BORDER, PADDING & Z-INDEX LAYERS', sculptVariant: 2 },
    ],
    sculptureCallouts: [
      { code: 'CSS.01', title: 'DOM STRUCTURE PLANE', value: 'Clean Semantic HTML Layer', x: -0.26, y: -0.15, z: -0.1, side: 'left' },
      { code: 'CSS.02', title: 'CSS CASCADE PLANE', value: 'Box Model, Float & Typography', x: -0.22, y: 0.14, z: 0, side: 'left' },
      { code: 'SWF.03', title: 'FLASH VECTOR WAVE', value: '60fps Bezier Motion & MP3 Loop', x: 0.26, y: -0.14, z: 0.1, side: 'right' },
      { code: 'SWF.04', title: 'ACTIONSCRIPT ENGINE', value: 'Interactive [SKIP INTRO] Portals', x: 0.24, y: 0.16, z: 0.1, side: 'right' },
    ],
    specs: [
      { label: 'STYLING', value: 'W3C CSS1 / CSS2', particleWord: 'CSS SPEC' },
      { label: 'RUNTIME', value: 'FLASH .SWF', particleWord: 'SWF 60FPS' },
      { label: 'DISPLAY', value: '800 × 600 SVGA', particleWord: '800 X 600' },
    ],
    milestones: [
      { year: '1996', title: 'CSS1 Specification', desc: 'Håkon Wium Lie & Bert Bos decouple style from HTML.', particleWord: 'H.W. LIE' },
      { year: '1999', title: 'Flash Golden Age', desc: 'Fullscreen vector motion and interactive soundscapes.', particleWord: 'SKIP INTRO' },
      { year: '2003', title: 'CSS Zen Garden', desc: 'Dave Shea proves one HTML file can wear infinite skins.', particleWord: 'ZEN GARDEN' },
    ],
  },
  {
    index: 4,
    id: 'mobile-grid',
    chapter: '04',
    year: '2004 — 2010',
    shapeType: 'responsive',
    title: 'Web 2.0 & Mobile Shift',
    quote: '“The fixed desktop monitor shattered into a billion pocket-sized glass viewports.”',
    summary:
      'AJAX made web applications dynamic without page reloads. Then the 2007 iPhone replaced cursors with capacitive multi-touch, and Ethan Marcotte’s Responsive Web Design united all screens.',
    phases: [
      { tag: 'PHASE 04.A // DYNAMIC', word: 'WEB 2.0', caption: 'ASYNCHRONOUS AJAX & SOCIAL PLATFORMS', sculptVariant: 0 },
      { tag: 'PHASE 04.B // VIEWPORT', word: 'MULTI-TOUCH', caption: '2007 IPHONE // 320×480 CAPACITIVE GLASS', sculptVariant: 1 },
      { tag: 'PHASE 04.C // FLUIDITY', word: '@MEDIA', caption: '12-COLUMN RESPONSIVE FLUID GRIDS', sculptVariant: 2 },
    ],
    sculptureCallouts: [
      { code: 'RWD.01', title: 'CAPACITIVE VIEWPORT', value: '320×480px Multi-Touch Glass', x: -0.22, y: -0.16, z: 0.03, side: 'left' },
      { code: 'RWD.02', title: 'FLUID CARD STACK', value: '100% Width Single-Column Reflow', x: -0.2, y: 0.14, z: 0, side: 'left' },
      { code: 'RWD.03', title: '12-COLUMN 960.GS', value: 'Proportional % Grid Containers', x: 0.22, y: -0.15, z: 0, side: 'right' },
      { code: 'RWD.04', title: 'CSS3 @MEDIA QUERY', value: 'Breakpoints Adapt Layout Live', x: 0.22, y: 0.16, z: 0, side: 'right' },
    ],
    specs: [
      { label: 'GRID', value: '12-COL FLUID %', particleWord: '12 COLUMN' },
      { label: 'DATA', value: 'ASYNC AJAX', particleWord: 'XHR JSON' },
      { label: 'TOUCH', value: '320 × 480 PX', particleWord: 'VIEWPORT' },
    ],
    milestones: [
      { year: '2005', title: 'AJAX Revolution', desc: 'Background JSON updates power seamless web apps.', particleWord: 'AJAX' },
      { year: '2007', title: 'iPhone & Safari', desc: 'Multi-touch gestures replace mouse hover and Flash.', particleWord: 'IPHONE' },
      { year: '2010', title: 'Responsive Design', desc: 'Ethan Marcotte unites desktop and mobile in one codebase.', particleWord: 'RESPONSIVE' },
    ],
  },
  {
    index: 5,
    id: 'flat-design',
    chapter: '05',
    year: '2011 — 2015',
    shapeType: 'flat',
    title: 'Skeuomorphism to Flat',
    quote: '“Interfaces shed faux stitched leather and heavy bevels for pure digital minimalism.”',
    summary:
      'As Retina screens doubled pixel density, faux textures gave way to Swiss-inspired Flat Design. Windows Metro, iOS 7, and Material Design embraced razor-sharp 2D vectors and modular systems.',
    phases: [
      { tag: 'PHASE 05.A // CLARITY', word: 'FLAT // 2D', caption: 'ZERO BEVELS // SWISS TYPOGRAPHIC HONESTY', sculptVariant: 0 },
      { tag: 'PHASE 05.B // CONTRAST', word: '3D → 2D', caption: 'SKEUOMORPHIC TEXTURE VS PURE GEOMETRY', sculptVariant: 1 },
      { tag: 'PHASE 05.C // VECTORS', word: '<SVG> GRID', caption: 'RESOLUTION-INDEPENDENT RETINA GRAPHICS', sculptVariant: 2 },
    ],
    sculptureCallouts: [
      { code: 'FLT.01', title: 'SWISS BAUHAUS GRID', value: 'Zero-Bevel Crisp 2D Planes', x: -0.25, y: -0.15, z: 0, side: 'left' },
      { code: 'FLT.02', title: 'INLINE <SVG> VECTORS', value: 'Infinite Resolution on 2x/3x DPI', x: -0.25, y: 0.15, z: 0, side: 'left' },
      { code: 'FLT.03', title: 'Z-AXIS COMPRESSION', value: 'Stripped Faux Shadows & Leather', x: 0.25, y: -0.15, z: 0, side: 'right' },
      { code: 'FLT.04', title: 'DESIGN TOKENS', value: 'Atomic Component Architecture', x: 0.25, y: 0.15, z: 0, side: 'right' },
    ],
    specs: [
      { label: 'AESTHETIC', value: 'SWISS MINIMAL', particleWord: 'BAUHAUS' },
      { label: 'GRAPHICS', value: 'SCALABLE SVG', particleWord: '2X RETINA' },
      { label: 'ELEVATION', value: 'Z-AXIS = 0.0', particleWord: 'ZERO Z' },
    ],
    milestones: [
      { year: '2012', title: 'Microsoft Metro', desc: 'Typography-led flat tiles reject glossy chrome.', particleWord: 'METRO UI' },
      { year: '2013', title: 'Apple iOS 7', desc: 'Faux felt and leather replaced by clean flat layers.', particleWord: 'IOS 7' },
      { year: '2014', title: 'Design Systems', desc: 'Reusable component libraries standardize UI at scale.', particleWord: 'TOKENS' },
    ],
  },
  {
    index: 6,
    id: 'webgl-gpu',
    chapter: '06',
    year: '2016 — 2022',
    shapeType: 'wave3d',
    title: 'WebGL & Silicon Shaders',
    quote: '“The screen stopped being a flat surface. It became a window into 3D space.”',
    summary:
      'WebGL, Three.js, and custom GLSL shaders unlocked direct GPU compute inside the browser—turning flat DOM trees into real-time 3D worlds, fluid physics, and scroll-rigged cinema.',
    phases: [
      { tag: 'PHASE 06.A // DIMENSION', word: 'WEBGL 3D', caption: 'REAL-TIME PERSPECTIVE SCENE GRAPHS', sculptVariant: 0 },
      { tag: 'PHASE 06.B // SILICON', word: 'SHADERS', caption: 'PARALLEL GPU VERTEX & FRAGMENT MATH', sculptVariant: 1 },
      { tag: 'PHASE 06.C // COMPUTE', word: 'WEBGPU', caption: '120 FPS HARDWARE-ACCELERATED PHYSICS', sculptVariant: 2 },
    ],
    sculptureCallouts: [
      { code: 'GPU.01', title: 'VERTEX DISPLACEMENT', value: 'Simplex Noise Wave Geometry', x: -0.28, y: -0.12, z: 0.1, side: 'left' },
      { code: 'GPU.02', title: 'GLSL FRAGMENT PASS', value: 'Per-Pixel Lighting & Raymarching', x: -0.26, y: 0.15, z: -0.1, side: 'left' },
      { code: 'GPU.03', title: 'INSTANCED BUFFERS', value: 'Parallel SIMD Silicon Execution', x: 0.28, y: -0.12, z: -0.1, side: 'right' },
      { code: 'GPU.04', title: '120HZ FRAME BUDGET', value: '8.33ms Real-Time Render Loop', x: 0.26, y: 0.15, z: 0.1, side: 'right' },
    ],
    specs: [
      { label: 'PIPELINE', value: 'WEBGL 2 / WEBGPU', particleWord: 'GLSL ES' },
      { label: 'GEOMETRY', value: '3D MESH + SDF', particleWord: 'RAYMARCH' },
      { label: 'RATE', value: '60 — 120 FPS', particleWord: '120 FPS' },
    ],
    milestones: [
      { year: '2017', title: 'WebGL 2.0 Standard', desc: 'GPU instancing powers massive particle fields.', particleWord: 'INSTANCED' },
      { year: '2019', title: 'Scroll-Rigged 3D', desc: 'Camera choreography bound to smooth scroll inertia.', particleWord: 'CAMERA 3D' },
      { year: '2022', title: 'WebGPU Compute', desc: 'Low-level silicon compute shaders arrive in browsers.', particleWord: 'COMPUTE' },
    ],
  },
  {
    index: 7,
    id: 'ai-neural',
    chapter: '07',
    year: '2023 — 2025',
    shapeType: 'neural',
    title: 'Human + Machine: AI',
    quote: '“The interface started responding to our intention instead of waiting for our clicks.”',
    summary:
      'Neural transformers inverted interaction design. Instead of hunting through static menus, users express natural intent—and generative systems synthesize bespoke interfaces on the fly.',
    phases: [
      { tag: 'PHASE 07.A // COGNITION', word: 'AI INTENT', caption: 'NATURAL LANGUAGE AS LAYOUT ENGINE', sculptVariant: 0 },
      { tag: 'PHASE 07.B // TOPOLOGY', word: 'SYNAPTIC', caption: 'CONTEXT-AWARE GENERATIVE INTERFACES', sculptVariant: 1 },
      { tag: 'PHASE 07.C // AUTONOMY', word: 'AGENTIC UI', caption: 'EPHEMERAL SOFTWARE TAILORED TO THOUGHT', sculptVariant: 2 },
    ],
    sculptureCallouts: [
      { code: 'SYN.01', title: 'INTENT VECTOR INPUT', value: 'Prompt & Context Understanding', x: -0.26, y: -0.15, z: 0.08, side: 'left' },
      { code: 'SYN.02', title: 'SYNAPTIC WEIGHTS', value: 'In-Browser WebGPU Inference', x: -0.24, y: 0.15, z: -0.08, side: 'left' },
      { code: 'SYN.03', title: 'EPHEMERAL UI TREE', value: 'Assembled Just-In-Time Per Task', x: 0.26, y: -0.15, z: -0.08, side: 'right' },
      { code: 'SYN.04', title: 'AUTONOMOUS AGENTS', value: 'Co-Navigating & Executing Tasks', x: 0.24, y: 0.15, z: 0.08, side: 'right' },
    ],
    specs: [
      { label: 'ENGINE', value: 'TRANSFORMER', particleWord: 'NEURAL' },
      { label: 'LIFECYCLE', value: 'EPHEMERAL UI', particleWord: 'RUNTIME' },
      { label: 'INPUT', value: 'HUMAN INTENT', particleWord: 'PROMPT' },
    ],
    milestones: [
      { year: '2023', title: 'Generative UI', desc: 'Components stream live from semantic prompts.', particleWord: 'GEN UI' },
      { year: '2024', title: 'Local WebGPU AI', desc: 'Neural weights execute directly on client silicon.', particleWord: 'LOCAL AI' },
      { year: '2025', title: 'Zero-Menu Web', desc: 'Adaptive surfaces replace static navigation trees.', particleWord: 'ADAPTIVE' },
    ],
  },
  {
    index: 8,
    id: 'future-horizon',
    chapter: '08',
    year: '2026 — ∞',
    shapeType: 'singularity',
    title: 'The Unwritten Horizon',
    quote: '“The next web hasn’t been designed yet. It’s waiting to be imagined.”',
    summary:
      'When the rectangular screen dissolves into spatial optics and neural presence, imagination itself becomes the interface. Type any word below to sculpt the particle field live.',
    phases: [
      { tag: 'PHASE 08.A // HORIZON', word: 'IMAGINE', caption: 'WHEN IMAGINATION BECOMES THE INTERFACE', sculptVariant: 0 },
      { tag: 'PHASE 08.B // OPTICS', word: 'SPATIAL ∞', caption: 'POST-SCREEN 360° ARCHITECTURAL COMPUTING', sculptVariant: 1 },
      { tag: 'PHASE 08.C // CREATION', word: 'BEYOND UI', caption: 'TYPE ANY WORD BELOW TO SCULPT THE FIELD', sculptVariant: 2 },
    ],
    sculptureCallouts: [
      { code: 'FUT.01', title: 'SPATIAL OPTICS', value: 'Post-Screen 360° WebXR Canvas', x: -0.28, y: -0.15, z: 0.1, side: 'left' },
      { code: 'FUT.02', title: 'GAZE & GESTURE', value: 'Zero-Friction Sub-Millimeter Input', x: -0.26, y: 0.15, z: -0.1, side: 'left' },
      { code: 'FUT.03', title: 'NEURAL INTERFACE', value: 'Direct Thought-To-Form Synthesis', x: 0.28, y: -0.15, z: -0.1, side: 'right' },
      { code: 'FUT.04', title: 'LIVE SYNTHESIZER', value: 'Type Below to Sculpt 6,000 Nodes', x: 0.26, y: 0.15, z: 0.1, side: 'right' },
    ],
    specs: [
      { label: 'BOUNDARY', value: 'ZERO SCREEN', particleWord: 'NO FRAME' },
      { label: 'OPTICS', value: 'SPATIAL 360°', particleWord: 'WEBXR' },
      { label: 'AUTHOR', value: 'YOUR MIND', particleWord: 'CREATE' },
    ],
    milestones: [
      { year: 'SPATIAL', title: 'Post-Screen Web', desc: 'Information woven directly into physical space.', particleWord: 'SPATIAL' },
      { year: 'GAZE', title: 'Zero Friction', desc: 'Eye-tracking, voice, and neural intention.', particleWord: 'NEURAL' },
      { year: '∞', title: 'Open Canvas', desc: 'The future web is written by you.', particleWord: 'FUTURE' },
    ],
  },
];
