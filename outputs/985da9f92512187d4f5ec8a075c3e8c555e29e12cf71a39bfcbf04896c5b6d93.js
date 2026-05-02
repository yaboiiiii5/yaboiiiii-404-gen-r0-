export default function generate(THREE) {
  const root = new THREE.Group();

  // Materials
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000, metalness: 0.1, roughness: 0.9 });
  const candleBaseMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA07A });
  const candleMaterial = new THREE.MeshPhysicalMaterial({ color: 0xFFD700, emissive: 0xFFD700, metalness: 1, roughness: 0.2 });
  const glassMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.1, roughness: 0.9 });

  // Base
  const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
  root.add(baseMesh);

  // Candle Base
  const candleBaseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
  const candleBaseMesh = new THREE.Mesh(candleBaseGeometry, candleBaseMaterial);
  candleBaseMesh.position.y = 0.5 + 0.1;
  root.add(candleBaseMesh);

  // Candle
  const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
  const candleMesh = new THREE.Mesh(candleGeometry, candleMaterial);
  candleMesh.position.y = 0.5 + 0.1 + 0.1 + 0.5;
  root.add(candleMesh);

  // Glass
  const glassGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 32);
  const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
  glassMesh.position.y = 0.5 + 0.1 + 0.1 + 0.5 + 0.6;
  root.add(glassMesh);

  // Candle Tip
  const candleTipGeometry = new THREE.ConeGeometry(0.2, 0.4, 32);
  const candleTipMesh = new THREE.Mesh(candleTipGeometry, candleMaterial);
  candleTipMesh.position.y = 0.5 + 0.1 + 0.1 + 0.5 + 0.6 + 0.6;
  root.add(candleTipMesh);

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