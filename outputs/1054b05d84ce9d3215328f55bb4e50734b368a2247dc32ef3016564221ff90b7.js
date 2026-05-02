export default function generate(THREE) {
  const root = new THREE.Group();

  // Create body cylinder
  const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 32);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1F1C18, metalness: 0.8, roughness: 0.3 });
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  root.add(bodyMesh);

  // Create lid sphere
  const lidGeometry = new THREE.SphereGeometry(0.25, 32, 32);
  const lidMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1 });
  const lidMesh = new THREE.Mesh(lidGeometry, lidMaterial);
  lidMesh.position.y = 0.5; // Position lid on top of the body
  root.add(lidMesh);

  // Create handle cylinder
  const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 32);
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x1F1C18, metalness: 0.8, roughness: 0.3 });
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.set(0.4, 0.2, 0); // Position handle on the side of the body
  handleMesh.rotation.z = Math.PI / 4; // Rotate handle to look like a handle
  root.add(handleMesh);

  // Create small opening cylinder
  const openingGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.02, 32);
  const openingMaterial = new THREE.MeshStandardMaterial({ color: 0x1F1C18, metalness: 0.8, roughness: 0.3 });
  const openingMesh = new THREE.Mesh(openingGeometry, openingMaterial);
  openingMesh.position.y = -0.45; // Position opening on the bottom of the body
  root.add(openingMesh);

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