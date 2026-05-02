export default function generate(THREE) {
  const root = new THREE.Group();

  const material = new THREE.MeshStandardMaterial({ color: 0x800080, metalness: 0.1, roughness: 0.5 });

  // Seat
  const seatGeometry = new THREE.BoxGeometry(2, 0.5, 2);
  const seatMesh = new THREE.Mesh(seatGeometry, material);
  root.add(seatMesh);

  // Backrest
  const backrestGeometry = new THREE.BoxGeometry(1.8, 3, 0.4);
  const backrestMesh = new THREE.Mesh(backrestGeometry, material);
  backrestMesh.position.set(0, 2, -1);
  root.add(backrestMesh);

  // Armrests
  const armrestGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.4);
  const leftArmrestMesh = new THREE.Mesh(armrestGeometry, material);
  leftArmrestMesh.position.set(-0.9, 2.75, -1);
  root.add(leftArmrestMesh);

  const rightArmrestMesh = new THREE.Mesh(armrestGeometry, material);
  rightArmrestMesh.position.set(0.9, 2.75, -1);
  root.add(rightArmrestMesh);

  // Legs
  const legGeometry = new THREE.BoxGeometry(0.4, 1.5, 0.4);
  const frontLeftLegMesh = new THREE.Mesh(legGeometry, material);
  frontLeftLegMesh.position.set(-0.8, -0.75, -1);
  root.add(frontLeftLegMesh);

  const frontRightLegMesh = new THREE.Mesh(legGeometry, material);
  frontRightLegMesh.position.set(0.8, -0.75, -1);
  root.add(frontRightLegMesh);

  const backLeftLegMesh = new THREE.Mesh(legGeometry, material);
  backLeftLegMesh.position.set(-0.8, -0.75, 1);
  root.add(backLeftLegMesh);

  const backRightLegMesh = new THREE.Mesh(legGeometry, material);
  backRightLegMesh.position.set(0.8, -0.75, 1);
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