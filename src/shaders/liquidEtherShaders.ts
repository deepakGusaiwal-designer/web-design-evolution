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
uniform vec3 uColorA; // Deep Void / Background
uniform vec3 uColorB; // Primary Ether (Cyan / Green / Pink)
uniform vec3 uColorC; // Secondary Ether (Violet / Blue)
uniform vec3 uColorD; // Accent Shimmer (Gold / Amber / White)
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
    0.211324865405187,  // (3.0-sqrt(3.0))/6.0
    0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
   -0.577350269189626,  // -1.0 + 2.0 * C.x
    0.024390243902439   // 1.0 / 41.0
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

// 3-Octave Lightweight FBM for buttery 60-120fps
float fbm(vec2 p) {
  float f = 0.0;
  float w = 0.52;
  mat2 rot = mat2(cos(0.52), sin(0.52), -sin(0.52), cos(0.52));
  for (int i = 0; i < 3; i++) {
    f += w * snoise(p);
    p = rot * p * 2.05 + vec2(0.12 * uTime, 0.1 * uTime);
    w *= 0.48;
  }
  return f;
}

void main() {
  // Exact aspect-ratio normalized coordinates
  vec2 p = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);

  // Exact aspect-corrected mouse position (uMouse is in [0, 1] range)
  vec2 mousePos = (uMouse * uResolution.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);

  // Mouse fluid interaction & vortex wake
  float distToMouse = length(p - mousePos);
  float mouseInfluence = smoothstep(0.9, 0.0, distToMouse);

  // Smooth vortex curl from cursor velocity
  vec2 mouseDir = (distToMouse > 0.001) ? normalize(p - mousePos) : vec2(0.0);
  vec2 vortex = vec2(-mouseDir.y, mouseDir.x) * mouseInfluence * (0.45 + uMouseVelocity * 1.1) * uVorticity;

  // Interactive Click Ripple Wave
  vec2 clickPosNorm = (uClickPos * uResolution.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
  float distToClick = length(p - clickPosNorm);
  float rippleRadius = uClickTime * 2.2;
  float rippleWidth = 0.28;
  float rippleIntensity = smoothstep(rippleWidth, 0.0, abs(distToClick - rippleRadius)) * exp(-uClickTime * 2.0);
  vec2 shockwave = (distToClick > 0.001) ? normalize(p - clickPosNorm) * rippleIntensity * 0.35 : vec2(0.0);

  // Fluid domain warping
  float t = uTime * 0.2 * uViscosity;
  vec2 q = vec2(
    fbm(p + vortex + shockwave + t * 0.35),
    fbm(p + vec2(4.8, 1.6) - vortex + shockwave + t * 0.4)
  );

  vec2 r = vec2(
    fbm(p + 3.2 * q + vec2(1.7, 8.4) + 0.1 * t),
    fbm(p + 3.2 * q + vec2(7.3, 2.5) + 0.08 * t)
  );

  float f = fbm(p + 3.0 * r * uTurbulence);

  // Luminous chromatic color palette
  vec3 col = mix(uColorA, uColorB, clamp((f * f) * 3.8, 0.0, 1.0));
  col = mix(col, uColorC, clamp(length(q) * 0.95, 0.0, 1.0));
  col = mix(col, uColorD, clamp(length(r.x) * 0.85, 0.0, 1.0) * 0.65);

  // Surface fluid caustics / specular highlights
  float caustic = pow(clamp(f * 1.45, 0.0, 1.0), 3.2) * 0.4;
  col += vec3(caustic * 0.85, caustic * 1.05, caustic * 1.25);

  // Shockwave crest glow
  col += vec3(rippleIntensity * 0.35, rippleIntensity * 0.45, rippleIntensity * 0.55);

  // Subtle radial vignette to preserve text contrast and elegance
  float vignette = smoothstep(1.9, 0.35, length(p));
  col *= vignette * 0.92;

  gl_FragColor = vec4(col, 0.88);
}
`;
