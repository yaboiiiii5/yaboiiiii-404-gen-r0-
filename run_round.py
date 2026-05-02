#!/usr/bin/env python3
"""Round 1 generation runner. Fetch seed + prompts, generate, write outputs/."""
import asyncio
import json
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

import httpx

sys.path.insert(0, str(Path(__file__).parent))
from pipeline.generate_scene import generate_scene_from_url, PLACEHOLDER_JS

ROUND = 1
COMP_BASE = "https://raw.githubusercontent.com/404-Repo/404-active-competition/main"
OUT_DIR = Path(__file__).parent / "outputs"
FAILED_PATH = OUT_DIR / "_failed.json"


def stem_from_url(url: str) -> str:
    name = Path(urlparse(url).path).name
    return name.rsplit(".", 1)[0] if "." in name else name


async def fetch_text(url: str) -> str:
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.get(url)
        r.raise_for_status()
        return r.text


async def main():
    OUT_DIR.mkdir(exist_ok=True)
    seed = json.loads(await fetch_text(f"{COMP_BASE}/rounds/{ROUND}/seed.json"))["seed"]
    prompts_text = await fetch_text(f"{COMP_BASE}/rounds/{ROUND}/prompts.txt")
    prompts = [p.strip() for p in prompts_text.splitlines() if p.strip()]
    print(f"seed={seed} prompts={len(prompts)}", flush=True)

    failed = {}
    t0 = time.time()
    for i, url in enumerate(prompts):
        stem = stem_from_url(url)
        out = OUT_DIR / f"{stem}.js"
        if out.exists() and out.stat().st_size > 0:
            print(f"[{i+1}/{len(prompts)}] {stem} cached", flush=True)
            continue
        ts = time.time()
        try:
            js = await generate_scene_from_url(url, seed)
            out.write_bytes(js)
            print(f"[{i+1}/{len(prompts)}] {stem} ok {time.time()-ts:.1f}s", flush=True)
        except Exception as e:
            out.write_bytes(PLACEHOLDER_JS)
            failed[stem] = str(e)[:200]
            print(f"[{i+1}/{len(prompts)}] {stem} FAIL {e}", flush=True)

    if failed:
        FAILED_PATH.write_text(json.dumps(failed, indent=2))
    print(f"done {len(prompts)} prompts in {time.time()-t0:.0f}s, failed={len(failed)}", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
