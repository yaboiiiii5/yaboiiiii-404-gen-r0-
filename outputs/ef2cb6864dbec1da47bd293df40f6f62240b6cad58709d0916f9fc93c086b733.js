export default function generate(THREE) {
  const root = new THREE.Group();

  // Create pear geometry
  const pearGeometry = createPearGeometry();
  const pearMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.1 });
  const pearMesh = new THREE.Mesh(pearGeometry, pearMaterial);
  root.add(pearMesh);

  // Create hollowed-out section geometry
  const hollowGeometry = createHollowGeometry();
  const hollowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.1 });
  const hollowMesh = new THREE.Mesh(hollowGeometry, hollowMaterial);
  hollowMesh.position.set(0, -0.25, 0); // Adjust position to fit inside pear
  root.add(hollowMesh);

  // Create spoon geometry
  const spoonGeometry = createSpoonGeometry();
  const spoonMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.1 });
  const spoonMesh = new THREE.Mesh(spoonGeometry, spoonMaterial);
  spoonMesh.position.set(0, -0.5, 0); // Adjust position to fit inside hollowed-out section
  root.add(spoonMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createPearGeometry() {
  const geometry = new THREE.LatheGeometry(createPearPoints(), 32);
  return geometry;
}

function createHollowGeometry() {
  const geometry = new THREE.TorusGeometry(0.5, 0.1, 8, 32);
  geometry.rotateX(Math.PI / 2);
  return geometry;
}

function createSpoonGeometry() {
  const points = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.1, 0.1),
    new THREE.Vector2(0.2, 0.2),
    new THREE.Vector2(0.3, 0.15),
    new THREE.Vector2(0.4, 0.1)
  ];
  const geometry = new THREE.LatheGeometry(points, 32);
  return geometry;
}

function createPearPoints() {
  const points = [];
  for (let i = 0; i <= 1; i += 0.05) {
    const x = Math.sin(i * Math.PI);
    const y = Math.cos(i * Math.PI) - 1;
    points.push(new THREE.Vector2(x, y));
  }
  return points;
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