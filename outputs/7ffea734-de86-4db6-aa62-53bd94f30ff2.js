export default function generate(THREE) {
  const root = new THREE.Group();

  const material = new THREE.MeshStandardMaterial({
    color: 0x404040,
    metalness: 0.8,
    roughness: 0.2
  });

  const innerMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    metalness: 0.8,
    roughness: 0.2
  });

  const circleGeometry = createCircleGeometry(THREE, 1);
  const ringGeometry = createRingGeometry(THREE, 0.75, 1);
  const cylinderGeometry = createCylinderWithGrooves(THREE, 0.5, 0.5, 0.2);

  const circleMesh = new THREE.Mesh(circleGeometry, material);
  const ringMesh = new THREE.Mesh(ringGeometry, material);
  const cylinderMesh = new THREE.Mesh(cylinderGeometry, innerMaterial);

  root.add(circleMesh);
  root.add(ringMesh);
  root.add(cylinderMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createCircleGeometry(THREE, radius) {
  const geometry = new THREE.CircleGeometry(radius, 64);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function createRingGeometry(THREE, innerRadius, outerRadius) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function createCylinderWithGrooves(THREE, radiusTop, radiusBottom, height) {
  const segments = 32;
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);

  for (let i = 0; i < geometry.vertices.length; i++) {
    const vertex = geometry.vertices[i];
    if (vertex.y === -height / 2 || vertex.y === height / 2) continue;
    const angle = Math.atan2(vertex.x, vertex.z);
    const grooveDepth = 0.05 * Math.sin(10 * angle);
    vertex.y += grooveDepth;
  }

  geometry.computeVertexNormals();
  return geometry;
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