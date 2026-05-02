export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080,
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.5
  });

  const interiorMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

  // Body
  const bodyGeometry = new THREE.BoxGeometry(1, 0.5, 2);
  const bodyMesh = new THREE.Mesh(bodyGeometry, metalMaterial);
  root.add(bodyMesh);

  // Hood
  const hoodGeometry = new THREE.BoxGeometry(1, 0.3, 0.8);
  const hoodMesh = new THREE.Mesh(hoodGeometry, metalMaterial);
  hoodMesh.position.set(0, 0.4, -0.6);
  bodyMesh.add(hoodMesh);

  // Wheels
  function createWheel(x, z) {
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    const wheelMesh = new THREE.Mesh(wheelGeometry, metalMaterial);
    wheelMesh.position.set(x, -0.25, z);
    bodyMesh.add(wheelMesh);
  }

  createWheel(-0.4, 1);
  createWheel(0.4, 1);
  createWheel(-0.4, -1);
  createWheel(0.4, -1);

  // Headlights
  function createHeadlight(x) {
    const headlightGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const headlightMesh = new THREE.Mesh(headlightGeometry, interiorMaterial);
    headlightMesh.position.set(x, 0.4, -0.85);
    hoodMesh.add(headlightMesh);
  }

  createHeadlight(-0.3);
  createHeadlight(0.3);

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