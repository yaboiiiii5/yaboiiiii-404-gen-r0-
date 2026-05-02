import re

BANNED_TOKENS = [
    "Math.random",
    "Date(",
    "Date.now",
    "new Date",
    "document.",
    "window.",
    "canvas",
    "ShaderMaterial",
    "RawShaderMaterial",
    "MeshLambertMaterial",
    "MeshPhongMaterial",
    "CanvasTexture",
    "VideoTexture",
    "Loader",
    "fetch(",
    "eval(",
    "setTimeout",
    "setInterval",
    "performance.",
    "crypto.",
    "AmbientLight",
    "DirectionalLight",
    "PointLight",
    "SpotLight",
    "HemisphereLight",
    "RectAreaLight",
    "import ",
    "require(",
]

ALLOWED_MATERIALS = {
    "MeshStandardMaterial", "MeshPhysicalMaterial", "MeshBasicMaterial",
    "PointsMaterial", "LineBasicMaterial", "LineDashedMaterial",
}

COMPUTED_THREE_RE = re.compile(r"THREE\s*\[")
HELPER_CALL_RE = re.compile(r"\b([a-z_][A-Za-z0-9_]*)\s*\(")
HELPER_DEF_RE = re.compile(r"function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(")

JS_BUILTINS = {
    "Math", "Number", "String", "Array", "Object", "JSON", "Map", "Set",
    "Boolean", "Error", "parseInt", "parseFloat", "isFinite", "isNaN",
    "Symbol", "BigInt", "ArrayBuffer", "DataView", "Int8Array", "Uint8Array",
    "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array",
    "Uint32Array", "Float32Array", "Float64Array",
    "if", "for", "while", "switch", "return", "function", "catch", "do",
    "typeof", "new", "throw", "await", "yield", "in", "of", "let", "const",
    "var", "else",
}


def check_banned(js: str) -> list[str]:
    hits = [tok for tok in BANNED_TOKENS if tok in js]
    if COMPUTED_THREE_RE.search(js):
        hits.append("THREE[computed]")
    return hits


def check_helpers_defined(js: str) -> list[str]:
    defined = set(HELPER_DEF_RE.findall(js))
    defined.add("generate")
    called = set(HELPER_CALL_RE.findall(js))
    missing = []
    for name in called:
        if name in JS_BUILTINS or name in defined:
            continue
        if name in {"Vector2", "Vector3", "Vector4", "Color"}:
            continue
        missing.append(name)
    return missing


def validate(js: str) -> tuple[bool, list[str]]:
    errs = []
    if "export default function generate" not in js:
        errs.append("missing export default function generate")
    errs.extend(f"banned:{t}" for t in check_banned(js))
    return (len(errs) == 0, errs)
