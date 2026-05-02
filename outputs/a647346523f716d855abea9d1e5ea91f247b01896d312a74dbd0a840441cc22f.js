export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const material = new THREE.MeshStandardMaterial({
    color: 0x0080FF,
    metalness: 0.8,
    roughness: 0.2
  });

  // Create textures
  const gridTexture = createGridTexture(THREE);
  material.map = gridTexture;
  material.needsUpdate = true;

  // Create dome (sphere)
  const domeGeometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMesh = new THREE.Mesh(domeGeometry, material);
  root.add(domeMesh);

  // Create cylinder
  const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
  const cylinderMesh = new THREE.Mesh(cylinderGeometry, material);
  cylinderMesh.position.y = -0.75;
  root.add(cylinderMesh);

  // Create base (torus)
  const baseGeometry = new THREE.TorusGeometry(1, 0.2, 16, 32);
  const baseMesh = new THREE.Mesh(baseGeometry, material);
  baseMesh.rotation.x = Math.PI / 2;
  baseMesh.position.y = -1.5;
  root.add(baseMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createGridTexture(THREE) {
  const size = 64;
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const color = ((i & 16) === (j & 16)) ? 255 : 0;
      data[(i * size + j) * 3] = color;
      data[(i * size + j) * 3 + 1] = color;
      data[(i * size + j) * 3 + 2] = color;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return texture;
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