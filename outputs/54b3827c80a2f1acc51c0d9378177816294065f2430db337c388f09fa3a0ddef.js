export default function generate(THREE) {
  const root = new THREE.Group();

  // Create geometry for the circular base with central hole and concentric rings
  const createCircularBaseGeometry = (radius, tubeRadius, radialSegments, tubularSegments, p, q) => {
    const shape = new THREE.TubeGeometry(new THREE.TorusKnotGeometry(radius, tubeRadius, tubularSegments, radialSegments, p, q), tubularSegments);
    return shape;
  };

  // Create geometry for the pointed elements
  const createPointedElementGeometry = (radius, height, segments) => {
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    }
    points.push(new THREE.Vector3(0, 0, height));
    return new THREE.LatheGeometry(points);
  };

  // Create the material for the metallic look
  const createMetallicMaterial = () => {
    const textureData = new Uint8Array([255, 255, 255]);
    const dataTexture = new THREE.DataTexture(textureData, 1, 1);
    dataTexture.needsUpdate = true;
    return new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 0.9,
      roughness: 0.1,
      map: dataTexture
    });
  };

  // Create the circular base with central hole and concentric rings
  const createCircularBase = () => {
    const geometry = createCircularBaseGeometry(1, 0.2, 64, 64, 2, 3);
    const material = createMetallicMaterial();
    return new THREE.Mesh(geometry, material);
  };

  // Create the pointed elements
  const createPointedElements = () => {
    const geometries = [];
    for (let i = 0; i < 5; i++) {
      const geometry = createPointedElementGeometry(0.1 + i * 0.05, 0.3, 64);
      geometry.rotateX(Math.PI / 2);
      geometry.translate(1.2 - i * 0.25, 0, 0);
      geometries.push(geometry);
    }
    const combinedGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);
    const material = createMetallicMaterial();
    return new THREE.Mesh(combinedGeometry, material);
  };

  // Add the circular base to the root
  const circularBase = createCircularBase();
  root.add(circularBase);

  // Add the pointed elements to the root
  const pointedElements = createPointedElements();
  root.add(pointedElements);

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