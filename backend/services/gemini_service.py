import os
import json
import asyncio
from typing import List, Dict, Any, AsyncGenerator, Optional
from dotenv import load_dotenv

load_dotenv()

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.client = None
        if self.api_key and GENAI_AVAILABLE:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"Warning: Failed to initialize Google GenAI Client: {e}")

    def _map_model_name(self, model_name: str) -> str:
        name = model_name.lower().strip()
        if "flash" in name:
            return "gemini-2.5-flash"
        elif "pro" in name or "syntrix" in name:
            return "gemini-2.5-pro"
        elif "2.0" in name:
            return "gemini-2.0-flash"
        return "gemini-2.5-flash"

    async def stream_chat(
        self,
        messages: List[Dict[str, str]],
        model_name: str = "gemini-2.5-flash",
        deep_think: bool = False,
        tools: Optional[List[str]] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Stream chat responses from Gemini with Server-Sent Events (SSE).
        Yields JSON formatted SSE data strings.
        """
        tools = tools or []
        target_model = self._map_model_name(model_name)

        if not self.client or not self.api_key:
            # Fallback mock streamer when API key is not yet set
            yield f"data: {json.dumps({'type': 'thinking', 'content': 'API Key not configured in .env. Initializing local demo simulation...'})}\n\n"
            await asyncio.sleep(0.4)
            yield f"data: {json.dumps({'type': 'thinking', 'content': 'Analyzing query structure and synthesis requirements...'})}\n\n"
            await asyncio.sleep(0.4)
            fallback_text = (
                f"Hello! I am connected to the Python FastAPI backend.\n\n"
                f"To enable live **{model_name}** intelligence, please set your `GEMINI_API_KEY` in the `.env` file.\n\n"
                f"Everything in the UI (Server-Sent Events streaming, Deep Think reasoning, and multimodal tools) is now fully wired up!"
            )
            for word in fallback_text.split(" "):
                yield f"data: {json.dumps({'type': 'token', 'content': word + ' '})}\n\n"
                await asyncio.sleep(0.04)
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
            return

        try:
            # Emit initial thinking steps if Deep Think is active
            if deep_think:
                yield f"data: {json.dumps({'type': 'thinking', 'content': 'Initializing deep reasoning chains...'})}\n\n"
                yield f"data: {json.dumps({'type': 'thinking', 'content': 'Analyzing query context and knowledge retrieval...'})}\n\n"

            # Prepare Gemini contents from history
            contents = []
            for msg in messages:
                role = "user" if msg.get("role") == "user" else "model"
                contents.append(
                    types.Content(
                        role=role,
                        parts=[types.Part.from_text(text=msg.get("content", ""))],
                    )
                )

            # Configure tools (e.g. Google Search Grounding)
            config_params = {}
            if "web-search" in tools:
                config_params["tools"] = [{"google_search": {}}]
                yield f"data: {json.dumps({'type': 'thinking', 'content': 'Executing Google Search Grounding...'})}\n\n"

            config = types.GenerateContentConfig(**config_params) if config_params else None

            # Call streaming API
            response_stream = self.client.models.generate_content_stream(
                model=target_model,
                contents=contents,
                config=config,
            )

            citations_sent = False
            for chunk in response_stream:
                # Check for grounding metadata / citations
                if (
                    not citations_sent
                    and hasattr(chunk, "candidates")
                    and chunk.candidates
                    and hasattr(chunk.candidates[0], "grounding_metadata")
                    and chunk.candidates[0].grounding_metadata
                ):
                    metadata = chunk.candidates[0].grounding_metadata
                    if hasattr(metadata, "grounding_chunks") and metadata.grounding_chunks:
                        sources = []
                        for g_chunk in metadata.grounding_chunks:
                            if hasattr(g_chunk, "web") and g_chunk.web:
                                sources.append({
                                    "title": g_chunk.web.title or "Web Source",
                                    "url": g_chunk.web.uri or "",
                                    "score": 0.95,
                                })
                        if sources:
                            yield f"data: {json.dumps({'type': 'sources', 'sources': sources})}\n\n"
                            citations_sent = True

                # Yield text tokens
                if chunk.text:
                    yield f"data: {json.dumps({'type': 'token', 'content': chunk.text})}\n\n"
                    await asyncio.sleep(0.01)

            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        except Exception as e:
            error_msg = f"Gemini API Error: {str(e)}"
            print(error_msg)
            yield f"data: {json.dumps({'type': 'error', 'content': error_msg})}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"

    async def generate_image_concept(self, prompt: str, aspect_ratio: str = "1:1") -> Dict[str, Any]:
        """
        Generate an enhanced visual art prompt and concept specs using Gemini.
        """
        if not self.client or not self.api_key:
            return {
                "success": True,
                "prompt": prompt,
                "enhanced_prompt": f"A breathtaking cinematic visual of: {prompt}, hyper-realistic, 8k resolution, ray tracing, studio lighting.",
                "palette": ["#0B0E14", "#22D3EE", "#10B981", "#38BDF8"],
                "aspect_ratio": aspect_ratio,
            }

        try:
            enhancement_prompt = (
                f"You are a master digital art director. Take this user prompt: '{prompt}' and return a JSON object with: "
                f"1) 'enhanced_prompt' (a detailed 8k cinematic prompt with lighting, composition, and mood), "
                f"2) 'palette' (array of 4 hex colors), "
                f"3) 'camera_settings' (focal length, aperture, lens type). Output only valid JSON."
            )
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=enhancement_prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json"),
            )
            data = json.loads(response.text)
            data["success"] = True
            data["aspect_ratio"] = aspect_ratio
            return data
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "enhanced_prompt": prompt,
                "aspect_ratio": aspect_ratio,
            }

    async def generate_video_storyboard(self, prompt: str) -> Dict[str, Any]:
        """
        Generate structured cinematic video storyboard scenes using Gemini.
        """
        if not self.client or not self.api_key:
            return {
                "success": True,
                "title": "Cinematic Storyboard",
                "scenes": [
                    {"scene": 1, "time": "0:00 - 0:02", "shot": "Wide aerial drone pan", "description": f"Establishing shot of {prompt}"},
                    {"scene": 2, "time": "0:02 - 0:04", "shot": "Medium tracking shot", "description": "Dynamic movement with dramatic lighting"},
                    {"scene": 3, "time": "0:04 - 0:05", "shot": "Extreme close-up & pull back", "description": "Atmospheric depth and particle effects"},
                ],
            }

        try:
            script_prompt = (
                f"You are a cinematic film director and AI video generator specialist. "
                f"Create a 3-scene video storyboard for this concept: '{prompt}'. "
                f"Return a JSON object with 'title', 'genre', and 'scenes' (array of objects with scene number, timecode, shot type, and visual description). Output only valid JSON."
            )
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=script_prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json"),
            )
            data = json.loads(response.text)
            data["success"] = True
            return data
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def analyze_code(self, code: str, task: str = "explain", language: str = "typescript") -> Dict[str, Any]:
        """
        Specialized developer assistant code debugger, refactorer, and architect.
        """
        if not self.client or not self.api_key:
            return {
                "success": True,
                "analysis": "Code analysis ready. Configure GEMINI_API_KEY for live deep AST refactoring and automated test generation.",
            }

        try:
            system_instruction = (
                "You are Syntrix Dev Assistant, an expert software architect. "
                "Analyze code accurately, provide concise optimizations, identify security/edge case risks, "
                "and provide clean, idiomatic code examples."
            )
            user_query = f"Task: {task}\nLanguage: {language}\n\nCode:\n```{language}\n{code}\n```"
            response = self.client.models.generate_content(
                model="gemini-2.5-pro",
                contents=user_query,
                config=types.GenerateContentConfig(system_instruction=system_instruction),
            )
            return {"success": True, "analysis": response.text}
        except Exception as e:
            return {"success": False, "error": str(e)}


gemini_service = GeminiService()
