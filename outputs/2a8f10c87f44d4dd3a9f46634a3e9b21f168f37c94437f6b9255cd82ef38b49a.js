export default function generate(THREE) {
  const root = new THREE.Group();

  // Materials
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.2, roughness: 0.8 });
  const topRoofMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });

  // Base (Cylinder)
  const baseGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
  root.add(baseMesh);

  // Top (Cube)
  const topGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const topMesh = new THREE.Mesh(topGeometry, topRoofMaterial);
  topMesh.position.y = 1.25;
  root.add(topMesh);

  // Roof (Cone)
  const roofGeometry = new THREE.ConeGeometry(0.6, 1, 32);
  const roofMesh = new THREE.Mesh(roofGeometry, topRoofMaterial);
  roofMesh.position.y = 1.75;
  root.add(roofMesh);

  // Windows
  addWindows(THREE, root);

  // Balcony
  addBalcony(THREE, root);

  // Light
  addLight(THREE, root);

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

function addWindows(THREE, root) {
  const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF });
  const windowGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.05);

  // Front windows
  for (let i = -0.4; i <= 0.4; i += 0.8) {
    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
    windowMesh.position.set(i, 1.3, 1.025);
    root.add(windowMesh);
  }

  // Back windows
  for (let i = -0.4; i <= 0.4; i += 0.8) {
    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
    windowMesh.position.set(i, 1.3, -1.025);
    root.add(windowMesh);
  }
}

function addBalcony(THREE, root) {
  const balconyMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const balconyGeometry = new THREE.BoxGeometry(1.2, 0.1, 1.2);

  const balconyMesh = new THREE.Mesh(balconyGeometry, balconyMaterial);
  balconyMesh.position.y = 1.6;
  root.add(balconyMesh);

  // Balcony railings
  addRailing(THREE, root, 1.6, 0.55, 0, 0);
  addRailing(THREE, root, 1.6, -0.55, 0, 0);
  addRailing(THREE, root, 1.6, 0, 0.55, 90);
  addRailing(THREE, root, 1.6, 0, -0.55, 270);
}

function addRailing(THREE, root, y, x, z, rotation) {
  const railingMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const railingGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.05);

  const railingMesh = new THREE.Mesh(railingGeometry, railingMaterial);
  railingMesh.position.set(x, y, z);
  railingMesh.rotation.y = rotation * Math.PI / 180;
  root.add(railingMesh);
}

function addLight(THREE, root) {
  const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00 });
  const lightGeometry = new THREE.SphereGeometry(0.05, 32, 32);

  const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
  lightMesh.position.set(0, 1.8, 0);
  root.add(lightMesh);
}