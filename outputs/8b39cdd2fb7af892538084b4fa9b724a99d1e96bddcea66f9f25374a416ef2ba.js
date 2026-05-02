export default function generate(THREE) {
  const root = new THREE.Group();

  // Create capsule geometry
  const capsuleGeometry = createCapsuleGeometry(THREE, 1, 0.3, 32, 32);
  const sphereGeometry = createSphereGeometry(THREE, 0.5, 32, 32);

  // Create textures
  const chocolateTexture = createChocolateTexture(THREE);
  const branchTexture = createBranchTexture(THREE);

  // Create materials
  const capsuleMaterial = new THREE.MeshStandardMaterial({
    map: chocolateTexture,
    metalness: 0.1,
    roughness: 0.5,
    color: 0x000000
  });

  const sphereMaterial = new THREE.MeshStandardMaterial({
    map: chocolateTexture,
    metalness: 0.1,
    roughness: 0.5,
    color: 0xFFFFFF
  });

  const branchMaterial = new THREE.MeshBasicMaterial({
    map: branchTexture,
    side: THREE.DoubleSide
  });

  // Create capsule mesh
  const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
  root.add(capsuleMesh);

  // Create sphere mesh
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.set(0, 0.5, 0); // Position sphere inside the capsule
  root.add(sphereMesh);

  // Create branch and leaves
  const branch = createBranch(THREE, branchMaterial);
  root.add(branch);

  fitToUnitCube(THREE, root);
  return root;
}

function createCapsuleGeometry(THREE, radius, height, radialSegments, heightSegments) {
  const geometry = new THREE.CapsuleGeometry(radius, height, radialSegments, heightSegments);
  return geometry;
}

function createSphereGeometry(THREE, radius, widthSegments, heightSegments) {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  return geometry;
}

function createChocolateTexture(THREE) {
  const size = 512;
  const data = new Uint8Array(size * size * 3);

  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const r = 0x4B + (Math.sin(x * 0.1) * 0x20) & 0xFF;
    const g = 0x36 + (Math.cos(y * 0.1) * 0x20) & 0xFF;
    const b = 0x2C + (Math.sin((x + y) * 0.1) * 0x20) & 0xFF;

    data[i * 3] = r;
    data[i * 3 + 1] = g;
    data[i * 3 + 2] = b;
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return texture;
}

function createBranchTexture(THREE) {
  const size = 512;
  const data = new Uint8Array(size * size * 3);

  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const r = 0x4B + (Math.sin(x * 0.1) * 0x20) & 0xFF;
    const g = 0x86 + (Math.cos(y * 0.1) * 0x20) & 0xFF;
    const b = 0x3C + (Math.sin((x + y) * 0.1) * 0x20) & 0xFF;

    data[i * 3] = r;
    data[i * 3 + 1] = g;
    data[i * 3 + 2] = b;
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return texture;
}

function createBranch(THREE, material) {
  const branchGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
  const branchMesh = new THREE.Mesh(branchGeometry, material);

  const leavesGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const leavesMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
  const leavesMesh = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leavesMesh.position.set(0, 1.5, 0);

  branchMesh.add(leavesMesh);
  return branchMesh;
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