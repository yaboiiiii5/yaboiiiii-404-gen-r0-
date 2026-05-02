export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const shoeMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, metalness: 0.2, roughness: 0.8 });
  const laceMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, metalness: 0.2, roughness: 0.8 });
  const soleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.1, roughness: 0.9 });
  const stitchingMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

  // Create shoe geometry
  const shoeGeometry = new THREE.BoxGeometry(2, 1, 0.5);
  const shoeMesh = new THREE.Mesh(shoeGeometry, shoeMaterial);
  shoeMesh.position.set(0, 0.75, 0);
  root.add(shoeMesh);

  // Create laces geometry
  const laceGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 32);
  const laceMesh = new THREE.Mesh(laceGeometry, laceMaterial);
  laceMesh.position.set(0, 0, 0);
  root.add(laceMesh);

  // Create soles geometry
  const soleGeometry = new THREE.CylinderGeometry(1.1, 1.1, 0.2, 32);
  const soleMesh = new THREE.Mesh(soleGeometry, soleMaterial);
  soleMesh.position.set(0, -0.5, 0);
  root.add(soleMesh);

  // Create stitching
  const stitchingGeometry = createStitchingGeometry();
  const stitchingLine = new THREE.LineSegments(stitchingGeometry, stitchingMaterial);
  shoeMesh.add(stitchingLine);

  fitToUnitCube(THREE, root);
  return root;
}

function createStitchingGeometry() {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const numStitches = 10;

  for (let i = 0; i < numStitches; i++) {
    const x = -1 + (i / (numStitches - 1)) * 2;
    vertices.push(x, 0.5, 0.25);
    vertices.push(x, 0.5, -0.25);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
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