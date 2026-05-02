export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const materialFlute = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.1, roughness: 0.5 });
  const materialCase = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.1, roughness: 0.5 });

  // Create flute geometry
  const fluteGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);
  const flute = new THREE.Mesh(fluteGeometry, materialFlute);

  // Create case geometry
  const caseGeometry = new THREE.CylinderGeometry(1, 1, 4, 32);
  const fluteCase = new THREE.Mesh(caseGeometry, materialCase);

  // Add holes to the flute
  addHolesToFlute(flute, THREE);

  // Position and scale objects
  flute.position.set(0, 1.5, 0); // Center the flute inside the case

  // Add objects to root
  root.add(flute);
  root.add(fluteCase);

  fitToUnitCube(THREE, root);
  return root;
}

function addHolesToFlute(flute, THREE) {
  const holeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 32);
  const holeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.1, roughness: 0.5 });

  // Create holes
  for (let i = -1; i <= 1; i += 2) {
    const hole1 = new THREE.Mesh(holeGeometry.clone(), holeMaterial);
    hole1.rotation.x = Math.PI / 2;
    hole1.position.set(0, 1.5 + i * 0.75, 0);

    const hole2 = new THREE.Mesh(holeGeometry.clone(), holeMaterial);
    hole2.rotation.x = Math.PI / 2;
    hole2.position.set(i * 0.3, 1.5 + i * 0.6, 0);

    flute.add(hole1);
    flute.add(hole2);
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