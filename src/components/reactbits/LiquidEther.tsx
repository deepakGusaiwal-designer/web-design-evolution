import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { liquidEtherVertexShader, liquidEtherFragmentShader } from '../../shaders/liquidEtherShaders';

interface LiquidEtherProps {
  className?: string;
  viscosity?: number;
  turbulence?: number;
  vorticity?: number;
  colorScheme?: 'nebula' | 'aurora' | 'cyber';
}

export const LiquidEther: React.FC<LiquidEtherProps> = ({
  className = '',
  viscosity = 0.9,
  turbulence = 1.0,
  vorticity = 1.2,
  colorScheme = 'nebula',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
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
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Color Palettes
    const colors = {
      nebula: {
        a: new THREE.Color(0x04060e), // Deep Space Void
        b: new THREE.Color(0x00f0ff), // Luminous Cyan Ether
        c: new THREE.Color(0x7c3aed), // Electric Violet
        d: new THREE.Color(0xf59e0b), // Solar Gold Shimmer
      },
      aurora: {
        a: new THREE.Color(0x021a1a),
        b: new THREE.Color(0x10b981),
        c: new THREE.Color(0x06b6d4),
        d: new THREE.Color(0xa855f7),
      },
      cyber: {
        a: new THREE.Color(0x0a0518),
        b: new THREE.Color(0xec4899),
        c: new THREE.Color(0x3b82f6),
        d: new THREE.Color(0x00f0ff),
      },
    }[colorScheme] || {
      a: new THREE.Color(0x04060e),
      b: new THREE.Color(0x00f0ff),
      c: new THREE.Color(0x7c3aed),
      d: new THREE.Color(0xf59e0b),
    };

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseVelocity: { value: 0.0 },
      uColorA: { value: colors.a },
      uColorB: { value: colors.b },
      uColorC: { value: colors.c },
      uColorD: { value: colors.d },
      uViscosity: { value: viscosity },
      uTurbulence: { value: turbulence },
      uVorticity: { value: vorticity },
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

    // Mouse Tracking with smooth velocity damping
    let prevMouseX = width * 0.5;
    let prevMouseY = height * 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentVelocity = 0.0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      targetMouseX = clientX / width;
      targetMouseY = 1.0 - (clientY / height);

      const vx = e.clientX - prevMouseX;
      const vy = e.clientY - prevMouseY;
      const speed = Math.sqrt(vx * vx + vy * vy);
      currentVelocity = Math.min(speed * 0.08, 3.5);

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      renderer.setSize(newW, newH);
      uniforms.uResolution.value.set(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let rafId: number;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      uniforms.uTime.value = elapsed;

      // Smooth mouse lerp
      uniforms.uMouse.value.x += (targetMouseX - uniforms.uMouse.value.x) * 0.08;
      uniforms.uMouse.value.y += (targetMouseY - uniforms.uMouse.value.y) * 0.08;

      // Smooth velocity decay
      currentVelocity = THREE.MathUtils.lerp(currentVelocity, 0.0, delta * 3.0);
      uniforms.uMouseVelocity.value = currentVelocity;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [colorScheme, viscosity, turbulence, vorticity]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ filter: 'contrast(115%) saturate(125%)' }}
    />
  );
};

export default LiquidEther;
