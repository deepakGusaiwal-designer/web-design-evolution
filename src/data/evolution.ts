export interface EraData {
  id: string;
  year: string;
  tag: string;
  title: string;
  subtitle: string;
  quote: string;
  description: string;
  keyTechnologies: string[];
  paradigmShift: {
    from: string;
    to: string;
  };
  accentColor: string;
}

export const ERAS: EraData[] = [
  {
    id: "hero",
    year: "1989 — ∞",
    tag: "PROLOGUE",
    title: "THE WEB EVOLVED",
    subtitle: "From terminal dark ages to living spatial experiences.",
    quote: "The web stopped being a document. It became an experience.",
    description: "What began as linked research papers has transformed into the primary canvas of human consciousness, interaction, and spatial reality.",
    keyTechnologies: ["Liquid Ether", "Hypertext", "Cascading Styles", "WebGL", "Neural Interfaces"],
    paradigmShift: {
      from: "Static Pages",
      to: "Living Realities",
    },
    accentColor: "#00f0ff",
  },
  {
    id: "static",
    year: "1989 — 1993",
    tag: "CHAPTER 01",
    title: "THE DARK AGES & FIRST HYPERTEXT",
    subtitle: "The Terminal & CERN Roots",
    quote: "In the dark ages, designers worked with black screens, pixelated text, and the TAB key.",
    description: "Before graphical browsers, Tim Berners-Lee created the World Wide Web in 1989 at CERN on a NeXT machine. On August 6, 1991, the first website went live. The web was pure hypertext: blue underlined links on neutral screens.",
    keyTechnologies: ["VT100 Terminals", "TAB Layouts", "HTML 1.0", "CERN NeXTSTEP", "info.cern.ch"],
    paradigmShift: {
      from: "Isolated Terminals",
      to: "Universal Hyperlink",
    },
    accentColor: "#34d399",
  },
  {
    id: "visual",
    year: "1994 — 1998",
    tag: "CHAPTER 02",
    title: "TABLE HACKS & CSS REVOLUTION",
    subtitle: "The Separation of Content & Style",
    quote: "In 1996, Cascading Style Sheets liberated content from the prison of table cells.",
    description: "Netscape launched the table era where designers hijacked table cells and invisible 1x1 spacer GIFs for layout. In December 1996, Håkon Wium Lie and Bert Bos created CSS, liberating content from presentation.",
    keyTechnologies: ["Nested Tables", "spacer.gif", "Netscape 2.0", "CSS1 (Lie & Bos)", "Web-Safe Colors"],
    paradigmShift: {
      from: "Table Cell Hacks",
      to: "Cascading Style Sheets",
    },
    accentColor: "#38bdf8",
  },
  {
    id: "motion",
    year: "1999 — 2006",
    tag: "CHAPTER 03",
    title: "THE GOLDEN AGE OF FLASH",
    subtitle: "Vector Animation & Soundscapes",
    quote: "Before modern web standards, Adobe Flash allowed designers to bypass HTML entirely.",
    description: "Macromedia and Adobe Flash unlocked 24fps keyframe animation, interactive soundboards, splash screens, and liquid navigation. Interfaces broke free from rectangular boxes into cinematic interactive motion.",
    keyTechnologies: ["Adobe Flash", "ActionScript", "Vector Motion", "Soundboards", "Kinetic Physics"],
    paradigmShift: {
      from: "Static Pages",
      to: "Cinematic Interaction",
    },
    accentColor: "#fbbf24",
  },
  {
    id: "3d",
    year: "2007 — 2012",
    tag: "CHAPTER 04",
    title: "SKEUOMORPHISM & RESPONSIVE DESIGN",
    subtitle: "The iPhone & The Mobile Revolution",
    quote: "Skeuomorphism served as a cozy blanket for early touchscreen humans.",
    description: "Steve Jobs introduced the iPhone in 2007. Designers added stitched leather, glossy gel buttons, and drop shadows to make digital buttons tactile. In 2010, Ethan Marcotte coined Responsive Web Design, making interfaces fluid across every screen size.",
    keyTechnologies: ["Multi-Touch Safari", "Skeuomorphic Textures", "Glossy Aqua Gel", "Fluid Grids", "CSS3 Media Queries"],
    paradigmShift: {
      from: "Fixed 960px Desktop",
      to: "Fluid Multi-Screen Web",
    },
    accentColor: "#10b981",
  },
  {
    id: "webgl",
    year: "2013 — 2023",
    tag: "CHAPTER 05",
    title: "FLAT DESIGN TO THE SILICON GPU",
    subtitle: "Minimalism to WebGL Shaders",
    quote: "From stripping decorative fluff to executing raw mathematics on the graphics processor.",
    description: "In 2013, Apple iOS 7, Microsoft Metro, and Material Design eliminated decorative fluff in favor of clean 2D flat vectors. That minimalism evolved into Flat 2.0 and WebGL shaders: turning the browser into a high-performance GPU canvas.",
    keyTechnologies: ["Flat Design", "iOS 7 / Metro", "Material Design", "WebGL & Three.js", "GLSL Shaders"],
    paradigmShift: {
      from: "Decorative Fluff",
      to: "GPU Shader Compute",
    },
    accentColor: "#00f0ff",
  },
  {
    id: "ai",
    year: "2024 — 2025",
    tag: "CHAPTER 06",
    title: "THE COGNITIVE SYMBIOSIS",
    subtitle: "The Interface Started Responding To Us",
    quote: "Interfaces used to wait for clicks. Now they understand intention.",
    description: "Static interfaces are rigid assumptions built by developers for average users. Generative interfaces dissolve that assumption. In this new era, the UI reconstructs itself around your context, synthesizing tailored views, spatial layouts, and generative workflows on the fly.",
    keyTechnologies: ["Generative UI", "Neural Networks", "Context Inference", "Intent Parsing", "Adaptive Layouts"],
    paradigmShift: {
      from: "Pre-rendered UI",
      to: "Generative Adaptation",
    },
    accentColor: "#8b5cf6",
  },
  {
    id: "imagination",
    year: "2026 — 2030",
    tag: "CHAPTER 07",
    title: "THE UNBOUNDED SPATIAL FABRIC",
    subtitle: "The Spatial & Generative Horizon",
    quote: "What happens when imagination becomes the interface?",
    description: "When screen borders disappear into spatial vision, neural intent, and generative intelligence, the traditional 'website' ceases to exist. There are no fixed buttons, no static pages. The interface is whatever you can think into existence.",
    keyTechnologies: ["Spatial Web", "Neural Links", "Voice & Gaze XR", "Procedural Worlds", "Ambient Computing"],
    paradigmShift: {
      from: "Screen Navigation",
      to: "Spatial Co-Creation",
    },
    accentColor: "#00f0ff",
  },
  {
    id: "future",
    year: "FUTURE — ∞",
    tag: "CHAPTER 08",
    title: "THE UNWRITTEN CANVAS",
    subtitle: "Waiting To Be Imagined",
    quote: "The next web hasn't been designed yet. What will you build?",
    description: "All particles from three decades of computing converge at the singularity. The screen has dissolved into pure imagination.",
    keyTechnologies: ["Quantum Web", "Bio-Digital Synthesis", "Ambient Void", "Zero-Chrome Reality"],
    paradigmShift: {
      from: "Predetermined Interfaces",
      to: "Pure Human Imagination",
    },
    accentColor: "#38bdf8",
  }
];

