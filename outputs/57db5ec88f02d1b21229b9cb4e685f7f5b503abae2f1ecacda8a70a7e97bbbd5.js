export default function generate(THREE) {
  const root = new THREE.Group();

  const octahedronGeometry = new THREE.OctahedronGeometry(1, 0);
  const material = new THREE.MeshStandardMaterial({
    metalness: 0.2,
    roughness: 0.3,
    transparent: true,
    opacity: 0.8
  });

  const colors = [new THREE.Color(0xffffff), new THREE.Color(0xffff00)];
  const colorArray = [];
  for (let i = 0; i < octahedronGeometry.attributes.position.count / 3; i++) {
    colorArray.push(...colors[i % 2].toArray());
  }
  octahedronGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colorArray), 3));

  material.vertexColors = true;

  const octahedronMesh = new THREE.Mesh(octahedronGeometry, material);
  root.add(octahedronMesh);

  addGearCutouts(THREE, root);

  fitToUnitCube(THREE, root);
  return root;
}

function addGearCutouts(THREE, root) {
  const gearPattern = createGearPattern(THREE);
  const geometry = new THREE.OctahedronGeometry(1, 0);
  const faces = geometry.faces;

  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];
    const vertices = [geometry.vertices[face.a], geometry.vertices[face.b], geometry.vertices[face.c]];
    const center = new THREE.Vector3().addVectors(vertices[0], vertices[1]).add(vertices[2]).divideScalar(3);
    const normal = face.normal.clone().normalize();

    const cutoutGeometry = createCutoutGeometry(THREE, center, normal, gearPattern);
    const material = new THREE.MeshStandardMaterial({
      metalness: 0.2,
      roughness: 0.3,
      transparent: true,
      opacity: 0.8
    });
    const cutoutMesh = new THREE.Mesh(cutoutGeometry, material);
    root.add(cutoutMesh);
  }
}

function createGearPattern(THREE) {
  const size = 128;
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size - 0.5;
      const v = y / size - 0.5;
      const distance = Math.sqrt(u * u + v * v);
      const angle = Math.atan2(v, u) * 4;

      let alpha = 1;
      if (distance > 0.3 && distance < 0.4) {
        const gearTooth = Math.sin(angle) > 0 ? 1 : -1;
        alpha = (Math.cos(8 * angle + gearTooth * Math.PI / 2) + 1) / 2;
      } else {
        alpha = 0;
      }

      const index = (y * size + x) * 4;
      data[index] = 255; // R
      data[index + 1] = 255; // G
      data[index + 2] = 0; // B
      data[index + 3] = alpha * 255; // A
    }
  }

  const texture = new THREE.DataTexture(data, size, size);
  texture.needsUpdate = true;
  return texture;
}

function createCutoutGeometry(THREE, center, normal, pattern) {
  const geometry = new THREE.CircleGeometry(0.2, 32);
  geometry.translate(center.x, center.y, center.z);

  const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, center);
  const matrix = new THREE.Matrix4().makeRotationX(Math.PI / 2).multiply(new THREE.Matrix4().lookAt(center, center.clone().add(normal), new THREE.Vector3(0, 1, 0)));

  geometry.applyMatrix4(matrix);

  const material = new THREE.MeshBasicMaterial({
    map: pattern,
    transparent: true
  });

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
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