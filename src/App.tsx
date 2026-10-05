import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ERAS } from './data/eras';
import WaterShader from './components/WaterShader';
import ParticleEngine from './components/ParticleEngine';
import HorizontalStage from './components/HorizontalStage';
import TimelineHUD from './components/TimelineHUD';
import { playArchitecturalPulse } from './utils/sound';

export const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [activeEraIndex, setActiveEraIndex] = useState(0);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [overrideWord, setOverrideWord] = useState<string | null>(null);
  const [customWord, setCustomWord] = useState('IMAGINE');
  const [pureParticleMode, setPureParticleMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const prevEraRef = useRef(0);
  const prevPhaseRef = useRef(0);
  const manualPhaseOverrideRef = useRef(false);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const selectEra = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(ERAS.length - 1, index));
    targetProgressRef.current = clamped / (ERAS.length - 1);
    manualPhaseOverrideRef.current = false;
    setActivePhaseIndex(0);
    setOverrideWord(null);
    if (soundEnabledRef.current) {
      playArchitecturalPulse(180 + clamped * 45, 0.16);
    }
  }, []);

  const handleSelectPhase = useCallback((eraIdx: number, phaseIdx: number) => {
    manualPhaseOverrideRef.current = true;
    prevPhaseRef.current = phaseIdx;
    setActivePhaseIndex(phaseIdx);
    setOverrideWord(null);
    if (eraIdx !== prevEraRef.current) {
      targetProgressRef.current = eraIdx / (ERAS.length - 1);
    }
    if (soundEnabledRef.current) {
      playArchitecturalPulse(300 + phaseIdx * 80, 0.14);
    }
  }, []);

  const handleSelectOverrideWord = useCallback((word: string | null) => {
    setOverrideWord(word);
    if (soundEnabledRef.current) {
      playArchitecturalPulse(word ? 440 : 260, 0.14);
    }
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      manualPhaseOverrideRef.current = false;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const step = delta * 0.0002;
      targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + step));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        const currentIdx = Math.round(targetProgressRef.current * (ERAS.length - 1));
        selectEra(currentIdx + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        const currentIdx = Math.round(targetProgressRef.current * (ERAS.length - 1));
        selectEra(currentIdx - 1);
      }
    };

    let isDragging = false;
    let startX = 0;
    let startProgress = 0;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'INPUT' ||
          target.closest('button') ||
          target.closest('input'))
      ) {
        return;
      }
      isDragging = true;
      manualPhaseOverrideRef.current = false;
      startX = e.clientX;
      startProgress = targetProgressRef.current;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = startX - e.clientX;
      const sensitivity = dx / (window.innerWidth * 3.2);
      targetProgressRef.current = Math.max(0, Math.min(1, startProgress + sensitivity));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });

    let rafId: number;
    const tick = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      const next = Math.abs(diff) < 0.00005 ? target : current + diff * 0.085;
      const velocity = (next - current) * 1000;

      currentProgressRef.current = next;
      setScrollProgress(next);
      setScrollVelocity(velocity);

      const totalIntervals = ERAS.length - 1;
      const eraFloat = next * totalIntervals;
      const eraIdx = Math.round(eraFloat);

      if (eraIdx !== prevEraRef.current) {
        prevEraRef.current = eraIdx;
        setActiveEraIndex(eraIdx);
        setOverrideWord(null);
        if (soundEnabledRef.current) {
          playArchitecturalPulse(200 + eraIdx * 40, 0.14);
        }
      }

      // Derive sequential sub-phase (0, 1, or 2) as user scrolls across each station
      if (!manualPhaseOverrideRef.current) {
        const localOffset = eraFloat - eraIdx + 0.5; // 0.0 to 1.0 across the station window
        const derivedPhase = localOffset < 0.36 ? 0 : localOffset < 0.68 ? 1 : 2;
        if (derivedPhase !== prevPhaseRef.current) {
          prevPhaseRef.current = derivedPhase;
          setActivePhaseIndex(derivedPhase);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      cancelAnimationFrame(rafId);
    };
  }, [selectEra]);

  return (
    <div className="relative w-screen h-screen bg-[#050505] text-white overflow-hidden select-none font-dm">
      {/* 0. WebGL GLSL Water & Caustics Shader Background */}
      <WaterShader
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        activeEraIndex={activeEraIndex}
      />

      {/* 1. Clean Monochrome 3D Particle Engine */}
      <ParticleEngine
        activeEraIndex={activeEraIndex}
        activePhaseIndex={activePhaseIndex}
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        overrideWord={overrideWord}
        customWord={customWord}
        onCanvasClick={() => {
          if (soundEnabled) playArchitecturalPulse(310, 0.12);
        }}
      />

      {/* 2. Minimal Top & Bottom Timeline HUD */}
      <TimelineHUD
        activeEraIndex={activeEraIndex}
        scrollProgress={scrollProgress}
        onSelectEra={selectEra}
        pureParticleMode={pureParticleMode}
        onTogglePureParticleMode={() => setPureParticleMode((p) => !p)}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          if (next) playArchitecturalPulse(360, 0.15);
        }}
      />

      {/* 3. Spacious Split-Margin Horizontal Stage */}
      <HorizontalStage
        scrollProgress={scrollProgress}
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
