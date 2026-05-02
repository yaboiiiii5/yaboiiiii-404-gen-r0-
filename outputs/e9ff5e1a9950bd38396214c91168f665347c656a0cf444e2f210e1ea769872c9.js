export default function generate(THREE) {
  const root = new THREE.Group();

  // Materials
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x404040, metalness: 0.8, roughness: 0.2 });
  const usbMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.9, roughness: 0.1 });

  // Box
  const boxGeometry = new THREE.BoxGeometry(1, 0.5, 0.3);
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  root.add(boxMesh);

  // USB Connector
  const usbGroup = new THREE.Group();
  usbGroup.position.set(0.4, 0, 0); // Position USB connector relative to the box

  // USB Body
  const usbBodyGeometry = new THREE.BoxGeometry(0.15, 0.2, 0.3);
  const usbBodyMesh = new THREE.Mesh(usbBodyGeometry, usbMaterial);
  usbGroup.add(usbBodyMesh);

  // USB Port
  const usbPortGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.05);
  const usbPortMesh = new THREE.Mesh(usbPortGeometry, usbMaterial);
  usbPortMesh.position.set(-0.075, 0, 0.125); // Position port on the end of USB body
  usbGroup.add(usbPortMesh);

  // Small LED
  const ledGeometry = new THREE.SphereGeometry(0.01, 8, 6);
  const ledMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red LED
  const ledMesh = new THREE.Mesh(ledGeometry, ledMaterial);
  ledMesh.position.set(-0.075, 0, -0.125); // Position LED on the end of USB body
  usbGroup.add(ledMesh);

  // Cutout in Box for USB Connector
  const cutoutGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.4);
  const cutoutMesh = new THREE.Mesh(cutoutGeometry, boxMaterial);
  cutoutMesh.position.set(0.5, 0, 0); // Position cutout to match USB connector position
  cutoutMesh.scale.z = -1; // Flip the cutout to create a hollow space
  root.add(cutoutMesh);

  root.add(usbGroup);

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