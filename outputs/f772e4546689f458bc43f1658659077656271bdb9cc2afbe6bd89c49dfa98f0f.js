export default function generate(THREE) {
  const root = new THREE.Group();

  function createLeafGeometry() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const uvs = [];

    // Define the shape of a leaf using vertices and UVs
    vertices.push(
      -0.5, 0.2, 0,
      0.5, 0.2, 0,
      0, 1, 0,
      -0.3, 0, 0,
      0.3, 0, 0
    );

    uvs.push(
      0, 0,
      1, 0,
      0.5, 1,
      0.25, 0.5,
      0.75, 0.5
    );

    const indices = [
      0, 2, 3,
      2, 1, 4,
      2, 3, 4
    ];

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

    return geometry;
  }

  function createVeinTexture(THREE) {
    const size = 1024;
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size; i++) {
      const x = i % size;
      const y = Math.floor(i / size);

      // Simple vein pattern
      let value = 0;
      if ((x > size * 0.25 && x < size * 0.75) || (y > size * 0.25 && y < size * 0.75)) {
        value = 255;
      }

      const index = i * 4;
      data[index] = value; // R
      data[index + 1] = value; // G
      data[index + 2] = value; // B
      data[index + 3] = 255; // A
    }

    return new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  }

  function createLeafMaterial(THREE) {
    const texture = createVeinTexture(THREE);
    texture.needsUpdate = true;

    return new THREE.MeshStandardMaterial({
      color: 0x00FF00,
      metalness: 0.1,
      roughness: 0.9,
      map: texture
    });
  }

  function createLeaf(THREE, scale) {
    const geometry = createLeafGeometry();
    const material = createLeafMaterial(THREE);
    const leaf = new THREE.Mesh(geometry, material);

    leaf.scale.setScalar(scale);
    return leaf;
  }

  // Create leaves
  const largeScale = 1.0;
  const smallScale = 0.5;

  const leaf1 = createLeaf(THREE, largeScale);
  leaf1.rotation.z = Math.PI / 4;
  leaf1.position.set(-0.5, 0.5, 0);

  const leaf2 = createLeaf(THREE, largeScale);
  leaf2.rotation.z = -Math.PI / 4;
  leaf2.position.set(0.5, 0.5, 0);

  const leaf3 = createLeaf(THREE, largeScale);
  leaf3.rotation.z = Math.PI / 2;
  leaf3.position.set(0, 1, 0);

  const leaf4 = createLeaf(THREE, smallScale);
  leaf4.rotation.z = -Math.PI / 6;
  leaf4.position.set(0, 0.75, 0.5);

  root.add(leaf1);
  root.add(leaf2);
  root.add(leaf3);
  root.add(leaf4);

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