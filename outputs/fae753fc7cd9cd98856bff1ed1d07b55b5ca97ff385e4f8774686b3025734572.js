export default function generate(THREE) {
  const root = new THREE.Group();

  // Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8, roughness: 0.2 });
  const keysMaterial = new THREE.MeshStandardMaterial({ color: 0x00FFFF, metalness: 0.8, roughness: 0.2 });
  const buttonsMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

  // Box (body)
  const boxGeometry = new THREE.BoxGeometry(1, 0.5, 0.3);
  const boxMesh = new THREE.Mesh(boxGeometry, bodyMaterial);
  root.add(boxMesh);

  // Capsule (keys)
  const capsuleGeometry = createCapsuleGeometry(0.05, 0.2, 8, 8);
  const keysMesh1 = new THREE.Mesh(capsuleGeometry, keysMaterial);
  keysMesh1.position.set(-0.4, 0.3, 0);
  root.add(keysMesh1);

  const keysMesh2 = new THREE.Mesh(capsuleGeometry.clone(), keysMaterial);
  keysMesh2.position.set(0.4, 0.3, 0);
  root.add(keysMesh2);

  // Cylinder (socket)
  const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 8);
  const socketMesh = new THREE.Mesh(cylinderGeometry, bodyMaterial);
  socketMesh.position.set(0, -0.35, 0);
  root.add(socketMesh);

  // Black buttons
  const buttonGeometry = new THREE.SphereGeometry(0.04, 8, 8);
  const button1 = new THREE.Mesh(buttonGeometry, buttonsMaterial);
  button1.position.set(-0.4, 0.3, 0.25);
  root.add(button1);

  const button2 = new THREE.Mesh(buttonGeometry.clone(), buttonsMaterial);
  button2.position.set(0.4, 0.3, 0.25);
  root.add(button2);

  fitToUnitCube(THREE, root);
  return root;
}

function createCapsuleGeometry(radius, height, radialSegments, heightSegments) {
  const geometry = new THREE.Geometry();
  const halfHeight = height / 2;

  // Top hemisphere
  for (let i = 0; i <= radialSegments; i++) {
    const theta = (i / radialSegments) * Math.PI * 2;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let j = 0; j <= heightSegments; j++) {
      const v = j / heightSegments;
      const y = -halfHeight + v * height;
      const r = radius;

      geometry.vertices.push(new THREE.Vector3(r * sinTheta, y, r * cosTheta));
    }
  }

  // Bottom hemisphere
  for (let i = 0; i <= radialSegments; i++) {
    const theta = (i / radialSegments) * Math.PI * 2;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let j = 0; j <= heightSegments; j++) {
      const v = j / heightSegments;
      const y = halfHeight - v * height;
      const r = radius;

      geometry.vertices.push(new THREE.Vector3(r * sinTheta, y, r * cosTheta));
    }
  }

  // Top cap
  for (let i = 0; i < radialSegments; i++) {
    for (let j = 0; j < heightSegments; j++) {
      const a = i + j * (radialSegments + 1);
      const b = i + 1 + j * (radialSegments + 1);
      const c = i + 1 + (j + 1) * (radialSegments + 1);
      const d = i + (j + 1) * (radialSegments + 1);

      geometry.faces.push(new THREE.Face3(a, b, d));
      geometry.faces.push(new THREE.Face3(b, c, d));
    }
  }

  // Bottom cap
  for (let i = 0; i < radialSegments; i++) {
    const baseIndex = (radialSegments + 1) * (heightSegments + 1);
    for (let j = 0; j < heightSegments; j++) {
      const a = baseIndex + i + j * (radialSegments + 1);
      const b = baseIndex + i + 1 + j * (radialSegments + 1);
      const c = baseIndex + i + 1 + (j + 1) * (radialSegments + 1);
      const d = baseIndex + i + (j + 1) * (radialSegments + 1);

      geometry.faces.push(new THREE.Face3(a, d, b));
      geometry.faces.push(new THREE.Face3(b, d, c));
    }
  }

  // Side faces
  for (let i = 0; i < radialSegments; i++) {
    for (let j = 0; j < heightSegments; j++) {
      const a = i + j * (radialSegments + 1);
      const b = i + 1 + j * (radialSegments + 1);
      const c = i + 1 + (j + 1) * (radialSegments + 1);
      const d = i + (j + 1) * (radialSegments + 1);

      geometry.faces.push(new THREE.Face3(a, b, c));
      geometry.faces.push(new THREE.Face3(a, c, d));

      const a2 = baseIndex + i + j * (radialSegments + 1);
      const b2 = baseIndex + i + 1 + j * (radialSegments + 1);
      const c2 = baseIndex + i + 1 + (j + 1) * (radialSegments + 1);
      const d2 = baseIndex + i + (j + 1) * (radialSegments + 1);

      geometry.faces.push(new THREE.Face3(a2, c2, b2));
      geometry.faces.push(new THREE.Face3(a2, d2, c2));
    }
  }

  geometry.computeVertexNormals();
  return geometry;
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