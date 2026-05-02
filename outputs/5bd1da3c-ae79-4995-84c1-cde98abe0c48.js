export default function generate(THREE) {
  const root = new THREE.Group();
  
  const materialBase = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8, roughness: 0.2 });
  const materialHandle = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.2 });

  // Base
  const baseGeometry = new THREE.BoxGeometry(1, 0.5, 1);
  const baseMesh = new THREE.Mesh(baseGeometry, materialBase);
  root.add(baseMesh);

  // Handle
  const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 32);
  const handleMesh = new THREE.Mesh(handleGeometry, materialHandle);
  handleMesh.position.set(0, 0.5 + 0.3, 0); // Position above the base
  root.add(handleMesh);

  // Handle Grip
  const gripGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.2);
  const gripMesh = new THREE.Mesh(gripGeometry, materialHandle);
  gripMesh.position.set(0, 0.5 + 0.6, 0); // Position at the end of the handle
  root.add(gripMesh);

  // Spout
  const spoutGeometry = new THREE.CylinderGeometry(0.05, 0.1, 0.4, 32);
  const spoutMesh = new THREE.Mesh(spoutGeometry, materialHandle);
  spoutMesh.position.set(0, 0.5 + 0.6 + 0.2, 0); // Position above the grip
  root.add(spoutMesh);

  // Spout Nozzle
  const nozzleGeometry = new THREE.ConeGeometry(0.03, 0.1, 32);
  const nozzleMesh = new THREE.Mesh(nozzleGeometry, materialHandle);
  nozzleMesh.position.set(0, 0.5 + 0.6 + 0.4, 0); // Position at the end of the spout
  root.add(nozzleMesh);

  // Valve Mechanism
  const valveBaseGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.1);
  const valveBaseMesh = new THREE.Mesh(valveBaseGeometry, materialHandle);
  valveBaseMesh.position.set(0, 0.5 + 0.6 + 0.45, 0); // Position below the nozzle
  root.add(valveBaseMesh);

  const valveRodGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.2, 32);
  const valveRodMesh = new THREE.Mesh(valveRodGeometry, materialHandle);
  valveRodMesh.position.set(0, 0.5 + 0.6 + 0.45 + 0.1, 0); // Position above the valve base
  root.add(valveRodMesh);

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