export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Create base geometry and material
  const baseGeometry = new THREE.BoxGeometry(1, 0.3, 1);
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8, roughness: 0.2 });
  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
  root.add(baseMesh);

  // Create stem geometry and material
  const stemGeometry = createCurvedCylinder(THREE, 0.1, 0.1, 0.5, 32, 16, 0, Math.PI * 2, false, 0.5);
  const stemMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8, roughness: 0.2 });
  const stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);
  stemMesh.position.y = 0.15;
  root.add(stemMesh);

  // Create shade geometry and material
  const shadeGeometry = createCurvedCylinder(THREE, 0.3, 0.3, 0.2, 32, 16, 0, Math.PI * 2, true, 0.5);
  const shadeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.2, roughness: 0.8 });
  const shadeMesh = new THREE.Mesh(shadeGeometry, shadeMaterial);
  shadeMesh.position.y = 0.4;
  root.add(shadeMesh);

  fitToUnitCube(THREE, root);
  return root;
}

function createCurvedCylinder(THREE, radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength, curveFactor) {
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
  for (let i = 0; i < geometry.vertices.length; i++) {
    const vertex = geometry.vertices[i];
    if (vertex.y > 0) {
      vertex.x += curveFactor * Math.sin(vertex.y / height * Math.PI);
      vertex.z += curveFactor * Math.cos(vertex.y / height * Math.PI);
    }
  }
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