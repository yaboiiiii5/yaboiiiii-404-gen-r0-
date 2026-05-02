export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const materialMain = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8, roughness: 0.2 });
  const materialProtrusion = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.2 });

  // Create main body
  const geometryMain = new THREE.BoxGeometry(1, 0.5, 0.3);
  const meshMain = new THREE.Mesh(geometryMain, materialMain);
  root.add(meshMain);

  // Create protrusion
  const geometryProtrusion = new THREE.BoxGeometry(0.2, 0.1, 0.1);
  const meshProtrusion = new THREE.Mesh(geometryProtrusion, materialProtrusion);
  meshProtrusion.position.set(0.5, 0, 0);
  root.add(meshProtrusion);

  // Create digital display (simple rectangle)
  const geometryDisplay = new THREE.BoxGeometry(0.8, 0.1, 0.01);
  const materialDisplay = new THREE.MeshStandardMaterial({ color: 0x0000FF, metalness: 0.8, roughness: 0.2 });
  const meshDisplay = new THREE.Mesh(geometryDisplay, materialDisplay);
  meshDisplay.position.set(0, -0.3, 0.15);
  root.add(meshDisplay);

  // Create hinge-like mechanism (simple cylinder)
  const geometryHinge = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 32);
  const materialHinge = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.2 });
  const meshHinge = new THREE.Mesh(geometryHinge, materialHinge);
  meshHinge.position.set(0.5, -0.15, 0);
  root.add(meshHinge);

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