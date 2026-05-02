export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const springMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.2 });
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.9, roughness: 0.1 });
  const tipMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.9, roughness: 0.1 });

  // Create spring (torus)
  const springGeometry = createTorusGeometry(THREE);
  const springMesh = new THREE.Mesh(springGeometry, springMaterial);
  root.add(springMesh);

  // Create handle (cylinder)
  const handleGeometry = createCylinderGeometry(THREE);
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.y = -1.5; // Position handle below the spring
  root.add(handleMesh);

  // Create tip (cone)
  const tipGeometry = createConeGeometry(THREE);
  const tipMesh = new THREE.Mesh(tipGeometry, tipMaterial);
  tipMesh.position.y = -3; // Position tip below the handle
  root.add(tipMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createTorusGeometry(THREE) {
  const geometry = new THREE.TorusGeometry(1, 0.25, 16, 32); // Larger radius for spring
  addRidgesToTorus(geometry, THREE);
  return geometry;
}

function addRidgesToTorus(geometry, THREE) {
  const positions = geometry.attributes.position.array;
  const vertexCount = positions.length / 3;

  for (let i = 0; i < vertexCount; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];

    // Calculate the angle in the torus tube
    const theta = Math.atan2(y, x);
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    // Add a ridge effect by modifying the y-coordinate
    const ridgeHeight = 0.1 * Math.sin(8 * theta); // 8 ridges per full circle
    positions[i * 3 + 1] += ridgeHeight;

    // Adjust x and z to maintain the tube radius
    const newRadius = Math.sqrt(x * x + y * y) - ridgeHeight;
    positions[i * 3] = newRadius * cosTheta;
    positions[i * 3 + 2] = newRadius * sinTheta;
  }

  geometry.attributes.position.needsUpdate = true;
}

function createCylinderGeometry(THREE) {
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32); // Smaller radius and height for handle
  addGripToCylinder(geometry, THREE);
  return geometry;
}

function addGripToCylinder(geometry, THREE) {
  const positions = geometry.attributes.position.array;
  const vertexCount = positions.length / 3;

  for (let i = 0; i < vertexCount; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];

    // Calculate the angle in the cylinder
    const theta = Math.atan2(y, x);
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    // Add a grip effect by modifying the radius
    const gripAmplitude = 0.1 * Math.sin(4 * theta); // 4 ridges per full circle
    const newRadius = 0.5 + gripAmplitude;
    positions[i * 3] = newRadius * cosTheta;
    positions[i * 3 + 2] = newRadius * sinTheta;
  }

  geometry.attributes.position.needsUpdate = true;
}

function createConeGeometry(THREE) {
  const geometry = new THREE.ConeGeometry(0.5, 1, 32); // Smaller base radius and height for tip
  addStarToCone(geometry, THREE);
  return geometry;
}

function addStarToCone(geometry, THREE) {
  const positions = geometry.attributes.position.array;
  const vertexCount = positions.length / 3;

  for (let i = 0; i < vertexCount; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];

    // Calculate the angle in the cone base
    const theta = Math.atan2(y, x);
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    // Add a star effect by modifying the radius at the base
    if (y === -0.5) { // Base of the cone
      const starAmplitude = 0.1 * Math.sin(10 * theta); // 10 points per full circle
      const newRadius = 0.5 + starAmplitude;
      positions[i * 3] = newRadius * cosTheta;
      positions[i * 3 + 2] = newRadius * sinTheta;
    }
  }

  geometry.attributes.position.needsUpdate = true;
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