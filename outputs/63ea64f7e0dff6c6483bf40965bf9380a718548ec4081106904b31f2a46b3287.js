export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Create materials
  const material = createMaterial(THREE);
  
  // Create torus
  const torusGeometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
  const torus = new THREE.Mesh(torusGeometry, material);
  root.add(torus);
  
  // Create pillars
  createPillars(THREE, root, material);
  
  fitToUnitCube(THREE, root);
  return root;
}

function createMaterial(THREE) {
  const texture = createTuftedTexture(THREE);
  return new THREE.MeshStandardMaterial({
    color: 0xFFF0E6,
    metalness: 0.1,
    roughness: 0.5,
    map: texture
  });
}

function createPillars(THREE, root, material) {
  const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
  const buttonGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const x = Math.cos(angle) * 3.5;
    const z = Math.sin(angle) * 3.5;
    
    // Create pillar
    const pillar = new THREE.Mesh(pillarGeometry, material);
    pillar.position.set(x, 0.5, z);
    root.add(pillar);
    
    // Create button on top of pillar
    const button = new THREE.Mesh(buttonGeometry, material);
    button.position.set(x, 1.5, z);
    root.add(button);
  }
}

function createTuftedTexture(THREE) {
  const size = 256;
  const data = new Uint8Array(size * size * 3);
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = (i * size + j) * 3;
      const tuftiness = noise(i / 16, j / 16);
      data[index] = Math.min(255, 200 + tuftiness * 55); // R
      data[index + 1] = Math.min(255, 200 + tuftiness * 55); // G
      data[index + 2] = Math.min(255, 200 + tuftiness * 55); // B
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return texture;
}

function noise(x, y) {
  const seed = 2175486791;
  x += seed;
  y += seed;
  let n = x + y * 57;
  n = (n << 13) - n;
  return ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0;
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