export default function generate(THREE) {
  const root = new THREE.Group();

  // Create bowl geometry and material
  const bowlGeometry = new THREE.CylinderGeometry(1, 0.5, 3, 32);
  const bowlMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5, metalness: 0.7 });
  const bowlMesh = new THREE.Mesh(bowlGeometry, bowlMaterial);

  // Create handle geometry and material
  const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.5, metalness: 0.7 });
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);

  // Position the handle
  handleMesh.position.set(1.25, 1.5, 0);
  handleMesh.rotation.x = Math.PI / 4;

  // Add bowl and handle to root group
  root.add(bowlMesh);
  root.add(handleMesh);

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