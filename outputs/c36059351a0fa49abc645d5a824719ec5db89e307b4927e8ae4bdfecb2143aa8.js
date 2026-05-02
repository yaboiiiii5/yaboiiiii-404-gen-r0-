export default function generate(THREE) {
  const root = new THREE.Group();
  
  const material = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1 });

  // Top Cylinder
  const topCylinderGeometry = new THREE.CylinderGeometry(2, 2, 4, 32);
  const topCylinderMesh = new THREE.Mesh(topCylinderGeometry, material);
  topCylinderMesh.position.y = 6;
  root.add(topCylinderMesh);

  // Middle Cylinder
  const middleCylinderGeometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
  const middleCylinderMesh = new THREE.Mesh(middleCylinderGeometry, material);
  middleCylinderMesh.position.y = 1.5;
  root.add(middleCylinderMesh);

  // Bottom Cylinder
  const bottomCylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const bottomCylinderMesh = new THREE.Mesh(bottomCylinderGeometry, material);
  bottomCylinderMesh.position.y = -1.5;
  root.add(bottomCylinderMesh);

  // Cone (Thread)
  const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32);
  const coneMesh = new THREE.Mesh(coneGeometry, material);
  coneMesh.rotation.x = Math.PI / 2;
  coneMesh.position.y = 4.5;
  root.add(coneMesh);

  // Threaded Middle
  addThread(middleCylinderMesh, THREE, material);

  fitToUnitCube(THREE, root);
  return root;
}

function addThread(cylinder, THREE, material) {
  const threadGeometry = new THREE.TorusGeometry(1.5, 0.02, 16, 32, Math.PI * 2);
  const threadMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1 });
  for (let i = 0; i < 5; i++) {
    const threadMesh = new THREE.Mesh(threadGeometry, threadMaterial);
    threadMesh.rotation.x = Math.PI / 2;
    threadMesh.position.y = -0.3 + i * 0.6;
    cylinder.add(threadMesh);
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