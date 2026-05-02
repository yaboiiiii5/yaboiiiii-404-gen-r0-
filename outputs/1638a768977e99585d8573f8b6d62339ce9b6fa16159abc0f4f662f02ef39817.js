export default function generate(THREE) {
  const root = new THREE.Group();

  const material = new THREE.MeshStandardMaterial({
    color: 0x808080,
    metalness: 0.8,
    roughness: 0.2
  });

  // Stone (Ring)
  const stoneGeometry = createTorus(THREE, 1, 0.3, 64, 128);
  const stoneMesh = new THREE.Mesh(stoneGeometry, material);
  root.add(stoneMesh);

  // Band
  const bandGeometry = createCylinder(THREE, 0.25, 0.25, 0.1, 32);
  const bandMesh = new THREE.Mesh(bandGeometry, material);
  bandMesh.position.y = -0.4;
  root.add(bandMesh);

  // Sphere
  const sphereGeometry = createSphere(THREE, 0.1, 32, 32);
  const sphereMesh = new THREE.Mesh(sphereGeometry, material);
  sphereMesh.position.y = -0.5;
  root.add(sphereMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createTorus(THREE, radius, tubeRadius, radialSegments, tubularSegments) {
  return new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
}

function createCylinder(THREE, radiusTop, radiusBottom, height, radialSegments) {
  return new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
}

function createSphere(THREE, radius, widthSegments, heightSegments) {
  return new THREE.SphereGeometry(radius, widthSegments, heightSegments);
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