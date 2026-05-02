export default function generate(THREE) {
  const root = new THREE.Group();

  // Materials
  const scooterMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000, metalness: 0.8, roughness: 0.3 });
  const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.2, roughness: 0.5 });
  const handlebarsMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.3 });
  const mirrorsMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1 });
  const basketMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.6, roughness: 0.4 });
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xD2B48C, metalness: 0.5, roughness: 0.7 });

  // Scooter Body (Capsule)
  const scooterBodyGeometry = new THREE.CapsuleBufferGeometry(1, 2, 32, 32);
  const scooterBodyMesh = new THREE.Mesh(scooterBodyGeometry, scooterMaterial);
  root.add(scooterBodyMesh);

  // Seat (Cylinder)
  const seatGeometry = new THREE.CylinderBufferGeometry(0.5, 0.5, 1, 32);
  const seatMesh = new THREE.Mesh(seatGeometry, seatMaterial);
  seatMesh.position.set(0, 1.5, 0);
  root.add(seatMesh);

  // Handlebars (Cylinder)
  const handlebarsGeometry = new THREE.CylinderBufferGeometry(0.1, 0.1, 2, 32);
  const handlebarsMesh = new THREE.Mesh(handlebarsGeometry, handlebarsMaterial);
  handlebarsMesh.position.set(0, 2.5, -1);
  root.add(handlebarsMesh);

  // Mirrors (Sphere)
  const mirrorGeometry = new THREE.SphereBufferGeometry(0.1, 32, 32);
  const leftMirrorMesh = new THREE.Mesh(mirrorGeometry, mirrorsMaterial);
  leftMirrorMesh.position.set(-0.5, 2.7, -1.5);
  root.add(leftMirrorMesh);

  const rightMirrorMesh = new THREE.Mesh(mirrorGeometry, mirrorsMaterial);
  rightMirrorMesh.position.set(0.5, 2.7, -1.5);
  root.add(rightMirrorMesh);

  // Basket (Torus)
  const basketGeometry = new THREE.TorusBufferGeometry(0.3, 0.1, 32, 64);
  const basketMesh = new THREE.Mesh(basketGeometry, basketMaterial);
  basketMesh.position.set(-1, 2.5, -1);
  basketMesh.rotation.x = Math.PI / 2;
  root.add(basketMesh);

  // Box (Cube)
  const boxGeometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.position.set(0, 1.75, 1);
  root.add(boxMesh);

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