export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.2 });
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.8 });
  const tireMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.8 });

  // Create body
  const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  root.add(bodyMesh);

  // Create wheels and tires
  function createWheelAndTire(positionX, positionZ) {
    const wheelGeometry = new THREE.CapsuleGeometry(0.3, 0.1, 8, 64);
    const wheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelMesh.position.set(positionX, -0.55, positionZ);

    const tireGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const tireMesh = new THREE.Mesh(tireGeometry, tireMaterial);
    tireMesh.position.set(0, -0.4, 0);

    wheelMesh.add(tireMesh);
    root.add(wheelMesh);
  }

  createWheelAndTire(-1, 1.8); // Front left
  createWheelAndTire(1, 1.8);  // Front right
  createWheelAndTire(-1, -1.8); // Rear left
  createWheelAndTire(1, -1.8);  // Rear right

  // Create front grille
  const grilleGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.1);
  const grilleMesh = new THREE.Mesh(grilleGeometry, bodyMaterial);
  grilleMesh.position.set(0, 0.3, 1.9);
  root.add(grilleMesh);

  // Create headlights
  function createHeadlight(positionX) {
    const headlightGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const headlightMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x888888 });
    const headlightMesh = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlightMesh.position.set(positionX, 0.4, 1.95);
    root.add(headlightMesh);
  }

  createHeadlight(-0.6); // Left headlight
  createHeadlight(0.6);  // Right headlight

  // Create side mirrors
  function createSideMirror(positionX) {
    const mirrorGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.05);
    const mirrorMesh = new THREE.Mesh(mirrorGeometry, bodyMaterial);
    mirrorMesh.position.set(positionX, 0.3, -1.9);
    root.add(mirrorMesh);

    const poleGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.5, 32);
    const poleMesh = new THREE.Mesh(poleGeometry, bodyMaterial);
    poleMesh.position.set(positionX, -0.1, -1.9);
    root.add(poleMesh);
  }

  createSideMirror(-1); // Left side mirror
  createSideMirror(1);  // Right side mirror

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