import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export interface ScrollMotionState {
  progress: number;
  velocity: number;
}

interface WaterShaderProps {
  motionRef: React.MutableRefObject<ScrollMotionState>;
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

  // Ultra-smooth C-infinity domain-warped liquid heightfield (autonomous, does not follow cursor)
  float liquidField(vec2 p, float t) {
    // Gentle horizontal current from timeline scroll
    vec2 q = p * 1.55 + vec2(uScroll * 2.2 + t * 0.07, -t * 0.04);

    // 3-pass iterative smooth sinusoidal domain warp (creates silky liquid folds)
    for (int i = 0; i < 3; i++) {
      vec2 nextQ = q;
      nextQ.x += 0.38 * sin(q.y * 1.45 + t * 0.42 + float(i) * 1.7);
      nextQ.y += 0.38 * cos(q.x * 1.35 - t * 0.36 + float(i) * 2.1);
      q = nextQ;
    }

    // Broad, velvety harmonic water swells
    float swell1 = sin(q.x * 1.25 + q.y * 0.85 + t * 0.45) * 0.5;
    float swell2 = cos(q.x * 0.95 - q.y * 1.30 - t * 0.38) * 0.5;
    return (swell1 + swell2) * 0.5;
  }

  // Sub-pixel triangular dither to eliminate 8-bit banding in deep dark gradients
  float dither(vec2 fragCoord) {
    float n = fract(sin(dot(fragCoord, vec2(12.9898, 78.233))) * 43758.5453);
    return (n - 0.5) / 255.0;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    float t = uTime;

    // Wide, buttery-smooth gradient sampling for liquid surface normal
    float eps = 0.015;
    float hC = liquidField(p, t);
    float hR = liquidField(p + vec2(eps, 0.0), t);
    float hL = liquidField(p - vec2(eps, 0.0), t);
    float hU = liquidField(p + vec2(0.0, eps), t);
    float hD = liquidField(p - vec2(0.0, eps), t);

    vec2 grad = vec2(hR - hL, hU - hD) / (2.0 * eps);
    vec3 normal = normalize(vec3(-grad.x * 0.65, -grad.y * 0.65, 1.0));

    // Soft studio lighting for dark liquid obsidian / night water
    vec3 viewDir = normalize(vec3(-p * 0.35, 1.0));
    vec3 lightDir1 = normalize(vec3(-0.3, 0.45, 0.85));
    vec3 lightDir2 = normalize(vec3(0.4, -0.35, 0.85));

    float diff1 = max(dot(normal, lightDir1), 0.0);
    float diff2 = max(dot(normal, lightDir2), 0.0);

    // Broad, silky specular reflections (low exponent for smooth liquid roll-off)
    vec3 half1 = normalize(lightDir1 + viewDir);
    vec3 half2 = normalize(lightDir2 + viewDir);
    float spec1 = pow(max(dot(normal, half1), 0.0), 18.0);
    float spec2 = pow(max(dot(normal, half2), 0.0), 12.0);

    // Gentle Fresnel sheen
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

    // Pure Pitch-Black (#000000) Monochrome Liquid Palette
    vec3 pitchBlack = vec3(0.0, 0.0, 0.0);
    vec3 deepLiquid = vec3(0.014, 0.014, 0.014);
    vec3 darkCrest  = vec3(0.036, 0.036, 0.036);

    float waveBlend = smoothstep(-0.75, 0.75, hC);
    vec3 color = mix(pitchBlack, deepLiquid, waveBlend);
    color = mix(color, darkCrest, pow(diff1, 2.2) * 0.45 + diff2 * 0.15);

    // Subtle pure-monochrome specular sheen on liquid swells
    color += vec3(0.065) * spec1;
    color += vec3(0.030) * spec2;
    color += vec3(0.022) * fresnel;

    // Vignette fades outer edges into pure #000000 pitch black
    float vignette = smoothstep(1.20, 0.22, length(p * vec2(0.75, 0.95)));
    color *= vignette;

    // Add sub-bit dither for zero banding
    color += dither(gl_FragCoord.xy);

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

export const WaterShader: React.FC<WaterShaderProps> = React.memo(({ motionRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', { antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' }) ||
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

    let smoothScroll = motionRef.current.progress;
    let smoothVel = 0;

    const updateSize = () => {
      // 1.0x resolution for silky smooth low-frequency liquid waves at minimal GPU cost
      canvas.width = Math.floor(window.innerWidth);
      canvas.height = Math.floor(window.innerHeight);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Driven by unified GSAP ticker for zero-jitter frame synchronization
    const onTick = (time: number) => {
      const { progress: sProg, velocity: sVel } = motionRef.current;

      smoothScroll += (sProg - smoothScroll) * 0.1;
      smoothVel += (sVel - smoothVel) * 0.1;

      gl.uniform1f(uTimeLoc, time);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform1f(uScrollLoc, smoothScroll);
      gl.uniform1f(uVelLoc, smoothVel);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    gsap.ticker.add(onTick);

    return () => {
      window.removeEventListener('resize', updateSize);
      gsap.ticker.remove(onTick);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [motionRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
});

export default WaterShader;
