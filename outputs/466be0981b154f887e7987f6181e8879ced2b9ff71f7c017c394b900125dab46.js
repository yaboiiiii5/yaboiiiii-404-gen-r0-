export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.1, roughness: 0.5 });
  const soundHoleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.1, roughness: 0.5 });
  const headstockMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.1, roughness: 0.5 });

  // Body
  const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 0.3);
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  root.add(bodyMesh);

  // Sound Hole
  const soundHoleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 32);
  const soundHoleMesh = new THREE.Mesh(soundHoleGeometry, soundHoleMaterial);
  soundHoleMesh.position.set(0, -0.15, 0);
  root.add(soundHoleMesh);

  // Headstock
  const headstockGeometry = new THREE.BoxGeometry(0.3, 0.6, 0.2);
  const headstockMesh = new THREE.Mesh(headstockGeometry, headstockMaterial);
  headstockMesh.position.set(1.15, 0.2, 0);
  root.add(headstockMesh);

  // Strings
  const stringMaterial = new THREE.LineBasicMaterial({ color: 0x808080 });
  for (let i = 0; i < 6; i++) {
    const stringGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(1.2, -0.15 + i * 0.1, 0),
      new THREE.Vector3(-1.2, -0.15 + i * 0.1, 0)
    ]);
    const stringMesh = new THREE.Line(stringGeometry, stringMaterial);
    root.add(stringMesh);
  }

  // Tuning Pegs
  const tuningPegGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 16);
  for (let i = 0; i < 6; i++) {
    const tuningPegMesh = new THREE.Mesh(tuningPegGeometry, bodyMaterial);
    tuningPegMesh.position.set(1.25, -0.1 + i * 0.1, 0.1);
    root.add(tuningPegMesh);
  }

  // Bridge
  const bridgeGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.05);
  const bridgeMesh = new THREE.Mesh(bridgeGeometry, bodyMaterial);
  bridgeMesh.position.set(-1.2, -0.15, 0);
  root.add(bridgeMesh);

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