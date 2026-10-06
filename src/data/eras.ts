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
  sculptVariant: number;
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
        tag: 'CHAPTER 00.A · THE SPARK',
        word: 'A GLOBAL BRAIN',
        line1: 'HUMANITY DREAMED OF ONE SHARED LIBRARY',
        line2: 'WHERE EVERY IDEA COULD LINK TO ANOTHER',
        caption: 'GEODESIC HYPERLINK TOPOLOGY',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 00.B · THE METAMORPHOSIS',
        word: 'STATIC TO ALIVE',
        line1: 'SILENT ACADEMIC TEXT LEARNED TO PAINT',
        line2: 'TO MOVE TO LISTEN AND TO BREATHE',
        caption: 'INTERTWINED DUAL-HELIX EVOLUTION',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 00.C · THE ARCHIVE',
        word: 'NINE ERAS OF LIGHT',
        line1: 'THIRTY SEVEN YEARS OF INTERFACE CRAFT',
        line2: 'SCULPTED IN NINE THOUSAND PARTICLES',
        caption: 'GYROSCOPIC ORBITAL ARCHIVE SHELL',
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
        label: 'CHRONOLOGY',
        value: '9 CHAPTERS',
        particleWord: 'NINE CHAPTERS',
        story: {
          kicker: 'PROLOGUE SPEC · CHRONOLOGY',
          word: 'NINE CHAPTERS',
          line1: 'FROM 1989 CERN TO 2026 SPATIAL HORIZONS',
          line2: 'MAPPED ACROSS TWENTY SEVEN STORY SCENES',
          sculptVariant: 3,
        },
      },
      {
        label: 'MATTER',
        value: '9,600 NODES',
        particleWord: 'LIVING DUST',
        story: {
          kicker: 'PROLOGUE SPEC · PARTICLE MATTER',
          word: 'LIVING DUST',
          line1: 'SEVEN THOUSAND TWO HUNDRED STORY NODES',
          line2: 'PLUS TWO THOUSAND SCULPTURE VERTICES',
          sculptVariant: 4,
        },
      },
      {
        label: 'SPECTRUM',
        value: 'MONOCHROME',
        particleWord: 'BLACK & WHITE',
        story: {
          kicker: 'PROLOGUE SPEC · VISUAL SPECTRUM',
          word: 'BLACK & WHITE',
          line1: 'STRIPPED OF COLOR TO REVEAL PURE FORM',
          line2: 'OBSIDIAN WATER SHADERS AND WHITE LIGHT',
          sculptVariant: 5,
        },
      },
    ],
    milestones: [
      {
        year: '1945',
        title: 'Vannevar Bush’s Memex',
        desc: 'Envisions linked trails of human knowledge long before digital computers.',
        particleWord: 'THE MEMEX',
        story: {
          kicker: 'PREHISTORY · 1945 AS WE MAY THINK',
          word: 'THE MEMEX',
          line1: 'VANNEVAR BUSH IMAGINES A DESK OF LIGHT',
          line2: 'CONNECTING TRAILS OF HUMAN MEMORY',
          sculptVariant: 6,
        },
      },
      {
        year: '1965',
        title: 'Ted Nelson Coins Hypertext',
        desc: 'Project Xanadu proposes non-sequential writing with bidirectional links.',
        particleWord: 'XANADU LINKS',
        story: {
          kicker: 'PREHISTORY · 1965 PROJECT XANADU',
          word: 'XANADU LINKS',
          line1: 'TED NELSON COINS THE WORD HYPERTEXT',
          line2: 'FOR NON SEQUENTIAL INTERTWINED WRITING',
          sculptVariant: 7,
        },
      },
      {
        year: '1969',
        title: 'ARPANET First Packet',
        desc: 'UCLA sends the letters “LO” to Stanford, birthing the packet-switched internet.',
        particleWord: 'LO AND BEHOLD',
        story: {
          kicker: 'PREHISTORY · OCTOBER 29 1969',
          word: 'LO AND BEHOLD',
          line1: 'TWO LETTERS SENT FROM UCLA TO STANFORD',
          line2: 'IGNITE THE GLOBAL PACKET NETWORK',
          sculptVariant: 8,
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
        line1: 'TIM BERNERS-LEE WRITES THE PROPOSAL',
        line2: 'FOR A DISTRIBUTED INFORMATION MESH',
        caption: 'WORLDWIDEWEB ON NEXTSTEP WORKSTATION',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 01.B · 1991 CATHODE TUBE',
        word: 'GREEN PHOSPHOR',
        line1: 'NO IMAGES NO COLORS NO GRAPHICS',
        line2: 'ONLY RAW ASCII ON DARK CATHODE GLASS',
        caption: '3D CRT ELECTRON SCANLINE FUNNEL',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 01.C · 1992 HYPERTEXT',
        word: 'THE ANCHOR TAG',
        line1: 'ONE UNDERLINED HYPERTEXT REFERENCE',
        line2: 'BRIDGED ACADEMIC SERVERS WORLDWIDE',
        caption: '3D </A> HYPERTEXT ANCHOR SCULPTURE',
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
        value: '80×24 MATRIX',
        particleWord: '80X24 MATRIX',
        story: {
          kicker: 'ERA 01 SPEC · TERMINAL DISPLAY',
          word: '80X24 MATRIX',
          line1: 'EIGHTY CHARACTERS WIDE BY TWENTY FOUR',
          line2: 'MONOSPACE GRID LOCKED IN HARDWARE ROM',
          sculptVariant: 3,
        },
      },
      {
        label: 'PROTOCOL',
        value: 'HTTP / 0.9',
        particleWord: 'PORT 80 TCP',
        story: {
          kicker: 'ERA 01 SPEC · NETWORK PROTOCOL',
          word: 'PORT 80 TCP',
          line1: 'A STATELESS SINGLE LINE GET COMMAND',
          line2: 'RETURNED RAW HTML THEN CLOSED THE WIRE',
          sculptVariant: 4,
        },
      },
      {
        label: 'MARKUP',
        value: '18 HTML TAGS',
        particleWord: '18 HTML TAGS',
        story: {
          kicker: 'ERA 01 SPEC · DOCUMENT GRAMMAR',
          word: '18 HTML TAGS',
          line1: 'H1 TO H6 PARAGRAPH LIST AND ANCHOR',
          line2: 'EIGHTEEN TAGS BUILT THE ENTIRE FIRST WEB',
          sculptVariant: 5,
        },
      },
    ],
    milestones: [
      {
        year: '1990',
        title: 'The NeXTcube Server',
        desc: 'A handwritten red sticker warns: “This machine is a server. DO NOT POWER IT DOWN!!”',
        particleWord: 'NEXT CUBE',
        story: {
          kicker: 'MILESTONE · DECEMBER 1990',
          word: 'NEXT CUBE',
          line1: 'DO NOT POWER DOWN THIS BLACK WORKSTATION',
          line2: 'THE WORLD WIDE WEB SERVER RUNS INSIDE',
          sculptVariant: 6,
        },
      },
      {
        year: '1991',
        title: 'info.cern.ch Goes Live',
        desc: 'The world’s first public website launches from Building 31 at CERN.',
        particleWord: 'INFO.CERN.CH',
        story: {
          kicker: 'MILESTONE · AUGUST 6 1991',
          word: 'INFO.CERN.CH',
          line1: 'THE FIRST PUBLIC URL GOES LIVE IN GENEVA',
          line2: 'INDEXING EVERY SERVER ON THE PLANET',
          sculptVariant: 7,
        },
      },
      {
        year: '1993',
        title: 'NCSA Mosaic 1.0',
        desc: 'Marc Andreessen introduces the inline <img> tag alongside hypertext.',
        particleWord: 'INLINE <IMG>',
        story: {
          kicker: 'MILESTONE · APRIL 1993',
          word: 'INLINE <IMG>',
          line1: 'MARC ANDREESSEN ADDS THE IMAGE TAG',
          line2: 'AND PHOTOGRAPHS ENTER THE FLOW OF TEXT',
          sculptVariant: 8,
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
        word: 'TABLE LAYOUTS',
        line1: 'DESIGNERS HIJACKED SPREADSHEET CELLS',
        line2: 'TO FORCE MULTI COLUMN MAGAZINE PAGES',
        caption: 'NESTED <TR> AND <TD> CELL MATRICES',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 02.B · 1996 PIXEL LOCK',
        word: '1PX SPACER GIF',
        line1: 'INVISIBLE SINGLE PIXEL TRANSPARENT GIFS',
        line2: 'HELD FRAGILE 640PX LAYOUTS TOGETHER',
        caption: 'EXPLODED ISOMETRIC SLICED CELL MATRIX',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 02.C · 1997 GEOCITIES',
        word: 'BLINK & MARQUEE',
        line1: 'TILED STARFIELDS AND SPINNING FLAMES',
        line2: 'TURNED PERSONAL HOMEPAGES INTO FOLK ART',
        caption: 'TRIPTYCH FRAMESET & ORBITAL GIF RING',
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
        label: 'MARKUP',
        value: 'NESTED <TD>',
        particleWord: 'COLSPAN HACK',
        story: {
          kicker: 'ERA 02 SPEC · TABLE ARCHITECTURE',
          word: 'COLSPAN HACK',
          line1: 'TABLES NESTED FIVE LEVELS DEEP IN HTML',
          line2: 'WITH BORDER ZERO AND CELLPADDING ZERO',
          sculptVariant: 3,
        },
      },
      {
        label: 'PALETTE',
        value: '216 WEB-SAFE',
        particleWord: '216 HEX CODES',
        story: {
          kicker: 'ERA 02 SPEC · COLOR QUANTIZATION',
          word: '216 HEX CODES',
          line1: 'EIGHT BIT VIDEO CARDS FORCED DESIGNERS',
          line2: 'INTO DITHERED GIFS AND WEB SAFE PALETTES',
          sculptVariant: 4,
        },
      },
      {
        label: 'MODEM',
        value: '28.8K BAUD',
        particleWord: '28.8K DIALUP',
        story: {
          kicker: 'ERA 02 SPEC · COPPER BANDWIDTH',
          word: '28.8K DIALUP',
          line1: 'ACOUSTIC HANDSHAKES OVER PHONE LINES',
          line2: 'LOADED INTERLACED JPEGS ROW BY ROW',
          sculptVariant: 5,
        },
      },
    ],
    milestones: [
      {
        year: '1995',
        title: 'Netscape Frames & JS',
        desc: 'Brendan Eich creates JavaScript in 10 days while framesets split viewports.',
        particleWord: 'FRAMESETS',
        story: {
          kicker: 'MILESTONE · 1995 NETSCAPE 2.0',
          word: 'FRAMESETS',
          line1: 'TEN DAYS OF BRENDAN EICH BORN JAVASCRIPT',
          line2: 'WHILE FRAMESETS SPLIT THE SCREEN IN THREE',
          sculptVariant: 6,
        },
      },
      {
        year: '1996',
        title: 'David Siegel’s Killer Sites',
        desc: 'Teaches a generation to slice Photoshop mockups into HTML table cells.',
        particleWord: 'SLICED PSD',
        story: {
          kicker: 'MILESTONE · 1996 KILLER WEB SITES',
          word: 'SLICED PSD',
          line1: 'DAVID SIEGEL TAUGHT DESIGNERS TO SLICE ART',
          line2: 'AND STITCH JPEGS INSIDE TABLE CELLS',
          sculptVariant: 7,
        },
      },
      {
        year: '1997',
        title: 'GeoCities Homesteads',
        desc: 'Millions build digital neighborhoods with guestbooks, web rings, and MIDI.',
        particleWord: 'GUESTBOOKS',
        story: {
          kicker: 'MILESTONE · 1997 DIGITAL FOLK ART',
          word: 'GUESTBOOKS',
          line1: 'UNDER CONSTRUCTION BANNERS AND WEB RINGS',
          line2: 'WELCOMED MILLIONS TO DIGITAL HOMESTEADS',
          sculptVariant: 8,
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
        word: 'THE CASCADE',
        line1: 'STYLESHEETS TORE PRESENTATION AWAY',
        line2: 'FROM SEMANTIC DOCUMENT STRUCTURE',
        caption: 'SEPARATED DOM & CSS Z-INDEX PLANES',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 03.B · 2001 FLASH MX',
        word: 'FLASH CINEMA',
        line1: 'VECTOR TIMELINES AND AMBIENT AUDIO LOOPS',
        line2: 'TURNED BROWSER WINDOWS INTO THEATERS',
        caption: 'ACTIONSCRIPT VECTOR WAVEFORM TUNNEL',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 03.C · 2004 WEB 2.0',
        word: 'GLOSSY WEB 2.0',
        line1: 'WET FLOOR REFLECTIONS AND AQUA PILLS',
        line2: 'HERALDED THE READ WRITE SOCIAL WEB',
        caption: 'ASYNC XMLHTTP DUAL ORBITAL STREAM',
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
        label: 'LAYOUT',
        value: 'CSS2 FLOATS',
        particleWord: 'CLEARFIX',
        story: {
          kicker: 'ERA 03 SPEC · FLOAT ARCHITECTURE',
          word: 'CLEARFIX',
          line1: 'FLOAT LEFT FLOAT RIGHT AND CLEAR BOTH',
          line2: 'ENGINEERED THE THREE COLUMN HOLY GRAIL',
          sculptVariant: 3,
        },
      },
      {
        label: 'RUNTIME',
        value: 'ACTIONSCRIPT',
        particleWord: 'SWF VECTORS',
        story: {
          kicker: 'ERA 03 SPEC · VECTOR ENGINE',
          word: 'SWF VECTORS',
          line1: 'BEZIER CURVES AND KEYFRAME TWEENS',
          line2: 'STREAMED INTERACTIVE ART OVER BROADBAND',
          sculptVariant: 4,
        },
      },
      {
        label: 'NETWORK',
        value: 'XMLHTTP',
        particleWord: 'ASYNC AJAX',
        story: {
          kicker: 'ERA 03 SPEC · DATA TRANSPORT',
          word: 'ASYNC AJAX',
          line1: 'BACKGROUND DATA FETCHING ENDED THE FLASH',
          line2: 'OF FULL WHITE PAGE RELOADS FOREVER',
          sculptVariant: 5,
        },
      },
    ],
    milestones: [
      {
        year: '2001',
        title: '2Advanced Studios',
        desc: 'Sci-fi preloaders, ambient loops, and vector motion redefine digital agencies.',
        particleWord: 'SKIP INTRO',
        story: {
          kicker: 'MILESTONE · 2001 FLASH GOLDEN AGE',
          word: 'SKIP INTRO',
          line1: 'FUTURISTIC SCI FI PRELOADERS AND SOUND',
          line2: 'DEFINED THE GOLDEN AGE OF FLASH DESIGN',
          sculptVariant: 6,
        },
      },
      {
        year: '2003',
        title: 'CSS Zen Garden',
        desc: 'Dave Shea proves one untouched HTML file can wear hundreds of CSS skins.',
        particleWord: 'ZEN GARDEN',
        story: {
          kicker: 'MILESTONE · MAY 2003 DAVE SHEA',
          word: 'ZEN GARDEN',
          line1: 'DAVE SHEA PROVED ONE LOCKED HTML FILE',
          line2: 'COULD WEAR THOUSANDS OF VISUAL SKINS',
          sculptVariant: 7,
        },
      },
      {
        year: '2005',
        title: 'Gmail & Google Maps',
        desc: 'Draggable map tiles and live inboxes turn the browser into an OS.',
        particleWord: 'LIVE CANVAS',
        story: {
          kicker: 'MILESTONE · 2005 WEB APPLICATIONS',
          word: 'LIVE CANVAS',
          line1: 'DRAGGABLE MAP TILES AND INSTANT INBOXES',
          line2: 'TURNED WEBSITES INTO DESKTOP SOFTWARE',
          sculptVariant: 8,
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
        tag: 'CHAPTER 04.A · 2008 PROPORTIONAL GRIDS',
        word: 'ELASTIC COLUMNS',
        line1: 'RIGID PIXEL WIDTHS SURRENDERED TO',
        line2: 'FLUID PERCENTAGES AND HARMONIC RATIOS',
        caption: '12-COLUMN ARCHITECTURAL SKYSCRAPER GRID',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 04.B · 2007 CAPACITIVE GLASS',
        word: 'TOUCH VIEWPORT',
        line1: 'FINGERTIPS REPLACED THE MECHANICAL MOUSE',
        line2: 'DEMANDING ERGONOMIC TOUCH TARGETS',
        caption: '320×480 CAPACITIVE MULTI-TOUCH CHASSIS',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 04.C · 2010 ETHAN MARCOTTE',
        word: 'ONE FLUID WEB',
        line1: 'A SINGLE CODEBASE MORPHED SEAMLESSLY',
        line2: 'FROM POCKET GLASS TO CINEMA DISPLAYS',
        caption: 'MULTI-DEVICE DESKTOP · TABLET · MOBILE TRIPTYCH',
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
        label: 'QUERY',
        value: '@MEDIA CSS3',
        particleWord: 'BREAKPOINTS',
        story: {
          kicker: 'ERA 04 SPEC · VIEWPORT QUERIES',
          word: 'BREAKPOINTS',
          line1: 'MIN WIDTH QUERIES SENSED THE VIEWPORT',
          line2: 'FOLDING THREE COLUMNS INTO A SINGLE STACK',
          sculptVariant: 3,
        },
      },
      {
        label: 'SYSTEM',
        value: '960.GS / 12-COL',
        particleWord: '960PX RHYTHM',
        story: {
          kicker: 'ERA 04 SPEC · PROPORTIONAL GRID',
          word: '960PX RHYTHM',
          line1: 'NINE HUNDRED SIXTY PIXELS DIVIDED BY TWELVE',
          line2: 'GAVE DESIGNERS MATHEMATICAL HARMONY',
          sculptVariant: 4,
        },
      },
      {
        label: 'GESTURE',
        value: 'INERTIAL TOUCH',
        particleWord: 'PINCH & SWIPE',
        story: {
          kicker: 'ERA 04 SPEC · CAPACITIVE ERGONOMICS',
          word: 'PINCH & SWIPE',
          line1: 'MOMENTUM SCROLLING AND RUBBER BAND BOUNCE',
          line2: 'GAVE DIGITAL INTERFACES PHYSICAL MASS',
          sculptVariant: 5,
        },
      },
    ],
    milestones: [
      {
        year: '2007',
        title: 'iPhone & Mobile Safari',
        desc: 'Steve Jobs unveils multi-touch Safari, putting the real web in every pocket.',
        particleWord: 'MOBILE SAFARI',
        story: {
          kicker: 'MILESTONE · JANUARY 9 2007',
          word: 'MOBILE SAFARI',
          line1: 'FULL DESKTOP PAGES RENDERED ON POCKET GLASS',
          line2: 'SIGNING THE DEATH WARRANT OF PLUGINS',
          sculptVariant: 6,
        },
      },
      {
        year: '2010',
        title: 'Responsive Web Design',
        desc: 'Ethan Marcotte publishes the A List Apart manifesto on fluid grids.',
        particleWord: 'FLUID MEDIA',
        story: {
          kicker: 'MILESTONE · MAY 25 2010',
          word: 'FLUID MEDIA',
          line1: 'ETHAN MARCOTTE PUBLISHED THE MANIFESTO',
          line2: 'THAT TAUGHT EVERY LAYOUT TO FLOW LIKE WATER',
          sculptVariant: 7,
        },
      },
      {
        year: '2011',
        title: 'Twitter Bootstrap 1.0',
        desc: 'Open-source 12-column toolkit standardizes mobile-first engineering.',
        particleWord: 'MOBILE FIRST',
        story: {
          kicker: 'MILESTONE · AUGUST 2011',
          word: 'MOBILE FIRST',
          line1: 'STANDARDIZED RESPONSIVE GRIDS AND BUTTONS',
          line2: 'ACCELERATED A MILLION STARTUP INTERFACES',
          sculptVariant: 8,
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
        word: 'SWISS CLARITY',
        line1: 'FAUX LEATHER AND DROP SHADOWS VANISHED',
        line2: 'STRIPPING UI DOWN TO PURE TYPOGRAPHY',
        caption: 'MODULAR SWISS BENTO QUADRANT GRID',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 05.B · 2014 ATOMIC SYSTEMS',
        word: 'ATOMIC SYSTEMS',
        line1: 'INTERFACES COMPOSED LIKE CHEMISTRY',
        line2: 'FROM ATOMS AND MOLECULES TO ORGANISMS',
        caption: '3D CRYSTALLINE COMPONENT LATTICE',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 05.C · 2015 RETINA VECTORS',
        word: 'RETINA VECTORS',
        line1: 'HIGH DENSITY DISPLAYS DEMANDED RAZOR SHARP',
        line2: 'MATHEMATICAL SVG PATHS AT ANY SCALE',
        caption: 'ISOMETRIC Z-ELEVATION LAYER PLANES',
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
        label: 'AESTHETIC',
        value: 'BAUHAUS FLAT',
        particleWord: 'ZERO BEVELS',
        story: {
          kicker: 'ERA 05 SPEC · DIGITAL HONESTY',
          word: 'ZERO BEVELS',
          line1: 'AUTHENTIC DIGITAL SURFACES REJECTED',
          line2: 'REAL WORLD METAPHORS AND HEAVY GRADIENTS',
          sculptVariant: 3,
        },
      },
      {
        label: 'ENGINE',
        value: 'CSS FLEXBOX',
        particleWord: 'FLEXBOX AXIS',
        story: {
          kicker: 'ERA 05 SPEC · BOX ALIGNMENT',
          word: 'FLEXBOX AXIS',
          line1: 'JUSTIFY CONTENT AND ALIGN ITEMS FINALLY',
          line2: 'SOLVED DYNAMIC CENTERING IN THE BROWSER',
          sculptVariant: 4,
        },
      },
      {
        label: 'TOKENS',
        value: 'JSON VARIABLES',
        particleWord: 'STYLE TOKENS',
        story: {
          kicker: 'ERA 05 SPEC · SYSTEM ARCHITECTURE',
          word: 'STYLE TOKENS',
          line1: 'SINGLE SOURCE OF TRUTH FOR SPACING AND TYPE',
          line2: 'BRIDGED DESIGN TOOLS AND PRODUCTION CODE',
          sculptVariant: 5,
        },
      },
    ],
    milestones: [
      {
        year: '2013',
        title: 'Apple iOS 7 Reset',
        desc: 'Stitched leather and green felt give way to translucent blur and hairline type.',
        particleWord: 'FROSTED BLUR',
        story: {
          kicker: 'MILESTONE · JUNE 2013 IOS 7',
          word: 'FROSTED BLUR',
          line1: 'STITCHED LEATHER AND GREEN FELT DISSOLVED',
          line2: 'INTO TRANSLUCENT LAYERS AND HAIRLINE TYPE',
          sculptVariant: 6,
        },
      },
      {
        year: '2014',
        title: 'Google Material Design',
        desc: 'Introduces quantum paper with physics-based elevation and choreographed ink.',
        particleWord: 'QUANTUM PAPER',
        story: {
          kicker: 'MILESTONE · JUNE 2014 GOOGLE',
          word: 'QUANTUM PAPER',
          line1: 'TACTILE SURFACES CASTING REALISTIC ELEVATION',
          line2: 'CHOREOGRAPHED BY MEANINGFUL MOTION',
          sculptVariant: 7,
        },
      },
      {
        year: '2015',
        title: 'Figma & React Era',
        desc: 'Declarative component trees unite with multiplayer browser design tools.',
        particleWord: 'COMPONENT UI',
        story: {
          kicker: 'MILESTONE · 2015 COMPONENT REVOLUTION',
          word: 'COMPONENT UI',
          line1: 'DECLARATIVE STATE DRIVEN REACT COMPONENTS',
          line2: 'MIRRORED LIVE MULTIPLAYER DESIGN CANVASES',
          sculptVariant: 8,
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
        word: 'SILICON SHADERS',
        line1: 'THE BROWSER UNLOCKED THE GRAPHICS CARD',
        line2: 'COMPUTING MILLIONS OF VERTICES PER FRAME',
        caption: 'REAL-TIME GPU VERTEX DISPLACEMENT FIELD',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 06.B · 2019 CUSTOM GLSL',
        word: 'LIQUID CANVASES',
        line1: 'FRAGMENT SHADERS BENT LIGHT AND WATER',
        line2: 'TURNING FLAT BACKGROUNDS INTO DEEP SPACE',
        caption: 'PARAMETRIC 3D TORUS KNOT SCULPTURE',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 06.C · 2021 SCROLL CINEMA',
        word: 'SCROLL CINEMA',
        line1: 'THE MOUSE WHEEL BECAME A DOLLY TRACK',
        line2: 'DRIVING 3D CAMERAS THROUGH LIVING SCENES',
        caption: '3D VORTEX CAMERA TUNNEL & FRUSTUM',
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
        label: 'PIPELINE',
        value: 'GLSL ES 3.0',
        particleWord: 'FRAGMENT GPU',
        story: {
          kicker: 'ERA 06 SPEC · SHADER PIPELINE',
          word: 'FRAGMENT GPU',
          line1: 'CUSTOM MATHEMATICAL NOISE AND RAYMARCHING',
          line2: 'EXECUTED DIRECTLY ON PARALLEL GPU CORES',
          sculptVariant: 3,
        },
      },
      {
        label: 'PHYSICS',
        value: 'DAMPED SPRINGS',
        particleWord: 'INERTIAL LERP',
        story: {
          kicker: 'ERA 06 SPEC · KINETIC CHOREOGRAPHY',
          word: 'INERTIAL LERP',
          line1: 'SUBPIXEL LERP AND VELOCITY MOMENTUM',
          line2: 'SYNCHRONIZED DOM LAYERS WITH WEBGL MESHES',
          sculptVariant: 4,
        },
      },
      {
        label: 'GEOMETRY',
        value: 'INSTANCED MESH',
        particleWord: '100K VERTICES',
        story: {
          kicker: 'ERA 06 SPEC · INSTANCED BUFFERS',
          word: '100K VERTICES',
          line1: 'HARDWARE INSTANCING RENDERED VAST SWARMS',
          line2: 'OF REACTIVE PARTICLES AT SIXTY HERTZ',
          sculptVariant: 5,
        },
      },
    ],
    milestones: [
      {
        year: '2016',
        title: 'Three.js Scene Graphs',
        desc: 'Ricardo Cabello’s Three.js makes 3D cameras, lights, and shaders mainstream.',
        particleWord: 'SCENE GRAPH',
        story: {
          kicker: 'MILESTONE · 2016 CREATIVE CODING',
          word: 'SCENE GRAPH',
          line1: 'CAMERAS LIGHTS AND CUSTOM SHADER MATERIALS',
          line2: 'MADE WEBGL ACCESSIBLE TO EVERY STUDIO',
          sculptVariant: 6,
        },
      },
      {
        year: '2019',
        title: 'Editorial Scrollytelling',
        desc: 'Longform journalism and product reveals blend prose with 3D camera rigs.',
        particleWord: 'CAMERA RIGS',
        story: {
          kicker: 'MILESTONE · 2019 SPATIAL STORYTELLING',
          word: 'CAMERA RIGS',
          line1: 'LONGFORM JOURNALISM AND PRODUCT REVEALS',
          line2: 'BLENDED NARRATIVE PROSE WITH 3D MOTION',
          sculptVariant: 7,
        },
      },
      {
        year: '2022',
        title: 'WebGPU Compute Shaders',
        desc: 'Next-gen GPU compute pipelines bring native console graphics to the browser.',
        particleWord: 'GPU COMPUTE',
        story: {
          kicker: 'MILESTONE · 2022 NEXT-GEN SILICON',
          word: 'GPU COMPUTE',
          line1: 'LOW LEVEL GRAPHICS AND COMPUTE SHADERS',
          line2: 'BROUGHT NATIVE ENGINE POWER TO THE TAB',
          sculptVariant: 8,
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
        word: 'LANGUAGE IS CODE',
        line1: 'TRANSFORMER MODELS LEARNED TO COMPILE',
        line2: 'HUMAN SENTENCES INTO WORKING SOFTWARE',
        caption: '7-CLUSTER SYNAPTIC CORTEX TOPOLOGY',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 07.B · 2024 BESPOKE STREAM',
        word: 'BESPOKE CANVAS',
        line1: 'RIGID PREBUILT DASHBOARDS DISSOLVED INTO',
        line2: 'FLUID INTERFACES TAILORED TO THE MOMENT',
        caption: '4-LAYER DEEP TRANSFORMER TENSOR PLANES',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 07.C · 2025 AGENTIC UX',
        word: 'REASONING AGENTS',
        line1: 'SOFTWARE SHIFTED FROM PASSIVE TOOLS',
        line2: 'TO PROACTIVE AUTONOMOUS COLLABORATORS',
        caption: 'ORBITAL MULTI-AGENT SWARM CONSTELLATION',
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
        label: 'CONTEXT',
        value: 'MULTIMODAL',
        particleWord: 'VISION & VOICE',
        story: {
          kicker: 'ERA 07 SPEC · MULTIMODAL INPUT',
          word: 'VISION & VOICE',
          line1: 'SKETCHES SCREENSHOTS AND SPOKEN INTENT',
          line2: 'PARSED SIMULTANEOUSLY BY NEURAL WEIGHTS',
          sculptVariant: 3,
        },
      },
      {
        label: 'LIFECYCLE',
        value: 'EPHEMERAL DOM',
        particleWord: 'JIT INTERFACE',
        story: {
          kicker: 'ERA 07 SPEC · EPHEMERAL LIFECYCLE',
          word: 'JIT INTERFACE',
          line1: 'JUST IN TIME COMPONENTS ASSEMBLE ON DEMAND',
          line2: 'AND VANISH ONCE THE DECISION IS MADE',
          sculptVariant: 4,
        },
      },
      {
        label: 'TOPOLOGY',
        value: 'ATTENTION MESH',
        particleWord: 'LATENT SPACE',
        story: {
          kicker: 'ERA 07 SPEC · TRANSFORMER WEIGHTS',
          word: 'LATENT SPACE',
          line1: 'BILLIONS OF SYNAPTIC PARAMETERS NAVIGATE',
          line2: 'HIGH DIMENSIONAL VECTORS OF DESIGN KNOWLEDGE',
          sculptVariant: 5,
        },
      },
    ],
    milestones: [
      {
        year: '2023',
        title: 'Generative Code Synthesis',
        desc: 'Natural language prompts compile directly into live React views.',
        particleWord: 'TEXT TO APP',
        story: {
          kicker: 'MILESTONE · 2023 PROMPT COMPILATION',
          word: 'TEXT TO APP',
          line1: 'DEVELOPERS DESCRIBED FULL INTERACTION FLOWS',
          line2: 'AND WATCHED PRODUCTION CODE STREAM LIVE',
          sculptVariant: 6,
        },
      },
      {
        year: '2024',
        title: 'Live Artifact Canvases',
        desc: 'Conversations spawn interactive simulations, charts, and widgets inline.',
        particleWord: 'LIVE ARTIFACT',
        story: {
          kicker: 'MILESTONE · 2024 GENERATIVE WIDGETS',
          word: 'LIVE ARTIFACT',
          line1: 'CONVERSATIONS SPAWNED INTERACTIVE SIMULATIONS',
          line2: 'CHARTS AND DIAGRAMS INLINE IN REAL TIME',
          sculptVariant: 7,
        },
      },
      {
        year: '2025',
        title: 'Multi-Agent Swarms',
        desc: 'Specialized autonomous agents research, plan, and build in parallel.',
        particleWord: 'AGENT SWARM',
        story: {
          kicker: 'MILESTONE · 2025 AUTONOMOUS TEAMS',
          word: 'AGENT SWARM',
          line1: 'SPECIALIZED AI AGENTS RESEARCH PLAN AND BUILD',
          line2: 'COMPLEX ARCHITECTURES IN PARALLEL',
          sculptVariant: 8,
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
        word: 'BEYOND THE GLASS',
        line1: 'THE RECTANGULAR BEZEL FINALLY DISSOLVES',
        line2: 'INTO THE PHYSICAL ROOM AROUND YOU',
        caption: 'GALACTIC LOGARITHMIC SINGULARITY SPIRAL',
        sculptVariant: 0,
      },
      {
        tag: 'CHAPTER 08.B · 2028 NEURAL OPTICS',
        word: 'NEURAL OPTICS',
        line1: 'LIGHT FIELDS AND EYE TRACKED PRECISION',
        line2: 'RESPOND BEFORE YOUR HAND EVEN MOVES',
        caption: 'EINSTEIN-ROSEN SPATIAL WORMHOLE BRIDGE',
        sculptVariant: 1,
      },
      {
        tag: 'CHAPTER 08.C · INTERACTIVE SANDBOX',
        word: 'YOUR OWN STORY',
        line1: 'THIRTY SEVEN YEARS BROUGHT US TO THIS MOMENT',
        line2: 'TYPE ANY WORD BELOW TO SCULPT THE FUTURE',
        caption: '4D TESSERACT HYPERCUBE PROJECTION',
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
        label: 'OPTICS',
        value: 'VOLUMETRIC XR',
        particleWord: 'HOLOGRAMS',
        story: {
          kicker: 'ERA 08 SPEC · VOLUMETRIC OPTICS',
          word: 'HOLOGRAMS',
          line1: 'STEREOSCOPIC DEPTH AND REAL WORLD OCCLUSION',
          line2: 'ANCHOR DIGITAL MATTER ON PHYSICAL SURFACES',
          sculptVariant: 3,
        },
      },
      {
        label: 'BIOMETRIC',
        value: 'GAZE & INTENT',
        particleWord: 'SUBVOCAL UI',
        story: {
          kicker: 'ERA 08 SPEC · NEURAL BIOMETRICS',
          word: 'SUBVOCAL UI',
          line1: 'MICRO GESTURES AND RETINAL FOCUS',
          line2: 'REPLACE KEYBOARDS MICE AND TOUCHSCREENS',
          sculptVariant: 4,
        },
      },
      {
        label: 'HORIZON',
        value: '2026 → ∞',
        particleWord: 'THE INFINITE',
        story: {
          kicker: 'ERA 08 SPEC · AMBIENT HORIZON',
          word: 'THE INFINITE',
          line1: 'THE WEB IS NO LONGER A PLACE WE VISIT',
          line2: 'IT IS THE ATMOSPHERE WE CREATE WITHIN',
          sculptVariant: 5,
        },
      },
    ],
    milestones: [
      {
        year: '2026',
        title: 'Spatial WebXR Native',
        desc: 'HTML elements gain true X, Y, and Z depth floating in physical rooms.',
        particleWord: 'SPATIAL DOM',
        story: {
          kicker: 'MILESTONE · 2026 VOLUMETRIC WEB',
          word: 'SPATIAL DOM',
          line1: 'HTML ELEMENTS GAIN TRUE X Y AND Z DEPTH',
          line2: 'FLOATING AS GLASS PANELS IN PHYSICAL SPACE',
          sculptVariant: 6,
        },
      },
      {
        year: '2028',
        title: 'Synaptic Intent Link',
        desc: 'Thought and retinal focus translate directly into 3D kinetic geometry.',
        particleWord: 'SYNAPTIC LINK',
        story: {
          kicker: 'MILESTONE · 2028 DIRECT INTENT',
          word: 'SYNAPTIC LINK',
          line1: 'THOUGHT AND IMAGINATION TRANSLATE DIRECTLY',
          line2: 'INTO THREE DIMENSIONAL KINETIC GEOMETRY',
          sculptVariant: 7,
        },
      },
      {
        year: '∞',
        title: 'Pure Living Light',
        desc: 'From 1989 CERN phosphor to infinite photons, every word continues the story.',
        particleWord: 'PURE LIGHT',
        story: {
          kicker: 'MILESTONE · INFINITE HORIZON',
          word: 'PURE LIGHT',
          line1: 'FROM 1989 CERN PHOSPHOR TO INFINITE PHOTONS',
          line2: 'EVERY WORD CONTINUES THE EVOLUTION',
          sculptVariant: 8,
        },
      },
    ],
  },
];
