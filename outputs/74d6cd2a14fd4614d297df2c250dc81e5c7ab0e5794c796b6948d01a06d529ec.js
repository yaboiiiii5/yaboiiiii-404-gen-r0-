export default function generate(THREE) {
  const root = new THREE.Group();

  // Create base geometry and material
  const baseGeometry = new THREE.BoxGeometry(2, 0.1, 2);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x00000000,
    transparent: true,
    metalness: 0.1,
    roughness: 0.9
  });
  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
  root.add(baseMesh);

  // Create pyramid geometry and material
  const pyramidGeometry = new THREE.ConeGeometry(1.5, 2, 4, 1, false);
  const pyramidMaterial = new THREE.MeshStandardMaterial({
    color: 0x00000000,
    transparent: true,
    metalness: 0.1,
    roughness: 0.9
  });
  const pyramidMesh = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
  pyramidMesh.position.y = 1; // Position the pyramid on top of the base
  root.add(pyramidMesh);

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