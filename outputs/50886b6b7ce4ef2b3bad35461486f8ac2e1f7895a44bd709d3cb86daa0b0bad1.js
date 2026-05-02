export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const material = new THREE.MeshStandardMaterial({ color: 0xFF0000, metalness: 0.8, roughness: 0.2 });

  // Body
  const bodyGeometry = new THREE.BoxGeometry(1, 0.5, 0.3);
  const bodyMesh = new THREE.Mesh(bodyGeometry, material);
  root.add(bodyMesh);

  // Neck
  const neckGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.3);
  const neckMesh = new THREE.Mesh(neckGeometry, material);
  neckMesh.position.set(0.45, 0, 0);
  root.add(neckMesh);

  // Headstock
  const headstockGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.3);
  const headstockMesh = new THREE.Mesh(headstockGeometry, material);
  headstockMesh.position.set(0.75, 0, 0);
  root.add(headstockMesh);

  // Fretboard
  const fretboardGeometry = new THREE.BoxGeometry(1, 0.02, 0.3);
  const fretboardMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.2 });
  const fretboardMesh = new THREE.Mesh(fretboardGeometry, fretboardMaterial);
  fretboardMesh.position.set(0.15, -0.24, 0);
  root.add(fretboardMesh);

  // Strings
  const stringMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
  for (let i = 0; i < 6; i++) {
    const stringGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.75, -0.24 + i * 0.1, 0),
      new THREE.Vector3(-0.5, -0.24 + i * 0.1, 0)
    ]);
    const stringMesh = new THREE.Line(stringGeometry, stringMaterial);
    root.add(stringMesh);
  }

  // Tuning Pegs
  for (let i = 0; i < 6; i++) {
    const pegGeometry = new THREE.CylinderGeometry(0.01, 0.02, 0.1, 32);
    const pegMesh = new THREE.Mesh(pegGeometry, material);
    pegMesh.position.set(0.85, -0.24 + i * 0.1, 0);
    root.add(pegMesh);
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