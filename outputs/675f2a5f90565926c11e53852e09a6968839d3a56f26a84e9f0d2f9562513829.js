export default function generate(THREE) {
  const root = new THREE.Group();

  // Create a box geometry with internal divisions
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const innerBoxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);

  // Create materials for the box and inner box
  const outerMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0000FF,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.5,
    reflectivity: 1.0
  });

  const innerMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.5,
    reflectivity: 1.0
  });

  // Create the outer box mesh and add it to the root group
  const outerBox = new THREE.Mesh(boxGeometry, outerMaterial);
  root.add(outerBox);

  // Create the inner box mesh and add it to the root group
  const innerBox = new THREE.Mesh(innerBoxGeometry, innerMaterial);
  innerBox.position.set(0, 0, 0);
  root.add(innerBox);

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