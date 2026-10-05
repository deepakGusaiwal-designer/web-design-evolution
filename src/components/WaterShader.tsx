import React, { useEffect, useRef } from 'react';

interface WaterShaderProps {
  scrollProgress: number;
  scrollVelocity: number;
  activeEraIndex: number;
}

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uScroll;
  uniform float uVelocity;
  uniform float uEra;
  // Up to 8 interactive water ripples: xy = position in aspect-corrected coords, z = birthTime, w = amplitude
  uniform vec4 uRipples[8];

  // Hash & 2D Value Noise for organic liquid turbulence
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Shimmering Voronoi / Wave Caustic network for submerged water depth
  float causticPattern(vec2 uv, float t) {
    vec2 p = mod(uv * 6.2831853, 6.2831853) - 250.0;
    vec2 i = vec2(p);
    float c = 1.0;
    float inten = 0.005;

    for (int n = 0; n < 4; n++) {
      float fn = float(n);
      float tRate = t * (1.0 - (3.2 / (fn + 1.0)));
      i = p + vec2(
        cos(tRate - i.x) + sin(tRate + i.y),
        sin(tRate - i.y) + cos(tRate + i.x)
      );
      c += 1.0 / length(vec2(
        p.x / (sin(i.x + tRate) / inten),
        p.y / (cos(i.y + tRate) / inten)
      ));
    }
    c /= 4.0;
    c = 1.17 - pow(c, 1.4);
    return pow(abs(c), 7.5);
  }

  // Composite Water Heightfield (Gerstner swells + FBM + Interactive Mouse/Click Ripples)
  float waterHeight(vec2 p, float t) {
    // Horizontal current driven by timeline scroll
    vec2 flow = vec2(uScroll * 4.5 + t * 0.14, t * 0.06);
    vec2 q = p * 2.4 + flow;

    // Layered directional ocean/liquid swells
    float w1 = sin(q.x * 1.8 + q.y * 0.9 + t * 1.1) * 0.28;
    float w2 = cos(q.x * 1.1 - q.y * 2.1 - t * 0.85) * 0.24;
    float w3 = sin((q.x + q.y) * 3.1 + t * 1.65) * 0.12;

    // Fine organic capillary ripples via rotated noise
    float n1 = noise(q * 1.7 + vec2(t * 0.35, -t * 0.25)) * 0.22;
    float n2 = noise(q * 3.8 - vec2(t * 0.5, t * 0.4)) * 0.10;

    float h = w1 + w2 + w3 + n1 + n2;

    // Add interactive concentric water ripples from mouse wakes & clicks
    for (int i = 0; i < 8; i++) {
      vec4 rip = uRipples[i];
      float age = t - rip.z;
      if (age > 0.0 && age < 4.5 && rip.w > 0.001) {
        float d = length(p - rip.xy);
        float waveFront = d * 28.0 - age * 11.5;
        float envelope = exp(-d * 4.2) * exp(-age * 1.15);
        // Ring packet around expanding wavefront
        float packet = smoothstep(-6.0, 0.0, waveFront) * smoothstep(6.0, 0.0, waveFront);
        h += sin(waveFront) * envelope * packet * rip.w * 0.55;
      }
    }

    return h;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    float t = uTime;

    // Finite-difference surface normal from water heightfield
    float eps = 0.0035;
    float hC = waterHeight(p, t);
    float hR = waterHeight(p + vec2(eps, 0.0), t);
    float hU = waterHeight(p + vec2(0.0, eps), t);

    vec3 normal = normalize(vec3((hC - hR) * 14.0, (hC - hU) * 14.0, 1.0));

    // View & Light vectors for liquid specular + Fresnel reflection
    vec3 viewDir = normalize(vec3(-p * 0.6, 1.2));
    vec3 lightDir1 = normalize(vec3(-0.35 + sin(t * 0.2) * 0.15, 0.45, 0.85));
    vec3 lightDir2 = normalize(vec3(0.45, -0.35, 0.75));

    float diff1 = max(dot(normal, lightDir1), 0.0);
    float diff2 = max(dot(normal, lightDir2), 0.0);

    vec3 halfVec1 = normalize(lightDir1 + viewDir);
    vec3 halfVec2 = normalize(lightDir2 + viewDir);
    float spec1 = pow(max(dot(normal, halfVec1), 0.0), 42.0);
    float spec2 = pow(max(dot(normal, halfVec2), 0.0), 24.0);

    // Schlick Fresnel for liquid sheen at grazing angles
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.5);

    // Refracted underwater caustics (warped by the water surface normal)
    vec2 refractedUv = p * 0.48 + normal.xy * 0.085 + vec2(uScroll * 0.45, 0.0);
    float caustics1 = causticPattern(refractedUv, t * 0.42);
    float caustics2 = causticPattern(refractedUv * 1.35 + vec2(0.37, -0.21), -t * 0.31);
    float caustics = (caustics1 * 0.65 + caustics2 * 0.45);

    // Monochrome Abyssal Water + Liquid Silver Palette (with subtle cool-slate depth)
    vec3 deepAbyss = vec3(0.014, 0.016, 0.020);
    vec3 midWater  = vec3(0.055, 0.062, 0.072);
    vec3 crestTone = vec3(0.14, 0.155, 0.175);

    // Base water body shaded by wave height and diffuse lighting
    float heightFactor = smoothstep(-0.6, 0.6, hC);
    vec3 color = mix(deepAbyss, midWater, heightFactor * 0.75 + diff1 * 0.35);
    color = mix(color, crestTone, pow(diff1, 2.2) * 0.55 + diff2 * 0.2);

    // Add submerged caustic light veins
    color += vec3(0.19, 0.21, 0.24) * caustics * (0.42 + 0.58 * diff1);

    // Add liquid mercury / moonlight specular glints on wave crests & interactive ripples
    color += vec3(0.75, 0.79, 0.84) * (spec1 * 0.48 + spec2 * 0.22);
    color += vec3(0.28, 0.30, 0.34) * fresnel * 0.45;

    // Horizontal velocity surge when scrolling rapidly
    float surge = clamp(abs(uVelocity) * 0.03, 0.0, 0.25);
    color += vec3(0.18, 0.20, 0.22) * caustics * surge;

    // Subtle horizon depth gradient & soft vignette so foreground particles stay 100% crisp
    float radialDist = length(p * vec2(0.72, 0.95));
    float vignette = smoothstep(1.18, 0.18, radialDist);
    color *= (0.45 + 0.55 * vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const WaterShader: React.FC<WaterShaderProps> = ({
  scrollProgress,
  scrollVelocity,
  activeEraIndex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    scrollProgress,
    scrollVelocity,
    activeEraIndex,
  });

  useEffect(() => {
    stateRef.current = {
      scrollProgress,
      scrollVelocity,
      activeEraIndex,
    };
  }, [scrollProgress, scrollVelocity, activeEraIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', { antialias: false, depth: false, stencil: false }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    // Fullscreen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uResLoc = gl.getUniformLocation(program, 'uResolution');
    const uScrollLoc = gl.getUniformLocation(program, 'uScroll');
    const uVelLoc = gl.getUniformLocation(program, 'uVelocity');
    const uEraLoc = gl.getUniformLocation(program, 'uEra');
    const uRipplesLoc = gl.getUniformLocation(program, 'uRipples[0]');

    // Ring buffer of 8 ripples: [x, y, birthTime, amplitude]
    const ripples = new Float32Array(8 * 4);
    let rippleWriteIdx = 0;
    let startTime = performance.now();

    const addRipple = (clientX: number, clientY: number, amplitude: number) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const aspect = w / h;
      const uvX = clientX / w;
      const uvY = 1.0 - clientY / h;
      const px = (uvX - 0.5) * aspect;
      const py = uvY - 0.5;
      const nowSec = (performance.now() - startTime) * 0.001;

      const base = rippleWriteIdx * 4;
      ripples[base] = px;
      ripples[base + 1] = py;
      ripples[base + 2] = nowSec;
      ripples[base + 3] = amplitude;
      rippleWriteIdx = (rippleWriteIdx + 1) % 8;
    };

    // Seed an initial gentle center water ripple on load
    addRipple(window.innerWidth * 0.5, window.innerHeight * 0.5, 0.85);

    let lastMoveX = -999;
    let lastMoveY = -999;
    let lastMoveTime = 0;

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dx = e.clientX - lastMoveX;
      const dy = e.clientY - lastMoveY;
      if (now - lastMoveTime > 65 && dx * dx + dy * dy > 700) {
        addRipple(e.clientX, e.clientY, 0.42);
        lastMoveX = e.clientX;
        lastMoveY = e.clientY;
        lastMoveTime = now;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      addRipple(e.clientX, e.clientY, 1.15);
    };

    const updateSize = () => {
      // Render water shader at 1.0x CSS pixels for ultra-smooth 60fps liquid look
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    let rafId: number;
    const render = () => {
      const elapsed = (performance.now() - startTime) * 0.001;
      const { scrollProgress: sProg, scrollVelocity: sVel, activeEraIndex: eraIdx } =
        stateRef.current;

      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform1f(uScrollLoc, sProg);
      gl.uniform1f(uVelLoc, sVel);
      gl.uniform1f(uEraLoc, eraIdx);
      if (uRipplesLoc) {
        gl.uniform4fv(uRipplesLoc, ripples);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(rafId);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default WaterShader;
