export default function generate(THREE) {
  const root = new THREE.Group();

  // Materials
  const boatMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 });
  const cushionsMaterial = new THREE.MeshStandardMaterial({ color: 0x004080, roughness: 0.3 });
  const radarMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.1 });
  const postsMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.4 });
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.5 });
  const flagMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });

  // Boat
  const boatGeometry = new THREE.BoxGeometry(1, 0.2, 1);
  const boatMesh = new THREE.Mesh(boatGeometry, boatMaterial);
  root.add(boatMesh);

  // Cushions
  const cushionGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
  const cushionMesh1 = new THREE.Mesh(cushionGeometry, cushionsMaterial);
  cushionMesh1.position.set(-0.25, 0.15, -0.25);
  root.add(cushionMesh1);

  const cushionMesh2 = new THREE.Mesh(cushionGeometry, cushionsMaterial);
  cushionMesh2.position.set(0.25, 0.15, -0.25);
  root.add(cushionMesh2);

  // Radar
  const radarGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  const radarMesh = new THREE.Mesh(radarGeometry, radarMaterial);
  radarMesh.position.set(0, 0.4, 0);
  root.add(radarMesh);

  // Posts
  const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 32);
  const postMesh1 = new THREE.Mesh(postGeometry, postsMaterial);
  postMesh1.position.set(-0.45, 0.1, -0.45);
  root.add(postMesh1);

  const postMesh2 = new THREE.Mesh(postGeometry, postsMaterial);
  postMesh2.position.set(0.45, 0.1, -0.45);
  root.add(postMesh2);

  // Wheel
  const wheelGeometry = new THREE.TorusGeometry(0.05, 0.01, 32, 64);
  const wheelMesh1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheelMesh1.position.set(-0.45, 0.1, -0.45);
  root.add(wheelMesh1);

  const wheelMesh2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheelMesh2.position.set(0.45, 0.1, -0.45);
  root.add(wheelMesh2);

  // Flag
  const flagGeometry = new THREE.PlaneGeometry(0.1, 0.2);
  const flagMesh = new THREE.Mesh(flagGeometry, flagMaterial);
  flagMesh.position.set(0, 0.3, -0.45);
  flagMesh.rotation.z = Math.PI / 4;
  root.add(flagMesh);

  // Windows
  const windowGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.01);
  const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF });
  const windowMesh1 = new THREE.Mesh(windowGeometry, windowMaterial);
  windowMesh1.position.set(-0.3, 0.15, 0.495);
  root.add(windowMesh1);

  const windowMesh2 = new THREE.Mesh(windowGeometry, windowMaterial);
  windowMesh2.position.set(0.3, 0.15, 0.495);
  root.add(windowMesh2);

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