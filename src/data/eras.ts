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

export interface ParticleCallout {
  label: string;
  detail: string;
  /** Normalized anchor on the sculpture (-1 to 1) */
  anchorX: number;
  anchorY: number;
}

export interface EraData {
  index: number;
  id: string;
  chapter: string;
  year: string;
  particleWord: string;
  particleAltWord: string;
  particleSubtext: string;
  shapeType: ParticleShapeType;
  title: string;
  quote: string;
  summary: string;
  specs: { label: string; value: string }[];
  milestones: { year: string; title: string; desc: string }[];
  interactionLabel: string;
  interactionActiveLabel: string;
  callouts: ParticleCallout[];
}

export const ERAS: EraData[] = [
  {
    index: 0,
    id: 'prologue',
    chapter: '00',
    year: '1989 — ∞',
    particleWord: 'THE WEB',
    particleAltWord: 'EVOLVED',
    particleSubtext: 'DOCUMENTS → EXPERIENCES // HORIZONTAL ARCHIVE',
    shapeType: 'sphere',
    title: 'THE WEB EVOLVED.',
    quote: '“The web stopped being a document. It became an experience.”',
    summary:
      'Welcome to an interactive particle journey through the evolution of web design. Scroll horizontally as 5,500 monochrome particles morph through every paradigm—from 1989 CRT terminals and nested HTML tables to CSS, Flash, mobile grids, WebGL shaders, and autonomous AI.',
    specs: [
      { label: 'PARTICLE FIELD', value: '5,500 NODES' },
      { label: 'NAVIGATION', value: 'HORIZONTAL X-AXIS' },
      { label: 'CHROMATIC MODE', value: 'MONO [B/G/W]' },
    ],
    milestones: [
      { year: '1989', title: 'Static Hypertext', desc: 'Read-only academic documents linked via raw coordinates.' },
      { year: '2007', title: 'Responsive Touch', desc: 'Fluid grids adapting across desktop and pocket glass.' },
      { year: '2026+', title: 'Generative Space', desc: 'Interfaces synthesized on demand from human intent.' },
    ],
    interactionLabel: 'MORPH WORD: "EVOLVED"',
    interactionActiveLabel: 'MORPH WORD: "THE WEB"',
    callouts: [
      { label: 'ORBITAL CORE', detail: 'World Wide Web Topology', anchorX: -0.45, anchorY: -0.35 },
      { label: 'PARTICLE GLYPH', detail: 'Rasterized Vector Cloud', anchorX: 0.4, anchorY: -0.4 },
      { label: 'KINETIC FIELD', detail: 'Cursor Repulsion Radius: 140px', anchorX: 0.35, anchorY: 0.38 },
    ],
  },
  {
    index: 1,
    id: 'dark-ages',
    chapter: '01',
    year: '1989 — 1991',
    particleWord: '1989 // HTML',
    particleAltWord: '<A HREF>',
    particleSubtext: 'CERN TERMINAL // 80×24 MONOSPACE MATRIX',
    shapeType: 'terminal',
    title: 'THE DARK AGES & FIRST HYPERTEXT',
    quote: '“In the dark ages, designers worked with black screens, pixelated text, and the TAB key.”',
    summary:
      'Before graphical browsers existed, web design began on pitch-black CRT terminals. Layouts were aligned solely with the [TAB] key and ASCII symbols. In August 1991, Tim Berners-Lee published the first website at CERN—pure semantic HTML tags (<H1>, <P>, <A>) with zero styling or images.',
    specs: [
      { label: 'RESOLUTION', value: '80 × 24 CHARS' },
      { label: 'LAYOUT ENGINE', value: 'ASCII & [TAB] KEY' },
      { label: 'FIRST URL', value: 'INFO.CERN.CH' },
    ],
    milestones: [
      { year: '1989', title: 'CERN Proposal', desc: 'Tim Berners-Lee outlines a global hypertext mesh.' },
      { year: '1990', title: 'WorldWideWeb.app', desc: 'First browser and WYSIWYG HTML editor built on NeXT.' },
      { year: '1991', title: 'First Web Page', desc: 'August 6: Pure text document goes live to the world.' },
    ],
    interactionLabel: 'PRESS [TAB] MATRIX SHIFT',
    interactionActiveLabel: 'RESET TERMINAL MATRIX',
    callouts: [
      { label: 'CRT SCAN MATRIX', detail: '80-Column Monospace Grid', anchorX: -0.5, anchorY: -0.35 },
      { label: 'HYPERLINK NODE', detail: '<A HREF="..."> Anchor Tag', anchorX: 0.45, anchorY: -0.3 },
      { label: 'TAB INDENTATION', detail: 'Hardware Stop Alignment', anchorX: -0.35, anchorY: 0.4 },
    ],
  },
  {
    index: 2,
    id: 'tables-era',
    chapter: '02',
    year: '1993 — 1995',
    particleWord: '<TABLE>',
    particleAltWord: 'MOSAIC 1.0',
    particleSubtext: 'NESTED CELLS // SPACER.GIF // HIT COUNTERS',
    shapeType: 'table',
    title: 'GRAPHICAL BROWSERS & TABLEHACKING',
    quote: '“Designers bent data tables into multi-column magazine layouts held together by 1×1 transparent GIFs.”',
    summary:
      'With the 1993 launch of Mosaic and Netscape Navigator, inline images arrived alongside text. Lacking a true layout system, pioneers hacked HTML <table>, <tr>, and <td> tags—nesting tables inside tables and inserting invisible 1×1 pixel spacer GIFs to force visual structure.',
    specs: [
      { label: 'VIEWPORT', value: '640 × 480 VGA' },
      { label: 'COLOR PALETTE', value: '216 WEB-SAFE' },
      { label: 'STRUCTURAL HACK', value: 'SPACER.GIF (1×1)' },
    ],
    milestones: [
      { year: '1993', title: 'Mosaic Browser', desc: 'Inline <img> tags bring graphics to public screens.' },
      { year: '1994', title: 'W3C Founded', desc: 'Open web standards established to prevent proprietary forks.' },
      { year: '1995', title: 'Table Layouts', desc: 'David Siegel’s "Creating Killer Websites" popularizes table grids.' },
    ],
    interactionLabel: 'EXPLODE <TD> TABLE CELLS',
    interactionActiveLabel: 'COLLAPSE TABLE BORDERS',
    callouts: [
      { label: 'HEADER <TR>', detail: 'Colspan=3 Banner Row', anchorX: -0.48, anchorY: -0.38 },
      { label: 'SIDEBAR <TD>', detail: 'Fixed 140px Navigation Cell', anchorX: -0.52, anchorY: 0.25 },
      { label: 'SPACER.GIF', detail: '1×1 Transparent Pixel Strut', anchorX: 0.48, anchorY: 0.35 },
    ],
  },
  {
    index: 3,
    id: 'css-flash',
    chapter: '03',
    year: '1996 — 2002',
    particleWord: '{ CSS }',
    particleAltWord: 'FLASH // SWF',
    particleSubtext: 'SEPARATION OF STYLE // VECTOR TIMELINES',
    shapeType: 'cascade',
    title: 'CASCADING STYLE & THE FLASH GOLDEN AGE',
    quote: '“Design became a language—while Macromedia Flash turned the browser into a cinematic stage.”',
    summary:
      'In December 1996, CSS1 separated visual presentation from HTML markup—unlocking typography, colors, and box positioning. Simultaneously, Macromedia Flash broke every constraint: delivering vector animations, custom fonts, interactive soundscapes, and iconic "[SKIP INTRO]" portals.',
    specs: [
      { label: 'STYLESHEET', value: 'W3C CSS LEVEL 1' },
      { label: 'MULTIMEDIA', value: 'SHOCKWAVE FLASH' },
      { label: 'PARADIGM', value: 'CONTENT ≠ STYLE' },
    ],
    milestones: [
      { year: '1996', title: 'CSS1 & Flash 1.0', desc: 'Style sheets and vector timeline animation debut.' },
      { year: '2000', title: 'ActionScript 1.0', desc: 'Interactive physics, audio loops, and full-screen web apps.' },
      { year: '2003', title: 'CSS Zen Garden', desc: 'Dave Shea proves one HTML file can wear infinite designs.' },
    ],
    interactionLabel: 'SEPARATE 3D Z-INDEX LAYERS',
    interactionActiveLabel: 'MERGE CASCADING LAYERS',
    callouts: [
      { label: 'LAYER 01 // DOM', detail: 'Semantic HTML Markup Plane', anchorX: -0.5, anchorY: -0.35 },
      { label: 'LAYER 02 // CSS', detail: 'Visual Cascade & Box Model', anchorX: 0.48, anchorY: -0.25 },
      { label: 'LAYER 03 // SWF', detail: 'Vector Motion & Audio Wave', anchorX: 0.4, anchorY: 0.4 },
    ],
  },
  {
    index: 4,
    id: 'mobile-grid',
    chapter: '04',
    year: '2004 — 2010',
    particleWord: 'MOBILE',
    particleAltWord: '@MEDIA GRID',
    particleSubtext: 'WEB 2.0 // 12-COLUMN FLUID GRIDS // TOUCH',
    shapeType: 'responsive',
    title: 'WEB 2.0 & THE RESPONSIVE MOBILE SHIFT',
    quote: '“The fixed desktop monitor shattered into a billion pocket-sized glass viewports.”',
    summary:
      'Web 2.0 introduced AJAX interactivity, dynamic feeds, and user-generated platforms. Then in 2007, the iPhone arrived without Flash support—changing everything. In 2010, Ethan Marcotte coined "Responsive Web Design," using fluid 12-column grids and @media queries so one layout adapts to any screen.',
    specs: [
      { label: 'GRID SYSTEM', value: '12-COL FLUID %' },
      { label: 'BREAKPOINTS', value: '@MEDIA QUERIES' },
      { label: 'INPUT VECTOR', value: 'CAPACITIVE TOUCH' },
    ],
    milestones: [
      { year: '2004', title: 'Web 2.0 & AJAX', desc: 'Asynchronous data updates without full page reloads.' },
      { year: '2007', title: 'iPhone Launch', desc: 'Multi-touch mobile browsing replaces Flash with HTML5.' },
      { year: '2010', title: 'Responsive Design', desc: 'Fluid grids and flexible media adapt to every viewport.' },
    ],
    interactionLabel: 'REFLOW: DESKTOP 12-COL → MOBILE',
    interactionActiveLabel: 'EXPAND: MOBILE → 12-COL DESKTOP',
    callouts: [
      { label: 'FLUID COLUMNS', detail: 'Proportional % Width Struts', anchorX: -0.5, anchorY: -0.36 },
      { label: 'TOUCH VIEWPORT', detail: '375×812 Mobile Handset Frame', anchorX: 0.48, anchorY: -0.3 },
      { label: 'MEDIA QUERY', detail: '@media (max-width: 768px)', anchorX: 0.35, anchorY: 0.42 },
    ],
  },
  {
    index: 5,
    id: 'flat-design',
    chapter: '05',
    year: '2011 — 2015',
    particleWord: 'FLAT // 2D',
    particleAltWord: 'SWISS GRID',
    particleSubtext: 'SKEUOMORPHISM → PURE DIGITAL MINIMALISM',
    shapeType: 'flat',
    title: 'SKEUOMORPHISM TO FLAT MINIMALISM',
    quote: '“Interfaces shed faux stitched leather and heavy bevels to embrace pure digital honesty.”',
    summary:
      'Early smartphones relied on skeuomorphism—imitating real-world felt, wood grain, and glossy glass buttons so users understood what to tap. By 2013, Microsoft Metro, Apple iOS 7, and Google Material Design stripped away faux textures in favor of crisp 2D geometry, bold typography, and razor-sharp performance.',
    specs: [
      { label: 'AESTHETIC', value: 'SWISS BAUHAUS 2D' },
      { label: 'VECTOR GRAPHICS', value: 'SCALABLE SVG' },
      { label: 'Z-ELEVATION', value: 'COMPRESSED 0.0PX' },
    ],
    milestones: [
      { year: '2012', title: 'Microsoft Metro', desc: 'Typography-first flat tiles pioneer modern digital minimalism.' },
      { year: '2013', title: 'Apple iOS 7', desc: 'Jony Ive replaces skeuomorphic textures with translucent flat layers.' },
      { year: '2014', title: 'Material Design', desc: 'Google codifies tactile digital paper with physics-based motion.' },
    ],
    interactionLabel: 'COMPRESS 3D CUBE → FLAT 2D PLANE',
    interactionActiveLabel: 'EXTRUDE 2D PLANE → 3D VOLUME',
    callouts: [
      { label: 'VECTOR GEOMETRY', detail: 'Zero-Bevel Crisp Edges', anchorX: -0.46, anchorY: -0.35 },
      { label: 'SWISS TYPOGRAPHY', detail: 'Grid-Aligned Sans Hierarchy', anchorX: 0.46, anchorY: -0.32 },
      { label: 'DEPTH COMPRESSION', detail: 'Z-Axis Flattened to Plane', anchorX: 0.4, anchorY: 0.38 },
    ],
  },
  {
    index: 6,
    id: 'webgl-gpu',
    chapter: '06',
    year: '2016 — 2022',
    particleWord: 'WEBGL // 3D',
    particleAltWord: 'GLSL SHADER',
    particleSubtext: 'THE BROWSER BECAME A SILICON GPU CANVAS',
    shapeType: 'wave3d',
    title: 'THE THIRD DIMENSION & SILICON SHADERS',
    quote: '“The screen stopped being a flat surface. It became a window into a three-dimensional space.”',
    summary:
      'With WebGL, Three.js, and custom GLSL vertex/fragment shaders, web browsers unlocked direct access to the graphics processor. Flat DOM nodes gave way to real-time raymarching, fluid simulations, physics engines, and cinematic spatial storytelling running at 60 frames per second.',
    specs: [
      { label: 'PIPELINE', value: 'WEBGL 2.0 / WEBGPU' },
      { label: 'COMPUTE', value: 'GLSL VERTEX + FRAG' },
      { label: 'SPATIAL AXIS', value: 'PERSPECTIVE [X,Y,Z]' },
    ],
    milestones: [
      { year: '2017', title: 'WebGL 2.0 Standard', desc: 'GPGPU instancing and shader pipelines reach universal support.' },
      { year: '2019', title: 'Immersive Storytelling', desc: 'Scroll-bound 3D cameras redefine digital editorial experiences.' },
      { year: '2022', title: 'WebGPU Horizon', desc: 'Next-generation low-level silicon compute arrives in browsers.' },
    ],
    interactionLabel: 'OVERDRIVE GPU WAVE FREQUENCY',
    interactionActiveLabel: 'NORMALIZE SHADER HARMONICS',
    callouts: [
      { label: 'VERTEX DISPLACEMENT', detail: 'Simplex Noise Wave Mesh', anchorX: -0.5, anchorY: -0.35 },
      { label: 'PERSPECTIVE FOV', detail: '60° Spatial Frustum Projection', anchorX: 0.45, anchorY: -0.32 },
      { label: 'SHADER RIPPLE', detail: 'Real-Time Cursor Wavefront', anchorX: 0.38, anchorY: 0.4 },
    ],
  },
  {
    index: 7,
    id: 'ai-neural',
    chapter: '07',
    year: '2023 — 2025',
    particleWord: 'AI // INTENT',
    particleAltWord: 'SYNAPTIC UI',
    particleSubtext: 'HUMAN + MACHINE // GENERATIVE INTERFACES',
    shapeType: 'neural',
    title: 'HUMAN + MACHINE: THE GENERATIVE WEB',
    quote: '“The interface started responding to our intention instead of waiting for our clicks.”',
    summary:
      'Large language models and neural networks transformed the web from pre-programmed static templates into living, adaptive systems. Interfaces now parse natural language, context, and human intent—synthesizing bespoke layouts, code, and workflows in real time.',
    specs: [
      { label: 'ARCHITECTURE', value: 'NEURAL TRANSFORMER' },
      { label: 'INTERACTION', value: 'INTENT → SYNTHESIS' },
      { label: 'TOPOLOGY', value: 'DYNAMIC GRAPH' },
    ],
    milestones: [
      { year: '2023', title: 'Generative UI', desc: 'Interfaces dynamically assemble components from user prompts.' },
      { year: '2024', title: 'Agentic Workflows', desc: 'Autonomous browser agents navigate and build alongside humans.' },
      { year: '2025', title: 'Adaptive Context', desc: 'Zero-UI surfaces that morph to match cognitive load.' },
    ],
    interactionLabel: 'FIRE SYNAPTIC INTENT PULSE',
    interactionActiveLabel: 'CALM NEURAL CONSTELLATION',
    callouts: [
      { label: 'INPUT VECTOR', detail: 'Natural Human Intent Signal', anchorX: -0.48, anchorY: -0.35 },
      { label: 'SYNAPTIC WEIGHTS', detail: 'Dynamic Proximity Filaments', anchorX: 0.46, anchorY: -0.3 },
      { label: 'GENERATIVE NODE', detail: 'Real-Time UI Synthesis', anchorX: -0.38, anchorY: 0.4 },
    ],
  },
  {
    index: 8,
    id: 'future-horizon',
    chapter: '08',
    year: '2026 — ∞',
    particleWord: 'IMAGINE',
    particleAltWord: 'BEYOND UI',
    particleSubtext: 'WHAT HAPPENS WHEN IMAGINATION IS THE INTERFACE?',
    shapeType: 'singularity',
    title: 'THE UNWRITTEN HORIZON',
    quote: '“The next web hasn’t been designed yet. It’s waiting to be imagined.”',
    summary:
      'What happens when the screen itself dissolves into spatial computing, neural optics, and ambient intelligence? In this final coordinate, the particle field belongs to you. Type any word below or trigger a singularity wave to sculpt the 5,500 particles with your own imagination.',
    specs: [
      { label: 'FORM FACTOR', value: 'ZERO FIXED FORM' },
      { label: 'MEDIUM', value: 'SPATIAL & NEURAL' },
      { label: 'AUTHOR', value: 'YOU // REAL-TIME' },
    ],
    milestones: [
      { year: 'SPATIAL', title: 'Post-Screen Web', desc: 'Information woven directly into physical 3D architecture.' },
      { year: 'VOICE/GAZE', title: 'Zero-Friction Input', desc: 'Gaze, gesture, and thought replace cursors and keyboards.' },
      { year: '∞', title: 'Living Canvas', desc: 'When imagination itself becomes the operating system.' },
    ],
    interactionLabel: 'DETONATE SINGULARITY SHOCKWAVE',
    interactionActiveLabel: 'CONVERGE SINGULARITY FIELD',
    callouts: [
      { label: 'SINGULARITY CORE', detail: '37 Years of Web Convergence', anchorX: -0.48, anchorY: -0.36 },
      { label: 'LIVE SYNTHESIZER', detail: 'Type Any Word to Morph Particles', anchorX: 0.48, anchorY: -0.32 },
      { label: 'HORIZON ∞', detail: 'Unbounded Spatial Coordinate', anchorX: 0.4, anchorY: 0.4 },
    ],
  },
];
