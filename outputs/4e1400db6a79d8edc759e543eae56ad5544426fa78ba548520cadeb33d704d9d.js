export default function generate(THREE) {
  const root = new THREE.Group();

  // Materials
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000, metalness: 0.5, roughness: 0.3 });
  const seatMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
  const handlebarsMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
  const wheelsMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF, metalness: 0.2, roughness: 0.7 });
  const pedalsMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });

  // Frame
  const frameGeometry = new THREE.BoxGeometry(4, 1, 2);
  const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
  root.add(frameMesh);

  // Seat
  const seatGeometry = new THREE.BoxGeometry(1, 0.5, 1);
  const seatMesh = new THREE.Mesh(seatGeometry, seatMaterial);
  seatMesh.position.set(0, 0.75, -1);
  frameMesh.add(seatMesh);

  // Handlebars
  const handlebarsGeometry = new THREE.BoxGeometry(2, 0.3, 0.3);
  const handlebarsMesh = new THREE.Mesh(handlebarsGeometry, handlebarsMaterial);
  handlebarsMesh.position.set(0, 1, -1.5);
  frameMesh.add(handlebarsMesh);

  // Wheels
  function createWheel(radius, tube) {
    const wheelGeometry = new THREE.CylinderGeometry(radius, radius, 0.3, 32);
    const wheelMesh = new THREE.Mesh(wheelGeometry, wheelsMaterial);
    return wheelMesh;
  }

  const frontWheel = createWheel(0.5, 0.1);
  frontWheel.position.set(-1.5, -0.4, 1);
  frameMesh.add(frontWheel);

  const backWheel = createWheel(0.5, 0.1);
  backWheel.position.set(1.5, -0.4, 1);
  frameMesh.add(backWheel);

  // Spokes
  function addSpokes(wheel, count) {
    for (let i = 0; i < count; i++) {
      const spokeGeometry = new THREE.CylinderGeometry(0.02, 0.02, wheel.geometry.parameters.height * 1.5);
      const spokeMesh = new THREE.Mesh(spokeGeometry, wheelsMaterial);
      spokeMesh.position.set(0, wheel.geometry.parameters.height / 2, 0);
      spokeMesh.rotation.z = (i / count) * Math.PI * 2;
      wheel.add(spokeMesh);
    }
  }

  addSpokes(frontWheel, 8);
  addSpokes(backWheel, 8);

  // Pedals
  function createPedal(radius, tube) {
    const pedalGeometry = new THREE.CylinderGeometry(radius, radius, 0.2, 32);
    const pedalMesh = new THREE.Mesh(pedalGeometry, pedalsMaterial);
    return pedalMesh;
  }

  const leftPedal = createPedal(0.15, 0.05);
  leftPedal.position.set(-1.5, -0.4, 1.2);
  frameMesh.add(leftPedal);

  const rightPedal = createPedal(0.15, 0.05);
  rightPedal.position.set(1.5, -0.4, 1.2);
  frameMesh.add(rightPedal);

  // Pegs
  function addPeg(pedal) {
    const pegGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.6);
    const pegMesh = new THREE.Mesh(pegGeometry, pedalsMaterial);
    pegMesh.position.set(0, 0.1, 0);
    pedal.add(pegMesh);
  }

  addPeg(leftPedal);
  addPeg(rightPedal);

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