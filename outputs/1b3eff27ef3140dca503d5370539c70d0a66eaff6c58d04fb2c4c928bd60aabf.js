export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const canopyMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.3, roughness: 0.5 });
  const handleMaterial = new THREE.MeshPhysicalMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.2 });
  const tipMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.3, roughness: 0.5 });

  // Create canopy (cone)
  const canopyGeometry = new THREE.ConeGeometry(1, 2, 32);
  const canopyMesh = new THREE.Mesh(canopyGeometry, canopyMaterial);
  root.add(canopyMesh);

  // Add ribs to the canopy
  addRibsToCanopy(THREE, canopyMesh);

  // Create handle (cylinder)
  const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.set(0, -1.5, 0); // Position the handle below the canopy
  root.add(handleMesh);

  // Create tip (sphere)
  const tipGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const tipMesh = new THREE.Mesh(tipGeometry, tipMaterial);
  tipMesh.position.set(0, -2.5, 0); // Position the tip below the handle
  root.add(tipMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function addRibsToCanopy(THREE, canopyMesh) {
  const ribGeometry = new THREE.PlaneGeometry(1, 2);
  const ribMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.3, roughness: 0.5 });
  for (let i = 0; i < 32; i++) {
    const ribMesh = new THREE.Mesh(ribGeometry, ribMaterial);
    ribMesh.rotation.y = (i / 32) * Math.PI * 2;
    ribMesh.position.z = -1; // Position the ribs at the base of the cone
    canopyMesh.add(ribMesh);
  }
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