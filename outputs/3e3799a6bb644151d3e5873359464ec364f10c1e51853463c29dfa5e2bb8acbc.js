export default function generate(THREE) {
  const root = new THREE.Group();

  // Helper function to create a cylinder with given parameters
  function createCylinder(radiusTop, radiusBottom, height, radialSegments, color, metalness, roughness) {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    const material = new THREE.MeshStandardMaterial({ color: color, metalness: metalness, roughness: roughness });
    return new THREE.Mesh(geometry, material);
  }

  // Helper function to create a bolt
  function createBolt(position) {
    const boltGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 32);
    const boltMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const bolt = new THREE.Mesh(boltGeometry, boltMaterial);
    bolt.position.copy(position);
    return bolt;
  }

  // Create the chair shell
  const chairShell = createCylinder(0.5, 0.3, 1, 64, 0xF0F8FF, 0.2, 0.3);
  chairShell.rotation.x = -Math.PI / 4;
  root.add(chairShell);

  // Create the base
  const base = createCylinder(0.7, 0.7, 0.1, 64, 0xF0F8FF, 0.2, 0.3);
  base.position.y = -0.5;
  root.add(base);

  // Create the wheels
  const wheelRadius = 0.1;
  const wheelHeight = 0.05;
  const wheelPositions = [
    new THREE.Vector3(-0.6, -0.55, -0.6),
    new THREE.Vector3(0.6, -0.55, -0.6),
    new THREE.Vector3(-0.6, -0.55, 0.6),
    new THREE.Vector3(0.6, -0.55, 0.6)
  ];

  wheelPositions.forEach(position => {
    const wheel = createCylinder(wheelRadius, wheelRadius, wheelHeight, 32, 0x00FF00, 0.1, 0.8);
    wheel.position.copy(position);
    root.add(wheel);

    // Add bolts to the wheels
    const boltPositions = [
      new THREE.Vector3(0, -wheelHeight / 2, wheelRadius),
      new THREE.Vector3(0, -wheelHeight / 2, -wheelRadius),
      new THREE.Vector3(wheelRadius, -wheelHeight / 2, 0),
      new THREE.Vector3(-wheelRadius, -wheelHeight / 2, 0)
    ];

    boltPositions.forEach(boltPosition => {
      const bolt = createBolt(new THREE.Vector3().addVectors(position, boltPosition));
      root.add(bolt);
    });
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