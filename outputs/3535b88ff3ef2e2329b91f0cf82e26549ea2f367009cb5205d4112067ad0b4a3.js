export default function generate(THREE) {
  const root = new THREE.Group();

  // Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.3 });
  const propellerMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1 });
  const landingGearMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000, metalness: 0.9, roughness: 0.3 });
  const cameraMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.2 });

  // Body
  const bodyGeometry = new THREE.BoxGeometry(1, 0.5, 1);
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  root.add(bodyMesh);

  // Propellers
  function createPropeller() {
    const propellerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
    const propellerMesh = new THREE.Mesh(propellerGeometry, propellerMaterial);
    return propellerMesh;
  }

  const propellers = [];
  for (let i = 0; i < 4; i++) {
    const propeller = createPropeller();
    propeller.position.set(0.5 * Math.cos(i * Math.PI / 2), 0.3, 0.5 * Math.sin(i * Math.PI / 2));
    root.add(propeller);
    propellers.push(propeller);

    // Propeller tips
    const tipGeometry = new THREE.ConeGeometry(0.1, 0.2, 32);
    const tipMesh = new THREE.Mesh(tipGeometry, propellerMaterial);
    tipMesh.position.set(0, 0.1, 0);
    propeller.add(tipMesh);

    // Rotate propellers
    propeller.rotation.x = Math.PI / 2;
  }

  // Landing Gear
  function createLandingGear() {
    const gearGeometry = new THREE.CylinderGeometry(0.05, 0.1, 0.3, 32);
    const gearMesh = new THREE.Mesh(gearGeometry, landingGearMaterial);
    return gearMesh;
  }

  for (let i = 0; i < 4; i++) {
    const gear = createLandingGear();
    gear.position.set(0.5 * Math.cos(i * Math.PI / 2), -0.3, 0.5 * Math.sin(i * Math.PI / 2));
    root.add(gear);
  }

  // Camera
  const cameraGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
  const cameraMesh = new THREE.Mesh(cameraGeometry, cameraMaterial);
  cameraMesh.position.set(0, -0.4, 0);
  root.add(cameraMesh);

  // Camera lens
  const lensGeometry = new THREE.CylinderGeometry(0.03, 0.05, 0.1, 32);
  const lensMesh = new THREE.Mesh(lensGeometry, cameraMaterial);
  lensMesh.position.set(0, -0.45, 0);
  root.add(lensMesh);

  // Lights
  function createLight() {
    const lightGeometry = new THREE.SphereGeometry(0.02, 32, 32);
    const lightMaterial = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
    const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
    return lightMesh;
  }

  for (let i = 0; i < 4; i++) {
    const light = createLight();
    light.position.set(0.5 * Math.cos(i * Math.PI / 2), 0.3, 0.5 * Math.sin(i * Math.PI / 2));
    root.add(light);
  }

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