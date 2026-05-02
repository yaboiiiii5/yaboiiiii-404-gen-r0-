export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const headMaterial = createMaterial(0x8B0000);
  const torsoMaterial = createMaterial(0xFF0000);
  const limbsMaterial = createMaterial(0xFFD700);
  const hatMaterial = createMaterial(0x00008B);

  // Head
  const headGeometry = new THREE.SphereGeometry(1, 32, 32);
  const headMesh = new THREE.Mesh(headGeometry, headMaterial);
  headMesh.position.y = 5;
  root.add(headMesh);

  // Torso
  const torsoGeometry = new THREE.CylinderGeometry(2, 2, 4, 32);
  const torsoMesh = new THREE.Mesh(torsoGeometry, torsoMaterial);
  torsoMesh.position.y = 1.5;
  root.add(torsoMesh);

  // Arms
  const armGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
  const leftArmMesh = new THREE.Mesh(armGeometry, limbsMaterial);
  leftArmMesh.position.set(-2.5, 3, 0);
  root.add(leftArmMesh);

  const rightArmMesh = new THREE.Mesh(armGeometry, limbsMaterial);
  rightArmMesh.position.set(2.5, 3, 0);
  root.add(rightArmMesh);

  // Legs
  const legGeometry = new THREE.CylinderGeometry(1, 1, 4, 32);
  const leftLegMesh = new THREE.Mesh(legGeometry, limbsMaterial);
  leftLegMesh.position.set(-1.5, -3, 0);
  root.add(leftLegMesh);

  const rightLegMesh = new THREE.Mesh(legGeometry, limbsMaterial);
  rightLegMesh.position.set(1.5, -3, 0);
  root.add(rightLegMesh);

  // Hat
  const hatGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 32);
  const hatMesh = new THREE.Mesh(hatGeometry, hatMaterial);
  hatMesh.position.y = 6;
  root.add(hatMesh);

  // Mustache
  const mustacheGeometry = createMustache();
  const mustacheMesh = new THREE.Mesh(mustacheGeometry, headMaterial);
  mustacheMesh.position.set(0, 4.5, -1.2);
  root.add(mustacheMesh);

  // Buttons
  const buttonGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  for (let i = 0; i < 3; i++) {
    const buttonMesh = new THREE.Mesh(buttonGeometry, torsoMaterial);
    buttonMesh.position.set(0, -1 + i * 1.5, 2.1);
    root.add(buttonMesh);
  }

  // Belt
  const beltGeometry = new THREE.BoxGeometry(4, 0.3, 0.3);
  const beltMesh = new THREE.Mesh(beltGeometry, limbsMaterial);
  beltMesh.position.y = -1;
  root.add(beltMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.1,
    roughness: 0.5
  });
}

function createMustache() {
  const mustacheShape = new THREE.Shape();
  mustacheShape.moveTo(-2, -1);
  mustacheShape.bezierCurveTo(-2, 1, -1, 2, 0, 2);
  mustacheShape.bezierCurveTo(1, 2, 2, 1, 2, -1);
  mustacheShape.lineTo(1.5, -0.5);
  mustacheShape.bezierCurveTo(1, -1, 0, -1, 0, -0.5);
  mustacheShape.bezierCurveTo(-0.5, -1, -1, -1, -1.5, -0.5);
  mustacheShape.lineTo(-2, -1);

  const extrudeSettings = {
    steps: 2,
    depth: 0.3,
    bevelEnabled: false
  };

  return new THREE.ExtrudeGeometry(mustacheShape, extrudeSettings);
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