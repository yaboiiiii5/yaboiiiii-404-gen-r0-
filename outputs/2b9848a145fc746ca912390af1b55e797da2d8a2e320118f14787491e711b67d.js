export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const cylinderMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFD700,
    metalness: 0.2,
    roughness: 0.3,
    map: createRidgedTexture(THREE)
  });

  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    metalness: 0.2,
    roughness: 0.3
  });

  // Create cylinders
  for (let i = 0; i < 12; i++) {
    const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 10, 32);
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(0, i * 10.5, 0); // Stacking cylinders with a small gap
    root.add(cylinder);
  }

  // Create cube
  const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(0, 63, 0); // Positioning cube at the end of cylinders
  root.add(cube);

  fitToUnitCube(THREE, root);
  return root;
}

function createRidgedTexture(THREE) {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  const seed = 2175486791;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value = noise(x / 32, y / 32, seed) * 255;
      const index = (y * size + x) * 4;
      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value;
      data[index + 3] = 255; // Alpha channel
    }
  }

  const texture = new THREE.DataTexture(data, size, size);
  texture.needsUpdate = true;
  return texture;
}

function noise(x, y, seed) {
  const s = Math.sin;
  x = (x * 12.9898 + y * 78.233 + seed) % 1;
  y = (x * 12.9898 + y * 78.233 + seed) % 1;
  return s(x * y * 43758.5453);
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