#!/usr/bin/env bash
set -euo pipefail

echo "[start] launching ollama"
ollama serve &
OLLAMA_PID=$!

echo "[start] waiting for ollama"
for i in $(seq 1 120); do
  if curl -fsS http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
    echo "[start] ollama up"
    break
  fi
  sleep 1
done

echo "[start] pulling qwen2.5vl:7b"
ollama pull qwen2.5vl:7b

echo "[start] pulling qwen2.5-coder:32b"
ollama pull qwen2.5-coder:32b

echo "[start] launching chute server on :10006"
cd /app
exec uvicorn chutes_ai.chute_app:app --host 0.0.0.0 --port 10006
