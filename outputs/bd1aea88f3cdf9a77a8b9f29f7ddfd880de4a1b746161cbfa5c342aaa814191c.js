export default function generate(THREE) {
  const root = new THREE.Group();

  // Helper function to create a cylinder
  function createCylinder(radiusTop, radiusBottom, height, radialSegments, material) {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    return new THREE.Mesh(geometry, material);
  }

  // Helper function to create a cone
  function createCone(radius, height, radialSegments, material) {
    const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
    return new THREE.Mesh(geometry, material);
  }

  // Helper function to create a carved texture for the dome
  function createCarvedTexture(size) {
    const data = new Uint8Array(3 * size * size);
    const patternSize = size / 10;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const x = i % patternSize;
        const y = j % patternSize;
        const value = (x > patternSize / 2 && y > patternSize / 2) ? 128 : 255;
        data[3 * (i * size + j)] = value;
        data[3 * (i * size + j) + 1] = value;
        data[3 * (i * size + j) + 2] = value;
      }
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
    texture.needsUpdate = true;
    return texture;
  }

  // Create materials
  const domeMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    metalness: 0.3,
    roughness: 0.7,
    map: createCarvedTexture(256)
  });
  const candleMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    metalness: 0.3,
    roughness: 0.7
  });

  // Create dome (cylinder + cone)
  const domeCylinder = createCylinder(2, 2, 4, 32, domeMaterial);
  const domeCone = createCone(2, 2, 2, 32, domeMaterial);
  domeCone.position.y = 2;
  const domeGroup = new THREE.Group();
  domeGroup.add(domeCylinder);
  domeGroup.add(domeCone);

  // Create candle
  const candle = createCylinder(0.5, 0.5, 3, 32, candleMaterial);
  candle.position.y = -1;

  // Create base
  const base = createCylinder(3, 3, 1, 32, baseMaterial);
  base.position.y = -4.5;

  // Add all parts to the root group
  root.add(domeGroup);
  root.add(candle);
  root.add(base);

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