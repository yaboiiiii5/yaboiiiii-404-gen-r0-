export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Create a cylinder geometry
  const radiusTop = 0.1;
  const radiusBottom = 0.1;
  const height = 2;
  const radialSegments = 32;
  const heightSegments = 64;
  const openEnded = false;
  const thetaStart = 0;
  const thetaLength = Math.PI * 2;
  
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
  
  // Create a material for the cylinder
  const material = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    metalness: 0.9,
    roughness: 0.1,
    emissive: 0x000000,
    side: THREE.DoubleSide
  });
  
  // Create a mesh from the geometry and material
  const cylinder = new THREE.Mesh(geometry, material);
  
  // Add the cylinder to the root group
  root.add(cylinder);
  
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