export default function generate(THREE) {
  const root = new THREE.Group();

  const bowlGeometry = createBowlGeometry();
  const handleGeometry = createHandleGeometry();

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    metalness: 0.9,
    roughness: 0.1
  });

  const bowlMesh = new THREE.Mesh(bowlGeometry, material);
  const handleMesh = new THREE.Mesh(handleGeometry, material);

  root.add(bowlMesh);
  root.add(handleMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createBowlGeometry() {
  const geometry = new THREE.LatheBufferGeometry(createBowlPoints(), 32);
  geometry.scale(0.6, 0.6, 0.6); // Scale to make the bowl 60% of the total size
  return geometry;
}

function createHandleGeometry() {
  const points = [
    new THREE.Vector3(0.5, -0.1, 0),
    new THREE.Vector3(0.7, -0.2, 0),
    new THREE.Vector3(1.0, -0.4, 0)
  ];
  const geometry = new THREE.TubeBufferGeometry(new THREE.CatmullRomCurve3(points), 64, 0.05, 8, false);
  return geometry;
}

function createBowlPoints() {
  const points = [];
  for (let i = 0; i <= 10; i++) {
    const angle = (i / 10) * Math.PI;
    const x = Math.sin(angle) * 0.5;
    const y = -Math.cos(angle) * 0.5 + 0.2;
    points.push(new THREE.Vector3(x, y, 0));
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