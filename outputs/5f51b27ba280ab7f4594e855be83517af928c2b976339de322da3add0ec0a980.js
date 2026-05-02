export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x808080,
    metalness: 0.9,
    roughness: 0.1
  });

  // Body (Cylinder)
  const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
  const bodyMesh = new THREE.Mesh(bodyGeometry, material);
  root.add(bodyMesh);

  // Handles (Torus)
  const handleGeometry = new THREE.TorusGeometry(1, 0.1, 8, 64);
  const leftHandleMesh = new THREE.Mesh(handleGeometry, material);
  leftHandleMesh.position.set(-1.2, 1, 0);
  root.add(leftHandleMesh);

  const rightHandleMesh = new THREE.Mesh(handleGeometry, material);
  rightHandleMesh.position.set(1.2, 1, 0);
  root.add(rightHandleMesh);

  // Base (Cylinder)
  const baseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
  const baseMesh = new THREE.Mesh(baseGeometry, material);
  baseMesh.position.set(0, -1, 0);
  root.add(baseMesh);

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