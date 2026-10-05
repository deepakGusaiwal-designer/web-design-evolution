import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ERAS } from './data/eras';
import ParticleEngine from './components/ParticleEngine';
import HorizontalStage from './components/HorizontalStage';
import TimelineHUD from './components/TimelineHUD';
import { playArchitecturalPulse } from './utils/sound';

export const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [activeEraIndex, setActiveEraIndex] = useState(0);
  const [altModes, setAltModes] = useState<Record<number, boolean>>({});
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);
  const [customWord, setCustomWord] = useState('IMAGINE');
  const [pureParticleMode, setPureParticleMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const prevEraRef = useRef(0);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const selectEra = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(ERAS.length - 1, index));
    targetProgressRef.current = clamped / (ERAS.length - 1);
    setSelectedNodeIndex(null);
    if (soundEnabledRef.current) {
      playArchitecturalPulse(180 + clamped * 45, 0.16);
    }
  }, []);

  const handleSelectNode = useCallback((idx: number | null) => {
    setSelectedNodeIndex(idx);
    if (soundEnabledRef.current) {
      playArchitecturalPulse(idx !== null ? 460 + idx * 35 : 260, 0.14);
    }
  }, []);

  const toggleAltMode = useCallback(() => {
    setSelectedNodeIndex(null);
    setAltModes((prev) => {
      const nextVal = !prev[activeEraIndex];
      if (soundEnabledRef.current) {
        playArchitecturalPulse(nextVal ? 420 : 280, 0.18);
      }
      return { ...prev, [activeEraIndex]: nextVal };
    });
  }, [activeEraIndex]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const step = delta * 0.00022;
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

      const eraIdx = Math.round(next * (ERAS.length - 1));
      if (eraIdx !== prevEraRef.current) {
        prevEraRef.current = eraIdx;
        setActiveEraIndex(eraIdx);
        setSelectedNodeIndex(null);
        if (soundEnabledRef.current) {
          playArchitecturalPulse(200 + eraIdx * 40, 0.14);
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

  const currentAltMode = !!altModes[activeEraIndex];

  return (
    <div className="relative w-screen h-screen bg-[#050505] text-white overflow-hidden select-none font-dm">
      {/* 1. Monochrome 3D Particle Engine (Forms Words, Glyphs, Sculptures, Satellites & Histogram) */}
      <ParticleEngine
        activeEraIndex={activeEraIndex}
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        isAltMode={currentAltMode}
        customWord={customWord}
        selectedNodeIndex={selectedNodeIndex}
        onSelectNode={handleSelectNode}
        onCanvasClick={() => {
          if (soundEnabled) playArchitecturalPulse(310, 0.12);
        }}
      />

      {/* 2. Top & Bottom Monochrome Architectural Timeline HUD */}
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

      {/* 3. Horizontal Scrolling Information Stations */}
      <HorizontalStage
        scrollProgress={scrollProgress}
        activeEraIndex={activeEraIndex}
        isAltMode={currentAltMode}
        onToggleAltMode={toggleAltMode}
        customWord={customWord}
        onChangeCustomWord={setCustomWord}
        selectedNodeIndex={selectedNodeIndex}
        onSelectNode={handleSelectNode}
        onSelectEra={selectEra}
        pureParticleMode={pureParticleMode}
      />
    </div>
  );
};

export default App;
