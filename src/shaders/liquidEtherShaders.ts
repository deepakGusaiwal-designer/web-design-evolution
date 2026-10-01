export const liquidEtherVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const liquidEtherFragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uMouseVelocity;
uniform vec3 uColorA; // Deep Void (#030308)
uniform vec3 uColorB; // Primary Ether (Cyan #00f0ff)
uniform vec3 uColorC; // Secondary Ether (Violet #7c3aed)
uniform vec3 uColorD; // Shimmer Accent (Gold #f59e0b)
uniform float uViscosity;
uniform float uTurbulence;
uniform float uVorticity;
uniform vec2 uClickPos;
uniform float uClickTime;

varying vec2 vUv;

// Fast Simplex 2D Noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
   -0.577350269189626,
    0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Broad, silky smooth 3-octave FBM for organic liquid waves
float fbm(vec2 p) {
  float f = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 3; i++) {
    f += amp * snoise(p);
    p = p * 1.8 + vec2(0.08 * uTime, 0.06 * uTime);
    amp *= 0.5;
  }
  return f;
}

void main() {
  // Screen coordinates with aspect-ratio correction
  vec2 p = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);

  // Exact cursor position
  vec2 mousePos = (uMouse * uResolution.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);

  // Mouse fluid interaction & vortex wake
  float distToMouse = length(p - mousePos);
  float mouseInfluence = smoothstep(0.9, 0.0, distToMouse);
  vec2 mouseDir = (distToMouse > 0.001) ? normalize(p - mousePos) : vec2(0.0);
  vec2 vortex = vec2(-mouseDir.y, mouseDir.x) * mouseInfluence * (0.35 + uMouseVelocity * 0.9) * uVorticity;

  // Interactive Click Ripple Wave
  vec2 clickPosNorm = (uClickPos * uResolution.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
  float distToClick = length(p - clickPosNorm);
  float rippleRadius = uClickTime * 2.0;
  float rippleWidth = 0.35;
  float rippleIntensity = smoothstep(rippleWidth, 0.0, abs(distToClick - rippleRadius)) * exp(-uClickTime * 1.8);
  vec2 shockwave = (distToClick > 0.001) ? normalize(p - clickPosNorm) * rippleIntensity * 0.3 : vec2(0.0);

  // Silky large-scale domain warping (broad ethereal ribbons)
  vec2 coord = p * 0.55;
  float t = uTime * 0.12 * uViscosity;

  vec2 q = vec2(
    fbm(coord + vortex * 0.6 + shockwave + vec2(0.0, 0.0) + t * 0.25),
    fbm(coord - vortex * 0.6 + shockwave + vec2(3.2, 1.4) + t * 0.3)
  );

  vec2 r = vec2(
    fbm(coord + 1.2 * q + vec2(1.7, 9.2) + 0.08 * t),
    fbm(coord + 1.2 * q + vec2(8.3, 2.8) + 0.06 * t)
  );

  float f = fbm(coord + 1.1 * r * uTurbulence);

  // Soft luminous ether clouds against deep cosmic black
  // Keep deep void space dominant for crisp text readability
  vec3 col = uColorA;

  // Primary luminous fluid ribbons (cyan / emerald / pink)
  float ribbon1 = smoothstep(-0.25, 0.65, f);
  col = mix(col, uColorB, ribbon1 * 0.65);

  // Secondary ethereal currents (violet / blue)
  float ribbon2 = smoothstep(0.0, 0.75, length(q) * 0.8);
  col = mix(col, uColorC, ribbon2 * 0.5);

  // Subtle warm solar / star shimmer crests
  float shimmer = pow(clamp(f * ribbon1, 0.0, 1.0), 2.5) * 0.5;
  col = mix(col, uColorD, shimmer * 0.6);

  // Smooth click wave illumination
  col += uColorB * (rippleIntensity * 0.4);

  // Soft radial vignette to keep text pristine and center clear
  float vignette = smoothstep(1.8, 0.35, length(p));
  col *= vignette * 0.95;

  gl_FragColor = vec4(col, 0.95);
}
`;
