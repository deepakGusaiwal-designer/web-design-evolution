export const liquidVertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uDistortion;
uniform float uWaveStrength;
uniform float uDisintegration;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vElevation;

// Simplex-like noise helper
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vUv = uv;
  vec3 pos = position;

  // Wave harmonic equations
  float wave1 = sin(pos.x * 2.5 + uTime * 1.5) * cos(pos.y * 2.5 + uTime * 1.2);
  float wave2 = sin(pos.x * 5.0 - uTime * 2.0) * 0.4;
  float noise = snoise(vec3(pos.xy * 1.2, uTime * 0.4)) * 0.7;

  // Mouse ripple interaction
  float distToMouse = distance(uv, uMouse);
  float mouseRipple = sin(distToMouse * 25.0 - uTime * 8.0) * exp(-distToMouse * 5.0) * uWaveStrength;

  float elevation = (wave1 + wave2 + noise) * uDistortion * 0.7 + mouseRipple * 1.2;

  // Disintegration scatter
  if (uDisintegration > 0.01) {
    float scatterNoise = snoise(vec3(pos.xy * 8.0, 0.0));
    pos.z += scatterNoise * uDisintegration * 4.0;
    pos.x += snoise(vec3(pos.yz * 8.0, 1.0)) * uDisintegration * 2.0;
  }

  pos.z += elevation;
  vElevation = elevation;
  vPosition = pos;
  vNormal = normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const liquidFragmentShader = `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uDisintegration;

varying vec2 vUv;
varying vec3 vPosition;
varying float vElevation;

void main() {
  // Disintegration threshold
  if (uDisintegration > 0.05) {
    float pattern = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
    if (pattern < (uDisintegration - 0.05) * 1.2) {
      discard;
    }
  }

  // Color blending across elevation height
  float t = smoothstep(-0.8, 1.2, vElevation);
  vec3 baseColor = mix(uColorA, uColorB, t);

  // Subtle wireframe grid overlay
  vec2 grid = abs(fract(vUv * 30.0 - 0.5) - 0.5) / fwidth(vUv * 30.0);
  float line = min(grid.x, grid.y);
  float wire = 1.0 - min(line, 1.0);

  // Fresnel edge glow
  vec3 viewDir = normalize(-vPosition);
  float fresnel = pow(1.0 - max(dot(viewDir, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);

  vec3 finalColor = mix(baseColor, vec3(0.0, 0.94, 1.0), fresnel * 0.8);
  finalColor += vec3(wire * 0.25);

  float alpha = 0.85 + fresnel * 0.15;
  if (uDisintegration > 0.0) {
    alpha *= (1.0 - uDisintegration * 0.8);
  }

  gl_FragColor = vec4(finalColor, alpha);
}
`;
