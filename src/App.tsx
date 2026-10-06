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
  const [customWord, setCustomWord] = useState('');
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
  const programmaticLockUntilRef = useRef(0);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const jumpToStepProgress = useCallback((eraIdx: number, phaseIdx: number) => {
    const totalSteps = ERAS.length * 3 - 1;
    const stepIndex = Math.max(0, Math.min(totalSteps, eraIdx * 3 + phaseIdx));
    const targetProg = stepIndex / totalSteps;
    const prevProg = motionRef.current.progress;
    const dir = targetProg >= prevProg ? 1 : -1;

    // Lock out scroll-derived phase cycling so we land directly on the target step
    programmaticLockUntilRef.current = performance.now() + 180;
    motionRef.current.progress = targetProg;
    motionRef.current.velocity = dir * 4.5;

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const targetScrollY = targetProg * maxScroll;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetScrollY, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: 'auto' });
    }
  }, []);

  const goToStep = useCallback(
    (eraIdx: number, phaseIdx: number) => {
      const clampedEra = Math.max(0, Math.min(ERAS.length - 1, eraIdx));
      const maxPhase = (ERAS[clampedEra]?.phases.length ?? 3) - 1;
      const clampedPhase = Math.max(0, Math.min(maxPhase, phaseIdx));

      prevEraRef.current = clampedEra;
      prevPhaseRef.current = clampedPhase;
      setActiveEraIndex(clampedEra);
      setActivePhaseIndex(clampedPhase);
      setOverrideWord(null);
      setCustomWord('');

      jumpToStepProgress(clampedEra, clampedPhase);

      if (soundEnabledRef.current) {
        playArchitecturalPulse(200 + clampedEra * 38 + clampedPhase * 55, 0.15);
      }
    },
    [jumpToStepProgress]
  );

  const selectEra = useCallback(
    (index: number) => {
      goToStep(index, 0);
    },
    [goToStep]
  );

  const handleSelectPhase = useCallback(
    (eraIdx: number, phaseIdx: number) => {
      goToStep(eraIdx, phaseIdx);
    },
    [goToStep]
  );

  const handleNextStep = useCallback(() => {
    const curEra = prevEraRef.current;
    const curPhase = prevPhaseRef.current;
    const maxPhase = (ERAS[curEra]?.phases.length ?? 3) - 1;

    if (curPhase < maxPhase) {
      goToStep(curEra, curPhase + 1);
    } else if (curEra < ERAS.length - 1) {
      goToStep(curEra + 1, 0);
    } else {
      goToStep(0, 0);
    }
  }, [goToStep]);

  const handlePrevStep = useCallback(() => {
    const curEra = prevEraRef.current;
    const curPhase = prevPhaseRef.current;

    if (curPhase > 0) {
      goToStep(curEra, curPhase - 1);
    } else if (curEra > 0) {
      const prevEra = curEra - 1;
      const prevMaxPhase = (ERAS[prevEra]?.phases.length ?? 3) - 1;
      goToStep(prevEra, prevMaxPhase);
    }
  }, [goToStep]);

  const handleSelectOverrideWord = useCallback((word: string | null) => {
    setOverrideWord(word);
    if (soundEnabledRef.current) {
      playArchitecturalPulse(word ? 440 : 260, 0.14);
    }
  }, []);

  useEffect(() => {
    // Initialize Lenis smooth scroll synced with GSAP ticker (slow, heavy cinematic damping)
    const lenis = new Lenis({
      lerp: 0.055,
      smoothWheel: true,
      gestureOrientation: 'both',
      wheelMultiplier: 0.45,
      touchMultiplier: 0.75,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ({ progress, velocity }: { progress: number; velocity: number }) => {
      if (performance.now() < programmaticLockUntilRef.current) {
        return;
      }

      const safeProgress = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
      const safeVelocity = Number.isFinite(velocity) ? velocity : 0;

      motionRef.current.progress = safeProgress;
      motionRef.current.velocity = safeVelocity;

      const totalSteps = ERAS.length * 3 - 1;
      const stepIndex = Math.round(safeProgress * totalSteps);
      const eraIdx = Math.min(ERAS.length - 1, Math.floor(stepIndex / 3));
      const derivedPhase = stepIndex % 3;

      if (eraIdx !== prevEraRef.current) {
        prevEraRef.current = eraIdx;
        setActiveEraIndex(eraIdx);
        setOverrideWord(null);
        if (soundEnabledRef.current) {
          playArchitecturalPulse(200 + eraIdx * 40, 0.14);
        }
      }

      if (derivedPhase !== prevPhaseRef.current) {
        prevPhaseRef.current = derivedPhase;
        setActivePhaseIndex(derivedPhase);
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
        handleNextStep();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevStep();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [handleNextStep, handlePrevStep]);

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
      {/* Virtual 2400vh Scroll Track Driven by Lenis + GSAP Ticker (~90vh per sub-phase) */}
      <div className="w-full h-[2400vh] pointer-events-none" aria-hidden="true" />

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
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
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
