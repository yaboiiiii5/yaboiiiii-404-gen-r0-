export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.2,
    transparent: true,
    opacity: 0.95
  });

  // Create bowl geometry and mesh
  const bowlGeometry = createBowlGeometry(THREE);
  const bowlMesh = new THREE.Mesh(bowlGeometry, glassMaterial);
  root.add(bowlMesh);

  // Create stem geometry and mesh
  const stemGeometry = createStemGeometry(THREE);
  const stemMesh = new THREE.Mesh(stemGeometry, glassMaterial);
  root.add(stemMesh);

  // Create base geometry and mesh
  const baseGeometry = createBaseGeometry(THREE);
  const baseMesh = new THREE.Mesh(baseGeometry, glassMaterial);
  root.add(baseMesh);

  // Apply etched pattern to bowl
  applyEtchedPattern(THREE, bowlMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createBowlGeometry(THREE) {
  const geometry = new THREE.CylinderGeometry(0.5, 1, 1, 32, 1, true);
  geometry.translate(0, 0.75, 0); // Position bowl on top
  return geometry;
}

function createStemGeometry(THREE) {
  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 32, 1);
  geometry.translate(0, 0.15, 0); // Position stem in middle
  return geometry;
}

function createBaseGeometry(THREE) {
  const geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32, 1);
  geometry.translate(0, -0.45, 0); // Position base at bottom
  return geometry;
}

function applyEtchedPattern(THREE, mesh) {
  const size = 512;
  const data = new Uint8Array(size * size * 3);

  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const patternValue = etchedPattern(x, y, size);
    data[i * 3] = patternValue;
    data[i * 3 + 1] = patternValue;
    data[i * 3 + 2] = patternValue;
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;

  mesh.material.map = texture;
}

function etchedPattern(x, y, size) {
  const scale = 10;
  const offsetX = x / scale;
  const offsetY = y / scale;
  const noiseValue = simplexNoise2D(offsetX, offsetY);
  return Math.floor((noiseValue + 1) * 128); // Map noise value to 0-255
}

function simplexNoise2D(xin, yin) {
  const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

  let n0, n1, n2; // Noise contributions from the three corners
  let s = (xin + yin) * F2;
  let i = Math.floor(xin + s);
  let j = Math.floor(yin + s);
  let t = (i + j) * G2;
  let X0 = i - t; // Skew the cell origin back to (x,y)
  let Y0 = j - t;
  let x0 = xin - X0; // The x,y distances from the cell origin
  let y0 = yin - Y0;

  // For the 2D case, the simplex shape is an equilateral triangle.
  // Determine which simplex we are in.
  let i1, j1;
  if (x0 > y0) {
    i1 = 1; j1 = 0; // Lower triangle, XY order: (0,0)->(1,0)->(1,1)
  } else {
    i1 = 0; j1 = 1; // Upper triangle, YX order: (0,0)->(0,1)->(1,1)
  }

  let x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
  let y1 = y0 - j1 + G2;
  let x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
  let y2 = y0 - 1.0 + 2.0 * G2;

  const seed = 2175486791;
  const permMod12 = [seed % 12, (seed + 1) % 12, (seed + 2) % 12, (seed + 3) % 12, (seed + 4) % 12, (seed + 5) % 12,
                     (seed + 6) % 12, (seed + 7) % 12, (seed + 8) % 12, (seed + 9) % 12, (seed + 10) % 12, (seed + 11) % 12];

  // Work out the hashed gradient indices of the three simplex corners
  let ii = i & 255;
  let jj = j & 255;
  let gi0 = permMod12[ii + permMod12[jj]] % 12;
  let gi1 = permMod12[ii + i1 + permMod12[jj + j1]] % 12;
  let gi2 = permMod12[ii + 1 + permMod12[jj + 1]] % 12;

  // Calculate the contribution from the three corners
  t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) {
    t0 *= t0;
    n0 = t0 * t0 * dot(grad3[gi0], x0, y0); // (x,y) of grad3 used for 2D gradient
  } else {
    n0 = 0.0;
  }

  t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) {
    t1 *= t1;
    n1 = t1 * t1 * dot(grad3[gi1], x1, y1);
  } else {
    n1 = 0.0;
  }

  t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) {
    t2 *= t2;
    n2 = t2 * t2 * dot(grad3[gi2], x2, y2);
  } else {
    n2 = 0.0;
  }

  // Add contributions from each corner to get the final noise value.
  return 70.0 * (n0 + n1 + n2);
}

function dot(g, x, y) {
  return g[0] * x + g[1] * y;
}

const grad3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
];

function fitToUnitCube(THREE, root) {
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size); box.getCenter(center);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 0.95 / maxDim;
  root.scale.setScalar(scale);
  root.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
}