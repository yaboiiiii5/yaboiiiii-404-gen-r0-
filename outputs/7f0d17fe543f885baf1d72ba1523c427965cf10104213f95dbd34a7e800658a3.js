export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000, metalness: 0.8, roughness: 0.2 });
  const windowMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const engineMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 });

  // Fuselage
  const fuselageGeometry = new THREE.BoxGeometry(1, 0.5, 2);
  const fuselageMesh = new THREE.Mesh(fuselageGeometry, bodyMaterial);
  root.add(fuselageMesh);

  // Wings
  const wingGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.3);
  const leftWingMesh = new THREE.Mesh(wingGeometry, bodyMaterial);
  leftWingMesh.position.set(-0.75, 0.25, 0.8);
  root.add(leftWingMesh);

  const rightWingMesh = new THREE.Mesh(wingGeometry, bodyMaterial);
  rightWingMesh.position.set(0.75, 0.25, 0.8);
  root.add(rightWingMesh);

  // Engines
  const engineGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 32);
  const leftEngineMesh = new THREE.Mesh(engineGeometry, engineMaterial);
  leftEngineMesh.position.set(-0.75, -0.25, 1.2);
  root.add(leftEngineMesh);

  const rightEngineMesh = new THREE.Mesh(engineGeometry, engineMaterial);
  rightEngineMesh.position.set(0.75, -0.25, 1.2);
  root.add(rightEngineMesh);

  // Cockpit
  const cockpitGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  const cockpitMesh = new THREE.Mesh(cockpitGeometry, bodyMaterial);
  cockpitMesh.position.set(0, 0.5, -0.8);
  root.add(cockpitMesh);

  // Canopy
  const canopyGeometry = new THREE.ConeGeometry(0.15, 0.3, 32);
  const canopyMesh = new THREE.Mesh(canopyGeometry, windowMaterial);
  canopyMesh.position.set(0, 0.7, -0.8);
  root.add(canopyMesh);

  // Tail
  const tailGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.3);
  const tailMesh = new THREE.Mesh(tailGeometry, bodyMaterial);
  tailMesh.position.set(0, -0.25, -1.4);
  root.add(tailMesh);

  // Tail Fin
  const tailFinGeometry = new THREE.ConeGeometry(0.1, 0.3, 32);
  const tailFinMesh = new THREE.Mesh(tailFinGeometry, bodyMaterial);
  tailFinMesh.position.set(0, -0.45, -1.6);
  root.add(tailFinMesh);

  // Windows
  const windowGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  const leftWindowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
  leftWindowMesh.position.set(-0.3, 0.5, -0.6);
  root.add(leftWindowMesh);

  const rightWindowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
  rightWindowMesh.position.set(0.3, 0.5, -0.6);
  root.add(rightWindowMesh);

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