import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { liquidVertexShader, liquidFragmentShader } from '../shaders/liquidShaders';
import { Sparkles, Sliders } from 'lucide-react';

export const WebGLScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<{
    uTime: { value: number };
    uMouse: { value: THREE.Vector2 };
    uDistortion: { value: number };
    uWaveStrength: { value: number };
    uDisintegration: { value: number };
    uColorA: { value: THREE.Color };
    uColorB: { value: THREE.Color };
  } | null>(null);

  const [distortion, setDistortion] = useState(1.2);
  const [disintegration, setDisintegration] = useState(0.0);
  const [wireframeOnly, setWireframeOnly] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, -3.2, 5.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    container.appendChild(renderer.domElement);

    // Optimized resolution grid plane for fluid ripples (smooth 60fps)
    const segments = window.innerWidth < 768 ? 50 : 80;
    const geometry = new THREE.PlaneGeometry(8, 8, segments, segments);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uDistortion: { value: distortion },
      uWaveStrength: { value: 1.5 },
      uDisintegration: { value: disintegration },
      uColorA: { value: new THREE.Color(0x061826) }, // Deep Oceanic Cyan
      uColorB: { value: new THREE.Color(0x7c3aed) }, // Electric Violet
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader: liquidVertexShader,
      fragmentShader: liquidFragmentShader,
      uniforms,
      transparent: true,
      wireframe: wireframeOnly,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.28;
    scene.add(mesh);

    const raycaster = new THREE.Raycaster();
    const mouseNorm = new THREE.Vector2(999, 999);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseNorm.set(x, y);

      raycaster.setFromCamera(mouseNorm, camera);
      const intersects = raycaster.intersectObject(mesh);
      if (intersects.length > 0 && intersects[0].uv) {
        uniforms.uMouse.value.copy(intersects[0].uv);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Only render when visible in viewport to prevent GPU contention
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    const clock = new THREE.Clock();
    let rafId: number;
    const tick = () => {
      if (isVisible) {
        const delta = clock.getDelta();
        uniforms.uTime.value += delta;
        renderer.render(scene, camera);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [wireframeOnly]);

  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uDistortion.value = distortion;
      uniformsRef.current.uDisintegration.value = disintegration;
    }
  }, [distortion, disintegration]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden glass-panel border border-cyan-500/20 group">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Interactive Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none">
        <span className="font-mono text-[10px] tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          GLSL Compute Mesh // 25,600 Vertices
        </span>
        <span className="text-xs text-slate-400 font-mono">Move mouse across surface to generate wave displacement</span>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl glass-panel-glow border border-white/10 text-xs">
        <div className="flex items-center gap-4">
          {/* Wave Distortion Slider */}
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[11px] text-slate-300">Fluidity:</span>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={distortion}
              onChange={(e) => setDistortion(parseFloat(e.target.value))}
              className="w-24 accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Disintegration Slider */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="font-mono text-[11px] text-slate-300">GPU Disintegrate:</span>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={disintegration}
              onChange={(e) => setDisintegration(parseFloat(e.target.value))}
              className="w-24 accent-violet-400 cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={() => setWireframeOnly(!wireframeOnly)}
          data-cursor-hover
          className={`px-3 py-1.5 rounded-lg font-mono text-[11px] border transition-all ${
            wireframeOnly
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/20'
              : 'border-white/15 text-slate-300 hover:border-white/30'
          }`}
        >
          {wireframeOnly ? "WIREFRAME ACTIVE" : "TOGGLE WIREFRAME"}
        </button>
      </div>
    </div>
  );
};
