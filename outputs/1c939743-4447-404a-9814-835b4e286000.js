export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Create textures
  const torusTexture = createConcentricRingsTexture(THREE, 0xFF00FF);
  const cylinderTexture = createConcentricRingsTexture(THREE, 0x0000FF);
  const sphereTexture = createCentralDotTexture(THREE, 0x000000);

  // Create materials
  const torusMaterial = new THREE.MeshStandardMaterial({ map: torusTexture, metalness: 0.3, roughness: 0.5 });
  const cylinderMaterial = new THREE.MeshStandardMaterial({ map: cylinderTexture, metalness: 0.3, roughness: 0.5 });
  const sphereMaterial = new THREE.MeshStandardMaterial({ map: sphereTexture, metalness: 0.3, roughness: 0.5 });

  // Create geometries
  const torusGeometry = new THREE.TorusGeometry(1, 0.2, 16, 100);
  const cylinderGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 32);
  const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);

  // Create meshes
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // Position and scale meshes
  cylinderMesh.position.set(0, -0.4, 0);
  sphereMesh.position.set(0, -1, 0);

  // Add meshes to root
  root.add(torusMesh);
  root.add(cylinderMesh);
  root.add(sphereMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createConcentricRingsTexture(THREE, color) {
  const size = 512;
  const data = new Uint8Array(size * size * 4);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 4;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const ringWidth = radius / 5;

      let alpha = 255;
      if (distance > radius) {
        alpha = 0;
      } else {
        const ringIndex = Math.floor(distance / ringWidth) % 2;
        alpha = ringIndex === 0 ? 255 : 0;
      }

      const index = (y * size + x) * 4;
      data[index] = (color >> 16) & 0xFF; // R
      data[index + 1] = (color >> 8) & 0xFF; // G
      data[index + 2] = color & 0xFF; // B
      data[index + 3] = alpha;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  return texture;
}

function createCentralDotTexture(THREE, color) {
  const size = 512;
  const data = new Uint8Array(size * size * 4);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 32;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let alpha = 255;
      if (distance > radius) {
        alpha = 0;
      }

      const index = (y * size + x) * 4;
      data[index] = (color >> 16) & 0xFF; // R
      data[index + 1] = (color >> 8) & 0xFF; // G
      data[index + 2] = color & 0xFF; // B
      data[index + 3] = alpha;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
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