import React, { useEffect, useRef, useState } from 'react';

export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

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

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Position center dot immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check if hovering over interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive =
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[data-cursor-hover]') ||
          target.closest('[role="button"]') ||
          target.tagName === 'INPUT';
        setIsHovering(Boolean(isInteractive));
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    let rafId: number;
    const render = () => {
      // Smooth ring lerp
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      ringX += dx * 0.18;
      ringY += dy * 0.18;

      // Calculate instantaneous mouse velocity for organic stretch
      const vx = mouseX - prevMouseX;
      const vy = mouseY - prevMouseY;
      const currentSpeed = Math.sqrt(vx * vx + vy * vy);
      velocity += (currentSpeed - velocity) * 0.2;
      prevMouseX = mouseX;
      prevMouseY = mouseY;

      if (currentSpeed > 0.5) {
        angle = Math.atan2(vy, vx);
      }

      const stretch = Math.min(velocity * 0.025, 0.45);
      const scaleX = 1 + stretch;
      const scaleY = Math.max(1 - stretch * 0.5, 0.6);

      if (ringRef.current) {
        const hoverScale = isHovering ? 1.7 : isClicking ? 0.8 : 1.0;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) rotate(${angle}rad) scale(${scaleX * hoverScale}, ${scaleY * hoverScale})`;
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

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Lagging Ring with Velocity Stretch */}
      <div
        ref={ringRef}
        className={`absolute -top-4 -left-4 w-8 h-8 rounded-full border transition-colors duration-200 ${
          isHovering
            ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
            : isClicking
            ? 'border-violet-400 bg-violet-500/20'
            : 'border-white/40'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* Central Sharp Dot */}
      <div
        ref={dotRef}
        className={`absolute -top-1 -left-1 w-2 h-2 rounded-full transition-transform duration-100 ${
          isHovering
            ? 'bg-cyan-300 scale-150'
            : isClicking
            ? 'bg-violet-400 scale-75'
            : 'bg-white'
        }`}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};
