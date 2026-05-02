export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const materialBox = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.2 });
  const materialCylinder = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8, roughness: 0.2 });
  const materialSphere = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.2 });

  // Box (Base)
  const boxGeometry = new THREE.BoxGeometry(1, 0.5, 1);
  const boxMesh = new THREE.Mesh(boxGeometry, materialBox);
  root.add(boxMesh);

  // Cylinder (Middle)
  const cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 32);
  const cylinderMesh = new THREE.Mesh(cylinderGeometry, materialCylinder);
  cylinderMesh.position.y = 0.5 + 0.15; // Position it on top of the box
  root.add(cylinderMesh);

  // Sphere (Top)
  const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const sphereMesh = new THREE.Mesh(sphereGeometry, materialSphere);
  sphereMesh.position.y = 1 + 0.1; // Position it on top of the cylinder
  root.add(sphereMesh);

  // Handle
  const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 32);
  const handleMesh = new THREE.Mesh(handleGeometry, materialCylinder);
  handleMesh.position.set(0.4, 1, 0); // Position it on the side of the box
  handleMesh.rotation.x = Math.PI / 2; // Rotate to make it vertical
  root.add(handleMesh);

  // Spout
  const spoutGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 32);
  const spoutMesh = new THREE.Mesh(spoutGeometry, materialCylinder);
  spoutMesh.position.set(-0.4, 1, 0); // Position it on the opposite side of the box
  spoutMesh.rotation.x = Math.PI / 2; // Rotate to make it vertical
  root.add(spoutMesh);

  // Lid
  const lidGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.8);
  const lidMesh = new THREE.Mesh(lidGeometry, materialBox);
  lidMesh.position.y = 1 + 0.2; // Position it on top of the sphere
  root.add(lidMesh);

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