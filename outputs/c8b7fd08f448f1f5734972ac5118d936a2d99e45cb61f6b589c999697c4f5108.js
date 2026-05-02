export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF, metalness: 0.3, roughness: 0.1, transparent: true, opacity: 0.5 });
  const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.3, roughness: 0.1 });

  // Body
  const bodyGeometry = new THREE.BoxGeometry(1, 0.5, 0.2);
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  root.add(bodyMesh);

  // Wings
  const wingGeometry = new THREE.BoxGeometry(1.33, 0.1, 0.2);
  const leftWingMesh = new THREE.Mesh(wingGeometry, bodyMaterial);
  leftWingMesh.position.set(-0.5, 0.25, 0);
  root.add(leftWingMesh);

  const rightWingMesh = new THREE.Mesh(wingGeometry, bodyMaterial);
  rightWingMesh.position.set(0.5, 0.25, 0);
  root.add(rightWingMesh);

  // Tail
  const tailGeometry = new THREE.BoxGeometry(0.75, 0.1, 0.2);
  const tailMesh = new THREE.Mesh(tailGeometry, bodyMaterial);
  tailMesh.position.set(0, -0.3, 0);
  root.add(tailMesh);

  // Windows
  const windowGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
  const leftWindowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
  leftWindowMesh.position.set(-0.4, 0.35, 0.11);
  root.add(leftWindowMesh);

  const rightWindowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
  rightWindowMesh.position.set(0.4, 0.35, 0.11);
  root.add(rightWindowMesh);

  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.02, 32);
  const leftWheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
  leftWheelMesh.position.set(-0.45, -0.6, 0);
  root.add(leftWheelMesh);

  const rightWheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
  rightWheelMesh.position.set(0.45, -0.6, 0);
  root.add(rightWheelMesh);

  // Internal Structure
  const internalStructureGeometry = new THREE.WireframeGeometry(bodyGeometry);
  const internalStructureMesh = new THREE.LineSegments(internalStructureGeometry, new THREE.LineBasicMaterial({ color: 0x000000 }));
  bodyMesh.add(internalStructureMesh);

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