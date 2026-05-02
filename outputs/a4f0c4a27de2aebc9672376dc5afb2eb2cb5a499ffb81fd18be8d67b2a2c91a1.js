export default function generate(THREE) {
  const root = new THREE.Group();

  // Materials
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.2 });
  const shaftMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.2 });
  const ribsMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.2 });
  const canopyMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.1, roughness: 0.9 });

  // Handle (curved sphere)
  const handleGeometry = createCurvedSphere(THREE);
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  root.add(handleMesh);

  // Shaft (cylinder)
  const shaftGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
  const shaftMesh = new THREE.Mesh(shaftGeometry, shaftMaterial);
  shaftMesh.position.y = 1; // Position the shaft on top of the handle
  root.add(shaftMesh);

  // Ribs (cones)
  const ribsGroup = createRibs(THREE);
  ribsGroup.position.y = 2.5; // Position the ribs on top of the shaft
  root.add(ribsGroup);

  // Canopy (box)
  const canopyGeometry = new THREE.BoxGeometry(3, 0.1, 3);
  const canopyMesh = new THREE.Mesh(canopyGeometry, canopyMaterial);
  canopyMesh.position.y = 4; // Position the canopy on top of the ribs
  root.add(canopyMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createCurvedSphere(THREE) {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32, Math.PI * 1.5, Math.PI / 2);
  geometry.translate(0, -0.5, 0); // Move the sphere down so it's curved upwards
  return geometry;
}

function createRibs(THREE) {
  const group = new THREE.Group();
  const numRibs = 8;
  for (let i = 0; i < numRibs; i++) {
    const angle = (i / numRibs) * Math.PI * 2;
    const x = Math.cos(angle);
    const z = Math.sin(angle);

    const ribGeometry = new THREE.ConeGeometry(0.1, 2, 32);
    const ribMesh = new THREE.Mesh(ribGeometry, ribsMaterial);
    ribMesh.position.set(x, 0, z);
    ribMesh.rotation.x = Math.PI / 2;
    ribMesh.rotation.z = angle;

    group.add(ribMesh);
  }
  return group;
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