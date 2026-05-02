export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const material = new THREE.MeshStandardMaterial({ color: 0x8B0000, metalness: 0.8, roughness: 0.2 });

  // Head (Sphere)
  const headGeometry = new THREE.SphereGeometry(1, 32, 32);
  const head = new THREE.Mesh(headGeometry, material);
  root.add(head);

  // Eyes
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8, roughness: 0.2 });
  const eyeGeometry = new THREE.SphereGeometry(0.15, 32, 32);
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.4, 0.6, 0.8);
  head.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.4, 0.6, 0.8);
  head.add(rightEye);

  // Antenna
  const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);
  const antenna = new THREE.Mesh(antennaGeometry, material);
  antenna.position.set(0, 1.4, 0.8);
  head.add(antenna);

  // Body (Capsule)
  const bodyGeometry = createCapsuleGeometry(0.5, 1, 32, 32);
  const body = new THREE.Mesh(bodyGeometry, material);
  body.position.set(0, -1.5, 0);
  root.add(body);

  // Legs (Cylinder)
  const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
  const leftLeg = new THREE.Mesh(legGeometry, material);
  leftLeg.position.set(-0.5, -3, 0);
  root.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeometry, material);
  rightLeg.position.set(0.5, -3, 0);
  root.add(rightLeg);

  // Wings (Cone)
  const wingGeometry = new THREE.ConeGeometry(1, 2, 32);
  const leftWing = new THREE.Mesh(wingGeometry, material);
  leftWing.position.set(-1.5, -1, 0);
  leftWing.rotation.z = Math.PI / 4;
  root.add(leftWing);

  const rightWing = new THREE.Mesh(wingGeometry, material);
  rightWing.position.set(1.5, -1, 0);
  rightWing.rotation.z = -Math.PI / 4;
  root.add(rightWing);

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