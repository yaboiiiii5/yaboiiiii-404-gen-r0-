export default function generate(THREE) {
  const root = new THREE.Group();

  // Helper function to create a capsule geometry
  function createCapsuleGeometry(radius, height, capSegments, radialSegments) {
    const halfHeight = height / 2;
    const sphereGeometryTop = new THREE.SphereGeometry(radius, radialSegments, capSegments, 0, Math.PI * 2, 0, Math.PI / 2);
    const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments, 1, true);
    const sphereGeometryBottom = new THREE.SphereGeometry(radius, radialSegments, capSegments, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);

    const capsuleGeometry = new THREE.BufferGeometry();
    capsuleGeometry.merge(sphereGeometryTop);
    capsuleGeometry.merge(cylinderGeometry, new THREE.Matrix4().translate(0, halfHeight, 0));
    capsuleGeometry.merge(sphereGeometryBottom, new THREE.Matrix4().translate(0, height, 0));

    return capsuleGeometry;
  }

  // Helper function to create F-holes
  function createFHoleShape(radius, depth) {
    const shape = new THREE.Shape();
    shape.moveTo(-radius, -depth);
    shape.bezierCurveTo(-radius * 0.5, -depth, -radius * 0.25, -depth * 0.75, 0, -depth * 0.75);
    shape.bezierCurveTo(radius * 0.25, -depth * 0.75, radius * 0.5, -depth, radius, -depth);
    shape.lineTo(radius, depth);
    shape.bezierCurveTo(radius * 0.5, depth, radius * 0.25, depth * 0.75, 0, depth * 0.75);
    shape.bezierCurveTo(-radius * 0.25, depth * 0.75, -radius * 0.5, depth, -radius, depth);
    return shape;
  }

  // Create body
  const bodyGeometry = createCapsuleGeometry(1, 3, 8, 32);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFF4500, metalness: 0.5, roughness: 0.3 });
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  root.add(bodyMesh);

  // Create neck
  const neckGeometry = new THREE.CylinderGeometry(0.2, 0.1, 2, 32);
  const neckMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
  const neckMesh = new THREE.Mesh(neckGeometry, neckMaterial);
  neckMesh.position.set(0, 1.5, 0);
  root.add(neckMesh);

  // Create bridge
  const bridgeGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.1);
  const bridgeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const bridgeMesh = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
  bridgeMesh.position.set(0, 3, -0.5);
  root.add(bridgeMesh);

  // Create scroll
  const scrollGeometry = new THREE.ConeGeometry(0.2, 1, 32);
  const scrollMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
  const scrollMesh = new THREE.Mesh(scrollGeometry, scrollMaterial);
  scrollMesh.position.set(0, 4, 0);
  root.add(scrollMesh);

  // Create F-holes
  const fHoleShape = createFHoleShape(0.5, 0.2);
  const fHoleGeometry = new THREE.ExtrudeGeometry(fHoleShape, { depth: 0.1 });
  const fHoleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const fHoleMesh1 = new THREE.Mesh(fHoleGeometry, fHoleMaterial);
  fHoleMesh1.position.set(-0.5, 2, -0.6);
  root.add(fHoleMesh1);

  const fHoleMesh2 = new THREE.Mesh(fHoleGeometry.clone(), fHoleMaterial);
  fHoleMesh2.position.set(0.5, 2, -0.6);
  root.add(fHoleMesh2);

  // Create strings
  const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 4, 32);
  const stringMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
  for (let i = 0; i < 4; i++) {
    const stringMesh = new THREE.Mesh(stringGeometry.clone(), stringMaterial);
    stringMesh.position.set(-0.5 + i * 0.3, 2.5, -0.6);
    root.add(stringMesh);
  }

  // Create tuning pegs
  const pegGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 32);
  for (let i = 0; i < 4; i++) {
    const pegMesh = new THREE.Mesh(pegGeometry.clone(), stringMaterial);
    pegMesh.position.set(-0.5 + i * 0.3, 4.2, 0);
    root.add(pegMesh);
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