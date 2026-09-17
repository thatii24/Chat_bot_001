import os
import json
import asyncio
from typing import List, Dict, Any, AsyncGenerator, Optional
from dotenv import load_dotenv

load_dotenv()

try:
    from openai import AsyncOpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


class OpenAIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "")
        self.client = None
        if self.api_key and OPENAI_AVAILABLE:
            try:
                self.client = AsyncOpenAI(api_key=self.api_key)
            except Exception as e:
                print(f"Warning: Failed to initialize OpenAI Client: {e}")

    def _map_model_name(self, model_name: str) -> str:
        name = model_name.lower().strip()
        if "o3" in name:
            return "o3-mini"
        elif "o1" in name:
            return "o1-mini"
        elif "mini" in name:
            return "gpt-4o-mini"
        elif "4o" in name or "syntrix" in name or "pro" in name:
            return "gpt-4o"
        return "gpt-4o"

    async def stream_chat(
        self,
        messages: List[Dict[str, str]],
        model_name: str = "GPT-4o",
        deep_think: bool = False,
        tools: Optional[List[str]] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Stream chat responses from OpenAI via Server-Sent Events (SSE).
        """
        tools = tools or []
        target_model = self._map_model_name(model_name)

        if not self.client or not self.api_key:
            # Local simulation fallback when OPENAI_API_KEY is not set
            yield f"data: {json.dumps({'type': 'thinking', 'content': 'OPENAI_API_KEY not found in .env. Initializing demo mode...'})}\n\n"
            await asyncio.sleep(0.3)
            yield f"data: {json.dumps({'type': 'thinking', 'content': 'Analyzing query semantics with OpenAI prompt builder...'})}\n\n"
            await asyncio.sleep(0.3)
            fallback_text = (
                f"Hello! Your chatbot is now configured for **OpenAI** ({target_model}).\n\n"
                f"To start receiving live responses, please add your `OPENAI_API_KEY` to the `.env` file.\n\n"
                f"✨ **Supported OpenAI Features**: GPT-4o, GPT-4o-mini, o3-mini reasoning, DALL-E 3 image concepts, and code analysis."
            )
            for word in fallback_text.split(" "):
                yield f"data: {json.dumps({'type': 'token', 'content': word + ' '})}\n\n"
                await asyncio.sleep(0.04)
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
            return

        try:
            if deep_think:
                yield f"data: {json.dumps({'type': 'thinking', 'content': 'Formulating multi-step OpenAI reasoning plan...'})}\n\n"
                yield f"data: {json.dumps({'type': 'thinking', 'content': 'Evaluating context and constraints...'})}\n\n"

            formatted_messages = []
            for msg in messages:
                role = msg.get("role", "user")
                if role not in ["system", "user", "assistant"]:
                    role = "user"
                formatted_messages.append({"role": role, "content": msg.get("content", "")})

            # Stream from OpenAI API
            response_stream = await self.client.chat.completions.create(
                model=target_model,
                messages=formatted_messages,
                stream=True,
            )

            async for chunk in response_stream:
                if chunk.choices and len(chunk.choices) > 0:
                    delta = chunk.choices[0].delta
                    if delta and delta.content:
                        yield f"data: {json.dumps({'type': 'token', 'content': delta.content})}\n\n"
                        await asyncio.sleep(0.005)

            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        except Exception as e:
            error_msg = f"OpenAI API Error: {str(e)}"
            print(error_msg)
            yield f"data: {json.dumps({'type': 'error', 'content': error_msg})}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"

    async def generate_image_concept(self, prompt: str, aspect_ratio: str = "1:1") -> Dict[str, Any]:
        """
        Generate DALL-E 3 image or enhanced visual prompt with OpenAI.
        """
        if not self.client or not self.api_key:
            return {
                "success": True,
                "prompt": prompt,
                "enhanced_prompt": f"A breathtaking cinematic visual of: {prompt}, hyper-realistic, 8k resolution, ray tracing.",
                "palette": ["#0B0E14", "#22D3EE", "#10B981", "#38BDF8"],
                "aspect_ratio": aspect_ratio,
            }

        try:
            # Call DALL-E 3
            img_response = await self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )
            image_url = img_response.data[0].url if img_response.data else None
            revised_prompt = img_response.data[0].revised_prompt if img_response.data else prompt

            return {
                "success": True,
                "image_url": image_url,
                "enhanced_prompt": revised_prompt,
                "palette": ["#0B0E14", "#22D3EE", "#10B981", "#38BDF8"],
                "aspect_ratio": aspect_ratio,
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "enhanced_prompt": prompt,
                "aspect_ratio": aspect_ratio,
            }

    async def generate_video_storyboard(self, prompt: str) -> Dict[str, Any]:
        """
        Generate structured cinematic video storyboard scenes using OpenAI GPT-4o.
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
                f"You are a cinematic film director. Create a 3-scene video storyboard for this concept: '{prompt}'. "
                f"Return a valid JSON object with 'title', 'genre', and 'scenes' (array of objects with scene, time, shot, description)."
            )
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": script_prompt}],
                response_format={"type": "json_object"},
            )
            data = json.loads(response.choices[0].message.content or "{}")
            data["success"] = True
            return data
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def analyze_code(self, code: str, task: str = "explain", language: str = "typescript") -> Dict[str, Any]:
        """
        Developer assistant code debugging, refactoring, and AST architecture explanation with GPT-4o.
        """
        if not self.client or not self.api_key:
            return {
                "success": True,
                "analysis": "OpenAI Dev Assistant ready. Set OPENAI_API_KEY in .env to enable live code execution & refactoring.",
            }

        try:
            system_instruction = (
                "You are Syntrix Dev Assistant, an expert software engineer. "
                "Analyze the provided code, provide concise refactorings, highlight edge cases, and provide idiomatic code snippets."
            )
            user_query = f"Task: {task}\nLanguage: {language}\n\nCode:\n```{language}\n{code}\n```"
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": user_query},
                ],
            )
            return {"success": True, "analysis": response.choices[0].message.content}
        except Exception as e:
            return {"success": False, "error": str(e)}


openai_service = OpenAIService()
