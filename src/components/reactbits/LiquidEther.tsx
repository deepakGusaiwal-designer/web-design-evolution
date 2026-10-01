import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { liquidEtherVertexShader, liquidEtherFragmentShader } from '../../shaders/liquidEtherShaders';

export type LiquidColorScheme = 'nebula' | 'aurora' | 'cyber' | 'monochrome' | 'solar';

interface LiquidEtherProps {
  className?: string;
  viscosity?: number;
  turbulence?: number;
  vorticity?: number;
  colorScheme?: LiquidColorScheme;
  currentEraIndex?: number;
}

// Preset color definitions
const PALETTES: Record<LiquidColorScheme, { a: number; b: number; c: number; d: number }> = {
  nebula: {
    a: 0x040610, // Deep Cosmic Space
    b: 0x00f0ff, // Luminescent Cyan
    c: 0x7c3aed, // Electric Violet
    d: 0xf59e0b, // Solar Shimmer
  },
  aurora: {
    a: 0x021414,
    b: 0x10b981, // Emerald Borealis
    c: 0x06b6d4, // Cyan
    d: 0xa855f7, // Deep Purple
  },
  cyber: {
    a: 0x080415,
    b: 0xec4899, // Cyberpunk Pink
    c: 0x3b82f6, // Neon Blue
    d: 0x00f0ff, // Cyan
  },
  monochrome: {
    a: 0x030604, // Terminal Darkness
    b: 0x10b981, // CRT Phosphor Green
    c: 0x1e293b, // Deep Charcoal Slate
    d: 0x94a3b8, // Silver Starlight
  },
  solar: {
    a: 0x0d0602,
    b: 0xf59e0b, // Amber Gold
    c: 0xef4444, // Crimson Flare
    d: 0x38bdf8, // Sky Cyan
  },
};

// Era-to-color mapping for seamless historical journey
const ERA_PALETTES: Record<number, LiquidColorScheme> = {
  0: 'nebula',     // Genesis Hero
  1: 'monochrome', // 1989-1993 Dark Ages & CERN
  2: 'solar',      // 1996 CSS & 1999 Flash Multimedia
  3: 'aurora',     // 2006 Motion & Responsive
  4: 'cyber',      // 2013-2015 Flat Design & 3D
  5: 'nebula',     // 2019 WebGL GPU
  6: 'cyber',      // 2023 AI & Generative
  7: 'nebula',     // 2026+ Spatial Horizon
  8: 'aurora',     // Climax
};

export const LiquidEther: React.FC<LiquidEtherProps> = ({
  className = '',
  viscosity = 0.85,
  turbulence = 1.0,
  vorticity = 1.2,
  colorScheme,
  currentEraIndex = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Target colors for smooth transitions
  const targetColorsRef = useRef<{
    a: THREE.Color;
    b: THREE.Color;
    c: THREE.Color;
    d: THREE.Color;
  }>({
    a: new THREE.Color(0x040610),
    b: new THREE.Color(0x00f0ff),
    c: new THREE.Color(0x7c3aed),
    d: new THREE.Color(0xf59e0b),
  });

  const uniformsRef = useRef<{
    uTime: { value: number };
    uResolution: { value: THREE.Vector2 };
    uMouse: { value: THREE.Vector2 };
    uMouseVelocity: { value: number };
    uColorA: { value: THREE.Color };
    uColorB: { value: THREE.Color };
    uColorC: { value: THREE.Color };
    uColorD: { value: THREE.Color };
    uViscosity: { value: number };
    uTurbulence: { value: number };
    uVorticity: { value: number };
    uClickPos: { value: THREE.Vector2 };
    uClickTime: { value: number };
  } | null>(null);

  // Determine active palette (explicit prop takes precedence over era mapping)
  const activeScheme: LiquidColorScheme = colorScheme || ERA_PALETTES[currentEraIndex] || 'nebula';

  useEffect(() => {
    const pal = PALETTES[activeScheme] || PALETTES.nebula;
    targetColorsRef.current.a.setHex(pal.a);
    targetColorsRef.current.b.setHex(pal.b);
    targetColorsRef.current.c.setHex(pal.c);
    targetColorsRef.current.d.setHex(pal.d);
  }, [activeScheme]);

  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uViscosity.value = viscosity;
      uniformsRef.current.uTurbulence.value = turbulence;
      uniformsRef.current.uVorticity.value = vorticity;
    }
  }, [viscosity, turbulence, vorticity]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: false, // Not needed for full-screen quad shader
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'highp',
    });

    // Capping pixel ratio at 1.25x for extreme smoothness (60-120 FPS) with zero GPU strain
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const pal = PALETTES[activeScheme] || PALETTES.nebula;
    const initialA = new THREE.Color(pal.a);
    const initialB = new THREE.Color(pal.b);
    const initialC = new THREE.Color(pal.c);
    const initialD = new THREE.Color(pal.d);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseVelocity: { value: 0.0 },
      uColorA: { value: initialA },
      uColorB: { value: initialB },
      uColorC: { value: initialC },
      uColorD: { value: initialD },
      uViscosity: { value: viscosity },
      uTurbulence: { value: turbulence },
      uVorticity: { value: vorticity },
      uClickPos: { value: new THREE.Vector2(0.5, 0.5) },
      uClickTime: { value: 99.0 }, // starts inactive
    };
    uniformsRef.current = uniforms;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: liquidEtherVertexShader,
      fragmentShader: liquidEtherFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });

    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // Mouse Tracking in normalized window coordinates
    let prevX = width * 0.5;
    let prevY = height * 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentVelocity = 0.0;
    let clickTime = 99.0;

    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      targetMouseX = x / window.innerWidth;
      targetMouseY = 1.0 - (y / window.innerHeight); // WebGL origin is bottom-left

      const dx = x - prevX;
      const dy = y - prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      currentVelocity = Math.min(speed * 0.05, 3.0);

      prevX = x;
      prevY = y;
    };

    const handlePointerDown = (e: PointerEvent) => {
      const clickX = e.clientX / window.innerWidth;
      const clickY = 1.0 - (e.clientY / window.innerHeight);
      uniforms.uClickPos.value.set(clickX, clickY);
      clickTime = 0.0;
      currentVelocity = Math.min(currentVelocity + 1.2, 4.0);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let rafId: number;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      uniforms.uTime.value = elapsed;

      // Smooth mouse lerp
      uniforms.uMouse.value.x += (targetMouseX - uniforms.uMouse.value.x) * 0.1;
      uniforms.uMouse.value.y += (targetMouseY - uniforms.uMouse.value.y) * 0.1;

      // Smooth velocity decay
      currentVelocity = THREE.MathUtils.lerp(currentVelocity, 0.0, delta * 3.5);
      uniforms.uMouseVelocity.value = currentVelocity;

      // Click ripple progression
      if (clickTime < 10.0) {
        clickTime += delta * 1.5;
        uniforms.uClickTime.value = clickTime;
      }

      // Smooth color palette interpolation
      const t = delta * 2.5;
      uniforms.uColorA.value.lerp(targetColorsRef.current.a, t);
      uniforms.uColorB.value.lerp(targetColorsRef.current.b, t);
      uniforms.uColorC.value.lerp(targetColorsRef.current.c, t);
      uniforms.uColorD.value.lerp(targetColorsRef.current.d, t);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};

export default LiquidEther;
