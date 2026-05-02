export default function generate(THREE) {
  const root = new THREE.Group();

  const yellowMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, metalness: 0.8, roughness: 0.2 });
  const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.2 });
  const silverMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.2 });
  const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.8, roughness: 0.2 });

  // Body (Box)
  const bodyGeometry = new THREE.BoxGeometry(1, 0.5, 0.3);
  const bodyMesh = new THREE.Mesh(bodyGeometry, yellowMaterial);
  root.add(bodyMesh);

  // Seat (Sphere)
  const seatGeometry = new THREE.SphereGeometry(0.25, 32, 32);
  const seatMesh = new THREE.Mesh(seatGeometry, blackMaterial);
  seatMesh.position.set(0, 0.4, 0);
  bodyMesh.add(seatMesh);

  // Tires (Cylinder)
  const tireGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
  const frontTireMesh = new THREE.Mesh(tireGeometry, blackMaterial);
  frontTireMesh.position.set(-0.45, -0.25, 0.15);
  bodyMesh.add(frontTireMesh);

  const rearTireMesh = new THREE.Mesh(tireGeometry, blackMaterial);
  rearTireMesh.position.set(0.45, -0.25, 0.15);
  bodyMesh.add(rearTireMesh);

  // Handlebars (Cone)
  const handlebarsGeometry = new THREE.ConeGeometry(0.05, 0.3, 32);
  const handlebarsMesh = new THREE.Mesh(handlebarsGeometry, silverMaterial);
  handlebarsMesh.rotation.x = Math.PI / 2;
  handlebarsMesh.position.set(-0.6, 0.1, -0.15);
  bodyMesh.add(handlebarsMesh);

  // Exhaust (Cylinder)
  const exhaustGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 32);
  const exhaustMesh = new THREE.Mesh(exhaustGeometry, silverMaterial);
  exhaustMesh.position.set(0.5, -0.4, 0.15);
  bodyMesh.add(exhaustMesh);

  // Mirrors (Capsule)
  const mirrorGeometry = new THREE.CapsuleGeometry(0.02, 0.1, 32, 8);
  const leftMirrorMesh = new THREE.Mesh(mirrorGeometry, silverMaterial);
  leftMirrorMesh.position.set(-0.5, 0.4, -0.15);
  bodyMesh.add(leftMirrorMesh);

  const rightMirrorMesh = new THREE.Mesh(mirrorGeometry, silverMaterial);
  rightMirrorMesh.position.set(0.5, 0.4, -0.15);
  bodyMesh.add(rightMirrorMesh);

  // Headlight (Torus)
  const headlightGeometry = new THREE.TorusGeometry(0.05, 0.02, 8, 32);
  const headlightMesh = new THREE.Mesh(headlightGeometry, yellowMaterial);
  headlightMesh.position.set(-0.4, 0.1, 0.2);
  bodyMesh.add(headlightMesh);

  // Rear Lights (Sphere)
  const rearLightGeometry = new THREE.SphereGeometry(0.05, 32, 32);
  const leftRearLightMesh = new THREE.Mesh(rearLightGeometry, redMaterial);
  leftRearLightMesh.position.set(0.45, -0.35, 0.15);
  bodyMesh.add(leftRearLightMesh);

  const rightRearLightMesh = new THREE.Mesh(rearLightGeometry, redMaterial);
  rightRearLightMesh.position.set(0.6, -0.35, 0.15);
  bodyMesh.add(rightRearLightMesh);

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