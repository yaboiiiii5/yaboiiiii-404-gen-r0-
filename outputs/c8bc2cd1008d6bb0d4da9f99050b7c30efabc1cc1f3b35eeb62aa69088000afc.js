export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const material = new THREE.MeshStandardMaterial({ metalness: 0.3, roughness: 0.2 });

  // Box (base)
  const boxGeometry = new THREE.BoxGeometry(1, 0.5, 1);
  const boxMesh = new THREE.Mesh(boxGeometry, material);
  boxMesh.position.set(0, -0.75, 0);
  root.add(boxMesh);

  // Cylinder (middle)
  const cylinderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 32);
  const cylinderMesh = new THREE.Mesh(cylinderGeometry, material);
  cylinderMesh.position.set(0, -0.25, 0);
  root.add(cylinderMesh);

  // Sphere (top)
  const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const sphereMesh = new THREE.Mesh(sphereGeometry, material);
  sphereMesh.position.set(0, 0.5, 0);
  root.add(sphereMesh);

  // Handle
  const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 32);
  const handleMesh = new THREE.Mesh(handleGeometry, material);
  handleMesh.position.set(0.6, -0.1, 0);
  handleMesh.rotation.x = Math.PI / 4;
  root.add(handleMesh);

  // Spout
  const spoutGeometry = new THREE.CylinderGeometry(0.05, 0.02, 0.8, 32);
  const spoutMesh = new THREE.Mesh(spoutGeometry, material);
  spoutMesh.position.set(-0.6, 0.4, 0);
  spoutMesh.rotation.x = -Math.PI / 4;
  root.add(spoutMesh);

  // Glass container
  const glassMaterial = new THREE.MeshStandardMaterial({ color: 0x00FF00, metalness: 0.3, roughness: 0.2 });
  const glassGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32);
  const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
  glassMesh.position.set(0, -0.6, 0);
  root.add(glassMesh);

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