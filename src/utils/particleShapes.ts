import * as THREE from 'three';

export type ShapeType =
  | 'cloud'
  | 'web'
  | 'grid'
  | 'wave'
  | 'spiral'
  | 'torus'
  | 'lattice'
  | 'network'
  | 'sphere'
  | 'explosion';

export function createParticleShapes(count: number) {
  const shapes: Record<ShapeType, Float32Array> = {
    cloud: new Float32Array(count * 3),
    web: new Float32Array(count * 3),
    grid: new Float32Array(count * 3),
    wave: new Float32Array(count * 3),
    spiral: new Float32Array(count * 3),
    torus: new Float32Array(count * 3),
    lattice: new Float32Array(count * 3),
    network: new Float32Array(count * 3),
    sphere: new Float32Array(count * 3),
    explosion: new Float32Array(count * 3),
  };

  const colors = new Float32Array(count * 3);
  const randomSpeeds = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const sizes = new Float32Array(count);

  // 1. CLOUD (Ambient ethereal universe)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = Math.pow(Math.random(), 0.6) * 16;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    shapes.cloud[i3] = r * Math.sin(phi) * Math.cos(theta);
    shapes.cloud[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    shapes.cloud[i3 + 2] = r * Math.cos(phi) * 0.8;

    // Speeds & phases
    randomSpeeds[i3] = (Math.random() - 0.5) * 0.4;
    randomSpeeds[i3 + 1] = (Math.random() - 0.5) * 0.4;
    randomSpeeds[i3 + 2] = (Math.random() - 0.5) * 0.4;
    phases[i] = Math.random() * Math.PI * 2;
    sizes[i] = 0.8 + Math.random() * 2.4;

    // Palette: Cyan, Electric Violet, Soft Blue-White, Ruby accent
    const p = Math.random();
    if (p < 0.45) {
      // Electric Cyan
      colors[i3] = 0.0;
      colors[i3 + 1] = 0.94;
      colors[i3 + 2] = 1.0;
    } else if (p < 0.8) {
      // Electric Violet
      colors[i3] = 0.62;
      colors[i3 + 1] = 0.35;
      colors[i3 + 2] = 0.98;
    } else if (p < 0.95) {
      // Soft Starlight White
      colors[i3] = 0.92;
      colors[i3 + 1] = 0.95;
      colors[i3 + 2] = 1.0;
    } else {
      // Ruby Amber Accent
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.25;
      colors[i3 + 2] = 0.45;
    }
  }

  // 2. "W E B" TYPOGRAPHY SHAPE
  // Generate coordinates sampled across the letters W, E, B in 3D space
  const webLetterPoints: { x: number; y: number; z: number }[] = [];
  const samplesPerLetter = Math.floor(count / 3);

  // Letter 'W' (centered at x = -6)
  for (let i = 0; i < samplesPerLetter; i++) {
    const t = Math.random();
    const branch = Math.floor(Math.random() * 4);
    let lx = 0, ly = 0;
    if (branch === 0) {
      // Down stroke 1
      lx = -2 + t * 0.7;
      ly = 2 - t * 4;
    } else if (branch === 1) {
      // Up stroke 1
      lx = -1.3 + t * 0.7;
      ly = -2 + t * 3.2;
    } else if (branch === 2) {
      // Down stroke 2
      lx = -0.6 + t * 0.7;
      ly = 1.2 - t * 3.2;
    } else {
      // Up stroke 2
      lx = 0.1 + t * 0.7;
      ly = -2 + t * 4;
    }
    webLetterPoints.push({
      x: lx * 1.5 - 4.5 + (Math.random() - 0.5) * 0.3,
      y: ly * 1.3 + (Math.random() - 0.5) * 0.3,
      z: (Math.random() - 0.5) * 0.8,
    });
  }

  // Letter 'E' (centered at x = 0)
  for (let i = 0; i < samplesPerLetter; i++) {
    const branch = Math.floor(Math.random() * 4);
    const t = Math.random();
    let lx = 0, ly = 0;
    if (branch === 0) {
      // Spine
      lx = -1.2;
      ly = -2 + t * 4;
    } else if (branch === 1) {
      // Top bar
      lx = -1.2 + t * 2.2;
      ly = 2;
    } else if (branch === 2) {
      // Middle bar
      lx = -1.2 + t * 1.7;
      ly = 0.1;
    } else {
      // Bottom bar
      lx = -1.2 + t * 2.2;
      ly = -2;
    }
    webLetterPoints.push({
      x: lx * 1.4 + (Math.random() - 0.5) * 0.3,
      y: ly * 1.3 + (Math.random() - 0.5) * 0.3,
      z: (Math.random() - 0.5) * 0.8,
    });
  }

  // Letter 'B' (centered at x = 4.5)
  const remaining = count - webLetterPoints.length;
  for (let i = 0; i < remaining; i++) {
    const branch = Math.floor(Math.random() * 5);
    const t = Math.random();
    let lx = 0, ly = 0;
    if (branch === 0) {
      // Spine
      lx = -1.2;
      ly = -2 + t * 4;
    } else if (branch === 1) {
      // Top loop arc
      const angle = (t - 0.5) * Math.PI;
      lx = -0.3 + Math.cos(angle) * 1.1;
      ly = 1.0 + Math.sin(angle) * 1.0;
    } else if (branch === 2) {
      // Bottom loop arc
      const angle = (t - 0.5) * Math.PI;
      lx = -0.3 + Math.cos(angle) * 1.25;
      ly = -1.0 + Math.sin(angle) * 1.0;
    } else if (branch === 3) {
      // Top cap
      lx = -1.2 + t * 1.0;
      ly = 2.0;
    } else {
      // Middle connector
      lx = -1.2 + t * 1.0;
      ly = 0.0;
    }
    webLetterPoints.push({
      x: lx * 1.4 + 4.5 + (Math.random() - 0.5) * 0.3,
      y: ly * 1.3 + (Math.random() - 0.5) * 0.3,
      z: (Math.random() - 0.5) * 0.8,
    });
  }

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const pt = webLetterPoints[i] || { x: 0, y: 0, z: 0 };
    shapes.web[i3] = pt.x;
    shapes.web[i3 + 1] = pt.y;
    shapes.web[i3 + 2] = pt.z;
  }

  // 3. GRID (Rigid early HTML table matrix)
  const cols = Math.floor(Math.sqrt(count * 1.6));
  const rows = Math.ceil(count / cols);
  const spacingX = 14 / cols;
  const spacingY = 10 / rows;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const col = i % cols;
    const row = Math.floor(i / cols);
    shapes.grid[i3] = (col - cols / 2) * spacingX;
    shapes.grid[i3 + 1] = (row - rows / 2) * spacingY;
    shapes.grid[i3 + 2] = ((col * row) % 7) * 0.15 - 0.5;
  }

  // 4. WAVE (Fluid CSS responsive waves)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const u = (i / count) * Math.PI * 8;
    const v = ((i % 120) / 120 - 0.5) * 6;
    const x = (i / count - 0.5) * 20;
    const y = Math.sin(u * 1.2) * 2.2 + Math.cos(v * 2.5) * 0.8;
    const z = Math.cos(u * 0.8) * 3.5 + v * 0.5;
    shapes.wave[i3] = x;
    shapes.wave[i3 + 1] = y;
    shapes.wave[i3 + 2] = z;
  }

  // 5. SPIRAL (Kinetic motion vortex)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const angle = i * 0.04;
    const rad = 0.2 + Math.sqrt(i) * 0.11;
    const height = (i / count - 0.5) * 10;
    shapes.spiral[i3] = Math.cos(angle) * rad;
    shapes.spiral[i3 + 1] = height;
    shapes.spiral[i3 + 2] = Math.sin(angle) * rad;
  }

  // 6. TORUS KNOT (3D spatial depth)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const p = 2;
    const q = 3;
    const t = (i / count) * Math.PI * 2 * 3;
    const r = 3.5 + Math.cos(q * t) * 1.5;
    shapes.torus[i3] = r * Math.cos(p * t);
    shapes.torus[i3 + 1] = r * Math.sin(p * t);
    shapes.torus[i3 + 2] = -Math.sin(q * t) * 2.5 + (Math.random() - 0.5) * 0.6;
  }

  // 6.5 LATTICE (WebGL Silicon GPU Computing Matrix)
  const latSide = Math.max(2, Math.floor(Math.cbrt(count)));
  const latStep = 10.0 / latSide;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const ix = i % latSide;
    const iy = Math.floor(i / latSide) % latSide;
    const iz = Math.floor(i / (latSide * latSide)) % latSide;
    const x = (ix - latSide / 2) * latStep;
    const y = (iy - latSide / 2) * latStep;
    const z = (iz - latSide / 2) * latStep * 0.8;
    const ripple = Math.sin(Math.sqrt(x * x + y * y) * 1.2) * 0.6;
    shapes.lattice[i3] = x;
    shapes.lattice[i3 + 1] = y + ripple;
    shapes.lattice[i3 + 2] = z;
  }

  // 7. NETWORK (Neural synapses)
  const nodeCount = 36;
  const nodes: { x: number; y: number; z: number }[] = [];
  for (let n = 0; n < nodeCount; n++) {
    nodes.push({
      x: (Math.random() - 0.5) * 12,
      y: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 8,
    });
  }
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const nA = Math.floor(Math.random() * nodeCount);
    const nB = (nA + 1 + Math.floor(Math.random() * (nodeCount - 1))) % nodeCount;
    const t = Math.random();
    const nodeA = nodes[nA];
    const nodeB = nodes[nB];
    shapes.network[i3] = THREE.MathUtils.lerp(nodeA.x, nodeB.x, t) + (Math.random() - 0.5) * 0.25;
    shapes.network[i3 + 1] = THREE.MathUtils.lerp(nodeA.y, nodeB.y, t) + (Math.random() - 0.5) * 0.25;
    shapes.network[i3 + 2] = THREE.MathUtils.lerp(nodeA.z, nodeB.z, t) + (Math.random() - 0.5) * 0.25;
  }

  // 8. SPHERE (Singularity core)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 4.2 + (Math.random() - 0.5) * 0.6;
    shapes.sphere[i3] = r * Math.sin(phi) * Math.cos(theta);
    shapes.sphere[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    shapes.sphere[i3 + 2] = r * Math.cos(phi);
  }

  // 9. EXPLOSION (Supernova expansion outward)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const dir = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    const distance = 16.0 + Math.random() * 32.0;
    shapes.explosion[i3] = dir.x * distance;
    shapes.explosion[i3 + 1] = dir.y * distance;
    shapes.explosion[i3 + 2] = dir.z * distance;
  }

  return {
    shapes,
    colors,
    randomSpeeds,
    phases,
    sizes,
  };
}
