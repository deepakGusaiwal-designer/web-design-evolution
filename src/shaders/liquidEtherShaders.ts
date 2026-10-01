export const liquidEtherVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const liquidEtherFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uMouseVelocity;
uniform vec3 uColorA; // Deep Void / Indigo
uniform vec3 uColorB; // Radiant Cyan Ether
uniform vec3 uColorC; // Ethereal Violet
uniform vec3 uColorD; // Luminescent Amber Gold
uniform float uViscosity;
uniform float uTurbulence;
uniform float uVorticity;

varying vec2 vUv;
varying vec3 vPosition;

// 2D Simplex Noise Helper
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Fractal Brownian Motion (Fluid Ether layers)
float fbm(vec2 p) {
  float f = 0.0;
  float w = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; i++) {
    f += w * snoise(p);
    p = rot * p * 2.0 + vec2(0.15 * uTime, 0.12 * uTime);
    w *= 0.5;
  }
  return f;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);

  // Mouse fluid interaction & vortex wake
  vec2 mouseNorm = (uMouse * 2.0 - 1.0);
  float distToMouse = length(p - mouseNorm);
  float mouseInfluence = smoothstep(1.2, 0.0, distToMouse);

  // Vortical displacement from cursor velocity
  vec2 mouseDir = normalize(p - mouseNorm + vec2(0.0001));
  vec2 vortex = vec2(-mouseDir.y, mouseDir.x) * mouseInfluence * (0.4 + uMouseVelocity * 0.8) * uVorticity;

  // Domain warping for liquid ether simulation
  float t = uTime * 0.25 * uViscosity;
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + vortex + t * 0.4),
    fbm(p + vec2(5.2, 1.3) - vortex + t * 0.5)
  );

  vec2 r = vec2(
    fbm(p + 4.0 * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(p + 4.0 * q + vec2(8.3, 2.8) + 0.12 * t)
  );

  float f = fbm(p + 4.0 * r * uTurbulence);

  // Ethereal chromatic color palette interpolation
  vec3 col = mix(uColorA, uColorB, clamp((f * f) * 4.0, 0.0, 1.0));
  col = mix(col, uColorC, clamp(length(q), 0.0, 1.0));
  col = mix(col, uColorD, clamp(length(r.x), 0.0, 1.0) * 0.6);

  // High-frequency liquid surface shimmer
  float caustic = pow(clamp(f * 1.5, 0.0, 1.0), 3.5) * 0.45;
  col += vec3(caustic * 0.9, caustic * 1.1, caustic * 1.2);

  // Subtle radial vignette to preserve text contrast
  float vignette = smoothstep(1.8, 0.4, length(p));
  col *= vignette * 0.85;

  gl_FragColor = vec4(col, 0.82);
}
`;
