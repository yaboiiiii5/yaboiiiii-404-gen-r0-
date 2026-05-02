export default function generate(THREE) {
  const root = new THREE.Group();
  
  const baseHeight = 1;
  const baseRadius = 1;
  const numCylinders = 5;
  const heightDecay = 0.7;
  const radiusDecay = 0.8;

  for (let i = 0; i < numCylinders; i++) {
    const geometry = new THREE.CylinderGeometry(baseRadius * Math.pow(radiusDecay, i), baseRadius * Math.pow(radiusDecay, i + 1), baseHeight * Math.pow(heightDecay, i), 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xFFA07A, metalness: 0.3, roughness: 0.2 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = (baseHeight / 2) * (1 - Math.pow(heightDecay, i + 1)) - (baseHeight / 2) * (1 - Math.pow(heightDecay, i));
    root.add(mesh);
  }

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