export default function generate(THREE) {
  const root = new THREE.Group();
  
  const material = new THREE.MeshStandardMaterial({
    color: 0x000000,
    metalness: 0.8,
    roughness: 0.2
  });

  const teapotGeometry = createTeapotGeometry(THREE);
  const teapotMesh = new THREE.Mesh(teapotGeometry, material);
  root.add(teapotMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createTeapotGeometry(THREE) {
  const geometry = new THREE.BufferGeometry();
  
  // Vertices for a simplified teapot
  const vertices = [
    // Body of the teapot
    -0.5, -0.2, 0.3,
    0.5, -0.2, 0.3,
    0.5, 0.2, 0.3,
    -0.5, 0.2, 0.3,

    // Spout
    0.6, -0.1, 0.4,
    0.8, -0.1, 0.4,
    0.7, 0.1, 0.4,

    // Handle
    0.5, 0.2, -0.3,
    0.6, 0.4, -0.2,
    0.5, 0.6, -0.3,

    // Lid
    -0.4, 0.4, 0.3,
    0.4, 0.4, 0.3,
    0.4, 0.6, 0.3,
    -0.4, 0.6, 0.3
  ];

  // Indices for the faces of the teapot
  const indices = [
    // Body
    0, 1, 2,
    0, 2, 3,

    // Spout
    4, 5, 6,

    // Handle
    7, 8, 9,

    // Lid
    10, 11, 12,
    10, 12, 13
  ];

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);

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