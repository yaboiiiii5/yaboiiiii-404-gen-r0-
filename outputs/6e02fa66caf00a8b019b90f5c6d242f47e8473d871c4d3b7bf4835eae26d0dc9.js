export default function generate(THREE) {
  const root = new THREE.Group();

  // Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFF4500, metalness: 0.8, roughness: 0.5 });
  const tireMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.5 });
  const hubcapMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.5 });
  const roofFrameMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.5 });

  // Body
  const bodyGeometry = new THREE.BoxGeometry(2, 1, 1);
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  root.add(bodyMesh);

  // Tires and Hubcaps
  const tireRadius = 0.3;
  const tireHeight = 0.5;
  const hubcapRadius = 0.2;

  function createTireAndHubcap(xOffset, zOffset) {
    const tireGeometry = new THREE.CylinderGeometry(tireRadius, tireRadius, tireHeight, 32);
    const tireMesh = new THREE.Mesh(tireGeometry, tireMaterial);
    tireMesh.position.set(xOffset, -0.5, zOffset);
    root.add(tireMesh);

    const hubcapGeometry = new THREE.SphereGeometry(hubcapRadius, 16, 16);
    const hubcapMesh = new THREE.Mesh(hubcapGeometry, hubcapMaterial);
    hubcapMesh.position.set(xOffset, -0.5 + tireHeight / 2, zOffset);
    root.add(hubcapMesh);

    // Suspension
    const suspensionGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
    const suspensionMesh = new THREE.Mesh(suspensionGeometry, tireMaterial);
    suspensionMesh.position.set(xOffset, -0.5 + tireHeight / 2 - 0.15, zOffset);
    root.add(suspensionMesh);
  }

  createTireAndHubcap(-0.8, -0.4);
  createTireAndHubcap(0.8, -0.4);
  createTireAndHubcap(-0.8, 0.4);
  createTireAndHubcap(0.8, 0.4);

  // Roof Frame
  const roofFrameGeometry = new THREE.BoxGeometry(1.5, 0.2, 0.6);
  const roofFrameMesh = new THREE.Mesh(roofFrameGeometry, roofFrameMaterial);
  roofFrameMesh.position.set(0, 0.7, 0);
  root.add(roofFrameMesh);

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