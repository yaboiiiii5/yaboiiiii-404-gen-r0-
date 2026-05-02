export default function generate(THREE) {
  const root = new THREE.Group();

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x8B0000,
    metalness: 0.1,
    roughness: 0.2
  });

  // Box (top)
  const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  const box = new THREE.Mesh(boxGeometry, material);
  box.position.y = 1;
  root.add(box);

  // Sphere (legs)
  const sphereGeometry = new THREE.SphereBufferGeometry(0.5, 32, 32);
  const leftLeg = new THREE.Mesh(sphereGeometry, material);
  leftLeg.position.set(-0.75, -0.5, 0.75);
  root.add(leftLeg);

  const rightLeg = new THREE.Mesh(sphereGeometry, material);
  rightLeg.position.set(0.75, -0.5, 0.75);
  root.add(rightLeg);

  const backLeg = new THREE.Mesh(sphereGeometry, material);
  backLeg.position.set(-0.75, -0.5, -0.75);
  root.add(backLeg);

  const frontLeg = new THREE.Mesh(sphereGeometry, material);
  frontLeg.position.set(0.75, -0.5, -0.75);
  root.add(frontLeg);

  // Cylinder (base)
  const cylinderGeometry = new THREE.CylinderBufferGeometry(1, 1, 2, 32);
  const base = new THREE.Mesh(cylinderGeometry, material);
  base.position.y = -1;
  root.add(base);

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