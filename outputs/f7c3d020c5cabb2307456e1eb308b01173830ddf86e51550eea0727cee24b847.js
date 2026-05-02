export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const carMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000, metalness: 0.9, roughness: 0.1 });
  const licensePlateMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.9, roughness: 0.1 });

  // Body
  const bodyGeometry = new THREE.BoxGeometry(2, 1, 0.5);
  const bodyMesh = new THREE.Mesh(bodyGeometry, carMaterial);
  root.add(bodyMesh);

  // Hood
  const hoodGeometry = new THREE.BoxGeometry(1.8, 0.6, 0.4);
  const hoodMesh = new THREE.Mesh(hoodGeometry, carMaterial);
  hoodMesh.position.set(0, 0.5, -0.25);
  root.add(hoodMesh);

  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 32);
  const wheels = [];
  for (let i = 0; i < 4; i++) {
    const wheelMesh = new THREE.Mesh(wheelGeometry, carMaterial);
    if (i < 2) {
      wheelMesh.position.set(-0.8 + i * 1.6, -0.5, 0.3);
    } else {
      wheelMesh.position.set(-0.8 + (i - 2) * 1.6, -0.5, -0.7);
    }
    wheels.push(wheelMesh);
    root.add(wheelMesh);
  }

  // License Plate
  const licensePlateGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.02);
  const licensePlateMesh = new THREE.Mesh(licensePlateGeometry, licensePlateMaterial);
  licensePlateMesh.position.set(0, -0.35, -0.7);
  root.add(licensePlateMesh);

  // Chrome accents
  addChromeAccent(root, carMaterial, [-0.8, 0.25, 0.4], [1.6, 0.1, 0.05]);
  addChromeAccent(root, carMaterial, [0.8, 0.25, 0.4], [1.6, 0.1, 0.05]);
  addChromeAccent(root, carMaterial, [-0.8, -0.3, 0.4], [1.6, 0.1, 0.05]);
  addChromeAccent(root, carMaterial, [0.8, -0.3, 0.4], [1.6, 0.1, 0.05]);

  // Headlights
  addHeadlight(root, carMaterial, [-0.7, 0.2, 0.4]);
  addHeadlight(root, carMaterial, [0.7, 0.2, 0.4]);

  // Grille
  const grilleGeometry = new THREE.BoxGeometry(1.6, 0.1, 0.05);
  const grilleMesh = new THREE.Mesh(grilleGeometry, carMaterial);
  grilleMesh.position.set(0, 0.3, 0.4);
  root.add(grilleMesh);

  // Side Mirrors
  addSideMirror(root, carMaterial, [-0.8, -0.1, 0.5]);
  addSideMirror(root, carMaterial, [0.8, -0.1, 0.5]);

  fitToUnitCube(THREE, root);
  return root;
}

function addChromeAccent(root, material, position, size = [0.2, 0.05, 0.05]) {
  const accentGeometry = new THREE.BoxGeometry(...size);
  const accentMesh = new THREE.Mesh(accentGeometry, material);
  accentMesh.position.set(...position);
  root.add(accentMesh);
}

function addHeadlight(root, material, position) {
  const headlightGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  const headlightMesh = new THREE.Mesh(headlightGeometry, material);
  headlightMesh.position.set(...position);
  root.add(headlightMesh);
}

function addSideMirror(root, material, position) {
  const mirrorGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.05);
  const mirrorMesh = new THREE.Mesh(mirrorGeometry, material);
  mirrorMesh.position.set(...position);
  root.add(mirrorMesh);
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