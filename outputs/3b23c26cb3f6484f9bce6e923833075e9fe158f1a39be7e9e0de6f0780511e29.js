export default function generate(THREE) {
  const root = new THREE.Group();

  function createHoledSphere(radius, segments, holes) {
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    for (const hole of holes) {
      const { position, radius: holeRadius, shape } = hole;
      const holeGeo = shape === 'circle' ? 
        new THREE.CircleGeometry(holeRadius, 32) : 
        new THREE.RingGeometry(0, holeRadius, 32);
      holeGeo.translate(position.x, position.y, position.z);
      const matrix = new THREE.Matrix4().makeTranslation(position.x, position.y, position.z);
      geometry.applyMatrix4(matrix);
      const holeVertices = [];
      holeGeo.vertices.forEach(v => {
        v.add(new THREE.Vector3(position.x, position.y, position.z));
        holeVertices.push(v.clone());
      });
      for (let i = 0; i < geometry.faces.length; i++) {
        const face = geometry.faces[i];
        if (holeVertices.some(v => isPointInFace(v, face))) {
          geometry.faces.splice(i, 1);
          i--;
        }
      }
    }
    return geometry;
  }

  function isPointInFace(point, face) {
    const a = new THREE.Vector3().fromArray(face.a.toArray());
    const b = new THREE.Vector3().fromArray(face.b.toArray());
    const c = new THREE.Vector3().fromArray(face.c.toArray());
    const v0 = new THREE.Vector3().subVectors(b, a);
    const v1 = new THREE.Vector3().subVectors(c, a);
    const v2 = new THREE.Vector3().subVectors(point, a);
    const dot00 = v0.dot(v0);
    const dot01 = v0.dot(v1);
    const dot02 = v0.dot(v2);
    const dot11 = v1.dot(v1);
    const dot12 = v1.dot(v2);
    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    return (u >= 0) && (v >= 0) && (u + v < 1);
  }

  const holes = [
    { position: new THREE.Vector3(0, 0.5, 0), radius: 0.2, shape: 'circle' },
    { position: new THREE.Vector3(-0.4, 0.3, 0), radius: 0.15, shape: 'circle' },
    { position: new THREE.Vector3(0.4, 0.3, 0), radius: 0.15, shape: 'circle' },
    { position: new THREE.Vector3(0, -0.2, 0), radius: 0.1, shape: 'ring' }
  ];

  const geometry = createHoledSphere(1, 64, holes);
  const material = new THREE.MeshStandardMaterial({ color: 0x8BFF00, roughness: 0.5 });
  const sphere = new THREE.Mesh(geometry, material);

  root.add(sphere);

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