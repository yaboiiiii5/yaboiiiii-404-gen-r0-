export default function generate(THREE) {
  const root = new THREE.Group();

  const boxGeometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.7, metalness: 0.5 });

  // Base
  const base = createBox(THREE, boxGeometry, material, 2, 1, 2);
  base.position.set(0, -0.5, 0);

  // Main Body
  const mainBody = createBox(THREE, boxGeometry, material, 1.8, 3, 1.8);
  mainBody.position.set(0, 1, 0);

  // Top Section
  const topSection = createBox(THREE, boxGeometry, material, 1.6, 0.5, 1.6);
  topSection.position.set(0, 3.25, 0);

  // Control Panel
  const controlPanel = createBox(THREE, boxGeometry, material, 1.4, 0.3, 1.4);
  controlPanel.position.set(0, 3.75, 0);

  // Handle
  const handle = createBox(THREE, boxGeometry, material, 0.2, 1, 0.2);
  handle.position.set(0.8, 4.25, 0);

  // Display
  const display = createBox(THREE, boxGeometry, material, 1.2, 0.3, 1.2);
  display.position.set(0, 4.75, 0);

  // Keyboard
  const keyboard = createBox(THREE, boxGeometry, material, 1.6, 0.2, 1.6);
  keyboard.position.set(0, 2.5, 0);

  // Tray
  const tray = createBox(THREE, boxGeometry, material, 1.4, 0.2, 1.4);
  tray.position.set(0, 0.75, 0);

  // Knobs
  const knob1 = createBox(THREE, boxGeometry, material, 0.1, 0.3, 0.1);
  knob1.position.set(-0.6, 4.25, 0.8);

  const knob2 = createBox(THREE, boxGeometry, material, 0.1, 0.3, 0.1);
  knob2.position.set(-0.6, 4.25, -0.8);

  // Buttons
  const button1 = createBox(THREE, boxGeometry, material, 0.1, 0.1, 0.1);
  button1.position.set(-0.3, 3.75, 0.6);

  const button2 = createBox(THREE, boxGeometry, material, 0.1, 0.1, 0.1);
  button2.position.set(-0.3, 3.75, -0.6);

  // Screen
  const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.7, metalness: 0.5 });
  const screen = createBox(THREE, boxGeometry, screenMaterial, 1, 0.28, 1);
  screen.position.set(0, 4.9, 0);

  // Add all parts to the root
  root.add(base, mainBody, topSection, controlPanel, handle, display, keyboard, tray, knob1, knob2, button1, button2, screen);

  fitToUnitCube(THREE, root);
  return root;
}

function createBox(THREE, geometry, material, width, height, depth) {
  const box = new THREE.Mesh(geometry.clone().scale(width, height, depth), material.clone());
  return box;
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