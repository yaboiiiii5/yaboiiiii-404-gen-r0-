from typing import Optional
from pydantic import BaseModel, Field


class PipeInput(BaseModel):
    image_url: Optional[str] = Field(None, max_length=2000)
    seed: int = Field(0)


class JsOutput(BaseModel):
    js: bytes
