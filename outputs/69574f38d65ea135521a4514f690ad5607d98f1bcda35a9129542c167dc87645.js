export default function generate(THREE) {
  const root = new THREE.Group();

  // Create sphere geometry
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

  // Create stem geometry
  const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32);

  // Combine sphere and stem into a single mesh
  const combinedGeometry = new THREE.BufferGeometry();
  combinedGeometry.merge(sphereGeometry);
  combinedGeometry.translate(0, 1, 0); // Move the sphere up to create space for the stem
  combinedGeometry.merge(stemGeometry);

  // Create material
  const material = new THREE.MeshStandardMaterial({
    color: 0xFFD700,
    metalness: 0.1,
    roughness: 0.2
  });

  // Create mesh and add to root
  const mesh = new THREE.Mesh(combinedGeometry, material);
  root.add(mesh);

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