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
      'Scroll horizontally through 37 years of digital architecture. As you move across time, 6,000 monochrome particles morph through every paradigm of the web.',
    phases: [
      { tag: '00.A // GENESIS', word: 'THE WEB', caption: 'FROM STATIC DOCUMENTS TO LIVING SPACES', sculptVariant: 0 },
      { tag: '00.B // EVOLUTION', word: 'EVOLVED', caption: '1989 TERMINAL → 2026 SPATIAL HORIZON', sculptVariant: 1 },
      { tag: '00.C // MEDIUM', word: 'EXPERIENCE', caption: 'SCROLL HORIZONTALLY TO BEGIN THE JOURNEY', sculptVariant: 2 },
    ],
    specs: [
      { label: 'TIMESPAN', value: '1989 — 2026+', particleWord: '37 YEARS' },
      { label: 'MEDIUM', value: '6,000 PARTICLES', particleWord: '6000 PTS' },
      { label: 'AXIS', value: 'HORIZONTAL X', particleWord: 'X-SCROLL' },
    ],
    milestones: [
      { year: '1989', title: 'Document Era', desc: 'Read-only hypertext on monochrome CRTs.', particleWord: 'DOCUMENT' },
      { year: '2007', title: 'Responsive Era', desc: 'Fluid grids across desktop and mobile glass.', particleWord: 'FLUID UI' },
      { year: '2026', title: 'Generative Era', desc: 'Interfaces synthesized live from human intent.', particleWord: 'INTENT' },
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
      'Before graphical browsers existed, layouts were aligned on 80×24 CRT terminals using hardware [TAB] stops. In August 1991, Tim Berners-Lee published the first website at CERN.',
    phases: [
      { tag: '01.A // ORIGIN', word: '1989 // CERN', caption: 'TIM BERNERS-LEE HYPERTEXT PROPOSAL', sculptVariant: 0 },
      { tag: '01.B // LAYOUT', word: '[TAB] KEY', caption: '80×24 MONOSPACE CHARACTER ALIGNMENT', sculptVariant: 1 },
      { tag: '01.C // MARKUP', word: '<A HREF>', caption: '18 ORIGINAL TAGS // INFO.CERN.CH', sculptVariant: 2 },
    ],
    specs: [
      { label: 'DISPLAY', value: '80 × 24 CRT', particleWord: '80 X 24' },
      { label: 'PROTOCOL', value: 'HTTP / 0.9', particleWord: 'HTTP/0.9' },
      { label: 'WEIGHT', value: '2.1 KB ASCII', particleWord: '2.1 KB' },
    ],
    milestones: [
      { year: '1989', title: 'CERN Proposal', desc: 'Global hypertext mesh conceived in Geneva.', particleWord: 'CERN 89' },
      { year: '1990', title: 'NeXTcube Host', desc: 'First web server and WorldWideWeb.app browser.', particleWord: 'NEXTCUBE' },
      { year: '1991', title: 'First Website', desc: 'Pure semantic text goes live on August 6.', particleWord: 'HTML 1.0' },
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
      'NCSA Mosaic introduced inline images in 1993. Lacking a layout engine, pioneers nested HTML <table> cells and propped them open with invisible 1×1 pixel spacer GIFs.',
    phases: [
      { tag: '02.A // BROWSER', word: 'MOSAIC 1.0', caption: 'FIRST INLINE <IMG> GRAPHICAL BROWSER', sculptVariant: 0 },
      { tag: '02.B // STRUCTURE', word: '<TABLE>', caption: 'NESTED <TR> & <TD> MULTI-COLUMN GRIDS', sculptVariant: 1 },
      { tag: '02.C // HACK', word: 'SPACER.GIF', caption: '1×1 TRANSPARENT PIXEL STRUCTURAL STRUTS', sculptVariant: 2 },
    ],
    specs: [
      { label: 'VIEWPORT', value: '640 × 480 VGA', particleWord: '640 X 480' },
      { label: 'PALETTE', value: '216 WEB-SAFE', particleWord: '216 HEX' },
      { label: 'MODEM', value: '28.8 KBPS', particleWord: '28.8K' },
    ],
    milestones: [
      { year: '1993', title: 'Inline Images', desc: 'Mosaic renders GIFs alongside hypertext.', particleWord: '<IMG>' },
      { year: '1994', title: 'W3C Founded', desc: 'Open web standards established at MIT.', particleWord: 'W3C ORG' },
      { year: '1995', title: 'Table Slicing', desc: 'Sliced graphics assembled inside borderless tables.', particleWord: '<TD> GRID' },
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
      'CSS1 separated visual presentation from HTML structure in 1996. Simultaneously, Macromedia Flash unlocked vector timelines, custom typography, and interactive audio portals.',
    phases: [
      { tag: '03.A // STYLESHEET', word: '{ CSS 1 }', caption: 'SEPARATION OF STRUCTURE & PRESENTATION', sculptVariant: 0 },
      { tag: '03.B // MOTION', word: 'FLASH .SWF', caption: 'VECTOR TIMELINES & STREAMING AUDIO', sculptVariant: 1 },
      { tag: '03.C // STANDARD', word: 'BOX MODEL', caption: 'MARGIN, BORDER, PADDING & Z-INDEX LAYERS', sculptVariant: 2 },
    ],
    specs: [
      { label: 'STYLING', value: 'W3C CSS1 / CSS2', particleWord: 'CSS SPEC' },
      { label: 'RUNTIME', value: 'FLASH PLAYER', particleWord: 'SWF 60FPS' },
      { label: 'DISPLAY', value: '800 × 600 SVGA', particleWord: '800 X 600' },
    ],
    milestones: [
      { year: '1996', title: 'CSS1 Specification', desc: 'Håkon Wium Lie & Bert Bos decouple style from markup.', particleWord: 'H.W. LIE' },
      { year: '1999', title: 'Flash Golden Age', desc: 'Vector preloaders and [SKIP INTRO] experiences.', particleWord: 'SKIP INTRO' },
      { year: '2003', title: 'CSS Zen Garden', desc: 'One HTML file styled hundreds of ways.', particleWord: 'ZEN GARDEN' },
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
      'AJAX made web pages dynamic without reloads. Then the 2007 iPhone replaced cursors with multi-touch, and Ethan Marcotte’s Responsive Web Design made layouts fluid across every screen.',
    phases: [
      { tag: '04.A // DYNAMIC', word: 'WEB 2.0', caption: 'ASYNCHRONOUS AJAX & SOCIAL PLATFORMS', sculptVariant: 0 },
      { tag: '04.B // VIEWPORT', word: 'MULTI-TOUCH', caption: '2007 IPHONE // CAPACITIVE GLASS', sculptVariant: 1 },
      { tag: '04.C // FLUIDITY', word: '@MEDIA', caption: '12-COLUMN RESPONSIVE FLUID GRIDS', sculptVariant: 2 },
    ],
    specs: [
      { label: 'GRID', value: '12-COL FLUID %', particleWord: '12 COLUMN' },
      { label: 'DATA', value: 'ASYNC AJAX', particleWord: 'XHR JSON' },
      { label: 'TOUCH', value: '320 × 480 PX', particleWord: 'VIEWPORT' },
    ],
    milestones: [
      { year: '2005', title: 'AJAX Revolution', desc: 'Background data updates power Google Maps.', particleWord: 'AJAX' },
      { year: '2007', title: 'iPhone Launch', desc: 'Mobile Safari brings the full web to pocket glass.', particleWord: 'IPHONE' },
      { year: '2010', title: 'Responsive Web', desc: 'Fluid grids and media queries unite all screens.', particleWord: 'RESPONSIVE' },
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
      'As Retina displays multiplied pixel density, faux textures gave way to Swiss-inspired Flat Design. Windows Metro, iOS 7, and Material Design embraced clean 2D vectors and sharp typography.',
    phases: [
      { tag: '05.A // CLARITY', word: 'FLAT // 2D', caption: 'ZERO BEVELS // SWISS TYPOGRAPHIC HONESTY', sculptVariant: 0 },
      { tag: '05.B // VECTORS', word: '<SVG> PATH', caption: 'RESOLUTION-INDEPENDENT RETINA GRAPHICS', sculptVariant: 1 },
      { tag: '05.C // SYSTEM', word: 'FLEX & GRID', caption: 'NATIVE 2D ARCHITECTURAL CSS LAYOUT', sculptVariant: 2 },
    ],
    specs: [
      { label: 'AESTHETIC', value: 'SWISS MINIMAL', particleWord: 'BAUHAUS' },
      { label: 'GRAPHICS', value: 'SCALABLE SVG', particleWord: '2X RETINA' },
      { label: 'ELEVATION', value: 'Z-AXIS = 0.0', particleWord: 'ZERO Z' },
    ],
    milestones: [
      { year: '2012', title: 'Microsoft Metro', desc: 'Typography-led flat tiles reject glossy chrome.', particleWord: 'METRO UI' },
      { year: '2013', title: 'Apple iOS 7', desc: 'Faux felt and leather replaced by translucent layers.', particleWord: 'IOS 7' },
      { year: '2014', title: 'Design Systems', desc: 'Modular component libraries standardize UI at scale.', particleWord: 'TOKENS' },
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
      'WebGL, Three.js, and custom GLSL shaders unlocked direct GPU compute inside the browser—turning flat DOM trees into real-time 3D worlds, fluid physics, and spatial cinema.',
    phases: [
      { tag: '06.A // DIMENSION', word: 'WEBGL // 3D', caption: 'REAL-TIME PERSPECTIVE SCENE GRAPHS', sculptVariant: 0 },
      { tag: '06.B // SILICON', word: 'GLSL SHADER', caption: 'PARALLEL GPU VERTEX & FRAGMENT MATH', sculptVariant: 1 },
      { tag: '06.C // COMPUTE', word: 'WEBGPU', caption: '120 FPS HARDWARE-ACCELERATED PHYSICS', sculptVariant: 2 },
    ],
    specs: [
      { label: 'PIPELINE', value: 'WEBGL 2 / WEBGPU', particleWord: 'GLSL ES' },
      { label: 'GEOMETRY', value: '3D MESH + SDF', particleWord: 'RAYMARCH' },
      { label: 'RATE', value: '60 — 120 FPS', particleWord: '120 FPS' },
    ],
    milestones: [
      { year: '2017', title: 'WebGL 2.0', desc: 'GPU instancing powers massive particle fields.', particleWord: 'INSTANCED' },
      { year: '2019', title: 'Scroll Cinema', desc: 'Camera choreography bound to smooth scroll inertia.', particleWord: 'CAMERA 3D' },
      { year: '2022', title: 'WebGPU Standard', desc: 'Low-level silicon compute arrives in browsers.', particleWord: 'COMPUTE' },
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
      'Neural transformers inverted interaction design. Instead of navigating rigid menus, users express natural intent—and generative systems synthesize bespoke interfaces in real time.',
    phases: [
      { tag: '07.A // COGNITION', word: 'AI // INTENT', caption: 'NATURAL LANGUAGE AS LAYOUT ENGINE', sculptVariant: 0 },
      { tag: '07.B // TOPOLOGY', word: 'SYNAPTIC', caption: 'CONTEXT-AWARE GENERATIVE INTERFACES', sculptVariant: 1 },
      { tag: '07.C // AUTONOMY', word: 'AGENTIC UI', caption: 'EPHEMERAL SOFTWARE TAILORED TO THOUGHT', sculptVariant: 2 },
    ],
    specs: [
      { label: 'ENGINE', value: 'TRANSFORMER', particleWord: 'NEURAL' },
      { label: 'LIFECYCLE', value: 'EPHEMERAL UI', particleWord: 'RUNTIME' },
      { label: 'INPUT', value: 'HUMAN INTENT', particleWord: 'PROMPT' },
    ],
    milestones: [
      { year: '2023', title: 'Generative UI', desc: 'Components stream live from semantic prompts.', particleWord: 'GEN UI' },
      { year: '2024', title: 'In-Browser AI', desc: 'WebGPU runs neural weights locally on client silicon.', particleWord: 'LOCAL AI' },
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
      'When the screen dissolves into spatial optics and neural presence, imagination itself becomes the interface. Type any word below to sculpt the 6,000 particles in real time.',
    phases: [
      { tag: '08.A // HORIZON', word: 'IMAGINE', caption: 'WHEN IMAGINATION BECOMES THE INTERFACE', sculptVariant: 0 },
      { tag: '08.B // OPTICS', word: 'SPATIAL ∞', caption: 'POST-SCREEN 360° ARCHITECTURAL COMPUTING', sculptVariant: 1 },
      { tag: '08.C // CREATION', word: 'BEYOND UI', caption: 'TYPE ANY WORD BELOW TO SCULPT THE FIELD', sculptVariant: 2 },
    ],
    specs: [
      { label: 'BOUNDARY', value: 'ZERO SCREEN', particleWord: 'NO FRAME' },
      { label: 'OPTICS', value: 'SPATIAL 360°', particleWord: 'WEBXR' },
      { label: 'AUTHOR', value: 'YOUR MIND', particleWord: 'CREATE' },
    ],
    milestones: [
      { year: 'SPATIAL', title: 'Post-Screen Web', desc: 'Information woven into physical space.', particleWord: 'SPATIAL' },
      { year: 'GAZE', title: 'Zero Friction', desc: 'Eye-tracking, voice, and neural intent.', particleWord: 'NEURAL' },
      { year: '∞', title: 'Open Canvas', desc: 'The future web is written by you.', particleWord: 'FUTURE' },
    ],
  },
];
