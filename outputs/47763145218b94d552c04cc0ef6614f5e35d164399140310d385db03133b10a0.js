export default function generate(THREE) {
  const root = new THREE.Group();

  // Create base geometry and material
  const baseGeometry = new THREE.BoxGeometry(2, 0.1, 2);
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8, roughness: 0.2 });
  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
  root.add(baseMesh);

  // Create pyramid geometry and material
  const pyramidGeometry = new THREE.ConeGeometry(1, 1, 4);
  const pyramidMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.2 });
  const pyramidMesh = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
  pyramidMesh.position.set(0, 0.55, 0); // Position the pyramid on top of the base
  root.add(pyramidMesh);

  // Create sphere geometry and material
  const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8, roughness: 0.2 });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.set(0, 1.15, 0); // Position the sphere on top of the pyramid
  root.add(sphereMesh);

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