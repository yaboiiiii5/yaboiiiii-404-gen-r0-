# SN17 Chute — Image to Three.js

Round-1 miner submission for SN17 (404-GEN). Accepts an image, returns a procedural Three.js `.js` module.

## Layout
- `chutes_ai/` — Chute SDK wrapper (app, docker config, schemas)
- `pipeline/` — qwen2.5vl + qwen2.5-coder pipeline + banned-token validator
- `docker/Dockerfile`, `docker/start.sh` — image build + boot script
- `requirements.txt`, `pyproject.toml`

## Endpoint
`POST /generate` (multipart):
- `prompt_image_file`: image file (preferred), or
- `image_url`: form field URL
- `seed`: integer (default 0)

Returns: `text/javascript` stream. Never returns 500 — always a valid JS module (placeholder cube on internal error).

## Build & push
From `build/`:

    docker build -f docker/Dockerfile -t yaboiiiii/sn17-chute:0.1 -t yaboiiiii/sn17-chute:latest .
    docker push yaboiiiii/sn17-chute:0.1
    docker push yaboiiiii/sn17-chute:latest

## Deploy as Chute
From `build/`:

    chutes deploy chutes_ai.chute_app:chute --public

## Reproducibility
- temperature=0, top_p=1, fixed seed plumbed to both Ollama calls.
- Same image + same seed -> deterministic JS.

## Hardware
NodeSelector: `gpu_count=1, min_vram_gb_per_gpu=24`. qwen-coder:32b ~19GB + qwen2.5vl:7b ~5GB.

## Models
Pulled at container start via Ollama (~25GB). Image stays small (~12GB).
