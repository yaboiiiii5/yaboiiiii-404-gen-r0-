export default function generate(THREE) {
  const root = new THREE.Group();

  // Create disk geometry with central hole and concentric grooves
  function createDiskGeometry(radius, tubeRadius, radialSegments, tubularSegments, height, grooveDepth, grooveCount) {
    const geometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments, Math.PI * 2);
    const positions = geometry.attributes.position.array;
    const stepAngle = (Math.PI * 2) / tubularSegments;

    for (let i = 0; i < tubularSegments; i++) {
      const angle = i * stepAngle;
      const grooveAmplitude = Math.sin(grooveCount * angle) * grooveDepth;
      for (let j = 0; j <= radialSegments; j++) {
        const index = (i + j * tubularSegments) * 3;
        positions[index + 1] += grooveAmplitude;
      }
    }

    geometry.attributes.position.needsUpdate = true;

    // Add top and bottom faces
    const topGeometry = new THREE.CircleGeometry(radius, radialSegments);
    const bottomGeometry = new THREE.CircleGeometry(radius, radialSegments);

    const topPositions = topGeometry.attributes.position.array;
    for (let i = 0; i < topPositions.length; i += 3) {
      topPositions[i + 1] = height / 2;
    }
    topGeometry.attributes.position.needsUpdate = true;

    const bottomPositions = bottomGeometry.attributes.position.array;
    for (let i = 0; i < bottomPositions.length; i += 3) {
      bottomPositions[i + 1] = -height / 2;
    }
    bottomGeometry.attributes.position.needsUpdate = true;

    // Merge geometries
    const mergedGeometry = new THREE.BufferGeometry();
    const combinedVertices = [];
    const combinedNormals = [];

    function addGeometry(geom, offset) {
      const positions = geom.attributes.position.array;
      const normals = geom.attributes.normal.array;
      for (let i = 0; i < positions.length; i += 3) {
        combinedVertices.push(positions[i] + offset.x, positions[i + 1] + offset.y, positions[i + 2] + offset.z);
        combinedNormals.push(normals[i], normals[i + 1], normals[i + 2]);
      }
    }

    addGeometry(geometry, new THREE.Vector3(0, 0, 0));
    addGeometry(topGeometry, new THREE.Vector3(0, height / 2, 0));
    addGeometry(bottomGeometry, new THREE.Vector3(0, -height / 2, 0));

    mergedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(combinedVertices, 3));
    mergedGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(combinedNormals, 3));

    return mergedGeometry;
  }

  const diskRadius = 1.5;
  const holeRadius = 0.2;
  const radialSegments = 64;
  const tubularSegments = 64;
  const height = 0.1;
  const grooveDepth = 0.02;
  const grooveCount = 8;

  const diskGeometry = createDiskGeometry(diskRadius, holeRadius, radialSegments, tubularSegments, height, grooveDepth, grooveCount);

  // Create material
  const textureData = new Uint8Array(4 * 64);
  for (let i = 0; i < 64; i++) {
    const value = (i % 2 === 0) ? 0x80 : 0xFF;
    textureData[i * 4] = value;
    textureData[i * 4 + 1] = value;
    textureData[i * 4 + 2] = value;
    textureData[i * 4 + 3] = 0xFF;
  }
  const dataTexture = new THREE.DataTexture(textureData, 8, 8, THREE.RGBAFormat);
  dataTexture.needsUpdate = true;

  const material = new THREE.MeshStandardMaterial({
    color: 0x808080,
    metalness: 0.8,
    roughness: 0.1,
    map: dataTexture
  });

  // Create mesh and add to root
  const diskMesh = new THREE.Mesh(diskGeometry, material);
  root.add(diskMesh);

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