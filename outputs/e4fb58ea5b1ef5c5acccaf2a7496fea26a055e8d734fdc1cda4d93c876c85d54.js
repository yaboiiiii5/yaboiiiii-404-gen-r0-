export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const materialLidBase = new THREE.MeshPhysicalMaterial({ color: 0x8B0000, metalness: 0.3, roughness: 0.1 });
  const materialBody = new THREE.MeshPhysicalMaterial({ color: 0x00FFFF, metalness: 0.3, roughness: 0.1 });

  // Create geometry
  const sphereGeometry = new THREE.SphereGeometry(0.25, 32, 32); // Small lid
  const cylinderBodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32); // Medium body
  const cylinderBaseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32); // Small base

  // Create meshes
  const lidMesh = new THREE.Mesh(sphereGeometry, materialLidBase);
  const bodyMesh = new THREE.Mesh(cylinderBodyGeometry, materialBody);
  const baseMesh = new THREE.Mesh(cylinderBaseGeometry, materialLidBase);

  // Position meshes
  lidMesh.position.y = 1.2; // Lid on top
  bodyMesh.position.y = 0.5; // Body in middle
  baseMesh.position.y = -0.3; // Base at bottom

  // Add meshes to root group
  root.add(lidMesh);
  root.add(bodyMesh);
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