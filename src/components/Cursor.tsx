import React, { useEffect, useRef, useState } from 'react';

export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    // Detect touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let velocity = 0;
    let angle = 0;

    let ringScale = 1.0;
    let dotScale = 1.0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Check if hovering over interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive =
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[data-cursor-hover]') ||
          target.closest('[role="button"]') ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA';
        setIsHovering(Boolean(isInteractive));
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newRipple = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-4), newRipple]);
    };

    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    let rafId: number;
    const render = () => {
      // Smooth ring lerp
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      ringX += dx * 0.22;
      ringY += dy * 0.22;

      // Calculate instantaneous mouse velocity for organic stretch
      const vx = mouseX - prevMouseX;
      const vy = mouseY - prevMouseY;
      const currentSpeed = Math.sqrt(vx * vx + vy * vy);
      velocity += (currentSpeed - velocity) * 0.2;
      prevMouseX = mouseX;
      prevMouseY = mouseY;

      if (currentSpeed > 0.8) {
        angle = Math.atan2(vy, vx);
      }

      // Smooth scale interpolation based on hover / click states
      const targetRingScale = isClicking ? 0.75 : isHovering ? 1.65 : 1.0;
      const targetDotScale = isClicking ? 0.6 : isHovering ? 1.3 : 1.0;

      ringScale += (targetRingScale - ringScale) * 0.2;
      dotScale += (targetDotScale - dotScale) * 0.25;

      const stretch = Math.min(velocity * 0.02, 0.4);
      const stretchX = 1 + stretch;
      const stretchY = Math.max(1 - stretch * 0.5, 0.65);

      // Apply transforms centered with translate(-50%, -50%)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${stretchX * ringScale}, ${stretchY * ringScale})`;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, [isHovering, isClicking]);

  // Clean up ripples after animation
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);
    return () => clearTimeout(timer);
  }, [ripples]);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Lagging Inertial Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-9 h-9 rounded-full border pointer-events-none transition-colors duration-200 ${
          isHovering
            ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,240,255,0.45)]'
            : isClicking
            ? 'border-cyan-300 bg-cyan-400/20'
            : 'border-white/40'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* Central Sharp Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none transition-colors duration-150 ${
          isHovering
            ? 'bg-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.8)]'
            : isClicking
            ? 'bg-cyan-200'
            : 'bg-white'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* Click Ripple Shockwave Rings */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed top-0 left-0 w-12 h-12 rounded-full border border-cyan-400/60 pointer-events-none animate-ping"
          style={{
            transform: `translate3d(${ripple.x}px, ${ripple.y}px, 0) translate(-50%, -50%)`,
            animationDuration: '600ms',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          }}
        />
      ))}
    </div>
  );
};
