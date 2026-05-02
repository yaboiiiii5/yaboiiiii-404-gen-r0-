export default function generate(THREE) {
  const root = new THREE.Group();

  // Helper function to create a speckled texture
  function createSpeckledTexture(size, color1, color2, seed) {
    const data = new Uint8Array(size * size * 4);
    let n = seed;
    for (let i = 0; i < size * size; i++) {
      n ^= n << 13;
      n ^= n >> 17;
      n ^= n << 5;
      const randomValue = ((n >>> 0) % 256) / 256;
      const color = randomValue > 0.5 ? color1 : color2;
      data[i * 4] = (color >> 16) & 0xff; // R
      data[i * 4 + 1] = (color >> 8) & 0xff; // G
      data[i * 4 + 2] = color & 0xff; // B
      data[i * 4 + 3] = 255; // A
    }
    const texture = new THREE.DataTexture(data, size, size);
    texture.needsUpdate = true;
    return texture;
  }

  // Create speckled textures for the cylinder and cone
  const cylinderTexture = createSpeckledTexture(1024, 0x00FF00, 0x0000FF, 2175486791);
  const coneTexture = createSpeckledTexture(1024, 0x00FF00, 0x0000FF, 2175486791);

  // Create materials
  const cylinderMaterial = new THREE.MeshStandardMaterial({
    map: cylinderTexture,
    roughness: 0.8,
    metalness: 0
  });
  const coneMaterial = new THREE.MeshStandardMaterial({
    map: coneTexture,
    roughness: 0.8,
    metalness: 0
  });

  // Create the cylindrical body
  const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  root.add(cylinderMesh);

  // Create the conical cut
  const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32);
  const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
  coneMesh.position.x = 1; // Position the cone on the right side of the cylinder
  root.add(coneMesh);

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