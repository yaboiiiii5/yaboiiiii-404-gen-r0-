export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Create geometry
  const geometry = new THREE.CircleGeometry(1, 32);
  
  // Create material
  const material = new THREE.MeshStandardMaterial({
    color: 0xD2B48C,
    metalness: 0.2,
    roughness: 0.3
  });
  
  // Create mesh
  const mesh = new THREE.Mesh(geometry, material);
  root.add(mesh);
  
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