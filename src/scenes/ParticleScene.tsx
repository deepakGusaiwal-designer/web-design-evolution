import React, { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { createParticleShapes, type ShapeType } from '../utils/particleShapes';
import { particleVertexShader, particleFragmentShader } from '../shaders/particleShaders';

interface ParticleSceneProps {
  currentEraIndex: number;
  scrollProgress: number;
  scrollVelocity?: number;
  attractMode?: boolean;
}

// Inner Fiber Component rendering and animating the particles
const ParticleField: React.FC<ParticleSceneProps> = ({
  currentEraIndex,
  scrollProgress = 0,
  scrollVelocity = 0,
  attractMode = false,
}) => {
  const { camera, gl } = useThree();

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const particleCount = prefersReducedMotion ? 2500 : isMobile ? 4500 : 9000;

  // 1. Generate multi-shape coordinate buffers
  const { shapes, colors, randomSpeeds, phases, sizes } = useMemo(() => {
    return createParticleShapes(particleCount);
  }, [particleCount]);

  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  // Setup initial buffer positions (from cloud to web)
  const initialCurrent = useMemo(() => new Float32Array(shapes.cloud), [shapes]);
  const initialTarget = useMemo(() => new Float32Array(shapes.cloud), [shapes]);

  // Morph tracking state
  const morphProgressRef = useRef(1.0);
  const activeShapeKeyRef = useRef<ShapeType>('cloud');
  const targetShapeKeyRef = useRef<ShapeType>('cloud');

  // Hero auto-reveal sequence state
  const [heroWebPhase, setHeroWebPhase] = useState(false);

  useEffect(() => {
    // Only run auto-evolution if user stays in Hero section
    const timer1 = setTimeout(() => {
      setHeroWebPhase(true); // Form "WEB" at ~2.8s
    }, 2800);

    const timer2 = setTimeout(() => {
      setHeroWebPhase(false); // Disperse back to cloud at ~6.8s
    }, 6800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Determine target shape based on active era index & hero sequence
  const currentTargetShape = useMemo<ShapeType>(() => {
    if (currentEraIndex === 0) {
      return heroWebPhase ? 'web' : 'cloud';
    }
    switch (currentEraIndex) {
      case 1:
        return 'grid'; // 1991: Static HTML Matrix
      case 2:
        return 'wave'; // 1996: CSS Responsive Wave
      case 3:
        return 'spiral'; // 2006: Motion Kinetic Vortex
      case 4:
        return 'torus'; // 2015: 3D Torus Knot
      case 5:
        return 'lattice'; // 2019: WebGL GPU Silicon Matrix
      case 6:
        return 'network'; // 2023: AI Synaptic Network
      case 7:
        return 'sphere'; // 2026: Spatial Singularity Constellation
      case 8:
        return 'explosion'; // Climax: Supernova Explosion
      default:
        return 'cloud';
    }
  }, [currentEraIndex, heroWebPhase]);

  // Trigger smooth, continuous morph without any popping
  const triggerMorphTo = React.useCallback((newShape: ShapeType) => {
    if (newShape === targetShapeKeyRef.current) return;

    const geo = geometryRef.current;
    if (!geo) return;

    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const targAttr = geo.attributes.targetPos as THREE.BufferAttribute;
    if (!posAttr || !targAttr) return;

    const currArr = posAttr.array as Float32Array;
    const targArr = targAttr.array as Float32Array;
    const nextTargetData = shapes[newShape];

    // Calculate exact current interpolated coordinates using cubic smoothstep
    const p = THREE.MathUtils.smoothstep(morphProgressRef.current, 0, 1);
    for (let i = 0; i < particleCount * 3; i++) {
      currArr[i] = currArr[i] + (targArr[i] - currArr[i]) * p;
      targArr[i] = nextTargetData[i];
    }

    posAttr.needsUpdate = true;
    targAttr.needsUpdate = true;

    morphProgressRef.current = 0.0;
    activeShapeKeyRef.current = targetShapeKeyRef.current;
    targetShapeKeyRef.current = newShape;
  }, [particleCount, shapes]);

  useEffect(() => {
    triggerMorphTo(currentTargetShape);
  }, [currentTargetShape, triggerMorphTo]);

  // 2. Uniforms setup
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0.0 },
    uHeroDarkness: { value: 0.05 },
    uColorVibrancy: { value: 0.0 },
    uMouse: { value: new THREE.Vector3(999, 999, 0) },
    uMouseRadius: { value: 3.8 },
    uMouseForce: { value: 1.0 },
    uAttractMode: { value: 0.0 },
    uRippleCenter: { value: new THREE.Vector3(0, 0, 0) },
    uRippleTime: { value: -1.0 },
    uRippleStrength: { value: 0.0 },
    uScrollVelocity: { value: 0.0 },
    uDevicePixelRatio: { value: gl.getPixelRatio() },
  }), [gl]);

  const uniformsRef = useRef(uniforms);

  // Update attract mode
  useEffect(() => {
    uniformsRef.current.uAttractMode.value = attractMode ? 1.0 : 0.0;
  }, [attractMode]);

  // 3. Mouse & Pointer Tracking with Raycasting
  const mousePlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseNorm = useRef(new THREE.Vector2(999, 999));
  const targetMouseWorld = useRef(new THREE.Vector3(999, 999, 0));
  const targetMouseForce = useRef(1.0);

  useEffect(() => {
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      mouseNorm.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNorm.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      const vx = e.clientX - prevMouseX;
      const vy = e.clientY - prevMouseY;
      const mouseSpeed = Math.sqrt(vx * vx + vy * vy);
      targetMouseForce.current = 1.0 + Math.min(mouseSpeed * 0.04, 3.2);

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      raycaster.setFromCamera(mouseNorm.current, camera);
      raycaster.ray.intersectPlane(mousePlane, targetMouseWorld.current);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('[role="button"]') ||
          target.closest('.interactive') ||
          target.closest('[data-cursor-hover]'))
      ) {
        return;
      }

      const clickNorm = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(clickNorm, camera);
      const clickPoint = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(mousePlane, clickPoint)) {
        uniformsRef.current.uRippleCenter.value.copy(clickPoint);
        uniformsRef.current.uRippleTime.value = 0.0;
        uniformsRef.current.uRippleStrength.value = 1.0;

        if (typeof (window as unknown as { playWebChime?: (f: number) => void }).playWebChime === 'function') {
          (window as unknown as { playWebChime: (f: number) => void }).playWebChime(520);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
    };
  }, [camera, mousePlane, raycaster]);

  // 4. Per-Frame Continuous Physics & Animation Loop
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05); // Guard against tab-switch jumps
    const uniforms = uniformsRef.current;
    uniforms.uTime.value += dt;

    // Smooth Morph Progress
    if (morphProgressRef.current < 1.0) {
      morphProgressRef.current = Math.min(1.0, morphProgressRef.current + dt / 1.35);
    }
    uniforms.uProgress.value = morphProgressRef.current;

    // Smooth Mouse Coordinates & Impulse
    uniforms.uMouse.value.lerp(targetMouseWorld.current, 0.12);
    uniforms.uMouseForce.value = THREE.MathUtils.lerp(
      uniforms.uMouseForce.value,
      targetMouseForce.current,
      dt * 4.0
    );
    targetMouseForce.current = THREE.MathUtils.lerp(targetMouseForce.current, 1.0, dt * 2.0);

    // Ripple Shockwave Evolution
    if (uniforms.uRippleStrength.value > 0.001) {
      uniforms.uRippleTime.value += dt * 1.5;
      uniforms.uRippleStrength.value = Math.max(0, uniforms.uRippleStrength.value - dt * 0.7);
    }

    // Hero Darkness Cinematic Emergence
    if (uniforms.uHeroDarkness.value < 1.0) {
      uniforms.uHeroDarkness.value = Math.min(1.0, uniforms.uHeroDarkness.value + dt * 0.65);
    }

    // Color Vibrancy: Monochrome in Era 0 & 1, Bloom in Era 2 (CSS), Full Chromatic in Era 3+
    const targetVibrancy = currentEraIndex <= 1 ? 0.0 : currentEraIndex === 2 ? 0.75 : 1.0;
    uniforms.uColorVibrancy.value = THREE.MathUtils.lerp(
      uniforms.uColorVibrancy.value,
      targetVibrancy,
      dt * 2.6
    );

    // Scroll Velocity Damping
    uniforms.uScrollVelocity.value = THREE.MathUtils.lerp(
      uniforms.uScrollVelocity.value,
      scrollVelocity,
      dt * 5.0
    );

    // Subtle Organic Camera Parallax & Scroll Depth
    if (!prefersReducedMotion && mouseNorm.current.x < 50) {
      const targetCamZ = 18 - scrollProgress * 3.2;
      state.camera.position.z = THREE.MathUtils.lerp(
        state.camera.position.z,
        targetCamZ,
        dt * 2.0
      );
      state.camera.position.x = THREE.MathUtils.lerp(
        state.camera.position.x,
        mouseNorm.current.x * 1.2,
        dt * 1.8
      );
      state.camera.position.y = THREE.MathUtils.lerp(
        state.camera.position.y,
        mouseNorm.current.y * 0.9,
        dt * 1.8
      );
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[initialCurrent, 3]}
        />
        <bufferAttribute
          attach="attributes-targetPos"
          args={[initialTarget, 3]}
        />
        <bufferAttribute
          attach="attributes-customColor"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-randomSpeed"
          args={[randomSpeeds, 3]}
        />
        <bufferAttribute
          attach="attributes-phase"
          args={[phases, 1]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const ParticleScene: React.FC<ParticleSceneProps> = (props) => {
  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 55, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          depth: false,
          stencil: false,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0.0);
          scene.fog = new THREE.FogExp2(0x050508, 0.022);
        }}
      >
        <ParticleField {...props} />
      </Canvas>
    </div>
  );
};
