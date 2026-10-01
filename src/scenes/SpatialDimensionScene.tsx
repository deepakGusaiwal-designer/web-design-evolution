import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Move3d, Compass } from 'lucide-react';

export const SpatialDimensionScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [cameraDepth, setCameraDepth] = useState(12);
  const [wireframeMode, setWireframeMode] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.04);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    container.appendChild(renderer.domElement);

    // Dynamic Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x00f0ff, 3, 25);
    cyanPoint.position.set(-6, 4, 6);
    scene.add(cyanPoint);

    const violetPoint = new THREE.PointLight(0xa855f7, 3.5, 25);
    violetPoint.position.set(6, -4, 4);
    scene.add(violetPoint);

    // Floating Geometric Objects
    const group = new THREE.Group();
    scene.add(group);

    // 1. Center Icosahedron with inner glowing core
    const icoGeo = new THREE.IcosahedronGeometry(2.4, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x0c1428,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: wireframeMode,
      emissive: 0x002244,
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    group.add(icosahedron);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(1.2, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    icosahedron.add(innerSphere);

    // 2. Orbiting Torus Knot
    const torusGeo = new THREE.TorusKnotGeometry(1.4, 0.35, 100, 16);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: wireframeMode,
    });
    const torusKnot = new THREE.Mesh(torusGeo, torusMat);
    torusKnot.position.set(-5, 2, -3);
    group.add(torusKnot);

    // 3. Orbiting Octahedron
    const octGeo = new THREE.OctahedronGeometry(1.8, 0);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.1,
      metalness: 0.95,
      wireframe: wireframeMode,
    });
    const octahedron = new THREE.Mesh(octGeo, octMat);
    octahedron.position.set(5.5, -2, -2);
    group.add(octahedron);

    // 4. Floating 3D Grid Planes
    const gridHelper = new THREE.GridHelper(24, 24, 0x00f0ff, 0x1e293b);
    gridHelper.position.y = -4.5;
    scene.add(gridHelper);

    // Mouse drag interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotX = 0;
    let rotY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      rotY += dx * 0.005;
      rotX += dy * 0.005;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Only render when visible in viewport
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    const clock = new THREE.Clock();
    let rafId: number;

    const tick = () => {
      if (isVisible) {
        const elapsed = clock.getElapsedTime();

        // Autonomous rotation
        icosahedron.rotation.x = elapsed * 0.3 + rotX;
        icosahedron.rotation.y = elapsed * 0.4 + rotY;

        torusKnot.rotation.x = elapsed * 0.5;
        torusKnot.rotation.y = elapsed * 0.6;
        torusKnot.position.y = 2 + Math.sin(elapsed * 1.5) * 0.6;

        octahedron.rotation.x = elapsed * 0.4;
        octahedron.rotation.z = elapsed * 0.3;
        octahedron.position.y = -2 + Math.cos(elapsed * 1.8) * 0.5;

        // Orbiting lights
        cyanPoint.position.x = Math.sin(elapsed * 0.8) * 8;
        cyanPoint.position.z = Math.cos(elapsed * 0.8) * 8;

        violetPoint.position.x = Math.cos(elapsed * 0.7) * 7;
        violetPoint.position.y = Math.sin(elapsed * 0.7) * 5;

        // Camera depth lerp
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraDepth, 0.08);

        renderer.render(scene, camera);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);

      icoGeo.dispose();
      icoMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      octGeo.dispose();
      octMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [wireframeMode, cameraDepth]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden glass-panel border border-violet-500/20 group">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Spatial HUD */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none">
        <span className="font-mono text-[10px] tracking-widest text-violet-400 uppercase flex items-center gap-1.5">
          <Move3d className="w-3.5 h-3.5" />
          Spatial Euclidean Coordinates [X, Y, Z]
        </span>
        <span className="text-xs text-slate-400 font-mono">Drag in 3D viewport to rotate camera coordinate system</span>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel text-[11px] font-mono text-cyan-300 border border-cyan-500/30">
        <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
        FOV: 50° | Depth: {cameraDepth.toFixed(1)}u
      </div>

      {/* Interactive Controls Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl glass-panel-glow border border-white/10 text-xs">
        <div className="flex items-center gap-3">
          <Eye className="w-3.5 h-3.5 text-violet-400" />
          <span className="font-mono text-[11px] text-slate-300">Camera Travel Depth:</span>
          <input
            type="range"
            min="6"
            max="20"
            step="0.5"
            value={cameraDepth}
            onChange={(e) => setCameraDepth(parseFloat(e.target.value))}
            className="w-32 accent-violet-400 cursor-pointer"
          />
        </div>

        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          data-cursor-hover
          className={`px-3 py-1.5 rounded-lg font-mono text-[11px] border transition-all ${
            wireframeMode
              ? 'border-violet-400 text-violet-300 bg-violet-500/20'
              : 'border-white/15 text-slate-300 hover:border-white/30'
          }`}
        >
          {wireframeMode ? "WIREFRAME POLYGONS" : "PBR METALLIC SOLID"}
        </button>
      </div>
    </div>
  );
};
