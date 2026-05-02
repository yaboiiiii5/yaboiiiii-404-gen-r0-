export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Sofa Body
  const sofaGeometry = new THREE.BoxGeometry(1, 1, 0.5);
  const sofaMaterial = new THREE.MeshStandardMaterial({ color: 0x0066CC, metalness: 0, roughness: 0.1 });
  const sofaMesh = new THREE.Mesh(sofaGeometry, sofaMaterial);
  root.add(sofaMesh);

  // Pillows
  const pillowGeometry = new THREE.BoxGeometry(1, 0.5, 0.4);
  const pillowMaterial = new THREE.MeshStandardMaterial({ color: 0x0066CC, metalness: 0, roughness: 0.1 });
  const leftPillowMesh = new THREE.Mesh(pillowGeometry, pillowMaterial);
  leftPillowMesh.position.set(-0.25, 0.75, -0.3);
  root.add(leftPillowMesh);

  const rightPillowMesh = new THREE.Mesh(pillowGeometry, pillowMaterial);
  rightPillowMesh.position.set(0.25, 0.75, -0.3);
  root.add(rightPillowMesh);

  // Armrests
  const armrestGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.4);
  const armrestMaterial = new THREE.MeshStandardMaterial({ color: 0x0066CC, metalness: 0, roughness: 0.1 });
  const leftArmrestMesh = new THREE.Mesh(armrestGeometry, armrestMaterial);
  leftArmrestMesh.position.set(-0.5, 0.3, -0.2);
  root.add(leftArmrestMesh);

  const rightArmrestMesh = new THREE.Mesh(armrestGeometry, armrestMaterial);
  rightArmrestMesh.position.set(0.5, 0.3, -0.2);
  root.add(rightArmrestMesh);

  // Legs
  const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 32);
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x0066CC, metalness: 0, roughness: 0.1 });
  const frontLeftLegMesh = new THREE.Mesh(legGeometry, legMaterial);
  frontLeftLegMesh.position.set(-0.45, -0.2, -0.3);
  root.add(frontLeftLegMesh);

  const frontRightLegMesh = new THREE.Mesh(legGeometry, legMaterial);
  frontRightLegMesh.position.set(0.45, -0.2, -0.3);
  root.add(frontRightLegMesh);

  const backLeftLegMesh = new THREE.Mesh(legGeometry, legMaterial);
  backLeftLegMesh.position.set(-0.45, -0.2, 0.1);
  root.add(backLeftLegMesh);

  const backRightLegMesh = new THREE.Mesh(legGeometry, legMaterial);
  backRightLegMesh.position.set(0.45, -0.2, 0.1);
  root.add(backRightLegMesh);

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