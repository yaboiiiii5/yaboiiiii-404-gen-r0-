export default function generate(THREE) {
  const root = new THREE.Group();

  // Create materials
  const metalMaterial = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, metalness: 0.8, roughness: 0.2 });
  const powderMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

  // Create bowl geometry and mesh
  const bowlGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
  const bowlMesh = new THREE.Mesh(bowlGeometry, metalMaterial);
  bowlMesh.rotation.x = -Math.PI / 2;
  root.add(bowlMesh);

  // Create handle geometry and mesh
  const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32);
  const handleMesh = new THREE.Mesh(handleGeometry, metalMaterial);
  handleMesh.position.set(1.1, 0.25, 0);
  root.add(handleMesh);

  // Create base geometry and mesh
  const baseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32);
  const baseMesh = new THREE.Mesh(baseGeometry, metalMaterial);
  baseMesh.position.set(0, -0.4, 0);
  root.add(baseMesh);

  // Create engraved text
  createEngravedText(THREE, root);

  // Create powder spill
  createPowderSpill(THREE, root);

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

function createEngravedText(THREE, root) {
  const textGeometry = new THREE.TextGeometry('Bowl', {
    font: createFont(),
    size: 0.1,
    height: 0.02
  });
  const textMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ color: 0x333333 }));
  textMesh.position.set(0.5, 0.4, -0.01);
  root.add(textMesh);
}

function createFont() {
  const fontData = { "glyphs": {"B": {"ha": 768,"o": [[-29,-12],[30,-12],[30,12],[-29,12]]},"o": {"ha": 544,"o": [[-27,-12],[27,-12],[27,12],[-27,12]]},"w": {"ha": 864,"o": [[-30,-12],[30,-12],[30,12],[-15,12],[-15,0],[-30,0]]}}};
  return new THREE.Font(fontData);
}

function createPowderSpill(THREE, root) {
  const powderGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  const powderMesh = new THREE.Mesh(powderGeometry, powderMaterial);
  powderMesh.position.set(0.5, -0.4, 0.1);
  root.add(powderMesh);

  const powderGeometry2 = new THREE.SphereGeometry(0.08, 32, 32);
  const powderMesh2 = new THREE.Mesh(powderGeometry2, powderMaterial);
  powderMesh2.position.set(-0.5, -0.4, 0.1);
  root.add(powderMesh2);

  const powderGeometry3 = new THREE.SphereGeometry(0.06, 32, 32);
  const powderMesh3 = new THREE.Mesh(powderGeometry3, powderMaterial);
  powderMesh3.position.set(0, -0.4, 0.15);
  root.add(powderMesh3);
}