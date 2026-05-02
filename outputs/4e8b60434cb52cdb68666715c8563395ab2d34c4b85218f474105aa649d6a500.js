export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000, metalness: 0.9, roughness: 0.1 });
  const gripMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1 });
  const barrelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1 });

  // Handle
  const handleGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.5);
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.set(0, 0, -1.75); // Position handle at the end of grip

  // Grip
  const gripGeometry = new THREE.SphereGeometry(0.4, 32, 32);
  const gripMesh = new THREE.Mesh(gripGeometry, gripMaterial);

  // Barrel
  const barrelGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 32);
  const barrelMesh = new THREE.Mesh(barrelGeometry, barrelMaterial);
  barrelMesh.position.set(0, 0, 1); // Position barrel at the end of grip

  // Trigger
  const triggerGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.3);
  const triggerMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, metalness: 0.9, roughness: 0.1 });
  const triggerMesh = new THREE.Mesh(triggerGeometry, triggerMaterial);
  triggerMesh.position.set(0.2, -0.2, 0.7); // Position trigger on the side of grip

  // Hammer
  const hammerGeometry = new THREE.BoxGeometry(0.15, 0.3, 0.1);
  const hammerMesh = new THREE.Mesh(hammerGeometry, gripMaterial);
  hammerMesh.position.set(-0.4, -0.2, 0.7); // Position hammer on the side of grip
  hammerMesh.rotation.z = Math.PI / 4; // Rotate hammer to simulate a cocked position

  // Add parts to root
  root.add(handleMesh);
  root.add(gripMesh);
  root.add(barrelMesh);
  root.add(triggerMesh);
  root.add(hammerMesh);

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