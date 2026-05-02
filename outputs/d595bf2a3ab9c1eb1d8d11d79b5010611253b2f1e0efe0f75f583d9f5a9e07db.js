export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.8, roughness: 0.6 });
  const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF, metalness: 0.8, roughness: 0.6 });

  // Lenses
  const lensGeometry = new THREE.SphereGeometry(1, 32, 32);
  const leftLens = new THREE.Mesh(lensGeometry, blueMaterial);
  const rightLens = new THREE.Mesh(lensGeometry, blueMaterial);
  leftLens.position.set(-2.5, 0, 0);
  rightLens.position.set(2.5, 0, 0);

  // Body
  const bodyGeometry = new THREE.CylinderGeometry(1, 1, 4, 32);
  const body = new THREE.Mesh(bodyGeometry, metalMaterial);
  body.rotation.x = Math.PI / 2;
  body.position.set(0, -2, 0);

  // Strap
  const strapGeometry = new THREE.BoxGeometry(0.5, 1, 4);
  const strap = new THREE.Mesh(strapGeometry, metalMaterial);
  strap.position.set(0, -6, 0);

  // Focus Knobs
  const knobGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32);
  const leftKnob = new THREE.Mesh(knobGeometry, blueMaterial);
  const rightKnob = new THREE.Mesh(knobGeometry, blueMaterial);
  leftKnob.position.set(-2.5, -1.5, 0);
  rightKnob.position.set(2.5, -1.5, 0);

  // Rubberized Edges
  const edgeGeometry = new THREE.TorusGeometry(1.1, 0.1, 8, 32);
  const leftEdge = new THREE.Mesh(edgeGeometry, blueMaterial);
  const rightEdge = new THREE.Mesh(edgeGeometry, blueMaterial);
  leftEdge.rotation.x = Math.PI / 2;
  rightEdge.rotation.x = Math.PI / 2;
  leftEdge.position.set(-2.5, 0, 0);
  rightEdge.position.set(2.5, 0, 0);

  // Textured Grip
  const gripGeometry = new THREE.CylinderGeometry(1.2, 1.2, 1, 32);
  const gripTexture = createGripTexture(THREE);
  const gripMaterial = new THREE.MeshStandardMaterial({ map: gripTexture, metalness: 0.8, roughness: 0.6 });
  const grip = new THREE.Mesh(gripGeometry, gripMaterial);
  grip.rotation.x = Math.PI / 2;
  grip.position.set(0, -3.5, 0);

  // Add to root
  root.add(leftLens, rightLens, body, strap, leftKnob, rightKnob, leftEdge, rightEdge, grip);

  fitToUnitCube(THREE, root);
  return root;
}

function createGripTexture(THREE) {
  const size = 1024;
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const value = ((x ^ y) & 16) ? 255 : 0;
    data[i * 3] = value;
    data[i * 3 + 1] = value;
    data[i * 3 + 2] = value;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return texture;
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