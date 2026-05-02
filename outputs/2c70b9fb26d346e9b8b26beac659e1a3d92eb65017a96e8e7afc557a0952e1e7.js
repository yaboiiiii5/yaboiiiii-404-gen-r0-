export default function generate(THREE) {
  const root = new THREE.Group();

  // Materials
  const pianoMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.1, metalness: 0.8 });
  const keyMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.2, metalness: 0.7 });
  const stringMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA07A, roughness: 0.3, metalness: 0.9 });

  // Piano Body
  const pianoGeometry = new THREE.BoxGeometry(4, 2, 1);
  const pianoBody = new THREE.Mesh(pianoGeometry, pianoMaterial);
  root.add(pianoBody);

  // Hinged Lid
  const lidGeometry = new THREE.BoxGeometry(3.5, 0.5, 1);
  const lid = new THREE.Mesh(lidGeometry, pianoMaterial);
  lid.position.set(0, 2.75, 0);
  root.add(lid);

  // Piano Keys
  for (let i = 0; i < 28; i++) {
    const keyGeometry = new THREE.BoxGeometry(0.1, 0.4, 1);
    const key = new THREE.Mesh(keyGeometry, keyMaterial);
    key.position.set(-1.35 + i * 0.1, 1.9, 0);
    root.add(key);
  }

  // Piano Strings
  for (let i = 0; i < 40; i++) {
    const stringGeometry = new THREE.CylinderGeometry(0.005, 0.005, 2, 32);
    const string = new THREE.Mesh(stringGeometry, stringMaterial);
    string.position.set(-1.7 + i * 0.1, 1.8, 0);
    string.rotation.x = Math.PI / 2;
    root.add(string);
  }

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