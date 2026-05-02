export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8, roughness: 0.3 });
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.3 });
  const cylinderMaterial = new THREE.MeshPhysicalMaterial({ color: 0x8B0000, metalness: 0.8, roughness: 0.3 });

  // Create geometries
  const boxGeometry = new THREE.BoxGeometry(2, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.25, 32, 32);
  const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.75, 32);

  // Create mesh objects
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

  // Position the objects
  sphereMesh.position.set(0, 0.5, 0); // Button on top of the box
  cylinderMesh.position.set(0, -0.25, 0.6); // Handle sticking out from the side

  // Add ribbed texture to the box
  const ribbedTexture = createRibbedTexture(THREE);
  boxMaterial.map = ribbedTexture;
  boxMaterial.needsUpdate = true;

  // Add keypad texture to the sphere
  const keypadTexture = createKeypadTexture(THREE);
  sphereMaterial.map = keypadTexture;
  sphereMaterial.needsUpdate = true;

  // Add objects to root group
  root.add(boxMesh);
  root.add(sphereMesh);
  root.add(cylinderMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createRibbedTexture(THREE) {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = (i * size + j) * 4;
      const value = ((i % 32 < 16) !== (j % 32 < 16)) ? 255 : 0;
      data[index] = data[index + 1] = data[index + 2] = value;
      data[index + 3] = 255; // Alpha
    }
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.needsUpdate = true;
  return texture;
}

function createKeypadTexture(THREE) {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = (i * size + j) * 4;
      const value = (i > size / 3 && i < 2 * size / 3 && j > size / 3 && j < 2 * size / 3) ? 0 : 255;
      data[index] = data[index + 1] = data[index + 2] = value;
      data[index + 3] = 255; // Alpha
    }
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.needsUpdate = true;
  return texture;
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