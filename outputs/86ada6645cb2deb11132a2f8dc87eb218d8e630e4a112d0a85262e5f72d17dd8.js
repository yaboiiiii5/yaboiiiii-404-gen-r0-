export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const outerMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.2 });
  const innerMaterial = createTexturedMaterial(THREE);
  const coneMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000, metalness: 0.8, roughness: 0.2 });

  // Create geometries
  const outerCylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const innerCylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.8, 32);
  const coneGeometry = new THREE.ConeGeometry(0.6, 0.7, 32);

  // Create meshes
  const outerCylinderMesh = new THREE.Mesh(outerCylinderGeometry, outerMaterial);
  const innerCylinderMesh = new THREE.Mesh(innerCylinderGeometry, innerMaterial);
  const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);

  // Position and scale meshes
  innerCylinderMesh.position.y = -0.1;
  coneMesh.rotation.x = Math.PI;
  coneMesh.position.y = -1;

  // Add meshes to root
  root.add(outerCylinderMesh);
  outerCylinderMesh.add(innerCylinderMesh);
  innerCylinderMesh.add(coneMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createTexturedMaterial(THREE) {
  const size = 1024;
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    const stride = i * 3;
    data[stride] = 139; // R
    data[stride + 1] = 0;   // G
    data[stride + 2] = 0;   // B
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return new THREE.MeshStandardMaterial({ map: texture, metalness: 0.8, roughness: 0.2 });
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