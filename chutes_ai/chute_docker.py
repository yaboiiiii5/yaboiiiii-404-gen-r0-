from chutes.image import Image


class ChuteDockerImage:
    def __init__(self, username: str, docker_image_name: str, tag: str):
        self.chute_docker_image = (
            Image(username=username, name=docker_image_name, tag=tag)
            .from_base("pytorch/pytorch:2.5.1-cuda12.4-cudnn9-runtime")
            .run_command("apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*")
            .run_command("curl -fsSL https://ollama.com/install.sh | sh")
            .run_command("pip install --no-cache-dir httpx fastapi uvicorn pydantic loguru python-multipart chutes")
            .set_workdir("/app")
            .add("./chutes_ai", "/app/chutes_ai")
            .add("./pipeline", "/app/pipeline")
            .add("./docker/start.sh", "/app/start.sh")
            .run_command("chmod +x /app/start.sh")
            .set_env("OLLAMA_HOST", "127.0.0.1:11434")
            .set_env("OLLAMA_MODELS", "/root/.ollama/models")
            .expose_port(10006)
            .set_entrypoint(["/app/start.sh"])
        )
