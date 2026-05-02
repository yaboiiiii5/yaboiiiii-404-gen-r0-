export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const blueMaterial = new THREE.MeshPhysicalMaterial({ color: 0x0000FF, metalness: 0.3, roughness: 0.2 });
  const whiteMaterial = new THREE.MeshPhysicalMaterial({ color: 0xFFFFFF, metalness: 0.3, roughness: 0.2 });
  const brownMaterial = new THREE.MeshPhysicalMaterial({ color: 0x8B4513, metalness: 0.3, roughness: 0.2 });

  // Create base
  const baseGeometry = createBaseGeometry(THREE);
  const baseMesh = new THREE.Mesh(baseGeometry, brownMaterial);
  root.add(baseMesh);

  // Create body
  const bodyGeometry = createBodyGeometry(THREE);
  const bodyMesh = new THREE.Mesh(bodyGeometry, blueMaterial);
  root.add(bodyMesh);

  // Create spout
  const spoutGeometry = createSpoutGeometry(THREE);
  const spoutMesh = new THREE.Mesh(spoutGeometry, whiteMaterial);
  root.add(spoutMesh);

  // Create handle
  const handleGeometry = createHandleGeometry(THREE);
  const handleMesh = new THREE.Mesh(handleGeometry, blueMaterial);
  root.add(handleMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createBaseGeometry(THREE) {
  const geometry = new THREE.CylinderGeometry(0.5, 0.7, 0.2, 32);
  geometry.translate(0, 0.1, 0);
  return geometry;
}

function createBodyGeometry(THREE) {
  const geometry = new THREE.CylinderGeometry(0.6, 0.4, 1, 32);
  geometry.translate(0, 0.5, 0);
  return geometry;
}

function createSpoutGeometry(THREE) {
  const points = [];
  for (let i = 0; i <= 10; i++) {
    const angle = (i / 10) * Math.PI;
    const x = 0.4 + 0.2 * Math.sin(angle);
    const y = 0.8 + 0.5 * angle;
    const z = 0.2 * Math.cos(angle);
    points.push(new THREE.Vector3(x, y, z));
  }
  const geometry = new THREE.LatheGeometry(points, 16);
  return geometry;
}

function createHandleGeometry(THREE) {
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.7, 0.8, -0.2),
    new THREE.Vector3(1.2, 1.2, -0.5),
    new THREE.Vector3(1.6, 1.4, -0.2),
    new THREE.Vector3(1.9, 1.6, 0)
  ]);
  const geometry = new THREE.TubeGeometry(path, 64, 0.1, 8, false);
  return geometry;
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