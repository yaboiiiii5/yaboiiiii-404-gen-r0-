import base64
import re
import httpx

from pipeline.validate import validate

OLLAMA_BASE = "http://127.0.0.1:11434"
VISION_MODEL = "qwen2.5vl:7b"
CODE_MODEL = "qwen2.5-coder:32b"

VISION_PROMPT = """Analyze this 3D reference image. Describe the object precisely:
1. SHAPE: geometric primitives per part (box, sphere, cylinder, cone, torus, capsule).
2. COLORS: hex per part (e.g. 0x8B0000).
3. PROPORTIONS: relative sizes.
4. STRUCTURE: part hierarchy and positions.
5. DETAILS: notable features.
6. MATERIAL: metalness 0-1, roughness 0-1.
Be terse and geometric. Output 12 lines max."""

CODE_SYSTEM = """You are a Three.js expert. Output a complete, valid JavaScript ES module. No markdown.

REQUIRED:
export default function generate(THREE) {
  const root = new THREE.Group();
  // build geometry, materials, textures
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

HARD RULES (violation = rejection):
- No Math.random, Date, document, window, canvas, lights, loaders, eval, fetch, setTimeout, performance, crypto.
- No imports, no async, no promises.
- THREE only via parameter. No alias. No computed access THREE['X'].
- Allowed materials: MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial, PointsMaterial, LineBasicMaterial, LineDashedMaterial.
- DataTexture only.
- ALL helper functions must be defined in the module BEFORE return. If you call foo(), define function foo.
- Output ONLY raw JS. No fences, no prose."""


PLACEHOLDER_JS = b"""export default function generate(THREE) {
  const root = new THREE.Group();
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.1, roughness: 0.7 });
  root.add(new THREE.Mesh(geo, mat));
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
"""


async def _vision(image_b64: str, seed: int) -> str:
    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(
            f"{OLLAMA_BASE}/api/generate",
            json={
                "model": VISION_MODEL,
                "prompt": VISION_PROMPT,
                "images": [image_b64],
                "stream": False,
                "options": {"seed": seed, "temperature": 0, "top_p": 1, "num_predict": 512},
            },
        )
        r.raise_for_status()
        return r.json()["response"]


async def _code(description: str, seed: int) -> str:
    prompt = f"Scene to recreate:\n{description}\n\nGenerate the module. Seed: {seed}."
    async with httpx.AsyncClient(timeout=120.0) as client:
        r = await client.post(
            f"{OLLAMA_BASE}/api/generate",
            json={
                "model": CODE_MODEL,
                "system": CODE_SYSTEM,
                "prompt": prompt,
                "stream": False,
                "options": {"seed": seed, "temperature": 0, "top_p": 1, "num_predict": 4096},
            },
        )
        r.raise_for_status()
        return r.json()["response"]


def _strip_fences(s: str) -> str:
    s = s.strip()
    s = re.sub(r"^```(?:javascript|js)?\n?", "", s)
    s = re.sub(r"\n?```$", "", s.strip())
    return s


async def _generate(image_b64: str, seed: int) -> bytes:
    desc = await _vision(image_b64, seed)
    raw = await _code(desc, seed)
    js = _strip_fences(raw)
    ok, errs = validate(js)
    if not ok:
        return PLACEHOLDER_JS
    return js.encode("utf-8")


async def generate_scene_from_bytes(image_bytes: bytes, seed: int) -> bytes:
    image_b64 = base64.standard_b64encode(image_bytes).decode()
    return await _generate(image_b64, seed)


async def generate_scene_from_url(image_url: str, seed: int) -> bytes:
    async with httpx.AsyncClient(timeout=30.0) as http:
        r = await http.get(image_url)
        r.raise_for_status()
        image_bytes = r.content
    return await generate_scene_from_bytes(image_bytes, seed)
