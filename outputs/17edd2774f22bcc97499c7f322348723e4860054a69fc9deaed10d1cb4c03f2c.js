export default function generate(THREE) {
  const root = new THREE.Group();

  const largeBoxSize = 2;
  const smallBoxSize = 0.5;

  const material = new THREE.MeshStandardMaterial({
    color: 0x808080,
    metalness: 0.8,
    roughness: 0.2
  });

  const transparentMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.5
  });

  const blackMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    metalness: 0.8,
    roughness: 0.2
  });

  // Large Box
  const largeBoxGeometry = new THREE.BoxGeometry(largeBoxSize, largeBoxSize, largeBoxSize);
  const largeBox = new THREE.Mesh(largeBoxGeometry, material);
  root.add(largeBox);

  // Transparent Lid
  const lidGeometry = new THREE.BoxGeometry(largeBoxSize, 0.1, largeBoxSize);
  const lid = new THREE.Mesh(lidGeometry, transparentMaterial);
  lid.position.y = largeBoxSize / 2 + 0.05;
  root.add(lid);

  // Black Feet
  const footGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.2);
  const feetPositions = [
    [-largeBoxSize/2 + 0.1, -largeBoxSize/2 + 0.1, largeBoxSize/2 - 0.1],
    [largeBoxSize/2 - 0.1, -largeBoxSize/2 + 0.1, largeBoxSize/2 - 0.1],
    [-largeBoxSize/2 + 0.1, -largeBoxSize/2 + 0.1, -largeBoxSize/2 + 0.1],
    [largeBoxSize/2 - 0.1, -largeBoxSize/2 + 0.1, -largeBoxSize/2 + 0.1]
  ];

  feetPositions.forEach(pos => {
    const foot = new THREE.Mesh(footGeometry, blackMaterial);
    foot.position.set(...pos);
    root.add(foot);
  });

  // Small Boxes
  const smallBoxGeometry = new THREE.BoxGeometry(smallBoxSize, smallBoxSize, smallBoxSize);
  const smallBoxesPositions = [
    [-largeBoxSize/2 + smallBoxSize/2, largeBoxSize/4, -largeBoxSize/2 + smallBoxSize/2],
    [0, largeBoxSize/4, -largeBoxSize/2 + smallBoxSize/2],
    [largeBoxSize/2 - smallBoxSize/2, largeBoxSize/4, -largeBoxSize/2 + smallBoxSize/2],
    [-largeBoxSize/2 + smallBoxSize/2, largeBoxSize/4, 0],
    [0, largeBoxSize/4, 0],
    [largeBoxSize/2 - smallBoxSize/2, largeBoxSize/4, 0],
    [-largeBoxSize/2 + smallBoxSize/2, largeBoxSize/4, largeBoxSize/2 - smallBoxSize/2],
    [0, largeBoxSize/4, largeBoxSize/2 - smallBoxSize/2],
    [largeBoxSize/2 - smallBoxSize/2, largeBoxSize/4, largeBoxSize/2 - smallBoxSize/2],
    [-largeBoxSize/2 + smallBoxSize/2, largeBoxSize/2 - smallBoxSize/2, -largeBoxSize/2 + smallBoxSize/2],
    [0, largeBoxSize/2 - smallBoxSize/2, -largeBoxSize/2 + smallBoxSize/2],
    [largeBoxSize/2 - smallBoxSize/2, largeBoxSize/2 - smallBoxSize/2, -largeBoxSize/2 + smallBoxSize/2]
  ];

  smallBoxesPositions.forEach(pos => {
    const smallBox = new THREE.Mesh(smallBoxGeometry, material);
    smallBox.position.set(...pos);
    root.add(smallBox);
  });

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