export const FUTURE_CONCEPTS = [
  {
    word: "SPACE",
    color: "#00f0ff",
    description: "Infinite 3D unbounded canvas where information inhabits physical and virtual surroundings."
  },
  {
    word: "VOICE",
    color: "#a855f7",
    description: "Natural conversational dialogue replacing navigation trees and tedious forms."
  },
  {
    word: "VISION",
    color: "#3b82f6",
    description: "Eye-tracking and visual saliency that prepares information before you consciously ask."
  },
  {
    word: "INTENT",
    color: "#ec4899",
    description: "Computing engines that anticipate outcomes rather than requiring procedural clicks."
  },
  {
    word: "CONTEXT",
    color: "#10b981",
    description: "Every interaction is aware of time, biological state, ambient lighting, and mental focus."
  },
  {
    word: "XR",
    color: "#f59e0b",
    description: "Seamless continuum across augmented glass, mixed reality rooms, and immersive deep dives."
  },
  {
    word: "GENERATIVE",
    color: "#8b5cf6",
    description: "Interfaces composed on demand: zero static pixels, 100% ephemeral and bespoke."
  },
  {
    word: "NEURAL",
    color: "#06b6d4",
    description: "Direct synaptic bio-sensing that connects thought patterns to digital manifestation."
  }
];
