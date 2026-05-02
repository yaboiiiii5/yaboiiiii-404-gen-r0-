export default function generate(THREE) {
  const root = new THREE.Group();

  // Materials
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, metalness: 0.2, roughness: 0.8 });
  const brushHeadMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, metalness: 0.2, roughness: 0.8 });
  const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x00FF00, metalness: 0, roughness: 0.5 });

  // Handle
  const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.set(0, -1, 0);
  root.add(handleMesh);

  // Brush Head
  const brushHeadGeometry = createSlitCylinderGeometry(THREE, 0.5, 0.2, 0.3, 8, 4);
  const brushHeadMesh = new THREE.Mesh(brushHeadGeometry, brushHeadMaterial);
  brushHeadMesh.position.set(0, 1, 0);
  root.add(brushHeadMesh);

  // Grass
  for (let i = 0; i < 20; i++) {
    const grassHeight = 1 + Math.sin(i * 0.3) * 0.5;
    const grassGeometry = new THREE.CylinderGeometry(0.01, 0.01, grassHeight, 8);
    const grassMesh = new THREE.Mesh(grassGeometry, grassMaterial);
    const angle = i / 20 * Math.PI * 2;
    grassMesh.position.set(Math.cos(angle) * 0.5, 1.3 + grassHeight / 2, Math.sin(angle) * 0.5);
    grassMesh.rotation.z = angle;
    root.add(grassMesh);
  }

  fitToUnitCube(THREE, root);
  return root;
}

function createSlitCylinderGeometry(THREE, radiusTop, radiusBottom, height, radialSegments, slitCount) {
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  const vertices = geometry.attributes.position.array;

  for (let i = 0; i < slitCount; i++) {
    const startAngle = (i / slitCount) * Math.PI * 2;
    const endAngle = ((i + 1) / slitCount) * Math.PI * 2;
    const startIndex = findClosestVertexIndex(vertices, radialSegments, height, startAngle);
    const endIndex = findClosestVertexIndex(vertices, radialSegments, height, endAngle);

    for (let j = startIndex; j < endIndex; j += 3) {
      vertices[j + 1] -= height * 0.2;
    }
  }

  geometry.attributes.position.needsUpdate = true;
  return geometry;
}

function findClosestVertexIndex(vertices, radialSegments, height, angle) {
  const x = Math.cos(angle);
  const z = Math.sin(angle);
  let minDistance = Infinity;
  let closestIndex = -1;

  for (let i = 0; i < vertices.length; i += 3) {
    const vertexX = vertices[i];
    const vertexZ = vertices[i + 2];
    const distance = Math.sqrt((vertexX - x) ** 2 + (vertexZ - z) ** 2);

    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
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