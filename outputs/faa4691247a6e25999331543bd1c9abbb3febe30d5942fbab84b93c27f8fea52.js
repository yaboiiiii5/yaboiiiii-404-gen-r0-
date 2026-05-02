export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const forkMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.2 });
  const handleMaterial = new THREE.MeshBasicMaterial({ color: 0x8B0000 });

  // Fork
  const forkGeometry = new THREE.BoxGeometry(1, 1, 1);
  const forkMesh = new THREE.Mesh(forkGeometry, forkMaterial);
  root.add(forkMesh);

  // Handle
  const handleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.set(0, -1.5, 0); // Position handle below the fork
  root.add(handleMesh);

  // Tines
  for (let i = 0; i < 4; i++) {
    const tineGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.1);
    const tineMesh = new THREE.Mesh(tineGeometry, forkMaterial);
    tineMesh.position.set(Math.sin(i * Math.PI / 2) * 0.5, 0.6 + i * 0.1, Math.cos(i * Math.PI / 2) * 0.5);
    tineMesh.rotation.x = (i % 2 === 0) ? -Math.PI / 4 : Math.PI / 4;
    forkMesh.add(tineMesh);
  }

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