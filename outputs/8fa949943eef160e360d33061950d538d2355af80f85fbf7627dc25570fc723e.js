export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const materialLoop = new THREE.MeshPhysicalMaterial({ color: 0x8B0000, metalness: 0.8, roughness: 0.5 });
  const materialBuckle = new THREE.MeshPhysicalMaterial({ color: 0x808000, metalness: 0.8, roughness: 0.5 });

  // Create belt loop (torus)
  const torusGeometry = new THREE.TorusGeometry(1, 0.2, 16, 100);
  const torus = new THREE.Mesh(torusGeometry, materialLoop);
  root.add(torus);

  // Create belt buckle (box with holes and metal texture)
  const boxGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.2);
  const box = new THREE.Mesh(boxGeometry, materialBuckle);
  box.position.set(1.4, 0, 0); // Position the buckle on the loop
  root.add(box);

  // Add holes to the buckle
  addHolesToBox(THREE, box, 0.1, 5, 3, 2);

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

function addHolesToBox(THREE, box, holeSize, rows, cols, depth) {
  const geometry = box.geometry;
  const positions = geometry.attributes.position.array;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = -box.scale.x / 2 + holeSize / 2 + j * (holeSize + box.scale.x / (cols + 1));
      const y = -box.scale.y / 2 + holeSize / 2 + i * (holeSize + box.scale.y / (rows + 1));

      for (let d = 0; d < depth; d++) {
        createHole(THREE, geometry, x, y, d * holeSize);
      }
    }
  }

  geometry.computeVertexNormals();
}

function createHole(THREE, geometry, x, y, z) {
  const positions = geometry.attributes.position.array;
  const indices = geometry.index.array;

  const vertices = [
    new THREE.Vector3(x - 0.1, y - 0.1, z),
    new THREE.Vector3(x + 0.1, y - 0.1, z),
    new THREE.Vector3(x + 0.1, y + 0.1, z),
    new THREE.Vector3(x - 0.1, y + 0.1, z)
  ];

  const startVertex = positions.length / 3;
  vertices.forEach(vertex => {
    positions.push(vertex.x, vertex.y, vertex.z);
  });

  indices.push(startVertex, startVertex + 1, startVertex + 2);
  indices.push(startVertex, startVertex + 2, startVertex + 3);

  geometry.attributes.position.needsUpdate = true;
  geometry.index.needsUpdate = true;
}