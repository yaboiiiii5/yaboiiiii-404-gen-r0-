export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.9, roughness: 0.1 });
  const tailNoseMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF, metalness: 0.9, roughness: 0.1 });

  // Body
  const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 0.5);
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  root.add(bodyMesh);

  // Wings
  const wingGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.3);
  const leftWingMesh = new THREE.Mesh(wingGeometry, bodyMaterial);
  leftWingMesh.position.set(-0.75, -0.25, 0.25);
  root.add(leftWingMesh);

  const rightWingMesh = new THREE.Mesh(wingGeometry, bodyMaterial);
  rightWingMesh.position.set(-0.75, -0.25, -0.25);
  rightWingMesh.rotation.y = Math.PI;
  root.add(rightWingMesh);

  // Tail
  const tailGeometry = new THREE.CapsuleGeometry(0.1, 0.3, 8, 16);
  const tailMesh = new THREE.Mesh(tailGeometry, tailNoseMaterial);
  tailMesh.position.set(-1.25, -0.25, 0);
  root.add(tailMesh);

  // Nose
  const noseGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
  const noseMesh = new THREE.Mesh(noseGeometry, tailNoseMaterial);
  noseMesh.position.set(1.25, -0.25, 0);
  root.add(noseMesh);

  // Cockpit Window
  const cockpitWindowGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.2);
  const cockpitWindowMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.5 });
  const cockpitWindowMesh = new THREE.Mesh(cockpitWindowGeometry, cockpitWindowMaterial);
  cockpitWindowMesh.position.set(0.75, -0.1, 0);
  root.add(cockpitWindowMesh);

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