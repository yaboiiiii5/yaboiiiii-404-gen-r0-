export default function generate(THREE) {
  const root = new THREE.Group();

  // Create textures
  const woodTexture = createWoodTexture(THREE);
  const yarnTexture = createYarnTexture(THREE);

  // Create materials
  const spoolMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000, roughness: 0.2, metalness: 0.3, map: woodTexture });
  const standMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.2, metalness: 0.3, map: woodTexture });
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000, roughness: 0.2, metalness: 0.3, map: yarnTexture });

  // Create geometries
  const spoolGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
  const standGeometry = new THREE.BoxGeometry(1.5, 0.2, 1.5);
  const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8);

  // Create meshes
  const spoolMesh = new THREE.Mesh(spoolGeometry, spoolMaterial);
  const standMesh = new THREE.Mesh(standGeometry, standMaterial);
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);

  // Position and scale objects
  spoolMesh.position.set(0, 1.2, 0); // Spool on top of the stand
  handleMesh.position.set(0, 1.6, 0); // Handle attached to the spool

  // Add meshes to root group
  root.add(spoolMesh);
  root.add(standMesh);
  root.add(handleMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createWoodTexture(THREE) {
  const size = 512;
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const r = 139 + 50 * Math.sin(x / 20) * Math.cos(y / 20);
    const g = 85 + 40 * Math.sin(x / 15) * Math.cos(y / 15);
    const b = 61 + 30 * Math.sin(x / 10) * Math.cos(y / 10);
    data[i * 3] = r;
    data[i * 3 + 1] = g;
    data[i * 3 + 2] = b;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return texture;
}

function createYarnTexture(THREE) {
  const size = 512;
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const r = 139 + 50 * Math.sin(x / 20) * Math.cos(y / 20);
    const g = 69 + 40 * Math.sin(x / 15) * Math.cos(y / 15);
    const b = 19 + 30 * Math.sin(x / 10) * Math.cos(y / 10);
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