export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8, roughness: 0.2 });
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1 });
  const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xFF00FF, metalness: 0.9, roughness: 0.1 });
  const hoodMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8, roughness: 0.2 });
  const rearMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8, roughness: 0.2 });
  const mirrorMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8, roughness: 0.2 });

  // Create body
  const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 3);
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  root.add(bodyMesh);

  // Create wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.75, 32);
  const frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  frontLeftWheel.position.set(-1.8, -0.9, 1.4);
  root.add(frontLeftWheel);

  const frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  frontRightWheel.position.set(1.8, -0.9, 1.4);
  root.add(frontRightWheel);

  const rearLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  rearLeftWheel.position.set(-1.8, -0.9, -1.4);
  root.add(rearLeftWheel);

  const rearRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  rearRightWheel.position.set(1.8, -0.9, -1.4);
  root.add(rearRightWheel);

  // Create lights
  const lightGeometry = new THREE.CapsuleGeometry(0.1, 0.2, 32, 32);
  const frontLeftLight = new THREE.Mesh(lightGeometry, lightMaterial);
  frontLeftLight.position.set(-1.5, -0.6, 1.8);
  root.add(frontLeftLight);

  const frontRightLight = new THREE.Mesh(lightGeometry, lightMaterial);
  frontRightLight.position.set(1.5, -0.6, 1.8);
  root.add(frontRightLight);

  // Create hood
  const hoodGeometry = new THREE.BoxGeometry(3, 0.75, 2);
  const hoodMesh = new THREE.Mesh(hoodGeometry, hoodMaterial);
  hoodMesh.position.set(0, 0.6, -1);
  root.add(hoodMesh);

  // Create rear
  const rearGeometry = new THREE.BoxGeometry(2, 0.75, 2);
  const rearMesh = new THREE.Mesh(rearGeometry, rearMaterial);
  rearMesh.position.set(0, 0.6, 1);
  root.add(rearMesh);

  // Create side mirrors
  const mirrorGeometry = new THREE.CapsuleGeometry(0.075, 0.3, 32, 32);
  const leftMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
  leftMirror.position.set(-1.9, -0.4, 1.6);
  root.add(leftMirror);

  const rightMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
  rightMirror.position.set(1.9, -0.4, 1.6);
  root.add(rightMirror);

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