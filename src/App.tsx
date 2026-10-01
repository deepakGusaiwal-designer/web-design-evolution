import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { ParticleScene } from './scenes/ParticleScene';
import { Navigation } from './components/Navigation';
import { SoundSystem } from './components/SoundSystem';
import { HeroSection } from './components/HeroSection';
import { Web1990 } from './components/Web1990';
import { Web2000 } from './components/Web2000';
import { Web2010 } from './components/Web2010';
import { Web2020 } from './components/Web2020';
import { WebGLSection } from './components/WebGLSection';
import { WebAI } from './components/WebAI';
import { SpatialWeb } from './components/SpatialWeb';
import { FutureWeb } from './components/FutureWeb';


export const App: React.FC = () => {
  const [currentEraIndex, setCurrentEraIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [attractMode, setAttractMode] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Section element references for programmatic scrolling
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    let prevScroll = 0;
    let prevTime = performance.now();

    const raf = (time: number) => {
      lenis.raf(time);

      const currentScroll = window.scrollY;
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScrollable > 0 ? currentScroll / totalScrollable : 0;
      setScrollProgress(progress);

      const dt = Math.max(time - prevTime, 1);
      const velocity = Math.abs(currentScroll - prevScroll) / dt;
      setScrollVelocity(velocity);

      prevScroll = currentScroll;
      prevTime = time;

      // Track active section based on scroll offset
      const triggerOffset = window.scrollY + window.innerHeight * 0.45;
      let activeIdx = 0;

      sectionRefs.current.forEach((el, index) => {
        if (el && el.offsetTop <= triggerOffset) {
          activeIdx = index;
        }
      });

      setCurrentEraIndex(activeIdx);

      requestAnimationFrame(raf);
    };

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const scrollToEra = (index: number) => {
    const targetElement = sectionRefs.current[index];
    if (targetElement && lenisRef.current) {
      lenisRef.current.scrollTo(targetElement, { offset: 0, duration: 1.4 });
    } else if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    scrollToEra(0);
  };

  const handleExplode = () => {
    // Switch to explosion shape in particle system
    setCurrentEraIndex(8);
  };

  return (
    <div className="relative min-h-screen bg-[#050508] text-[#f1f5f9] overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Three.js GPU Morphing Particle Canvas Field */}
      <ParticleScene
        currentEraIndex={currentEraIndex}
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        attractMode={attractMode}
      />

      {/* 3. Subtle Film Grain / Scanline Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-30 scanlines opacity-40 mix-blend-overlay" />

      {/* 4. Top Navigation & Editorial HUD */}
      <Navigation
        currentEraIndex={currentEraIndex}
        onSelectEra={scrollToEra}
        scrollProgress={scrollProgress}
      />

      {/* 5. Procedural Web Audio Sound Engine */}
      <SoundSystem />

      {/* 6. Main Interactive Experience Sections */}
      <main className="relative z-10 flex flex-col">
        {/* HERO: The Genesis */}
        <div ref={(el) => { sectionRefs.current[0] = el; }}>
          <HeroSection
            onHoverTitle={(hovering) => setAttractMode(hovering)}
            onExploreClick={() => scrollToEra(1)}
          />
        </div>

        {/* SECTION 01: The Static Web (1991) */}
        <div ref={(el) => { sectionRefs.current[1] = el; }}>
          <Web1990 onShatter={() => setCurrentEraIndex(3)} />
        </div>

        {/* SECTION 02: The Web Becomes Visual (1996 - CSS) */}
        <div ref={(el) => { sectionRefs.current[2] = el; }}>
          <Web2000 />
        </div>

        {/* SECTION 03: The Web Learns to Move (2006 - Motion) */}
        <div ref={(el) => { sectionRefs.current[3] = el; }}>
          <Web2010 />
        </div>

        {/* SECTION 04: The Third Dimension (2015 - 3D Space) */}
        <div ref={(el) => { sectionRefs.current[4] = el; }}>
          <Web2020 />
        </div>

        {/* SECTION 05: The Browser Became a GPU (2019 - GLSL Shaders) */}
        <div ref={(el) => { sectionRefs.current[5] = el; }}>
          <WebGLSection />
        </div>

        {/* SECTION 06: Human + Machine (2023 - AI & Generative) */}
        <div ref={(el) => { sectionRefs.current[6] = el; }}>
          <WebAI />
        </div>

        {/* SECTION 07: Imagination Becomes the Interface (2026 - Spatial Horizon) */}
        <div ref={(el) => { sectionRefs.current[7] = el; }}>
          <SpatialWeb />
        </div>

        {/* CLIMAX: Singularity & Explosion & Interactive Future Canvas */}
        <div ref={(el) => { sectionRefs.current[8] = el; }}>
          <FutureWeb
            onRestart={handleRestart}
            onExplodeParticles={handleExplode}
          />
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-20 py-12 px-6 border-t border-white/5 text-center font-mono text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span>THE EVOLUTION OF THE WEB // 1990 — {new Date().getFullYear()} — ∞</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>React + Three.js + GLSL + Web Audio</span>
            <span>•</span>
            <span className="text-cyan-400">Experience Complete</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
