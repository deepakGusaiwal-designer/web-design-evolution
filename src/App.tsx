import React, { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ERAS } from './data/eras';
import WaterShader, { type ScrollMotionState } from './components/WaterShader';
import ParticleEngine from './components/ParticleEngine';
import HorizontalStage from './components/HorizontalStage';
import TimelineHUD from './components/TimelineHUD';
import { playArchitecturalPulse } from './utils/sound';

export const App: React.FC = () => {
  const [activeEraIndex, setActiveEraIndex] = useState(0);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [overrideWord, setOverrideWord] = useState<string | null>(null);
  const [customWord, setCustomWord] = useState('IMAGINE');
  const [pureParticleMode, setPureParticleMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Shared mutable motion state updated at 60/120fps without triggering React re-renders
  const motionRef = useRef<ScrollMotionState>({
    progress: 0,
    velocity: 0,
  });

  const lenisRef = useRef<Lenis | null>(null);
  const prevEraRef = useRef(0);
  const prevPhaseRef = useRef(0);
  const manualPhaseOverrideRef = useRef(false);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const scrollToProgress = useCallback((targetProg: number, duration = 1.1) => {
    const clamped = Math.max(0, Math.min(1, targetProg));
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(clamped * maxScroll, {
        duration,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      window.scrollTo({ top: clamped * maxScroll, behavior: 'smooth' });
    }
  }, []);

  const selectEra = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(ERAS.length - 1, index));
      manualPhaseOverrideRef.current = false;
      prevEraRef.current = clamped;
      prevPhaseRef.current = 0;
      setActiveEraIndex(clamped);
      setActivePhaseIndex(0);
      setOverrideWord(null);
      scrollToProgress(clamped / (ERAS.length - 1), 1.15);

      if (soundEnabledRef.current) {
        playArchitecturalPulse(180 + clamped * 45, 0.16);
      }
    },
    [scrollToProgress]
  );

  const handleSelectPhase = useCallback(
    (eraIdx: number, phaseIdx: number) => {
      manualPhaseOverrideRef.current = true;
      prevPhaseRef.current = phaseIdx;
      setActivePhaseIndex(phaseIdx);
      setOverrideWord(null);

      // Compute exact sub-phase progress along the station window
      const totalIntervals = ERAS.length - 1;
      const phaseOffset = phaseIdx === 0 ? -0.22 : phaseIdx === 1 ? 0 : 0.22;
      const targetProg = Math.max(
        0,
        Math.min(1, (eraIdx + phaseOffset) / totalIntervals)
      );
      scrollToProgress(targetProg, 0.85);

      if (soundEnabledRef.current) {
        playArchitecturalPulse(300 + phaseIdx * 80, 0.14);
      }
    },
    [scrollToProgress]
  );

  const handleSelectOverrideWord = useCallback((word: string | null) => {
    setOverrideWord(word);
    if (soundEnabledRef.current) {
      playArchitecturalPulse(word ? 440 : 260, 0.14);
    }
  }, []);

  useEffect(() => {
    // Initialize Lenis smooth scroll synced with GSAP ticker
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      gestureOrientation: 'both',
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ({ progress, velocity }: { progress: number; velocity: number }) => {
      const safeProgress = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
      const safeVelocity = Number.isFinite(velocity) ? velocity : 0;

      motionRef.current.progress = safeProgress;
      motionRef.current.velocity = safeVelocity;

      const totalIntervals = ERAS.length - 1;
      const eraFloat = safeProgress * totalIntervals;
      const eraIdx = Math.round(eraFloat);

      if (eraIdx !== prevEraRef.current) {
        prevEraRef.current = eraIdx;
        manualPhaseOverrideRef.current = false;
        setActiveEraIndex(eraIdx);
        setOverrideWord(null);
        if (soundEnabledRef.current) {
          playArchitecturalPulse(200 + eraIdx * 40, 0.14);
        }
      }

      if (!manualPhaseOverrideRef.current) {
        const localOffset = eraFloat - eraIdx + 0.5;
        const derivedPhase = localOffset < 0.36 ? 0 : localOffset < 0.68 ? 1 : 2;
        if (derivedPhase !== prevPhaseRef.current) {
          prevPhaseRef.current = derivedPhase;
          setActivePhaseIndex(derivedPhase);
        }
      }
    });

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const onKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        selectEra(prevEraRef.current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        selectEra(prevEraRef.current - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [selectEra]);

  const handleCanvasClick = useCallback(() => {
    if (soundEnabledRef.current) playArchitecturalPulse(310, 0.12);
  }, []);

  const handleTogglePureMode = useCallback(() => {
    setPureParticleMode((p) => !p);
  }, []);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) playArchitecturalPulse(360, 0.15);
      return next;
    });
  }, []);

  return (
    <div className="relative w-full bg-black text-white select-none font-dm">
      {/* Virtual 900vh Scroll Track Driven by Lenis + GSAP Ticker */}
      <div className="w-full h-[900vh] pointer-events-none" aria-hidden="true" />

      {/* 0. WebGL GLSL Water Shader Background (Synced to GSAP Ticker) */}
      <WaterShader motionRef={motionRef} />

      {/* 1. Batched 3D Particle Engine (Synced to GSAP Ticker) */}
      <ParticleEngine
        activeEraIndex={activeEraIndex}
        activePhaseIndex={activePhaseIndex}
        motionRef={motionRef}
        overrideWord={overrideWord}
        customWord={customWord}
        onCanvasClick={handleCanvasClick}
      />

      {/* 2. Frosted Glassmorphic Top Timeline HUD */}
      <TimelineHUD
        activeEraIndex={activeEraIndex}
        motionRef={motionRef}
        onSelectEra={selectEra}
        pureParticleMode={pureParticleMode}
        onTogglePureParticleMode={handleTogglePureMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* 3. Frosted Glassmorphic Split-Margin Horizontal Stage */}
      <HorizontalStage
        activeEraIndex={activeEraIndex}
        activePhaseIndex={activePhaseIndex}
        onSelectPhase={handleSelectPhase}
        overrideWord={overrideWord}
        onSelectOverrideWord={handleSelectOverrideWord}
        customWord={customWord}
        onChangeCustomWord={setCustomWord}
        onSelectEra={selectEra}
        pureParticleMode={pureParticleMode}
      />
    </div>
  );
};

export default App;
