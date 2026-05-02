export default function generate(THREE) {
  const root = new THREE.Group();

  // Boat
  const boatGeometry = new THREE.BoxGeometry(1, 0.3, 0.5);
  const boatMaterial = new THREE.MeshStandardMaterial({ color: 0x00BFFF, roughness: 0.2 });
  const boatMesh = new THREE.Mesh(boatGeometry, boatMaterial);
  root.add(boatMesh);

  // Mast
  const mastGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 32);
  const mastMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.3 });
  const mastMesh = new THREE.Mesh(mastGeometry, mastMaterial);
  mastMesh.position.set(0, 0.45, 0);
  root.add(mastMesh);

  // Ropes
  function createRope(positionX, positionY, positionZ) {
    const ropeGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.6, 32);
    const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000, roughness: 0.1 });
    const ropeMesh = new THREE.Mesh(ropeGeometry, ropeMaterial);
    ropeMesh.position.set(positionX, positionY, positionZ);
    return ropeMesh;
  }

  const rope1 = createRope(-0.45, 0.3, -0.25);
  const rope2 = createRope(0.45, 0.3, -0.25);
  root.add(rope1);
  root.add(rope2);

  // Windows
  function createWindow(positionX, positionY, positionZ) {
    const windowGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.01);
    const windowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.1 });
    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
    windowMesh.position.set(positionX, positionY, positionZ);
    return windowMesh;
  }

  const window1 = createWindow(-0.25, 0.1, 0.26);
  const window2 = createWindow(0.25, 0.1, 0.26);
  root.add(window1);
  root.add(window2);

  // Small Door
  const doorGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.01);
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x00BFFF, roughness: 0.2 });
  const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
  doorMesh.position.set(0, -0.1, 0.26);
  root.add(doorMesh);

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