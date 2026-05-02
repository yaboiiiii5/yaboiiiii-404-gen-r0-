export default function generate(THREE) {
  const root = new THREE.Group();
  
  const material = new THREE.MeshStandardMaterial({ color: 0x8B4513, metalness: 0.2, roughness: 0.8 });

  const smallCylinderGeometry = createTaperedCylinderGeometry(THREE, 0.1, 0.1, 0.5, 32);
  const largeCylinderGeometry = createTaperedCylinderGeometry(THREE, 0.2, 0.2, 1.0, 32);

  for (let i = 0; i < 12; i++) {
    const smallCylinder = new THREE.Mesh(smallCylinderGeometry, material);
    smallCylinder.position.set(0, i * 0.6, 0);
    root.add(smallCylinder);
  }

  const largeCylinder = new THREE.Mesh(largeCylinderGeometry, material);
  largeCylinder.position.set(0, 12 * 0.6 + 0.5, 0);
  root.add(largeCylinder);

  fitToUnitCube(THREE, root);
  return root;
}

function createTaperedCylinderGeometry(THREE, topRadius, bottomRadius, height, radialSegments) {
  const geometry = new THREE.CylinderGeometry(topRadius, bottomRadius, height, radialSegments);
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