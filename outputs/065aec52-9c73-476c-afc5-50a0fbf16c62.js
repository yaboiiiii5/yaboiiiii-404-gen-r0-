export default function generate(THREE) {
  const root = new THREE.Group();

  // Create a rough texture for wood grain
  const createWoodTexture = (THREE) => {
    const width = 512;
    const height = 512;
    const size = width * height;
    const data = new Uint8Array(3 * size);

    const seed = 2175486791;
    let random = (seed) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < size; i++) {
      const r = Math.floor(random(seed + i) * 256);
      const g = Math.floor(random(seed + i + 1) * 256);
      const b = Math.floor(random(seed + i + 2) * 256);

      data[i * 3] = r;
      data[i * 3 + 1] = g;
      data[i * 3 + 2] = b;
    }

    const texture = new THREE.DataTexture(data, width, height, THREE.RGBFormat);
    texture.needsUpdate = true;
    return texture;
  };

  const woodTexture = createWoodTexture(THREE);

  // Create table material
  const tableMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    metalness: 0,
    roughness: 0.8,
    map: woodTexture
  });

  // Create leg material
  const legMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    metalness: 0,
    roughness: 0.8,
    map: woodTexture
  });

  // Create table geometry and mesh
  const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1);
  const tableMesh = new THREE.Mesh(tableGeometry, tableMaterial);
  root.add(tableMesh);

  // Create leg geometries and meshes
  const legGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
  for (let i = -1; i <= 1; i += 2) {
    for (let j = -0.5; j <= 0.5; j += 1) {
      const legMesh = new THREE.Mesh(legGeometry, legMaterial);
      legMesh.position.set(i * 0.95, -0.3, j);
      root.add(legMesh);
    }
  }

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