export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const hatMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.1, roughness: 0.5 });
  const neckwearMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.1, roughness: 0.5 });

  // Create hat top
  const hatTopGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
  const hatTopMesh = new THREE.Mesh(hatTopGeometry, hatMaterial);
  hatTopMesh.position.y = 0.4;
  root.add(hatTopMesh);

  // Create hat brim
  const hatBrimGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
  const hatBrimMesh = new THREE.Mesh(hatBrimGeometry, hatMaterial);
  hatBrimMesh.position.y = 0.3;
  root.add(hatBrimMesh);

  // Create neckwear
  const neckwearGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.1, 32, 1, true, Math.PI * 0.75, Math.PI * 1.5);
  const neckwearMesh = new THREE.Mesh(neckwearGeometry, neckwearMaterial);
  neckwearMesh.position.y = 0.1;
  root.add(neckwearMesh);

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