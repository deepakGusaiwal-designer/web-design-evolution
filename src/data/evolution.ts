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
    year: "1990 — ∞",
    tag: "THE GENESIS",
    title: "THE WEB EVOLVED",
    subtitle: "From documents to experiences.",
    quote: "The web stopped being a document. It became an experience.",
    description: "What began as linked research papers has transformed into the primary canvas of human consciousness, interaction, and spatial reality.",
    keyTechnologies: ["Hypertext", "Cascading Styles", "Scripting", "WebGL", "Neural Interfaces"],
    paradigmShift: {
      from: "Static Pages",
      to: "Living Realities",
    },
    accentColor: "#00f0ff",
  },
  {
    id: "static",
    year: "1991 — 1995",
    tag: "SECTION 01",
    title: "THE STATIC WEB",
    subtitle: "The Document Era",
    quote: "A web of pure documents. Text, links, and black-and-white simplicity.",
    description: "The early web was not designed to be watched or felt. It was designed to be read. Tim Berners-Lee gave humanity the first universal digital parchment: HTML. Raw markup, default serif typography, blue underlined links, and gray background viewports.",
    keyTechnologies: ["HTML 1.0", "CERN HTTPD", "Mosaic Browser", "Hyperlinks", "Standard Tables"],
    paradigmShift: {
      from: "Isolated Texts",
      to: "Universal Hyperlink",
    },
    accentColor: "#94a3b8",
  },
  {
    id: "visual",
    year: "1996 — 2005",
    tag: "SECTION 02",
    title: "THE WEB BECOMES VISUAL",
    subtitle: "Design Became a Language",
    quote: "Design is not what it looks like. It is how information breathes.",
    description: "With CSS, the web found its aesthetic voice. Designers broke free from table-based jail cells. Typography gained weight and grace. Colors painted viewports. Grids, flexboxes, and responsive media queries made interfaces adapt to any glass rectangle.",
    keyTechnologies: ["CSS 1 & 2", "Box Model", "Web Fonts", "CSS Grid", "Responsive Design"],
    paradigmShift: {
      from: "Raw Structure",
      to: "Visual Expression",
    },
    accentColor: "#38bdf8",
  },
  {
    id: "motion",
    year: "2006 — 2014",
    tag: "SECTION 03",
    title: "THE WEB LEARNS TO MOVE",
    subtitle: "Static Is Not Enough",
    quote: "Static is dead. Motion is the heartbeat of comprehension.",
    description: "Motion ceased being decoration and became choreography. Transitions explained where elements came from and where they went. Kinetic typography, magnetic gestures, physics-based springs, and fluid interactions made the screen feel tangible and alive.",
    keyTechnologies: ["GSAP", "CSS Animations", "Spring Physics", "Kinetic Typography", "Micro-interactions"],
    paradigmShift: {
      from: "Instant Cut",
      to: "Physical Continuity",
    },
    accentColor: "#a855f7",
  },
  {
    id: "3d",
    year: "2015 — 2018",
    tag: "SECTION 04",
    title: "THE THIRD DIMENSION",
    subtitle: "The Screen Became a Space",
    quote: "We spent twenty years flattening our thoughts into 2D rectangles. Then the screen opened up.",
    description: "Depth arrived. Virtual cameras traveled through digital chambers. Platonic geometries, volumetric fog, PBR lighting, and materials gave depth to ideas. The viewport was no longer a flat page — it became a window into an infinite spatial coordinate system.",
    keyTechnologies: ["Three.js", "WebGL 1.0", "PBR Materials", "Spatial Cameras", "3D Canvas"],
    paradigmShift: {
      from: "2D Canvas",
      to: "3D Space",
    },
    accentColor: "#ec4899",
  },
  {
    id: "webgl",
    year: "2019 — 2022",
    tag: "SECTION 05",
    title: "THE BROWSER BECAME A GPU",
    subtitle: "Computing at the Pixel Level",
    quote: "When every pixel has its own computer program, the medium dissolves into light.",
    description: "Web designers became shader artists. GLSL unlocked millions of parallel mathematical operations per millisecond. Wave physics, raymarching, liquid simulations, and chromatic distortion transformed the browser into a high-performance visual synthesizer.",
    keyTechnologies: ["GLSL Shaders", "Compute Pipelines", "Post-Processing", "GPGPU Particles", "WebGPU"],
    paradigmShift: {
      from: "DOM Manipulation",
      to: "GPU Shader Compute",
    },
    accentColor: "#06b6d4",
  },
  {
    id: "ai",
    year: "2023 — 2025",
    tag: "SECTION 06",
    title: "HUMAN + MACHINE",
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
    year: "2026 — ∞",
    tag: "SECTION 07",
    title: "IMAGINATION BECOMES THE INTERFACE",
    subtitle: "The Spatial & Generative Horizon",
    quote: "What happens when imagination becomes the interface?",
    description: "When screen borders disappear into spatial vision, neural intent, and generative intelligence, the traditional 'website' ceases to exist. There are no fixed buttons, no static pages. The interface is whatever you can think into existence.",
    keyTechnologies: ["Spatial Web", "Neural Links", "Voice & Gaze XR", "Procedural Worlds", "Ambient Computing"],
    paradigmShift: {
      from: "Screen Navigation",
      to: "Spatial Co-Creation",
    },
    accentColor: "#00f0ff",
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
