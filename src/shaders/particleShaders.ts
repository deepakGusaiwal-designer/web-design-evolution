export const particleVertexShader = `
uniform float uTime;
uniform float uProgress;
uniform vec3 uMouse;
uniform float uMouseRadius;
uniform float uMouseForce;
uniform float uAttractMode; // 0.0 = repel, 1.0 = attract
uniform vec3 uRippleCenter;
uniform float uRippleTime;
uniform float uRippleStrength;
uniform float uScrollVelocity;
uniform float uDevicePixelRatio;

attribute vec3 targetPos;
attribute vec3 randomSpeed;
attribute float phase;
attribute float size;
attribute vec3 customColor;

varying vec3 vColor;
varying float vAlpha;
varying float vDepth;

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
  vColor = customColor;

  // 1. Smooth interpolation between current and target shape
  vec3 basePos = mix(position, targetPos, uProgress);

  // 2. Organic breathing & noise displacement
  float noiseTime = uTime * 0.4 + phase;
  vec3 noiseOffset = vec3(
    snoise(basePos * 0.15 + vec3(noiseTime, 0.0, 0.0)),
    snoise(basePos * 0.15 + vec3(0.0, noiseTime, 0.0)),
    snoise(basePos * 0.15 + vec3(0.0, 0.0, noiseTime))
  ) * 0.45;

  // Drift based on randomSpeed
  vec3 drift = randomSpeed * sin(uTime + phase) * 0.3;
  vec3 finalPos = basePos + noiseOffset + drift;

  // 3. Mouse interaction (Repulsion or Attraction)
  vec3 dirToMouse = finalPos - uMouse;
  float distToMouse = length(dirToMouse);
  if (distToMouse < uMouseRadius && distToMouse > 0.001) {
    float influence = 1.0 - smoothstep(0.0, uMouseRadius, distToMouse);
    vec3 forceDir = normalize(dirToMouse);
    if (uAttractMode > 0.5) {
      // Pull toward cursor
      finalPos -= forceDir * (influence * uMouseForce * 1.8);
    } else {
      // Push away from cursor
      finalPos += forceDir * (influence * uMouseForce * 2.2);
    }
  }

  // 4. Click Shockwave / Ripple effect
  if (uRippleStrength > 0.01 && uRippleTime >= 0.0) {
    float waveSpeed = 14.0;
    float currentRadius = uRippleTime * waveSpeed;
    float distToRipple = distance(finalPos, uRippleCenter);
    float ringThickness = 2.2;
    float ringDist = abs(distToRipple - currentRadius);

    if (ringDist < ringThickness) {
      float wave = sin((ringDist / ringThickness) * 3.14159) * uRippleStrength;
      vec3 rippleDir = normalize(finalPos - uRippleCenter + vec3(0.001));
      finalPos += rippleDir * wave * 1.5;
    }
  }

  // 5. Scroll Velocity stretch
  finalPos.y += sin(uTime * 3.0 + finalPos.x) * (uScrollVelocity * 0.08);

  // Projection
  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Depth attenuation for particle point size
  float depth = -mvPosition.z;
  vDepth = depth;
  gl_PointSize = (size * 52.0 * uDevicePixelRatio) / max(depth, 1.0);

  // Soft fade when too close to camera or far
  vAlpha = smoothstep(0.5, 4.0, depth) * (1.0 - smoothstep(28.0, 48.0, depth));
}
`;

export const particleFragmentShader = `
uniform float uColorVibrancy; // 0.0 = black & white, 1.0 = full color spectrum

varying vec3 vColor;
varying float vAlpha;
varying float vDepth;

void main() {
  // Center coordinate -0.5 to 0.5
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);

  if (dist > 0.5) {
    discard;
  }

  // Soft glowing exponential falloff
  float intensity = exp(-dist * dist * 12.0);
  float core = smoothstep(0.18, 0.0, dist);

  vec3 glowColor = mix(vColor, vec3(1.0, 1.0, 1.0), core * 0.7);

  // High fidelity monochrome conversion for the early web era
  float gray = dot(glowColor, vec3(0.299, 0.587, 0.114));
  vec3 bwColor = vec3(gray * 1.25);

  // Smooth blend between monochrome and full color spectrum
  vec3 finalColor = mix(bwColor, glowColor, uColorVibrancy);

  gl_FragColor = vec4(finalColor, intensity * vAlpha);
}
`;
