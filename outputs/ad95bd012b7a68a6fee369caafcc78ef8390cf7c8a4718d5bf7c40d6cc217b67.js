export default function generate(THREE) {
  const root = new THREE.Group();

  // Handle
  const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, metalness: 0.8, roughness: 0.2 });
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.set(0, 0.5, 0);
  root.add(handleMesh);

  // Ring
  const ringGeometry = new THREE.TorusGeometry(0.6, 0.1, 32, 64);
  const ringMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, metalness: 0.7, roughness: 0.3 });
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
  ringMesh.position.set(0, 1.2, 0);
  root.add(ringMesh);

  // Blade
  const bladeGeometry = createCapsuleGeometry(0.5, 1, 32, 64);
  const bladeTexture = createGroovesTexture(THREE);
  const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.9, roughness: 0.1, map: bladeTexture });
  const bladeMesh = new THREE.Mesh(bladeGeometry, bladeMaterial);
  bladeMesh.position.set(0, 2, 0);
  root.add(bladeMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createCapsuleGeometry(radius, height, radialSegments, heightSegments) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const normals = [];
  const uvs = [];

  const halfHeight = height / 2;

  for (let i = 0; i <= radialSegments; i++) {
    const theta = (i / radialSegments) * Math.PI * 2;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    // Top hemisphere
    for (let j = 0; j <= heightSegments; j++) {
      const v = j / heightSegments;
      const y = -halfHeight + v * height;
      const r = radius * Math.sqrt(1 - ((y + halfHeight) / height) ** 2);
      vertices.push(r * sinTheta, y, r * cosTheta);
      normals.push(sinTheta, (y + halfHeight) / height, cosTheta);
      uvs.push(i / radialSegments, v);
    }

    // Bottom hemisphere
    for (let j = 0; j <= heightSegments; j++) {
      const v = j / heightSegments;
      const y = -halfHeight + v * height;
      const r = radius * Math.sqrt(1 - ((y - halfHeight) / height) ** 2);
      vertices.push(r * sinTheta, y, r * cosTheta);
      normals.push(sinTheta, (y - halfHeight) / height, cosTheta);
      uvs.push(i / radialSegments, v + 1);
    }
  }

  const indices = [];
  for (let i = 0; i < radialSegments; i++) {
    for (let j = 0; j < heightSegments; j++) {
      const a = i * (heightSegments + 1) + j;
      const b = (i + 1) * (heightSegments + 1) + j;
      const c = (i + 1) * (heightSegments + 1) + j + 1;
      const d = i * (heightSegments + 1) + j + 1;

      indices.push(a, b, d);
      indices.push(b, c, d);

      a += heightSegments + 1;
      b += heightSegments + 1;
      c += heightSegments + 1;
      d += heightSegments + 1;

      indices.push(a, d, b);
      indices.push(d, c, b);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);

  return geometry;
}

function createGroovesTexture(THREE) {
  const size = 512;
  const data = new Uint8Array(size * size * 4);
  const grooveWidth = 0.1;
  const grooveDepth = 0.3;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const grooveFactor = Math.sin(u * Math.PI * 10) * grooveDepth + 1 - grooveDepth;

      data[(y * size + x) * 4] = 255 * grooveFactor; // R
      data[(y * size + x) * 4 + 1] = 255 * grooveFactor; // G
      data[(y * size + x) * 4 + 2] = 255 * grooveFactor; // B
      data[(y * size + x) * 4 + 3] = 255; // A
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