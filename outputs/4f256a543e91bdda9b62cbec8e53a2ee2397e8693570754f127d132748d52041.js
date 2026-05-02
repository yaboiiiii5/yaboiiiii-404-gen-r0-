export default function generate(THREE) {
  const root = new THREE.Group();

  // Helper function to create a rusted texture
  function createRustedTexture(width, height) {
    const size = width * height;
    const data = new Uint8Array(size * 3);
    for (let i = 0; i < size; i++) {
      const x = i % width;
      const y = Math.floor(i / width);
      const noise = perlin2(x / width, y / height) * 128 + 128;
      data[i * 3] = Math.min(255, noise - 50); // Red
      data[i * 3 + 1] = Math.min(255, noise - 70); // Green
      data[i * 3 + 2] = Math.min(255, noise - 90); // Blue
    }
    const texture = new THREE.DataTexture(data, width, height, THREE.RGBFormat);
    texture.needsUpdate = true;
    return texture;
  }

  // Helper function for 2D Perlin Noise
  function perlin2(x, y) {
    const X = Math.floor(x), Y = Math.floor(y);
    const xf = x - X, yf = y - Y;
    const u = fade(xf), v = fade(yf);
    const n00 = grad(permutation[X & 255] + permutation[Y & 255], xf, yf);
    const n01 = grad(permutation[X & 255] + permutation[Y + 1 & 255], xf, yf - 1);
    const n10 = grad(permutation[X + 1 & 255] + permutation[Y & 255], xf - 1, yf);
    const n11 = grad(permutation[X + 1 & 255] + permutation[Y + 1 & 255], xf - 1, yf - 1);
    return lerp(lerp(n00, n10, u), lerp(n01, n11, u), v);
  }

  // Helper function for Perlin Noise fade
  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  // Helper function for Perlin Noise gradient
  function grad(hash, x, y) {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 2 ? y : (h === 5 || h === 7) ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  // Permutation table for Perlin Noise
  const permutation = [];
  for (let i = 0; i < 256; i++) {
    permutation.push(i);
  }
  for (let i = 255; i > 0; i--) {
    const j = Math.floor((i + 1) * 2175486791 % (i + 1));
    [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
  }
  for (let i = 0; i < 256; i++) {
    permutation.push(permutation[i]);
  }

  // Helper function for linear interpolation
  function lerp(a, b, t) {
    return a + t * (b - a);
  }

  // Create rusted texture
  const rustedTexture = createRustedTexture(256, 256);

  // Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B0000,
    metalness: 0.7,
    roughness: 0.9,
    map: rustedTexture
  });
  const tipMaterial = new THREE.MeshStandardMaterial({
    color: 0x808000,
    metalness: 0.7,
    roughness: 0.9,
    map: rustedTexture
  });
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080,
    metalness: 0.7,
    roughness: 0.9,
    map: rustedTexture
  });

  // Geometry and Meshes
  const bodyGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  bodyMesh.position.y = 1;
  root.add(bodyMesh);

  const tipGeometry = new THREE.ConeGeometry(0.5, 1, 32);
  const tipMesh = new THREE.Mesh(tipGeometry, tipMaterial);
  tipMesh.position.y = 2.5;
  root.add(tipMesh);

  const baseGeometry = new THREE.BoxGeometry(2, 0.5, 2);
  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
  baseMesh.position.y = -0.25;
  root.add(baseMesh);

  fitToUnitCube(THREE, root);
  return root;
}

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