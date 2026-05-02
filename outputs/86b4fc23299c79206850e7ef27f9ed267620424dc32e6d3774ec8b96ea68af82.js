export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const material = new THREE.MeshStandardMaterial({
    color: 0x000000,
    metalness: 0.9,
    roughness: 0.1
  });

  // Create body (Box)
  const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 1);
  const bodyMesh = new THREE.Mesh(bodyGeometry, material);
  root.add(bodyMesh);

  // Create wheels (Cylinder)
  const wheelRadius = 0.2;
  const wheelHeight = 0.3;
  const wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 16);
  const frontLeftWheelMesh = new THREE.Mesh(wheelGeometry, material);
  frontLeftWheelMesh.position.set(-0.8, -0.25, 0.45);
  root.add(frontLeftWheelMesh);

  const frontRightWheelMesh = new THREE.Mesh(wheelGeometry, material);
  frontRightWheelMesh.position.set(0.8, -0.25, 0.45);
  root.add(frontRightWheelMesh);

  const backLeftWheelMesh = new THREE.Mesh(wheelGeometry, material);
  backLeftWheelMesh.position.set(-0.8, -0.25, -0.45);
  root.add(backLeftWheelMesh);

  const backRightWheelMesh = new THREE.Mesh(wheelGeometry, material);
  backRightWheelMesh.position.set(0.8, -0.25, -0.45);
  root.add(backRightWheelMesh);

  // Create engine (Sphere)
  const engineRadius = 0.3;
  const engineGeometry = new THREE.SphereGeometry(engineRadius, 16, 16);
  const engineMesh = new THREE.Mesh(engineGeometry, material);
  engineMesh.position.set(1.2, 0, 0);
  root.add(engineMesh);

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