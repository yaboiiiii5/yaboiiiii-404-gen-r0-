export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x0080FF, metalness: 0.8, roughness: 0.2 });
  const bellyMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00, metalness: 0.8, roughness: 0.2 });
  const finMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF, metalness: 0.8, roughness: 0.2 });

  // Body
  const bodyGeometry = new THREE.CapsuleGeometry(1, 1.5, 32, 32);
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  root.add(bodyMesh);

  // Belly
  const bellyGeometry = new THREE.SphereGeometry(0.75, 32, 32);
  const bellyMesh = new THREE.Mesh(bellyGeometry, bellyMaterial);
  bellyMesh.position.set(0, -0.6, 0);
  root.add(bellyMesh);

  // Fins
  const finGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32);
  const leftFinMesh = new THREE.Mesh(finGeometry, finMaterial);
  leftFinMesh.position.set(-0.8, -0.4, 0.7);
  leftFinMesh.rotation.x = Math.PI / 4;
  root.add(leftFinMesh);

  const rightFinMesh = new THREE.Mesh(finGeometry, finMaterial);
  rightFinMesh.position.set(0.8, -0.4, 0.7);
  rightFinMesh.rotation.x = -Math.PI / 4;
  root.add(rightFinMesh);

  // Tail
  const tailGeometry = new THREE.ConeGeometry(0.5, 1, 32);
  const tailMesh = new THREE.Mesh(tailGeometry, finMaterial);
  tailMesh.position.set(0, -1.75, 0);
  tailMesh.rotation.x = Math.PI / 2;
  root.add(tailMesh);

  // Eye
  const eyeGeometry = new THREE.SphereGeometry(0.05, 32, 32);
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const leftEyeMesh = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEyeMesh.position.set(-0.4, 0.6, 0.8);
  root.add(leftEyeMesh);

  const rightEyeMesh = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEyeMesh.position.set(0.4, 0.6, 0.8);
  root.add(rightEyeMesh);

  // Mouth
  const mouthGeometry = new THREE.ConeGeometry(0.1, 0.3, 32);
  const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const mouthMesh = new THREE.Mesh(mouthGeometry, mouthMaterial);
  mouthMesh.position.set(0, -0.85, 0.7);
  mouthMesh.rotation.x = Math.PI;
  root.add(mouthMesh);

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