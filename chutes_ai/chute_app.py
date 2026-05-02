import asyncio
import io
import json
import sys
import threading
import traceback
import zipfile
from contextlib import asynccontextmanager
from typing import Optional

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, PlainTextResponse, StreamingResponse
from loguru import logger
from pydantic import BaseModel

sys.path.insert(0, "/app")

from pipeline.generate_scene import PLACEHOLDER_JS, generate_scene_from_url

OLLAMA_BASE = "http://127.0.0.1:11434"
VISION_MODEL = "qwen2.5vl:7b"
CODE_MODEL = "qwen2.5-coder:32b"


class PromptItem(BaseModel):
    stem: str
    image_url: str


class GenerateRequest(BaseModel):
    prompts: list[PromptItem]
    seed: int = 0


class ServiceState:
    def __init__(self):
        self.lock = threading.Lock()
        self.status = "warming_up"
        self.progress = 0
        self.total = 0
        self.replacements_remaining = 3
        self.results: dict[str, bytes] = {}
        self.failed: dict[str, str] = {}
        self.current_stems: frozenset[str] = frozenset()
        self.task: Optional[asyncio.Task] = None

    def snapshot(self):
        with self.lock:
            return {
                "status": self.status,
                "progress": self.progress if self.status == "generating" else None,
                "total": self.total if self.status == "generating" else None,
                "payload": None,
            }


STATE = ServiceState()


async def _warmup():
    try:
        async with httpx.AsyncClient(timeout=600.0) as c:
            for _ in range(600):
                try:
                    r = await c.get(f"{OLLAMA_BASE}/api/tags")
                    if r.status_code == 200:
                        break
                except Exception:
                    pass
                await asyncio.sleep(1)
            for model in (VISION_MODEL, CODE_MODEL):
                logger.info(f"warmup: priming {model}")
                try:
                    await c.post(
                        f"{OLLAMA_BASE}/api/generate",
                        json={"model": model, "prompt": "ok", "stream": False,
                              "options": {"num_predict": 1, "temperature": 0}},
                        timeout=1800.0,
                    )
                except Exception as e:
                    logger.warning(f"warmup prime {model}: {e}")
        with STATE.lock:
            STATE.status = "ready"
        logger.info("warmup complete; state=ready")
    except Exception as e:
        logger.error(f"warmup failed: {e}\n{traceback.format_exc()}")
        with STATE.lock:
            STATE.status = "ready"


async def _process_batch(prompts: list[PromptItem], seed: int):
    for i, p in enumerate(prompts):
        try:
            js = await generate_scene_from_url(p.image_url, seed)
            STATE.results[p.stem] = js
        except Exception as e:
            logger.error(f"prompt {p.stem} failed: {e}")
            STATE.results[p.stem] = PLACEHOLDER_JS
            STATE.failed[p.stem] = str(e)[:200]
        with STATE.lock:
            STATE.progress = i + 1
    with STATE.lock:
        STATE.status = "complete"
    logger.info(f"batch complete: {len(STATE.results)} results, {len(STATE.failed)} failed")


@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(_warmup())
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/health")
async def health():
    return PlainTextResponse("ok")


@app.get("/status")
async def status(replacements_remaining: Optional[int] = None):
    if replacements_remaining is not None:
        with STATE.lock:
            STATE.replacements_remaining = replacements_remaining
    return JSONResponse(STATE.snapshot())


@app.post("/generate")
async def generate(req: GenerateRequest):
    incoming = frozenset(p.stem for p in req.prompts)
    with STATE.lock:
        if STATE.status in ("generating", "complete") and incoming == STATE.current_stems:
            return {"accepted": len(req.prompts)}
        if STATE.status == "warming_up":
            raise HTTPException(409, detail={"detail": "Cannot accept batch", "current_status": "warming_up"})
        if STATE.status == "generating":
            raise HTTPException(409, detail={"detail": "Cannot accept batch", "current_status": "generating"})
        STATE.results = {}
        STATE.failed = {}
        STATE.current_stems = incoming
        STATE.status = "generating"
        STATE.progress = 0
        STATE.total = len(req.prompts)
    STATE.task = asyncio.create_task(_process_batch(req.prompts, req.seed))
    return {"accepted": len(req.prompts)}


@app.get("/results")
async def results():
    with STATE.lock:
        if STATE.status != "complete":
            raise HTTPException(409, detail={"detail": "Not complete", "current_status": STATE.status})
        results_copy = dict(STATE.results)
        failed_copy = dict(STATE.failed)

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        for stem, js in results_copy.items():
            if stem in failed_copy:
                z.writestr(f"{stem}.js", PLACEHOLDER_JS)
            else:
                z.writestr(f"{stem}.js", js)
        if failed_copy:
            z.writestr("_failed.json", json.dumps(failed_copy))
    buf.seek(0)

    def _iter():
        while True:
            chunk = buf.read(65536)
            if not chunk:
                break
            yield chunk

    return StreamingResponse(_iter(), media_type="application/zip")
