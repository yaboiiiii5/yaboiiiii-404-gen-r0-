export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Materials
  const materialBody = new THREE.MeshStandardMaterial({ color: 0x0000FF, metalness: 0.8, roughness: 0.2 });
  const materialWheels = new THREE.MeshStandardMaterial({ color: 0xFF0000, metalness: 0.8, roughness: 0.2 });
  const materialLights = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xFFFFFF, metalness: 0.8, roughness: 0.2 });

  // Body (Box)
  const geometryBody = new THREE.BoxGeometry(1, 0.5, 2);
  const body = new THREE.Mesh(geometryBody, materialBody);
  root.add(body);

  // Wheels (Cylinder)
  const geometryWheel = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 32);
  const wheelFrontLeft = new THREE.Mesh(geometryWheel, materialWheels);
  wheelFrontLeft.position.set(-0.5, -0.4, 1);
  root.add(wheelFrontLeft);

  const wheelFrontRight = new THREE.Mesh(geometryWheel, materialWheels);
  wheelFrontRight.position.set(0.5, -0.4, 1);
  root.add(wheelFrontRight);

  const wheelBackLeft = new THREE.Mesh(geometryWheel, materialWheels);
  wheelBackLeft.position.set(-0.5, -0.4, -1);
  root.add(wheelBackLeft);

  const wheelBackRight = new THREE.Mesh(geometryWheel, materialWheels);
  wheelBackRight.position.set(0.5, -0.4, -1);
  root.add(wheelBackRight);

  // Lights (Sphere)
  const geometryLight = new THREE.SphereGeometry(0.1, 32, 32);
  const lightFrontLeft = new THREE.Mesh(geometryLight, materialLights);
  lightFrontLeft.position.set(-0.5, 0.4, 1);
  root.add(lightFrontLeft);

  const lightFrontRight = new THREE.Mesh(geometryLight, materialLights);
  lightFrontRight.position.set(0.5, 0.4, 1);
  root.add(lightFrontRight);

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