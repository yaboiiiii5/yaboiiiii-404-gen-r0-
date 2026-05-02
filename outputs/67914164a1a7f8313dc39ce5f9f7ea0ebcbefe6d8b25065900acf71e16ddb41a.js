export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Create materials
  const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0, roughness: 0 });
  const goldMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0, roughness: 0 });

  // Create textures
  const floralTexture = createFloralPattern(THREE);
  whiteMaterial.map = floralTexture;
  whiteMaterial.needsUpdate = true;

  // Body: Sphere + Cylinder
  const bodySphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
  const bodyCylinderGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
  const bodySphere = new THREE.Mesh(bodySphereGeometry, whiteMaterial);
  const bodyCylinder = new THREE.Mesh(bodyCylinderGeometry, whiteMaterial);
  bodyCylinder.position.y = -0.75;
  root.add(bodySphere, bodyCylinder);

  // Lid: Sphere + Cylinder
  const lidSphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const lidCylinderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
  const lidSphere = new THREE.Mesh(lidSphereGeometry, whiteMaterial);
  const lidCylinder = new THREE.Mesh(lidCylinderGeometry, whiteMaterial);
  lidSphere.position.y = 2.5;
  lidCylinder.position.set(0, 2.4, 0);
  root.add(lidSphere, lidCylinder);

  // Spout: Cylinder
  const spoutGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
  const spout = new THREE.Mesh(spoutGeometry, whiteMaterial);
  spout.position.set(-2, 1.5, 0);
  root.add(spout);

  // Handle: Cylinder + Curve
  const handleCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2, -0.5, 0),
    new THREE.Vector3(2.5, 0.5, 0.5),
    new THREE.Vector3(3, 1.5, 0)
  ]);
  const handlePoints = handleCurve.getPoints(50);
  const handleGeometry = new THREE.BufferGeometry().setFromPoints(handlePoints);
  const handleMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
  const handle = new THREE.Mesh(handleCylinderGeometry, whiteMaterial);
  const handleLine = new THREE.Line(handleGeometry, handleMaterial);
  handle.position.set(2, -0.5, 0);
  root.add(handle, handleLine);

  // Trim: Gold
  const trimGeometries = [
    new THREE.CylinderGeometry(1.6, 1.6, 0.05, 32),
    new THREE.CylinderGeometry(0.4, 0.4, 0.25, 16),
    new THREE.CylinderGeometry(0.11, 0.11, 1.05, 16)
  ];
  const trimMeshes = trimGeometries.map(geometry => new THREE.Mesh(geometry, goldMaterial));
  trimMeshes[0].position.y = -0.7;
  trimMeshes[1].position.set(0, 2.4, 0);
  trimMeshes[2].position.set(-2, 1.5, 0);
  root.add(...trimMeshes);

  fitToUnitCube(THREE, root);
  return root;
}

function createFloralPattern(THREE) {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = (i * size + j) * 4;
      const x = i / size - 0.5;
      const y = j / size - 0.5;
      const r = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);
      const pattern = Math.sin(16 * angle) * Math.cos(8 * r);
      const value = (pattern + 1) / 2 * 255;
      data[index] = value; // R
      data[index + 1] = value; // G
      data[index + 2] = value; // B
      data[index + 3] = 255; // A
    }
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.needsUpdate = true;
  return texture;
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