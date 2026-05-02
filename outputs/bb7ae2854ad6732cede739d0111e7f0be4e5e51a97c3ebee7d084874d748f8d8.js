export default function generate(THREE) {
  const root = new THREE.Group();

  // Create backboard
  const backboardGeometry = new THREE.PlaneGeometry(2, 1);
  const backboardMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8, roughness: 0.2 });
  const backboard = new THREE.Mesh(backboardGeometry, backboardMaterial);
  root.add(backboard);

  // Create rim
  const rimGeometry = new THREE.TorusGeometry(1, 0.05, 16, 32);
  const rimMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00, metalness: 0.8, roughness: 0.2 });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.set(0, -0.5, 0);
  root.add(rim);

  // Create pole
  const poleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 32);
  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00, metalness: 0.8, roughness: 0.2 });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.set(0, -1.4, 0);
  root.add(pole);

  // Create net
  const netGeometry = new THREE.WireframeGeometry(new THREE.CylinderGeometry(0.95, 0.95, 0.8, 32).toBufferGeometry());
  const netMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const net = new THREE.LineSegments(netGeometry, netMaterial);
  net.position.set(0, -1.4, 0);
  root.add(net);

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