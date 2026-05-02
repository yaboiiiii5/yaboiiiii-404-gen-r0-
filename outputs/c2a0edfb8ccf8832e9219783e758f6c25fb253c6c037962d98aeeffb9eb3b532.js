export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const cushionMaterial = new THREE.MeshStandardMaterial({ color: 0xFFE0D2, metalness: 0.2, roughness: 0.3 });
  const patternMaterial = createPatternMaterial(THREE);
  const ottomanMaterial = new THREE.MeshStandardMaterial({ color: 0x0080FF, metalness: 0.2, roughness: 0.3 });
  const pillowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.2, roughness: 0.3 });
  const storageMaterial = new THREE.MeshStandardMaterial({ color: 0x00FFFF, metalness: 0.2, roughness: 0.3 });

  // Create shapes
  const cushionGeometry = new THREE.BoxGeometry(1, 0.5, 1);
  const ottomanGeometry = new THREE.BoxGeometry(1.5, 0.3, 1.5);
  const pillowGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.8);
  const storageGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.6);

  // Create mesh objects
  const cushion = new THREE.Mesh(cushionGeometry, patternMaterial);
  const ottoman = new THREE.Mesh(ottomanGeometry, ottomanMaterial);
  const pillow = new THREE.Mesh(pillowGeometry, pillowMaterial);
  const storage = new THREE.Mesh(storageGeometry, storageMaterial);

  // Position objects
  cushion.position.set(0, 0.25, 0);
  ottoman.position.set(0, -0.15, 0);
  pillow.position.set(0, 0.35, 0);
  storage.position.set(0, 0.45, 0);

  // Add to root
  root.add(cushion);
  root.add(ottoman);
  root.add(pillow);
  root.add(storage);

  fitToUnitCube(THREE, root);
  return root;
}

function createPatternMaterial(THREE) {
  const size = 128;
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const color = ((x + y) % 2 === 0) ? 0x80FF00 : 0xFFE0D2;
    data[i * 3] = (color >> 16) & 0xFF; // R
    data[i * 3 + 1] = (color >> 8) & 0xFF; // G
    data[i * 3 + 2] = color & 0xFF; // B
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return new THREE.MeshStandardMaterial({ map: texture, metalness: 0.2, roughness: 0.3 });
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