export default function generate(THREE) {
  const root = new THREE.Group();

  // Helper function to create a floral pattern texture
  function createFloralTexture(size, seed) {
    const data = new Uint8Array(size * size * 3);
    let n = seed;
    for (let i = 0; i < size * size * 3; i++) {
      n ^= n << 13;
      n ^= n >> 17;
      n ^= n << 5;
      data[i] = (n & 255) / 4 + 64;
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
    texture.needsUpdate = true;
    return texture;
  }

  // Create vase
  const vaseGeometry = new THREE.CylinderGeometry(0.3, 0.1, 1, 64, 1, false, Math.PI / 2, Math.PI * 1.5);
  const vaseMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    metalness: 0.2,
    roughness: 0.8,
    map: createFloralTexture(256, 2175486791)
  });
  const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
  vase.position.set(0, 0.5, 0);

  // Create chain
  const chainGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 8, 1);
  const chainMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    metalness: 0.8,
    roughness: 0.2
  });
  const chain = new THREE.Mesh(chainGeometry, chainMaterial);
  chain.position.set(0, -0.15, 0);

  // Create base
  const baseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 64);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    metalness: 0.2,
    roughness: 0.8
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(0, -0.5, 0);

  // Build structure
  vase.add(chain);
  chain.add(base);
  root.add(vase);

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