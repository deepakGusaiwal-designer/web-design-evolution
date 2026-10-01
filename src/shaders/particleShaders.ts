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
uniform float uHeroDarkness; // 0.0 = complete darkness, 1.0 = fully visible

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
  float easeProgress = smoothstep(0.0, 1.0, uProgress);
  vec3 basePos = mix(position, targetPos, easeProgress);

  // 2. Organic breathing & noise displacement
  float noiseTime = uTime * 0.35 + phase;
  vec3 noiseOffset = vec3(
    snoise(basePos * 0.12 + vec3(noiseTime, 0.0, 0.0)),
    snoise(basePos * 0.12 + vec3(0.0, noiseTime, 0.0)),
    snoise(basePos * 0.12 + vec3(0.0, 0.0, noiseTime))
  ) * 0.35;

  // Drift based on randomSpeed
  vec3 drift = randomSpeed * sin(uTime * 0.8 + phase) * 0.25;
  vec3 finalPos = basePos + noiseOffset + drift;

  // 3. Mouse interaction (Repulsion or Attraction)
  vec3 dirToMouse = finalPos - uMouse;
  float distToMouse = length(dirToMouse);
  if (distToMouse < uMouseRadius && distToMouse > 0.001) {
    float influence = 1.0 - smoothstep(0.0, uMouseRadius, distToMouse);
    influence = influence * influence;
    vec3 forceDir = normalize(dirToMouse);
    if (uAttractMode > 0.5) {
      // Pull toward cursor
      finalPos -= forceDir * (influence * uMouseForce * 2.2);
    } else {
      // Push away from cursor
      finalPos += forceDir * (influence * uMouseForce * 2.8);
    }
  }

  // 4. Smooth, continuous ripple shockwave (zero glitches or discontinuous pops)
  if (uRippleStrength > 0.001 && uRippleTime >= 0.0) {
    float waveSpeed = 18.0;
    float currentRadius = uRippleTime * waveSpeed;
    float distToRipple = distance(finalPos, uRippleCenter);
    float diff = distToRipple - currentRadius;
    float waveWidth = 3.6;

    // Smooth Gaussian envelope prevents abrupt boundary clipping
    float envelope = exp(-(diff * diff) / (waveWidth * waveWidth));
    float distanceDecay = 1.0 / (1.0 + currentRadius * 0.12);
    float displacement = sin(diff * 1.3) * envelope * uRippleStrength * distanceDecay * 1.0;

    vec3 rippleDir = normalize(finalPos - uRippleCenter + vec3(0.0001));
    finalPos += rippleDir * displacement;
  }

  // 5. Scroll Velocity stretch
  finalPos.y += sin(uTime * 2.5 + finalPos.x * 0.5) * (uScrollVelocity * 0.06);
  finalPos.z += (uScrollVelocity * 0.03) * (sin(finalPos.y + uTime) * 0.5);

  // Projection
  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Depth attenuation for particle point size with clamping
  float depth = -mvPosition.z;
  vDepth = depth;
  float rawSize = (size * 48.0 * uDevicePixelRatio) / max(depth, 1.0);
  gl_PointSize = clamp(rawSize, 1.5, 60.0);

  // Soft fade when too close to camera or far, plus hero darkness fade
  float depthAlpha = smoothstep(0.4, 3.5, depth) * (1.0 - smoothstep(30.0, 52.0, depth));
  vAlpha = depthAlpha * uHeroDarkness;
}
`;

export const particleFragmentShader = `
uniform float uColorVibrancy; // 0.0 = black & white, 1.0 = full color spectrum

varying vec3 vColor;
varying float vAlpha;
varying float vDepth;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);

  if (dist > 0.5) {
    discard;
  }

  // Soft starlight Gaussian core with smooth outer edge decay
  float softEdge = smoothstep(0.5, 0.15, dist);
  float core = smoothstep(0.18, 0.0, dist);
  float glow = exp(-dist * dist * 10.0);
  float intensity = glow * softEdge;

  // Bright starlight core with vibrant chromatic rim
  vec3 glowColor = mix(vColor, vec3(1.0, 1.0, 1.0), core * 0.75);

  // High-fidelity monochrome conversion for the early web era (Rec. 709 luminance)
  float luma = dot(glowColor, vec3(0.2126, 0.7152, 0.0722));
  vec3 bwColor = vec3(luma * 1.3);

  // Smooth blend between monochrome and full color spectrum
  vec3 finalColor = mix(bwColor, glowColor, uColorVibrancy);

  gl_FragColor = vec4(finalColor, intensity * vAlpha);
}
`;
