export default function generate(THREE) {
  const root = new THREE.Group();

  // Create fruit sphere
  const fruitGeometry = new THREE.SphereGeometry(1, 32, 32);
  const fruitMaterial = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
  const fruit = new THREE.Mesh(fruitGeometry, fruitMaterial);

  // Create pit cylinder
  const pitGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
  const pitMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
  const pit = new THREE.Mesh(pitGeometry, pitMaterial);

  // Create rind torus
  const rindGeometry = new THREE.TorusGeometry(1.5, 0.1, 8, 64);
  const rindTextureData = generateRindTextureData();
  const rindTexture = new THREE.DataTexture(rindTextureData, 256, 256, THREE.RGBAFormat);
  rindTexture.needsUpdate = true;
  const rindMaterial = new THREE.MeshStandardMaterial({ color: 0x008000, metalness: 0.3, roughness: 0.7, map: rindTexture });
  const rind = new THREE.Mesh(rindGeometry, rindMaterial);

  // Position pit inside fruit
  pit.position.set(0, -0.5, 0);

  // Add pit to fruit
  fruit.add(pit);

  // Add fruit to rind
  rind.add(fruit);

  // Add rind to root
  root.add(rind);

  fitToUnitCube(THREE, root);
  return root;
}

function generateRindTextureData() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      const value = (x ^ y) & 255;
      data[index] = value; // R
      data[index + 1] = value; // G
      data[index + 2] = value; // B
      data[index + 3] = 255; // A
    }
  }
  return data;
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