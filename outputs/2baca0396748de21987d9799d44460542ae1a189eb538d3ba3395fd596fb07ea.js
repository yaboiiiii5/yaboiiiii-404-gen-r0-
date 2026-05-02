export default function generate(THREE) {
  const root = new THREE.Group();

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.8
  });

  const sandMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.02
  });

  function createCylinder(radiusTop, radiusBottom, height, radialSegments) {
    return new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  }

  function createGridOverlay(geometry, material) {
    const vertices = geometry.attributes.position.array;
    const indices = [];
    for (let i = 0; i < vertices.length; i += 3) {
      indices.push(i / 3);
    }
    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    gridGeometry.setIndex(indices);
    return new THREE.LineSegments(gridGeometry, material);
  }

  function createHourglass(topRadius, bottomRadius, height, radialSegments) {
    const topCylinder = new THREE.Mesh(createCylinder(topRadius, bottomRadius, height / 2, radialSegments), glassMaterial);
    const bottomCylinder = new THREE.Mesh(createCylinder(bottomRadius, topRadius, height / 2, radialSegments), glassMaterial);
    bottomCylinder.position.y = -height / 2;
    return [topCylinder, bottomCylinder];
  }

  function createSandParticles(geometry, material) {
    const vertices = geometry.attributes.position.array;
    const positions = [];
    for (let i = 0; i < vertices.length; i += 3) {
      positions.push(vertices[i], vertices[i + 1], vertices[i + 2]);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return new THREE.Points(particleGeometry, material);
  }

  const topRadius = 0.5;
  const bottomRadius = 0.1;
  const height = 1.5;
  const radialSegments = 64;

  const [topCylinder, bottomCylinder] = createHourglass(topRadius, bottomRadius, height, radialSegments);
  root.add(topCylinder);
  root.add(bottomCylinder);

  const gridMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
  const topGrid = createGridOverlay(createCylinder(topRadius, bottomRadius, height / 2, radialSegments), gridMaterial);
  const bottomGrid = createGridOverlay(createCylinder(bottomRadius, topRadius, height / 2, radialSegments), gridMaterial);
  bottomGrid.position.y = -height / 2;
  root.add(topGrid);
  root.add(bottomGrid);

  const sandParticles = createSandParticles(createCylinder(topRadius, bottomRadius, height, radialSegments), sandMaterial);
  root.add(sandParticles);

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