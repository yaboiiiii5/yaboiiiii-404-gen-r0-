export default function generate(THREE) {
  const root = new THREE.Group();

  // Create textures
  const boxTexture = createWoodenTexture(THREE);
  const sphereTexture = createRedKeychainTexture(THREE);
  const cylinderTexture = createCircularLensTexture(THREE);

  // Create materials
  const boxMaterial = new THREE.MeshStandardMaterial({ map: boxTexture, roughness: 0.2 });
  const sphereMaterial = new THREE.MeshStandardMaterial({ map: sphereTexture, roughness: 0.1 });
  const cylinderMaterial = new THREE.MeshStandardMaterial({ map: cylinderTexture, roughness: 0.3 });

  // Create geometries
  const boxGeometry = new THREE.BoxGeometry(2, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);

  // Create meshes
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

  // Position objects
  sphereMesh.position.y = 0.75;
  cylinderMesh.position.set(0, -0.5, 0);

  // Add to root
  root.add(boxMesh);
  root.add(sphereMesh);
  root.add(cylinderMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createWoodenTexture(THREE) {
  const size = 256;
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const r = 139 + 20 * Math.sin(x / 16) * Math.cos(y / 16);
    const g = 0 + 10 * Math.sin(x / 8) * Math.cos(y / 8);
    const b = 0 + 10 * Math.sin(x / 4) * Math.cos(y / 4);
    data[i * 3] = r;
    data[i * 3 + 1] = g;
    data[i * 3 + 2] = b;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return texture;
}

function createRedKeychainTexture(THREE) {
  const size = 256;
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const r = 255;
    const g = 0 + 10 * Math.sin(x / 8) * Math.cos(y / 8);
    const b = 0 + 10 * Math.sin(x / 4) * Math.cos(y / 4);
    data[i * 3] = r;
    data[i * 3 + 1] = g;
    data[i * 3 + 2] = b;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return texture;
}

function createCircularLensTexture(THREE) {
  const size = 256;
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    const x = i % size - size / 2;
    const y = Math.floor(i / size) - size / 2;
    const dist = Math.sqrt(x * x + y * y);
    const r = 255 * (1 - Math.min(dist / (size / 4), 1));
    const g = 0;
    const b = 0;
    data[i * 3] = r;
    data[i * 3 + 1] = g;
    data[i * 3 + 2] = b;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return texture;
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