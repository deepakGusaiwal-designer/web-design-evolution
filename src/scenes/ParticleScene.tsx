import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createParticleShapes, type ShapeType } from '../utils/particleShapes';
import { particleVertexShader, particleFragmentShader } from '../shaders/particleShaders';

interface ParticleSceneProps {
  currentEraIndex: number;
  scrollProgress: number;
  scrollVelocity?: number;
  attractMode?: boolean;
}

export const ParticleScene: React.FC<ParticleSceneProps> = ({
  currentEraIndex,
  scrollProgress,
  scrollVelocity = 0,
  attractMode = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<{
    uTime: { value: number };
    uProgress: { value: number };
    uMouse: { value: THREE.Vector3 };
    uMouseRadius: { value: number };
    uMouseForce: { value: number };
    uAttractMode: { value: number };
    uRippleCenter: { value: THREE.Vector3 };
    uRippleTime: { value: number };
    uRippleStrength: { value: number };
    uScrollVelocity: { value: number };
    uDevicePixelRatio: { value: number };
  } | null>(null);

  const prevEraRef = useRef<number>(currentEraIndex);
  const targetEraRef = useRef<number>(currentEraIndex);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const shapesRef = useRef<Record<ShapeType, Float32Array> | null>(null);

  useEffect(() => {
    targetEraRef.current = currentEraIndex;
  }, [currentEraIndex]);

  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uAttractMode.value = attractMode ? 1.0 : 0.0;
    }
  }, [attractMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check device capabilities
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particleCount = prefersReducedMotion ? 2000 : isMobile ? 4000 : 9000;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.025);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.0);
    container.appendChild(renderer.domElement);

    // 2. Build particle shapes & geometry
    const { shapes, colors, randomSpeeds, phases, sizes } = createParticleShapes(particleCount);
    shapesRef.current = shapes;

    const shapeKeys: ShapeType[] = [
      'cloud',      // 0: Hero initial
      'web',        // 1: Hero WEB formation
      'grid',       // 2: Section 01 Static Web
      'wave',       // 3: Section 02 Visual CSS
      'spiral',     // 4: Section 03 Motion
      'torus',      // 5: Section 04 3D
      'network',    // 6: Section 05 WebGL / AI
      'sphere',     // 7: Section 06 Imagination / Singularity
      'explosion',  // 8: Final explosion
    ];

    const initialShapeA = shapes[shapeKeys[0]];
    const initialShapeB = shapes[shapeKeys[1]];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(initialShapeA), 3));
    geometry.setAttribute('targetPos', new THREE.BufferAttribute(new Float32Array(initialShapeB), 3));
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('randomSpeed', new THREE.BufferAttribute(randomSpeeds, 3));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometryRef.current = geometry;

    // 3. Shaders & Material
    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0.0 },
      uMouse: { value: new THREE.Vector3(999, 999, 0) },
      uMouseRadius: { value: 3.8 },
      uMouseForce: { value: 1.0 },
      uAttractMode: { value: 0.0 },
      uRippleCenter: { value: new THREE.Vector3(0, 0, 0) },
      uRippleTime: { value: -1.0 },
      uRippleStrength: { value: 0.0 },
      uScrollVelocity: { value: 0.0 },
      uDevicePixelRatio: { value: renderer.getPixelRatio() },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 4. Mouse tracking in 3D
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouseNormalized = new THREE.Vector2(999, 999);
    const targetMouseWorld = new THREE.Vector3(999, 999, 0);
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseNormalized.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNormalized.y = -(e.clientY / window.innerHeight) * 2 + 1;

      const vx = e.clientX - prevMouseX;
      const vy = e.clientY - prevMouseY;
      const mouseSpeed = Math.sqrt(vx * vx + vy * vy);
      uniforms.uMouseForce.value = 1.0 + Math.min(mouseSpeed * 0.04, 3.5);

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      raycaster.setFromCamera(mouseNormalized, camera);
      raycaster.ray.intersectPlane(mousePlane, targetMouseWorld);
    };

    const handleClick = (e: MouseEvent) => {
      const clickNorm = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(clickNorm, camera);
      const clickPoint = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(mousePlane, clickPoint)) {
        uniforms.uRippleCenter.value.copy(clickPoint);
        uniforms.uRippleTime.value = 0.0;
        uniforms.uRippleStrength.value = 1.6;

        // Play subtle sound if available
        if (typeof (window as unknown as { playWebChime?: (f: number) => void }).playWebChime === 'function') {
          (window as unknown as { playWebChime: (f: number) => void }).playWebChime(520);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);

    // 5. Resize handler
    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uDevicePixelRatio.value = renderer.getPixelRatio();
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation loop
    const clock = new THREE.Clock();
    let currentMorphProgress = 0.0;
    let currentShapeIndex = 0;
    let nextShapeIndex = 1;
    let rafId: number;

    const tick = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      uniforms.uTime.value = elapsed;

      // Smooth mouse coordinate lerping
      uniforms.uMouse.value.lerp(targetMouseWorld, 0.12);

      // Ripple shockwave propagation
      if (uniforms.uRippleStrength.value > 0.01) {
        uniforms.uRippleTime.value += delta * 1.2;
        uniforms.uRippleStrength.value = Math.max(0, uniforms.uRippleStrength.value - delta * 0.9);
      }

      // Camera gentle subtle parallax
      if (!prefersReducedMotion) {
        camera.position.x += (mouseNormalized.x * 0.8 - camera.position.x) * 0.03;
        camera.position.y += (mouseNormalized.y * 0.6 - camera.position.y) * 0.03;
      }
      camera.lookAt(0, 0, 0);

      // Smooth Shape Morphing based on active section
      const targetIdx = Math.min(Math.max(targetEraRef.current, 0), shapeKeys.length - 1);
      if (targetIdx !== currentShapeIndex) {
        // Incrementally morph
        currentMorphProgress += delta * 1.8;
        if (currentMorphProgress >= 1.0) {
          // Transition complete: make current target the base
          currentMorphProgress = 0.0;
          currentShapeIndex = targetIdx;
          nextShapeIndex = Math.min(targetIdx + 1, shapeKeys.length - 1);

          const currentArr = shapes[shapeKeys[currentShapeIndex]];
          const nextArr = shapes[shapeKeys[nextShapeIndex]];

          const posAttr = geometry.attributes.position as THREE.BufferAttribute;
          const targetAttr = geometry.attributes.targetPos as THREE.BufferAttribute;
          if (posAttr && targetAttr) {
            posAttr.copyArray(currentArr);
            posAttr.needsUpdate = true;
            targetAttr.copyArray(nextArr);
            targetAttr.needsUpdate = true;
          }
        }
      } else {
        currentMorphProgress = THREE.MathUtils.lerp(currentMorphProgress, 0.0, 0.1);
      }

      uniforms.uProgress.value = currentMorphProgress;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
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

  // Update target shape when currentEraIndex changes
  useEffect(() => {
    if (shapesRef.current && geometryRef.current) {
      const shapeKeys: ShapeType[] = [
        'cloud',
        'web',
        'grid',
        'wave',
        'spiral',
        'torus',
        'network',
        'sphere',
        'explosion',
      ];
      const fromKey = shapeKeys[Math.min(prevEraRef.current, shapeKeys.length - 1)];
      const toKey = shapeKeys[Math.min(currentEraIndex, shapeKeys.length - 1)];

      const fromData = shapesRef.current[fromKey];
      const toData = shapesRef.current[toKey];

      const posAttr = geometryRef.current.attributes.position as THREE.BufferAttribute;
      const targetAttr = geometryRef.current.attributes.targetPos as THREE.BufferAttribute;

      if (posAttr && targetAttr) {
        posAttr.copyArray(fromData);
        posAttr.needsUpdate = true;
        targetAttr.copyArray(toData);
        targetAttr.needsUpdate = true;
      }

      prevEraRef.current = currentEraIndex;
    }
  }, [currentEraIndex]);

  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uScrollVelocity.value = scrollVelocity;
    }
  }, [scrollVelocity]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-auto z-0"
      style={{ opacity: scrollProgress > 0.98 ? 0.4 : 1 }}
    />
  );
};
