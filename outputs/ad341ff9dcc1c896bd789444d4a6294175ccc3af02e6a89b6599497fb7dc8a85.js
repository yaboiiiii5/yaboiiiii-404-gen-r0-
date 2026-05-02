export default function generate(THREE) {
  const root = new THREE.Group();

  // Create pumpkin body
  const pumpkinGeometry = new THREE.SphereGeometry(1, 32, 32);
  const pumpkinMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA07A, metalness: 0.1, roughness: 0.5 });
  const pumpkinMesh = new THREE.Mesh(pumpkinGeometry, pumpkinMaterial);

  // Create stem
  const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 32);
  const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, metalness: 0.1, roughness: 0.5 });
  const stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);

  // Position stem on top of pumpkin
  stemMesh.position.set(0, 1.1, 0);

  // Create cut-out face
  createPumpkinFace(pumpkinMesh);

  // Add seeds inside the pumpkin
  addSeedsToPumpkin(pumpkinMesh, THREE);

  // Add meshes to root group
  root.add(pumpkinMesh);
  root.add(stemMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createPumpkinFace(pumpkinMesh) {
  const faceGeometry = new THREE.Geometry();
  const vertices = [
    new THREE.Vector3(-0.5, -0.2, 1),
    new THREE.Vector3(0.5, -0.2, 1),
    new THREE.Vector3(0.5, 0.2, 1),
    new THREE.Vector3(-0.5, 0.2, 1)
  ];
  faceGeometry.vertices.push(...vertices);
  faceGeometry.faces.push(new THREE.Face3(0, 1, 2));
  faceGeometry.faces.push(new THREE.Face3(0, 2, 3));

  const eyeGeometry = new THREE.Geometry();
  const eyeVertices = [
    new THREE.Vector3(-0.4, -0.1, 1),
    new THREE.Vector3(-0.3, -0.1, 1),
    new THREE.Vector3(-0.3, 0.1, 1),
    new THREE.Vector3(-0.4, 0.1, 1)
  ];
  eyeGeometry.vertices.push(...eyeVertices);
  eyeGeometry.faces.push(new THREE.Face3(0, 1, 2));
  eyeGeometry.faces.push(new THREE.Face3(0, 2, 3));

  const noseGeometry = new THREE.Geometry();
  const noseVertices = [
    new THREE.Vector3(-0.1, -0.1, 1),
    new THREE.Vector3(0.1, -0.1, 1),
    new THREE.Vector3(0, 0.1, 1)
  ];
  noseGeometry.vertices.push(...noseVertices);
  noseGeometry.faces.push(new THREE.Face3(0, 1, 2));

  const mouthGeometry = new THREE.Geometry();
  const mouthVertices = [
    new THREE.Vector3(-0.4, -0.25, 1),
    new THREE.Vector3(0.4, -0.25, 1),
    new THREE.Vector3(0.4, -0.15, 1),
    new THREE.Vector3(-0.4, -0.15, 1)
  ];
  mouthGeometry.vertices.push(...mouthVertices);
  mouthGeometry.faces.push(new THREE.Face3(0, 1, 2));
  mouthGeometry.faces.push(new THREE.Face3(0, 2, 3));

  const faceMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const eyeMesh = new THREE.Mesh(eyeGeometry, faceMaterial);
  const noseMesh = new THREE.Mesh(noseGeometry, faceMaterial);
  const mouthMesh = new THREE.Mesh(mouthGeometry, faceMaterial);

  pumpkinMesh.add(new THREE.Mesh(faceGeometry, faceMaterial));
  pumpkinMesh.add(eyeMesh.clone().position.set(-0.2, 0.15, 1));
  pumpkinMesh.add(eyeMesh.clone().position.set(0.2, 0.15, 1));
  pumpkinMesh.add(noseMesh);
  pumpkinMesh.add(mouthMesh);
}

function addSeedsToPumpkin(pumpkinMesh, THREE) {
  const seedGeometry = new THREE.SphereGeometry(0.03, 8, 8);
  const seedMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
  const seedCount = 20;
  const seeds = [];

  for (let i = 0; i < seedCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / seedCount);
    const theta = Math.sqrt(seedCount * Math.PI) * phi;

    const x = Math.cos(theta) * Math.sin(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(phi);

    const seedMesh = new THREE.Mesh(seedGeometry, seedMaterial);
    seedMesh.position.set(x * 0.9, y * 1.1, z * 0.9); // Adjust position to be inside the pumpkin
    seeds.push(seedMesh);
  }

  seeds.forEach(seed => pumpkinMesh.add(seed));
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