export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const candleMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.1, roughness: 0.5 });
  const glassMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.1, roughness: 0.5, transparent: true, opacity: 0.3 });

  // Create geometries
  const candleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
  const glassGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 32);

  // Create meshes
  const candleMesh = new THREE.Mesh(candleGeometry, candleMaterial);
  const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);

  // Position and scale objects
  candleMesh.position.set(0, -1, 0); // Place the candle at the bottom of the glass

  // Add meshes to root
  root.add(candleMesh);
  root.add(glassMesh);

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