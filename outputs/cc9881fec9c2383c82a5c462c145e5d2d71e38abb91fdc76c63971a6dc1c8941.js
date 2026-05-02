export default function generate(THREE) {
  const root = new THREE.Group();

  // Create shell geometry and material
  const shellGeometry = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI);
  const shellMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    metalness: 0.3,
    roughness: 0.7
  });
  const shell = new THREE.Mesh(shellGeometry, shellMaterial);

  // Create flesh geometry and material
  const fleshGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 32);
  const fleshMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFF8DC,
    metalness: 0,
    roughness: 0.5
  });
  const flesh = new THREE.Mesh(fleshGeometry, fleshMaterial);

  // Position the flesh inside the shell
  flesh.position.set(0, -0.1, 0);

  // Add textures to materials
  shell.material.map = createCoarseTexture(THREE);
  flesh.material.map = createFibrousTexture(THREE);

  // Add objects to root group
  root.add(shell);
  root.add(flesh);

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

function createCoarseTexture(THREE) {
  const width = 64;
  const height = 64;
  const data = new Uint8Array(width * height * 3);

  for (let i = 0; i < width * height; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    const value = ((x + y) % 16 === 0) ? 255 : 192;

    data[i * 3] = value;
    data[i * 3 + 1] = value;
    data[i * 3 + 2] = value;
  }

  const texture = new THREE.DataTexture(data, width, height);
  texture.needsUpdate = true;
  return texture;
}

function createFibrousTexture(THREE) {
  const width = 64;
  const height = 64;
  const data = new Uint8Array(width * height * 3);

  for (let i = 0; i < width * height; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    const value = ((x + y) % 16 === 0 || (x - y) % 16 === 0) ? 255 : 224;

    data[i * 3] = value;
    data[i * 3 + 1] = value;
    data[i * 3 + 2] = value;
  }

  const texture = new THREE.DataTexture(data, width, height);
  texture.needsUpdate = true;
  return texture;
}