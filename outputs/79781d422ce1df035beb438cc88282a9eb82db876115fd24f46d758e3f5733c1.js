export default function generate(THREE) {
  const root = new THREE.Group();

  // Create Torus Geometry
  const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 32, 100);

  // Create Star Geometry
  const starPoints = createStarPoints();
  const starShape = new THREE.Shape(starPoints);
  const extrudeSettings = { steps: 2, depth: 0.1, bevelEnabled: false };
  const starGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);

  // Create Material
  const material = new THREE.MeshStandardMaterial({ color: 0x8B0000, metalness: 0.8, roughness: 0.2 });

  // Create Torus Mesh
  const torusMesh = new THREE.Mesh(torusGeometry, material);
  root.add(torusMesh);

  // Create Star Mesh and position it inside the torus
  const starMesh = new THREE.Mesh(starGeometry, material);
  starMesh.position.set(0, 0.15, 0); // Adjust position to fit inside the torus
  root.add(starMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createStarPoints() {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? 0.1 : 0.04;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
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