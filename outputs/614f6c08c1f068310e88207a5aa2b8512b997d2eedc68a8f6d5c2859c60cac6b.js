export default function generate(THREE) {
  const root = new THREE.Group();
  
  // Create a cylinder geometry
  const radiusTop = 0.5;
  const radiusBottom = 0.5;
  const height = 1;
  const radialSegments = 32;
  const heightSegments = 1;
  const openEnded = false;
  const thetaStart = 0;
  const thetaLength = Math.PI * 2;

  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);

  // Create a material with specified properties
  const material = new THREE.MeshStandardMaterial({
    color: 0x8000FF,
    metalness: 0.2,
    roughness: 0.3
  });

  // Create the mesh and add it to the root group
  const cylinder = new THREE.Mesh(geometry, material);
  root.add(cylinder);

  // Function to create an embossed cross texture
  function createEmbossedCrossTexture(THREE) {
    const size = 256;
    const data = new Uint8Array(size * size * 4);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = (i * size + j) * 4;

        // Calculate the distance from the center
        const centerX = size / 2;
        const centerY = size / 2;
        const distX = Math.abs(i - centerX);
        const distY = Math.abs(j - centerY);

        // Determine if the pixel is part of the cross
        const isCross = (distX < 10 && distY < 5) || (distX < 5 && distY < 10);

        // Set color and emboss effect
        data[index] = isCross ? 255 : 128; // Red channel
        data[index + 1] = isCross ? 0 : 128;   // Green channel
        data[index + 2] = isCross ? 255 : 128; // Blue channel
        data[index + 3] = 255;                 // Alpha channel
      }
    }

    const texture = new THREE.DataTexture(data, size, size);
    texture.needsUpdate = true;
    return texture;
  }

  // Create the embossed cross texture and apply it to the material
  const crossTexture = createEmbossedCrossTexture(THREE);
  material.map = crossTexture;

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