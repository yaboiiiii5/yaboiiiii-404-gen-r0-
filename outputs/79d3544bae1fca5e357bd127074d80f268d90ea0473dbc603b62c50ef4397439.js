export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const bodyMaterial = new THREE.MeshPhysicalMaterial({ color: 0xff00ff, metalness: 0.3, roughness: 0.1 });
  const lidMaterial = new THREE.MeshPhysicalMaterial({ color: 0xff0000, metalness: 0.3, roughness: 0.1 });

  // Create geometry
  const bodyGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const lidGeometry = new THREE.ConeGeometry(0.8, 0.5, 32);

  // Create meshes
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  const lidMesh = new THREE.Mesh(lidGeometry, lidMaterial);

  // Position the lid on top of the body
  lidMesh.position.y = 1.25;

  // Add meshes to root group
  root.add(bodyMesh);
  root.add(lidMesh);

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