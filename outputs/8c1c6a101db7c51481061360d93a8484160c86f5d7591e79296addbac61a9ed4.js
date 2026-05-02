export default function generate(THREE) {
  const root = new THREE.Group();

  // Materials
  const bedMaterial = new THREE.MeshStandardMaterial({ color: 0xFFF0E6 });
  const pillowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFF0E6 });
  const ballMaterial = new THREE.MeshPhysicalMaterial({ color: 0x808080, metalness: 0.8, roughness: 0.2 });

  // Bed Base
  const bedBaseGeometry = new THREE.BoxGeometry(4, 1, 2);
  const bedBaseMesh = new THREE.Mesh(bedBaseGeometry, bedMaterial);
  bedBaseMesh.position.set(0, -0.5, 0);
  root.add(bedBaseMesh);

  // Bed Mattress
  const mattressGeometry = new THREE.BoxGeometry(3.8, 1, 1.8);
  const mattressMesh = new THREE.Mesh(mattressGeometry, bedMaterial);
  mattressMesh.position.set(0, 0.5, 0);
  root.add(mattressMesh);

  // Sheets
  const sheetsTexture = createWrinkledTexture(THREE);
  const sheetsMaterial = new THREE.MeshBasicMaterial({ map: sheetsTexture });
  const sheetsGeometry = new THREE.BoxGeometry(3.8, 1, 1.8);
  const sheetsMesh = new THREE.Mesh(sheetsGeometry, sheetsMaterial);
  sheetsMesh.position.set(0, 0.5, 0);
  root.add(sheetsMesh);

  // Pillows
  const pillowGeometry = new THREE.BoxGeometry(1, 0.5, 1);
  for (let i = -1; i <= 1; i += 2) {
    const pillowMesh = new THREE.Mesh(pillowGeometry, pillowMaterial);
    pillowMesh.position.set(i * 1.2, 1, 0);
    root.add(pillowMesh);
  }

  // Balls
  const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  for (let i = -1; i <= 1; i += 2) {
    const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
    ballMesh.position.set(i * 1.5, 1.2, 0);
    root.add(ballMesh);
  }

  fitToUnitCube(THREE, root);
  return root;
}

function createWrinkledTexture(THREE) {
  const size = 512;
  const data = new Uint8Array(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const noiseValue = perlinNoise(x / size, y / size) * 255;
    data[i * 3] = noiseValue;
    data[i * 3 + 1] = noiseValue;
    data[i * 3 + 2] = noiseValue;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  texture.needsUpdate = true;
  return texture;
}

function perlinNoise(x, y) {
  const X = Math.floor(x);
  const Y = Math.floor(y);
  const xf = x - X;
  const yf = y - Y;
  const u = fade(xf);
  const v = fade(yf);

  const topRight = grad(permutation[X + 1] + permutation[Y + 1], xf - 1, yf - 1);
  const topLeft = grad(permutation[X] + permutation[Y + 1], xf, yf - 1);
  const bottomRight = grad(permutation[X + 1] + permutation[Y], xf - 1, yf);
  const bottomLeft = grad(permutation[X] + permutation[Y], xf, yf);

  return lerp(u, lerp(v, bottomLeft, topRight), lerp(v, bottomRight, topLeft));
}

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t, a, b) {
  return a + t * (b - a);
}

function grad(hash, x, y) {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 1 ? y : h === 2 ? x : 0;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

const permutation = [
  151, 160, 137, 91, 90, 15,
  131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
  190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
  88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
  77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
  102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
  135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
  5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
  223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
  129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
  251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
  49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
  138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
];

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