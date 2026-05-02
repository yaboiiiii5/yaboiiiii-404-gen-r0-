export default function generate(THREE) {
  const root = new THREE.Group();

  // Create handle
  const handleGeometry = createCurvedHandleGeometry();
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000, metalness: 0.8, roughness: 0.2 });
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  root.add(handleMesh);

  // Create ribs
  const ribs = createRibs(THREE);
  root.add(ribs);

  // Create canopy
  const canopyGeometry = createCanopyGeometry();
  const canopyMaterial = createDottedPatternMaterial(THREE);
  const canopyMesh = new THREE.Mesh(canopyGeometry, canopyMaterial);
  root.add(canopyMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createCurvedHandleGeometry() {
  const points = [];
  for (let i = 0; i <= 10; i++) {
    const angle = Math.PI * 2 * (i / 10);
    const x = Math.sin(angle) * 0.1;
    const y = -i * 0.1 + 0.5;
    const z = Math.cos(angle) * 0.1;
    points.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 64, 0.02, 8, false);
  return geometry;
}

function createRibs(THREE) {
  const group = new THREE.Group();
  const ribMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  for (let i = 0; i < 12; i++) {
    const angle = Math.PI * 2 * (i / 12);
    const x = Math.sin(angle) * 0.5;
    const z = Math.cos(angle) * 0.5;
    const ribGeometry = new THREE.BoxGeometry(0.01, 0.6, 0.01);
    const ribMesh = new THREE.Mesh(ribGeometry, ribMaterial);
    ribMesh.position.set(x, -0.2, z);
    ribMesh.rotation.x = Math.PI / 4;
    group.add(ribMesh);
  }
  return group;
}

function createCanopyGeometry() {
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32, 1, true);
  geometry.translate(0, -0.4, 0);
  return geometry;
}

function createDottedPatternMaterial(THREE) {
  const size = 64;
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    if ((x + y) % 2 === 0) {
      data[i * 3] = 140; // R
      data[i * 3 + 1] = 0; // G
      data[i * 3 + 2] = 0; // B
    } else {
      data[i * 3] = 0; // R
      data[i * 3 + 1] = 0; // G
      data[i * 3 + 2] = 0; // B
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return new THREE.MeshStandardMaterial({ color: 0x8B0000, map: texture, metalness: 0.1, roughness: 0.3 });
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