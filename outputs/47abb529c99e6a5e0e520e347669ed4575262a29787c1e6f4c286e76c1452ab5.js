export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const material = new THREE.MeshStandardMaterial({
    color: 0x8B0000,
    metalness: 0.8,
    roughness: 0.3,
    map: createScalesTexture(THREE)
  });

  // Create snake body (torus)
  const snakeBodyGeometry = new THREE.TorusGeometry(1, 0.25, 16, 100);
  const snakeBodyMesh = new THREE.Mesh(snakeBodyGeometry, material);
  root.add(snakeBodyMesh);

  // Create head (cylinder with open mouth)
  const headGeometry = createHeadGeometry(THREE);
  const headMesh = new THREE.Mesh(headGeometry, material);
  headMesh.position.set(0, 1.25, 0); // Position the head above the snake body
  root.add(headMesh);

  // Create ring (torus)
  const ringGeometry = new THREE.TorusGeometry(0.75, 0.1, 8, 64);
  const ringMesh = new THREE.Mesh(ringGeometry, material);
  ringMesh.position.set(0, -0.25, 0); // Position the ring below the snake body
  root.add(ringMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createScalesTexture(THREE) {
  const size = 1024;
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const scalePattern = (Math.sin(x / 50) + Math.cos(y / 50)) * 128 + 128;
    data[i * 3] = scalePattern; // R
    data[i * 3 + 1] = scalePattern; // G
    data[i * 3 + 2] = scalePattern; // B
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return texture;
}

function createHeadGeometry(THREE) {
  const headGeometry = new THREE.CylinderGeometry(0.5, 0.75, 1, 32, 1, false, Math.PI / 4, (Math.PI * 3) / 2);
  // Create the mouth opening
  const mouthShape = new THREE.Shape();
  mouthShape.moveTo(-0.6, -0.5);
  mouthShape.lineTo(0.6, -0.5);
  mouthShape.quadraticCurveTo(0.4, -0.3, 0, 0);
  mouthShape.quadraticCurveTo(-0.4, -0.3, -0.6, -0.5);

  const extrudeSettings = {
    steps: 1,
    depth: 0.2,
    bevelEnabled: false
  };

  const mouthGeometry = new THREE.ExtrudeGeometry(mouthShape, extrudeSettings);
  mouthGeometry.translate(0, -0.6, 0.5);

  headGeometry.merge(mouthGeometry);
  return headGeometry;
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