export default function generate(THREE) {
  const root = new THREE.Group();

  // Create blade geometry and material
  const bladeGeometry = new THREE.ConeGeometry(0.3, 1, 32);
  const bladeMaterial = createMetallicRoughMaterial(THREE, 0x000000, 0.9, 0.1);

  // Create handle geometry and material
  const handleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 32);
  const handleMaterial = createMetallicRoughMaterial(THREE, 0x000000, 0.9, 0.1);

  // Create blade mesh
  const bladeMesh = new THREE.Mesh(bladeGeometry, bladeMaterial);
  bladeMesh.position.y = 0.5; // Position the blade above the handle

  // Create handle mesh
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.y = -0.4; // Position the handle below the blade

  // Add sharp edge detail to the blade
  addSharpEdgeDetail(THREE, bladeMesh);

  // Add textured grip to the handle
  addTexturedGrip(THREE, handleMesh);

  // Add blade and handle to root group
  root.add(bladeMesh);
  root.add(handleMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createMetallicRoughMaterial(THREE, color, metalness, roughness) {
  return new THREE.MeshStandardMaterial({
    color: color,
    metalness: metalness,
    roughness: roughness
  });
}

function addSharpEdgeDetail(THREE, mesh) {
  const geometry = mesh.geometry;
  const positions = geometry.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    if (positions[i + 1] === 0.5) { // Top of the cone
      positions[i] *= 1.1; // Stretch x-axis to create a sharp edge
      positions[i + 2] *= 1.1; // Stretch z-axis to create a sharp edge
    }
  }

  geometry.attributes.position.needsUpdate = true;
}

function addTexturedGrip(THREE, mesh) {
  const size = 512;
  const data = new Uint8Array(size * size * 4);

  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const value = ((x ^ y) & 16) ? 255 : 0;

    data[i * 4] = value;     // R
    data[i * 4 + 1] = value; // G
    data[i * 4 + 2] = value; // B
    data[i * 4 + 3] = 255;   // A
  }

  const texture = new THREE.DataTexture(data, size, size);
  texture.needsUpdate = true;

  mesh.material.map = texture;
  mesh.material.needsUpdate = true;
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