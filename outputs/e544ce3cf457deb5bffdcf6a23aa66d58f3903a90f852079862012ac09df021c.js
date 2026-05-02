export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x40C4FF, metalness: 0.8, roughness: 0.2 });
  const keyMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.2 });

  // Create base
  const baseGeometry = new THREE.BoxGeometry(1, 0.2, 0.5);
  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
  root.add(baseMesh);

  // Create keys
  const keyGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.4);
  for (let i = 0; i < 10; i++) {
    const keyMesh = new THREE.Mesh(keyGeometry, keyMaterial);
    keyMesh.position.set(-0.45 + i * 0.1, 0.21, -0.05);
    root.add(keyMesh);
  }

  // Create stand
  const standGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.3);
  const standMesh = new THREE.Mesh(standGeometry, baseMaterial);
  standMesh.position.set(0, -0.15, 0);
  root.add(standMesh);

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