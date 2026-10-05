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

export interface ParticleStoryBeat {
  tag: string;
  word: string;
  line1: string;
  line2: string;
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

export interface ParticleNodeStory {
  kicker: string;
  word: string;
  line1: string;
  line2: string;
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
  phases: [ParticleStoryBeat, ParticleStoryBeat, ParticleStoryBeat];
  sculptureCallouts: [SculptureCallout, SculptureCallout, SculptureCallout, SculptureCallout];
  specs: {
    label: string;
    value: string;
    particleWord: string;
    story: ParticleNodeStory;
  }[];
  milestones: {
    year: string;
    title: string;
    desc: string;
    particleWord: string;
    story: ParticleNodeStory;
  }[];
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
      'Scroll through 37 years of web history told entirely in living monochrome particles.',
    phases: [
      {
        tag: 'CHAPTER 00.A · GENESIS',
        word: 'THE WEB BEGAN',
        line1: 'AS SILENT TEXT ON DARK GLASS',
        line2: 'BUILT FOR SCIENTISTS AT CERN',
        caption: 'FROM STATIC DOCUMENTS TO LIVING SPACES',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 00.B · TRANSFORMATION',
        word: 'IT EVOLVED',
        line1: 'FROM STATIC DOCUMENTS AND TABLES',
        line2: 'INTO FLUID RESPONSIVE INTERFACES',
        caption: '1989 TERMINAL → 2026 SPATIAL HORIZON',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 00.C · LIVING MEDIUM',
        word: 'NOW IT BREATHES',
        line1: 'SHADERS PARTICLES AND NEURAL AI',
        line2: 'SCROLL TO WITNESS THE FULL STORY',
        caption: 'SCROLL TO EXPLORE 27 STORY SCENES',
        sculptVariant: 2,
      },
    ],
    sculptureCallouts: [
      { code: 'CORE.01', title: 'HYPERLINK TOPOLOGY', value: 'Global Information Mesh', x: -0.22, y: -0.14, z: 0.1, side: 'left' },
      { code: 'CORE.02', title: 'ORBITAL DATA RING', value: '37 Years of Web Standards', x: -0.34, y: 0.14, z: -0.05, side: 'left' },
      { code: 'CORE.03', title: 'PARTICLE ENGINE', value: '9,600 Monochrome Nodes', x: 0.22, y: -0.16, z: -0.1, side: 'right' },
      { code: 'CORE.04', title: 'SPATIAL HORIZON', value: 'HTML → CSS → GPU → AI', x: 0.32, y: 0.16, z: 0.08, side: 'right' },
    ],
    specs: [
      {
        label: 'TIMESPAN',
        value: '1989 — 2026',
        particleWord: '37 YEARS',
        story: {
          kicker: 'ARCHIVE SPEC · TIMESPAN',
          word: '37 YEARS',
          line1: 'FOUR DECADES OF DIGITAL CRAFT',
          line2: 'FROM CERN TERMINALS TO SPATIAL AI',
        },
      },
      {
        label: 'PARTICLES',
        value: '9,600 NODES',
        particleWord: '9600 NODES',
        story: {
          kicker: 'ARCHIVE SPEC · RESOLUTION',
          word: '9600 NODES',
          line1: 'EVERY LETTER FORMED BY LIGHT',
          line2: 'IN REAL TIME AT 60 FRAMES PER SEC',
        },
      },
      {
        label: 'NAVIGATION',
        value: 'LENIS + GSAP',
        particleWord: 'KINETIC FLOW',
        story: {
          kicker: 'ARCHIVE SPEC · ENGINE',
          word: 'KINETIC FLOW',
          line1: 'INERTIAL SCROLLING DRIVES THE TIDE',
          line2: 'MORPHING EVERY WORD IN PARTICLES',
        },
      },
    ],
    milestones: [
      {
        year: '1989',
        title: 'The Document Web',
        desc: 'Read-only academic hypertext on monochrome CRTs.',
        particleWord: 'DOCUMENT WEB',
        story: {
          kicker: 'MILESTONE · 1989 CERN',
          word: 'DOCUMENT WEB',
          line1: 'READ ONLY ACADEMIC HYPERTEXT',
          line2: 'ON MONOCHROME CRT TERMINALS',
        },
      },
      {
        year: '2007',
        title: 'The Responsive Web',
        desc: 'Fluid grids adapting across desktop and mobile glass.',
        particleWord: 'FLUID GRIDS',
        story: {
          kicker: 'MILESTONE · 2007 MOBILE',
          word: 'FLUID GRIDS',
          line1: 'ONE LAYOUT FLOWS LIKE WATER',
          line2: 'ACROSS DESKTOP AND TOUCH GLASS',
        },
      },
      {
        year: '2026',
        title: 'The Generative Web',
        desc: 'Interfaces synthesized live from human intent.',
        particleWord: 'INTENT UI',
        story: {
          kicker: 'MILESTONE · 2026 HORIZON',
          word: 'INTENT UI',
          line1: 'INTERFACES SYNTHESIZED LIVE',
          line2: 'FROM HUMAN VOICE AND THOUGHT',
        },
      },
    ],
  },
  {
    index: 1,
    id: 'dark-ages',
    chapter: '01',
    year: '1989 — 1994',
    shapeType: 'terminal',
    title: 'The Dark Ages',
    quote: '“Information Management: A Proposal.” — Tim Berners-Lee, CERN',
    summary:
      'Before images or stylesheets, the web was pure semantic text glowing on dark CRT monitors.',
    phases: [
      {
        tag: 'CHAPTER 01.A · 1989 GENEVA',
        word: '1989 CERN LAB',
        line1: 'TIM BERNERS-LEE WRITES HTML',
        line2: 'TO LINK HUMAN KNOWLEDGE TOGETHER',
        caption: 'WORLDWIDEWEB ON NEXTSTEP WORKSTATION',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 01.B · 1991 FIRST PAGE',
        word: 'TEXT ONLY WEB',
        line1: 'NO IMAGES NO COLORS NO LAYOUT',
        line2: 'JUST PHOSPHOR CHARACTERS IN ROWS',
        caption: '80×24 MONOSPACE TERMINAL BUFFER',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 01.C · 1993 MOSAIC',
        word: 'THE BLUE LINK',
        line1: 'ONE UNDERLINED ANCHOR TAG',
        line2: 'CONNECTED EVERY PAGE ON EARTH',
        caption: 'HTTP/0.9 GLOBAL HYPERTEXT GRAPH',
        sculptVariant: 2,
      },
    ],
    sculptureCallouts: [
      { code: 'CRT.01', title: 'NEXTSTEP BEZEL', value: '80×24 Character Frame', x: -0.32, y: -0.18, z: -0.02, side: 'left' },
      { code: 'CRT.02', title: 'ANCHOR NODE <A>', value: 'HREF Hypertext Pointer', x: -0.24, y: 0.14, z: 0.02, side: 'left' },
      { code: 'CRT.03', title: 'SCANLINE MATRIX', value: 'Monospace ASCII Stream', x: 0.26, y: -0.14, z: 0.0, side: 'right' },
      { code: 'CRT.04', title: 'HTTP/0.9 SOCKET', value: 'Port 80 TCP/IP Stream', x: 0.32, y: 0.18, z: -0.02, side: 'right' },
    ],
    specs: [
      {
        label: 'DISPLAY',
        value: '80×24 CRT',
        particleWord: '80X24 CRT',
        story: {
          kicker: 'ERA 01 SPEC · DISPLAY',
          word: '80X24 CRT',
          line1: 'EIGHTY COLUMNS OF GLOWING TEXT',
          line2: 'ON CURVED MONOCHROME CATHODE GLASS',
        },
      },
      {
        label: 'PROTOCOL',
        value: 'HTTP / 0.9',
        particleWord: 'HTTP 0.9',
        story: {
          kicker: 'ERA 01 SPEC · PROTOCOL',
          word: 'HTTP 0.9',
          line1: 'A SINGLE LINE GET REQUEST',
          line2: 'STREAMING RAW ASCII ACROSS THE WIRE',
        },
      },
      {
        label: 'STYLING',
        value: 'NONE (RAW)',
        particleWord: 'ZERO CSS',
        story: {
          kicker: 'ERA 01 SPEC · STYLING',
          word: 'ZERO CSS',
          line1: 'NO FONTS NO MARGINS NO GRIDS',
          line2: 'THE BROWSER DICTATED EVERY PIXEL',
        },
      },
    ],
    milestones: [
      {
        year: '1989',
        title: 'CERN Proposal',
        desc: 'Tim Berners-Lee outlines a global hypertext system.',
        particleWord: 'CERN 1989',
        story: {
          kicker: 'MILESTONE · MARCH 1989',
          word: 'CERN 1989',
          line1: 'A VAGUE BUT EXCITING PROPOSAL',
          line2: 'SPARKS THE WORLD WIDE WEB',
        },
      },
      {
        year: '1991',
        title: 'info.cern.ch Goes Live',
        desc: 'The world’s first website launches with pure HTML tags.',
        particleWord: 'FIRST SITE',
        story: {
          kicker: 'MILESTONE · AUGUST 1991',
          word: 'FIRST SITE',
          line1: 'INFO.CERN.CH OPENS TO THE WORLD',
          line2: 'HOSTED ON A BLACK NEXT CUBE',
        },
      },
      {
        year: '1993',
        title: 'NCSA Mosaic 1.0',
        desc: 'Introduces the inline <img> tag alongside text.',
        particleWord: 'MOSAIC 1.0',
        story: {
          kicker: 'MILESTONE · 1993 BROWSER',
          word: 'MOSAIC 1.0',
          line1: 'THE IMG TAG BRINGS PICTURES',
          line2: 'INTO THE FLOW OF HYPERTEXT',
        },
      },
    ],
  },
  {
    index: 2,
    id: 'tables-era',
    chapter: '02',
    year: '1995 — 1999',
    shapeType: 'table',
    title: 'Tables & GeoCities',
    quote: '“1px transparent spacer.gif held the entire 1990s web together.”',
    summary:
      'Designers hijacked HTML <table> tags and invisible 1px GIFs to force multi-column layouts.',
    phases: [
      {
        tag: 'CHAPTER 02.A · 1995 NETSCAPE',
        word: 'TABLE HACKS',
        line1: 'DESIGNERS BENT SPREADSHEET CELLS',
        line2: 'TO BUILD THE FIRST PAGE COLUMNS',
        caption: 'NESTED <TR> AND <TD> CELL MATRICES',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 02.B · 1996 PIXEL LOCK',
        word: '1PX SPACER GIF',
        line1: 'INVISIBLE GIFS HELD GRIDS APART',
        line2: 'WHILE SLICED JPEGS FORMED BUTTONS',
        caption: 'TRANSPARENT GIFS LOCKING 640×480 CELLS',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 02.C · 1997 GEOCITIES',
        word: 'BLINK AND GIF',
        line1: 'STARRY BACKGROUNDS AND HIT COUNTERS',
        line2: 'EVERY CITIZEN BUILT A HOMEPAGE',
        caption: 'UNDER CONSTRUCTION GIFS & MARQUEES',
        sculptVariant: 2,
      },
    ],
    sculptureCallouts: [
      { code: 'TBL.01', title: 'HEADER COLSPAN=3', value: '640px Sliced Image Banner', x: -0.28, y: -0.18, z: 0.0, side: 'left' },
      { code: 'TBL.02', title: 'LEFT SIDEBAR <TD>', value: '140px Fixed Spacer Column', x: -0.25, y: 0.06, z: 0.04, side: 'left' },
      { code: 'TBL.03', title: 'CONTENT CELL', value: 'Nested Table Body Area', x: 0.12, y: -0.05, z: -0.03, side: 'right' },
      { code: 'TBL.04', title: 'HIT COUNTER FOOTER', value: '00048291 Visitor Odometer', x: 0.28, y: 0.18, z: -0.02, side: 'right' },
    ],
    specs: [
      {
        label: 'LAYOUT',
        value: '<TABLE> GRID',
        particleWord: 'TABLE GRID',
        story: {
          kicker: 'ERA 02 SPEC · LAYOUT',
          word: 'TABLE GRID',
          line1: 'DEEP NESTED TABLE ROWS AND CELLS',
          line2: 'SIMULATED PRINT MAGAZINE PAGES',
        },
      },
      {
        label: 'PALETTE',
        value: '216 WEB-SAFE',
        particleWord: '216 COLORS',
        story: {
          kicker: 'ERA 02 SPEC · COLOR',
          word: '216 COLORS',
          line1: 'EIGHT BIT MONITORS LIMITED ARTISTS',
          line2: 'TO TWO HUNDRED SIXTEEN HEX CODES',
        },
      },
      {
        label: 'BANDWIDTH',
        value: '28.8K MODEM',
        particleWord: '28.8K DIALUP',
        story: {
          kicker: 'ERA 02 SPEC · SPEED',
          word: '28.8K DIALUP',
          line1: 'EVERY KILOBYTE SQUEALED OVER COPPER',
          line2: 'AS SLICED IMAGES LOADED ROW BY ROW',
        },
      },
    ],
    milestones: [
      {
        year: '1995',
        title: 'Netscape Navigator 2.0',
        desc: 'Introduces JavaScript, framesets, and animated GIFs.',
        particleWord: 'FRAMESETS',
        story: {
          kicker: 'MILESTONE · 1995 NETSCAPE',
          word: 'FRAMESETS',
          line1: 'SCREENS SPLIT INTO SCROLLING PANES',
          line2: 'AND JAVASCRIPT BIRTHED INTERACTION',
        },
      },
      {
        year: '1996',
        title: 'David Siegel’s Killer Sites',
        desc: 'Popularizes single-pixel GIFs and sliced table layouts.',
        particleWord: 'SLICED UI',
        story: {
          kicker: 'MILESTONE · 1996 SIEGEL',
          word: 'SLICED UI',
          line1: 'PHOTOSHOP MOCKUPS CHOPPED INTO TILES',
          line2: 'STITCHED TOGETHER INSIDE HTML TABLES',
        },
      },
      {
        year: '1997',
        title: 'GeoCities Neighborhoods',
        desc: 'Millions build personal pages with marquees and guestbooks.',
        particleWord: 'GEOCITIES',
        story: {
          kicker: 'MILESTONE · 1997 FOLK WEB',
          word: 'GEOCITIES',
          line1: 'DIGITAL NEIGHBORHOODS OF BLINK TAGS',
          line2: 'GUESTBOOKS AND MIDI SOUNDTRACKS',
        },
      },
    ],
  },
  {
    index: 3,
    id: 'css-flash',
    chapter: '03',
    year: '2000 — 2006',
    shapeType: 'cascade',
    title: 'CSS Zen & Flash Era',
    quote: '“One HTML file. Hundreds of visual worlds via CSS.” — Dave Shea',
    summary:
      'CSS separated structure from style while Flash and AJAX pushed browsers toward immersive, interactive experiences.',
    phases: [
      {
        tag: 'CHAPTER 03.A · 2003 CSS ZEN GARDEN',
        word: 'CSS TAKES OVER',
        line1: 'CONTENT FREED FROM TABLE MARKUP',
        line2: 'ONE STYLESHEET RULED EVERY PAGE',
        caption: 'SEPARATION OF HTML STRUCTURE & CSS',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 03.B · 2001 FLASH MX',
        word: 'FLASH CINEMA',
        line1: 'VECTOR TIMELINES AND SOUNDTRACKS',
        line2: 'TURNED WEBSITES INTO MOVIES',
        caption: 'ACTIONSCRIPT VECTOR MOTION & AUDIO',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 03.C · 2004 WEB 2.0',
        word: 'LIQUID CHROME',
        line1: 'AJAX STREAMS AND GLOSSY PILLS',
        line2: 'BIRTHED THE SOCIAL INTERACTIVE WEB',
        caption: 'GLOSSY GRADIENTS & ASYNC XMLHTTP',
        sculptVariant: 2,
      },
    ],
    sculptureCallouts: [
      { code: 'CSS.01', title: 'DOM PLANE (Z-0)', value: 'Semantic HTML Markup', x: -0.26, y: -0.15, z: -0.12, side: 'left' },
      { code: 'CSS.02', title: 'STYLE PLANE (Z-1)', value: 'Floating Cascade Rules', x: -0.18, y: 0.16, z: 0.0, side: 'left' },
      { code: 'SWF.03', title: 'VECTOR WAVEFORM', value: '60fps Flash Timeline', x: 0.24, y: -0.14, z: 0.12, side: 'right' },
      { code: 'WEB.04', title: 'AJAX DATA STREAM', value: 'Async XMLHttpRequest', x: 0.28, y: 0.16, z: 0.08, side: 'right' },
    ],
    specs: [
      {
        label: 'STYLING',
        value: 'CSS2 FLOAT',
        particleWord: 'CSS2 FLOAT',
        story: {
          kicker: 'ERA 03 SPEC · STYLING',
          word: 'CSS2 FLOAT',
          line1: 'FLOAT LEFT AND CLEARFIX HACKS',
          line2: 'REPLACED RIGID SPREADSHEET TABLES',
        },
      },
      {
        label: 'RUNTIME',
        value: 'FLASH SWF',
        particleWord: 'FLASH SWF',
        story: {
          kicker: 'ERA 03 SPEC · RUNTIME',
          word: 'FLASH SWF',
          line1: 'LOADING BARS AND SKIP INTRO BUTTONS',
          line2: 'OPENED IMMERSIVE VECTOR WORLDS',
        },
      },
      {
        label: 'DATA',
        value: 'AJAX / XML',
        particleWord: 'AJAX LIVE',
        story: {
          kicker: 'ERA 03 SPEC · DATA',
          word: 'AJAX LIVE',
          line1: 'PAGES UPDATED LIVE IN THE BACKGROUND',
          line2: 'WITHOUT FULL BROWSER RELOADS',
        },
      },
    ],
    milestones: [
      {
        year: '2001',
        title: 'Flash Golden Age',
        desc: '2Advanced Studios and preloader bars redefine digital art.',
        particleWord: '2ADVANCED',
        story: {
          kicker: 'MILESTONE · 2001 FLASH',
          word: '2ADVANCED',
          line1: 'SCI FI INTERFACES AND AMBIENT LOOPS',
          line2: 'PUSHED BROWSERS INTO CINEMA',
        },
      },
      {
        year: '2003',
        title: 'CSS Zen Garden',
        desc: 'Dave Shea proves pure CSS can transform identical HTML.',
        particleWord: 'ZEN GARDEN',
        story: {
          kicker: 'MILESTONE · 2003 SHEA',
          word: 'ZEN GARDEN',
          line1: 'ONE UNTOUCHED HTML DOCUMENT',
          line2: 'REIMAGINED HUNDREDS OF WAYS BY CSS',
        },
      },
      {
        year: '2005',
        title: 'Web 2.0 & AJAX',
        desc: 'Gmail and Google Maps pioneer live asynchronous apps.',
        particleWord: 'WEB 2.0',
        story: {
          kicker: 'MILESTONE · 2005 AJAX',
          word: 'WEB 2.0',
          line1: 'GOOGLE MAPS AND GMAIL PROVED',
          line2: 'THE BROWSER WAS AN OPERATING SYSTEM',
        },
      },
    ],
  },
  {
    index: 4,
    id: 'mobile-grid',
    chapter: '04',
    year: '2007 — 2011',
    shapeType: 'responsive',
    title: 'Mobile & Responsive',
    quote: '“Content is like water. You pour it into a cup, it becomes the cup.”',
    summary:
      'The 2007 iPhone ended Flash and forced layouts to morph fluidly from 12-column desktops to handheld glass.',
    phases: [
      {
        tag: 'CHAPTER 04.A · 2008 FLUID GRIDS',
        word: '12 COLUMN GRID',
        line1: '960PX PROPORTIONS BROUGHT ORDER',
        line2: 'TO COMPLEX APPLICATION INTERFACES',
        caption: 'PROPORTIONAL 960.GS & BOOTSTRAP COLUMNS',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 04.B · 2007 CAPACITIVE GLASS',
        word: 'IPHONE ARRIVES',
        line1: 'THE MOUSE CURSOR GAVE WAY TO TOUCH',
        line2: 'FLASH FELL AND MOBILE ROSE',
        caption: '320×480 CAPACITIVE MULTI-TOUCH SCREEN',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 04.C · 2010 ETHAN MARCOTTE',
        word: 'RESPONSIVE WEB',
        line1: 'CSS MEDIA QUERIES FLUIDLY MORPHED',
        line2: 'ONE DESIGN ACROSS EVERY SCREEN',
        caption: '@MEDIA BREAKPOINTS REFLOWING COLUMNS',
        sculptVariant: 2,
      },
    ],
    sculptureCallouts: [
      { code: 'RWD.01', title: 'CAPACITIVE VIEWPORT', value: '320×480px Touch Glass', x: -0.18, y: -0.18, z: 0.02, side: 'left' },
      { code: 'RWD.02', title: '@MEDIA BREAKPOINT', value: 'min-width: 768px / 1024px', x: -0.22, y: 0.16, z: 0.0, side: 'left' },
      { code: 'RWD.03', title: 'FLUID CARD STACK', value: 'Percentage Width Reflow', x: 0.18, y: -0.14, z: 0.02, side: 'right' },
      { code: 'RWD.04', title: 'TOUCH TARGET 44PX', value: 'Ergonomic Finger Hitbox', x: 0.22, y: 0.18, z: 0.0, side: 'right' },
    ],
    specs: [
      {
        label: 'BREAKPOINT',
        value: '@MEDIA CSS3',
        particleWord: '@MEDIA CSS',
        story: {
          kicker: 'ERA 04 SPEC · BREAKPOINT',
          word: '@MEDIA CSS',
          line1: 'LAYOUTS DETECTED SCREEN WIDTH LIVE',
          line2: 'REFLOWING COLUMNS WITHOUT RELOADING',
        },
      },
      {
        label: 'GRID SYSTEM',
        value: '12 COLUMNS',
        particleWord: '12 COLUMNS',
        story: {
          kicker: 'ERA 04 SPEC · ARCHITECTURE',
          word: '12 COLUMNS',
          line1: 'DIVISIBLE BY TWO THREE FOUR AND SIX',
          line2: 'THE UNIVERSAL RHYTHM OF MODERN UI',
        },
      },
      {
        label: 'INPUT',
        value: 'MULTI-TOUCH',
        particleWord: 'TOUCH GLASS',
        story: {
          kicker: 'ERA 04 SPEC · ERGONOMICS',
          word: 'TOUCH GLASS',
          line1: 'SWIPE PINCH AND INERTIAL MOMENTUM',
          line2: 'REPLACED HOVER STATES AND SCROLLBARS',
        },
      },
    ],
    milestones: [
      {
        year: '2007',
        title: 'iPhone & Mobile Safari',
        desc: 'Multi-touch gestures replace hover states and kill Flash.',
        particleWord: 'IPHONE 2007',
        story: {
          kicker: 'MILESTONE · JANUARY 2007',
          word: 'IPHONE 2007',
          line1: 'STEVE JOBS UNVEILS MOBILE SAFARI',
          line2: 'PUTTING THE REAL WEB IN EVERY POCKET',
        },
      },
      {
        year: '2010',
        title: 'Responsive Web Design',
        desc: 'Ethan Marcotte coins RWD using fluid grids and media queries.',
        particleWord: 'MARCOTTE RWD',
        story: {
          kicker: 'MILESTONE · MAY 2010',
          word: 'MARCOTTE RWD',
          line1: 'FLUID GRIDS FLEXIBLE IMAGES',
          line2: 'AND MEDIA QUERIES UNITE ALL SCREENS',
        },
      },
      {
        year: '2011',
        title: 'Twitter Bootstrap 1.0',
        desc: 'Standardizes mobile-first 12-column responsive components.',
        particleWord: 'BOOTSTRAP',
        story: {
          kicker: 'MILESTONE · AUGUST 2011',
          word: 'BOOTSTRAP',
          line1: 'OPEN SOURCE GRID AND UI TOOLKIT',
          line2: 'STANDARDIZES RESPONSIVE ENGINEERING',
        },
      },
    ],
  },
  {
    index: 5,
    id: 'flat-design',
    chapter: '05',
    year: '2012 — 2015',
    shapeType: 'flat',
    title: 'Flat & Design Systems',
    quote: '“Good design is as little design as possible.” — Dieter Rams',
    summary:
      'Skeuomorphic leather and faux shadows were stripped away in favor of Swiss typography, SVG vectors, and atomic tokens.',
    phases: [
      {
        tag: 'CHAPTER 05.A · 2013 DIGITAL HONESTY',
        word: 'PURE GEOMETRY',
        line1: 'FAUX LEATHER AND STITCHING VANISHED',
        line2: 'PIXELS EMBRACED SWISS CLARITY',
        caption: 'ZERO DROP SHADOWS OR BEVELS',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 05.B · 2014 ATOMIC SYSTEMS',
        word: 'DESIGN TOKENS',
        line1: 'REUSABLE ATOMIC UI COMPONENTS',
        line2: 'UNIFIED DESIGN AND ENGINEERING',
        caption: 'MODULAR ATOMS → MOLECULES → ORGANISMS',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 05.C · 2015 RETINA VECTORS',
        word: 'BOLD TYPOGRAPHY',
        line1: 'WHITESPACE SCALE AND VECTOR ICONS',
        line2: 'BECAME THE CORE INTERFACE LANGUAGE',
        caption: 'RESOLUTION-INDEPENDENT SVG & FLEXBOX',
        sculptVariant: 2,
      },
    ],
    sculptureCallouts: [
      { code: 'SYS.01', title: 'SWISS BENTO TILE', value: '8px Spatial Grid Module', x: -0.24, y: -0.15, z: 0.0, side: 'left' },
      { code: 'SYS.02', title: 'DESIGN TOKENS', value: 'Spacing / Type / Contrast', x: -0.24, y: 0.15, z: 0.0, side: 'left' },
      { code: 'SYS.03', title: 'ATOMIC COMPONENT', value: 'Stateless React Primitive', x: 0.24, y: -0.15, z: 0.0, side: 'right' },
      { code: 'SYS.04', title: 'SVG VECTOR PATH', value: 'Infinite Retina Sharpness', x: 0.24, y: 0.15, z: 0.0, side: 'right' },
    ],
    specs: [
      {
        label: 'PARADIGM',
        value: 'SWISS FLAT',
        particleWord: 'SWISS FLAT',
        story: {
          kicker: 'ERA 05 SPEC · PARADIGM',
          word: 'SWISS FLAT',
          line1: 'INSPIRED BY INTERNATIONAL TYPOGRAPHY',
          line2: 'CLARITY AND ORDER REPLACED ORNAMENT',
        },
      },
      {
        label: 'LAYOUT',
        value: 'FLEX & GRID',
        particleWord: 'CSS FLEXBOX',
        story: {
          kicker: 'ERA 05 SPEC · LAYOUT',
          word: 'CSS FLEXBOX',
          line1: 'TRUE VERTICAL AND HORIZONTAL ALIGNMENT',
          line2: 'NATIVE IN THE BROWSER ENGINE',
        },
      },
      {
        label: 'SYSTEMS',
        value: 'DESIGN TOKENS',
        particleWord: 'UI TOKENS',
        story: {
          kicker: 'ERA 05 SPEC · ARCHITECTURE',
          word: 'UI TOKENS',
          line1: 'SHARED VARIABLES FOR SPACE AND TYPE',
          line2: 'SYNCHRONIZED FIGMA AND REACT CODE',
        },
      },
    ],
    milestones: [
      {
        year: '2012',
        title: 'Microsoft Metro & iOS 7',
        desc: 'Skeuomorphic textures vanish overnight across all platforms.',
        particleWord: 'IOS 7 FLAT',
        story: {
          kicker: 'MILESTONE · 2013 RESET',
          word: 'IOS 7 FLAT',
          line1: 'FELT GREEN TABLES AND FAUX WOOD',
          line2: 'GAVE WAY TO TRANSLUCENT GLASS AND TYPE',
        },
      },
      {
        year: '2014',
        title: 'Google Material Design',
        desc: 'Introduces tactile digital paper with physics-based elevation.',
        particleWord: 'MATERIAL UI',
        story: {
          kicker: 'MILESTONE · 2014 GOOGLE',
          word: 'MATERIAL UI',
          line1: 'QUANTUM PAPER WITH CHOREOGRAPHED INK',
          line2: 'AND MEANINGFUL Z AXIS ELEVATION',
        },
      },
      {
        year: '2015',
        title: 'React & Figma Systems',
        desc: 'Component-driven UI and collaborative vector systems unite.',
        particleWord: 'FIGMA + REACT',
        story: {
          kicker: 'MILESTONE · 2015 WORKFLOW',
          word: 'FIGMA + REACT',
          line1: 'MULTIPLAYER DESIGN IN THE BROWSER',
          line2: 'MAPPED DIRECTLY TO COMPONENT TREES',
        },
      },
    ],
  },
  {
    index: 6,
    id: 'webgl-gpu',
    chapter: '06',
    year: '2016 — 2022',
    shapeType: 'wave3d',
    title: 'WebGL & Scrollytelling',
    quote: '“The browser tab became a real-time 60fps GPU shader canvas.”',
    summary:
      'WebGL, Three.js, custom GLSL shaders, and smooth scroll engines transformed websites into spatial films.',
    phases: [
      {
        tag: 'CHAPTER 06.A · 2016 HARDWARE GPU',
        word: 'THE GPU AWAKENS',
        line1: 'THREE.JS BROUGHT 3D SCENES AND LIGHT',
        line2: 'DIRECTLY INTO THE BROWSER DOM',
        caption: 'REAL-TIME VERTEX & FRAGMENT SHADERS',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 06.B · 2019 CUSTOM GLSL',
        word: 'LIQUID SHADERS',
        line1: 'PIXELS BECAME FLUID WATER AND CLOTH',
        line2: 'REACTING LIVE TO EVERY SCROLL',
        caption: 'PROCEDURAL NOISE & RAYMARCHED SURFACES',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 06.C · 2021 CINEMATIC MOTION',
        word: 'SCROLLYTELLING',
        line1: 'LENIS AND GSAP TURNED THE SCROLLBAR',
        line2: 'INTO A FILM DIRECTOR CAMERA',
        caption: 'INERTIAL SCROLL CHOREOGRAPHY AT 60FPS',
        sculptVariant: 2,
      },
    ],
    sculptureCallouts: [
      { code: 'GPU.01', title: 'VERTEX DISPLACEMENT', value: 'sin(d * 14.0 - uTime * 3.0)', x: -0.28, y: -0.1, z: 0.14, side: 'left' },
      { code: 'GPU.02', title: 'FRAGMENT NORMAL', value: 'Per-Pixel Specular Shading', x: -0.24, y: 0.16, z: -0.12, side: 'left' },
      { code: 'GPU.03', title: 'UNIFORM uScroll', value: 'Lenis Inertial Velocity', x: 0.26, y: -0.12, z: -0.1, side: 'right' },
      { code: 'GPU.04', title: '60FPS RENDER LOOP', value: 'GSAP Ticker Synchronized', x: 0.28, y: 0.16, z: 0.14, side: 'right' },
    ],
    specs: [
      {
        label: 'GRAPHICS',
        value: 'WEBGL2 / GLSL',
        particleWord: 'GLSL SHADER',
        story: {
          kicker: 'ERA 06 SPEC · GRAPHICS',
          word: 'GLSL SHADER',
          line1: 'MILLIONS OF PIXELS COMPUTED IN PARALLEL',
          line2: 'DIRECTLY ON SILICON GRAPHICS CORES',
        },
      },
      {
        label: 'MOTION',
        value: 'LENIS + GSAP',
        particleWord: '60FPS MOTION',
        story: {
          kicker: 'ERA 06 SPEC · CHOREOGRAPHY',
          word: '60FPS MOTION',
          line1: 'DAMPED SPRING PHYSICS AND TIMELINES',
          line2: 'SYNCHRONIZED DOM AND WEBGL CAMERAS',
        },
      },
      {
        label: 'DEPTH',
        value: '3D RAYMARCH',
        particleWord: '3D CANVASES',
        story: {
          kicker: 'ERA 06 SPEC · DIMENSION',
          word: '3D CANVASES',
          line1: 'LIGHT REFRACTION SHADOWS AND BLOOM',
          line2: 'RENDERED WITHOUT PLUGINS OR DOWNLOADS',
        },
      },
    ],
    milestones: [
      {
        year: '2016',
        title: 'Three.js & WebGL Mainstream',
        desc: '3D particle fields and custom shaders become the Awwwards standard.',
        particleWord: 'THREE.JS 3D',
        story: {
          kicker: 'MILESTONE · 2016 THREE.JS',
          word: 'THREE.JS 3D',
          line1: 'RICARDO CABELLO UNLOCKS WEBGL',
          line2: 'FOR CREATIVE CODERS WORLDWIDE',
        },
      },
      {
        year: '2019',
        title: 'Cinematic Scrollytelling',
        desc: 'Apple AirPods Pro and editorial stories pioneer scroll-bound 3D.',
        particleWord: 'SCROLL FILM',
        story: {
          kicker: 'MILESTONE · 2019 EDITORIAL',
          word: 'SCROLL FILM',
          line1: 'EVERY WHEEL TICK ADVANCES THE CAMERA',
          line2: 'THROUGH EXPLODED 3D PRODUCT ARCHITECTURE',
        },
      },
      {
        year: '2022',
        title: 'React Three Fiber & WebGPU',
        desc: 'Declarative 3D scene graphs merge seamlessly with React state.',
        particleWord: 'R3F + WEBGPU',
        story: {
          kicker: 'MILESTONE · 2022 DECLARATIVE 3D',
          word: 'R3F + WEBGPU',
          line1: 'THREE.JS EXPRESSED AS REACT COMPONENTS',
          line2: 'WITH COMPUTE SHADERS ON THE GPU',
        },
      },
    ],
  },
  {
    index: 7,
    id: 'ai-neural',
    chapter: '07',
    year: '2023 — 2025',
    shapeType: 'neural',
    title: 'AI-Native & Generative UI',
    quote: '“The interface is no longer pre-drawn. It is synthesized on demand.”',
    summary:
      'Large language models and autonomous agents dissolved static templates into intent-driven interfaces.',
    phases: [
      {
        tag: 'CHAPTER 07.A · 2023 NEURAL PARADIGM',
        word: 'PROMPT TO PIXEL',
        line1: 'HUMAN LANGUAGE BECAME SOURCE CODE',
        line2: 'GENERATING INTERFACES ON DEMAND',
        caption: 'NATURAL LANGUAGE → LIVE REACT TREES',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 07.B · 2024 BESPOKE STREAM',
        word: 'GENERATIVE UI',
        line1: 'STATIC TEMPLATES DISSOLVED INTO',
        line2: 'LIVE STREAMING NEURAL COMPONENTS',
        caption: 'BESPOKE INTERACTIVE WIDGETS PER QUERY',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 07.C · 2025 AGENTIC UX',
        word: 'INTENT DRIVEN',
        line1: 'THE INTERFACE ADAPTS ITS OWN FORM',
        line2: 'TO MATCH EVERY USER THOUGHT',
        caption: 'MULTI-AGENT WORKFLOWS & ZERO NAVIGATION',
        sculptVariant: 2,
      },
    ],
    sculptureCallouts: [
      { code: 'AI.01', title: 'INPUT CORTEX', value: 'Multimodal Intent Vector', x: -0.24, y: -0.12, z: 0.06, side: 'left' },
      { code: 'AI.02', title: 'SYNAPTIC WEIGHTS', value: 'Attention Head Filaments', x: -0.2, y: 0.14, z: -0.08, side: 'left' },
      { code: 'AI.03', title: 'LATENT CLUSTER', value: 'Semantic Context Graph', x: 0.24, y: -0.12, z: -0.06, side: 'right' },
      { code: 'AI.04', title: 'UI SYNTHESIZER', value: 'Live Streamed DOM Nodes', x: 0.2, y: 0.14, z: 0.08, side: 'right' },
    ],
    specs: [
      {
        label: 'INPUT',
        value: 'INTENT / VOICE',
        particleWord: 'VOICE INTENT',
        story: {
          kicker: 'ERA 07 SPEC · INPUT',
          word: 'VOICE INTENT',
          line1: 'CONVERSATION AND MULTIMODAL CONTEXT',
          line2: 'REPLACED DEEP NESTED DROPDOWN MENUS',
        },
      },
      {
        label: 'DOM TREE',
        value: 'EPHEMERAL UI',
        particleWord: 'EPHEMERAL UI',
        story: {
          kicker: 'ERA 07 SPEC · ARCHITECTURE',
          word: 'EPHEMERAL UI',
          line1: 'INTERFACES ASSEMBLE FOR THE TASK',
          line2: 'AND DISSOLVE WHEN THE GOAL IS DONE',
        },
      },
      {
        label: 'ENGINE',
        value: 'NEURAL AGENT',
        particleWord: 'AGENTIC AI',
        story: {
          kicker: 'ERA 07 SPEC · COGNITION',
          word: 'AGENTIC AI',
          line1: 'AUTONOMOUS AGENTS REASON PLAN AND CODE',
          line2: 'COLLABORATING LIVE WITH THE USER',
        },
      },
    ],
    milestones: [
      {
        year: '2023',
        title: 'Prompt-to-UI Synthesis',
        desc: 'Natural language prompts compile directly into live React views.',
        particleWord: 'PROMPT TO UI',
        story: {
          kicker: 'MILESTONE · 2023 SYNTHESIS',
          word: 'PROMPT TO UI',
          line1: 'DESCRIBE AN APPLICATION IN WORDS',
          line2: 'AND WATCH THE INTERFACE MATERIALIZE',
        },
      },
      {
        year: '2024',
        title: 'Streaming Generative Widgets',
        desc: 'Interfaces stream custom interactive canvases for each question.',
        particleWord: 'STREAMED UI',
        story: {
          kicker: 'MILESTONE · 2024 GENERATIVE',
          word: 'STREAMED UI',
          line1: 'EVERY ANSWER RENDERS A BESPOKE',
          line2: 'INTERACTIVE SIMULATION IN REAL TIME',
        },
      },
      {
        year: '2025',
        title: 'Autonomous Agentic UX',
        desc: 'Multi-agent systems orchestrate complex tasks across the web.',
        particleWord: 'AGENT SWARM',
        story: {
          kicker: 'MILESTONE · 2025 AGENTS',
          word: 'AGENT SWARM',
          line1: 'ORCHESTRATED TEAMS OF AI AGENTS',
          line2: 'EXECUTE END TO END DIGITAL WORKFLOWS',
        },
      },
    ],
  },
  {
    index: 8,
    id: 'future-horizon',
    chapter: '08',
    year: '2026+',
    shapeType: 'singularity',
    title: 'The Spatial Horizon',
    quote: '“Type any word below to sculpt the future of the particle web.”',
    summary:
      'Beyond flat glass screens lies spatial computing, ambient intelligence, and interfaces made of living light.',
    phases: [
      {
        tag: 'CHAPTER 08.A · 2026 BEYOND GLASS',
        word: 'SPATIAL CANVAS',
        line1: 'THE RECTANGULAR MONITOR DISSOLVES',
        line2: 'INTO INFINITE AMBIENT COMPUTING',
        caption: 'WEBXR PASSTHROUGH & VOLUMETRIC LIGHT',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 08.B · ZERO-UI HORIZON',
        word: 'LIVING MATTER',
        line1: 'INFORMATION FLOATS AS LIGHT AND DEPTH',
        line2: 'SCULPTED BY VOICE GAZE AND INTENT',
        caption: 'EYE-TRACKED GAZE & NEURAL BIOMETRICS',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 08.C · INTERACTIVE SANDBOX',
        word: 'IMAGINE NEXT',
        line1: 'FROM 1989 CERN TO INFINITE SPACE',
        line2: 'TYPE BELOW TO SCULPT YOUR OWN WORD',
        caption: 'LIVE PARTICLE TYPOGRAPHY SYNTHESIZER',
        sculptVariant: 2,
      },
    ],
    sculptureCallouts: [
      { code: 'INF.01', title: 'EVENT HORIZON', value: 'Zero-UI Singularity Core', x: -0.22, y: -0.08, z: 0.12, side: 'left' },
      { code: 'INF.02', title: 'ORBITAL ARM A', value: 'Volumetric WebXR Field', x: -0.28, y: 0.14, z: -0.14, side: 'left' },
      { code: 'INF.03', title: 'ORBITAL ARM B', value: 'Neural Gaze Telemetry', x: 0.26, y: -0.1, z: -0.12, side: 'right' },
      { code: 'INF.04', title: 'PARTICLE SYNTH', value: 'Live User Word Sculptor', x: 0.28, y: 0.14, z: 0.12, side: 'right' },
    ],
    specs: [
      {
        label: 'MEDIUM',
        value: 'SPATIAL 3D',
        particleWord: 'SPATIAL 3D',
        story: {
          kicker: 'ERA 08 SPEC · MEDIUM',
          word: 'SPATIAL 3D',
          line1: 'INTERFACES ANCHORED IN PHYSICAL ROOMS',
          line2: 'WITH NATURAL DEPTH AND OCCLUSION',
        },
      },
      {
        label: 'INTERFACE',
        value: 'ZERO-UI',
        particleWord: 'ZERO UI',
        story: {
          kicker: 'ERA 08 SPEC · INTERFACE',
          word: 'ZERO UI',
          line1: 'NO WINDOWS NO FILES NO MENUS',
          line2: 'AMBIENT COMPUTING WOVEN INTO LIFE',
        },
      },
      {
        label: 'TIMELINE',
        value: '2026 → ∞',
        particleWord: 'INFINITE WEB',
        story: {
          kicker: 'ERA 08 SPEC · HORIZON',
          word: 'INFINITE WEB',
          line1: 'THIRTY SEVEN YEARS WAS JUST THE PROLOGUE',
          line2: 'THE NEXT CHAPTER IS YOURS TO WRITE',
        },
      },
    ],
    milestones: [
      {
        year: '2026',
        title: 'Ambient Spatial Web',
        desc: 'Information detaches from 2D monitors into physical space.',
        particleWord: 'AMBIENT WEB',
        story: {
          kicker: 'MILESTONE · 2026 SPATIAL',
          word: 'AMBIENT WEB',
          line1: 'GLASSES AND OPTICS MERGE THE WEB',
          line2: 'WITH THE ARCHITECTURE AROUND US',
        },
      },
      {
        year: '2028',
        title: 'Biometric & Gaze Intent',
        desc: 'Micro-gestures and eye tracking replace physical pointers.',
        particleWord: 'NEURAL GAZE',
        story: {
          kicker: 'MILESTONE · 2028 BIOMETRIC',
          word: 'NEURAL GAZE',
          line1: 'LOOK AT ANY OBJECT AND WHISPER',
          line2: 'TO RESHAPE DIGITAL MATTER INSTANTLY',
        },
      },
      {
        year: '∞',
        title: 'The Living Medium',
        desc: 'Human imagination and digital matter become one.',
        particleWord: 'PURE LIGHT',
        story: {
          kicker: 'MILESTONE · INFINITE HORIZON',
          word: 'PURE LIGHT',
          line1: 'HUMAN IMAGINATION AND DIGITAL MATTER',
          line2: 'CONVERGE INTO PURE LIVING LIGHT',
        },
      },
    ],
  },
];
