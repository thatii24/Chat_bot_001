import os
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

from services.openai_service import openai_service
from services.gemini_service import gemini_service

load_dotenv()

app = FastAPI(
    title="Syntrix AI Chatbot Backend",
    description="FastAPI Backend for OpenAI & Gemini Multi-Turn Chat, Streaming, and Multimodal Tools",
    version="1.0.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MessageItem(BaseModel):
    role: str
    content: str


class ChatStreamRequest(BaseModel):
    messages: List[MessageItem]
    model: Optional[str] = "Syntrix v4.2"
    deep_think: Optional[bool] = False
    tools: Optional[List[str]] = []


class ImageGenRequest(BaseModel):
    prompt: str
    aspect_ratio: Optional[str] = "1:1"


class VideoGenRequest(BaseModel):
    prompt: str


class CodeAnalysisRequest(BaseModel):
    code: str
    task: Optional[str] = "explain"
    language: Optional[str] = "typescript"


@app.get("/")
def read_root():
    openai_key_set = bool(os.getenv("OPENAI_API_KEY"))
    gemini_key_set = bool(os.getenv("GEMINI_API_KEY"))
    return {
        "status": "online",
        "service": "Syntrix AI Backend (OpenAI + Gemini)",
        "openai_configured": openai_key_set,
        "gemini_configured": gemini_key_set,
    }


@app.get("/api/health")
def health_check():
    openai_key_set = bool(os.getenv("OPENAI_API_KEY"))
    return {
        "status": "healthy",
        "openai_configured": openai_key_set,
        "provider": "openai",
        "supported_models": [
            "Syntrix v4.2",
            "GPT-4o",
            "GPT-4o mini",
            "o3-mini",
            "o1-mini",
        ],
    }


@app.post("/api/chat/stream")
async def chat_stream(request: ChatStreamRequest):
    """
    Stream chat completion with Server-Sent Events (SSE) using OpenAI.
    """
    dict_messages = [{"role": m.role, "content": m.content} for m in request.messages]
    model_name = request.model or "GPT-4o"

    # Route to OpenAI (or Gemini if model explicitly specifies gemini)
    if "gemini" in model_name.lower():
        generator = gemini_service.stream_chat(
            messages=dict_messages,
            model_name=model_name,
            deep_think=request.deep_think or False,
            tools=request.tools or [],
        )
    else:
        generator = openai_service.stream_chat(
            messages=dict_messages,
            model_name=model_name,
            deep_think=request.deep_think or False,
            tools=request.tools or [],
        )

    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.post("/api/generate/image")
async def generate_image(request: ImageGenRequest):
    """
    Generate DALL-E 3 visual art or enhanced concept prompts.
    """
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")
    result = await openai_service.generate_image_concept(
        prompt=request.prompt,
        aspect_ratio=request.aspect_ratio or "1:1",
    )
    return result


@app.post("/api/generate/video")
async def generate_video(request: VideoGenRequest):
    """
    Generate cinematic multi-scene storyboard breakdown for video prompts.
    """
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")
    result = await openai_service.generate_video_storyboard(prompt=request.prompt)
    return result


@app.post("/api/tools/code")
async def analyze_code(request: CodeAnalysisRequest):
    """
    Developer assistant code debugging, refactoring, and AST architecture explanation.
    """
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty.")
    result = await openai_service.analyze_code(
        code=request.code,
        task=request.task or "explain",
        language=request.language or "typescript",
    )
    return result
