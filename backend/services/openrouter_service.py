"""
AI Chat Service for Shreya Wangikar's Portfolio.
Supports Google Gemini API (primary) with OpenRouter API fallback.
"""

import os
import requests
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv()


class OpenRouterService:
    """
    Service class for interacting with Gemini and OpenRouter APIs.
    """
    
    GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
    OPENROUTER_FALLBACK_MODELS = [
        "liquid/lfm-2.5-2.6b:free",
        "google/gemma-4-26b-a4b-it:free",
        "qwen/qwen3.8-27b:free"
    ]
    
    SYSTEM_PROMPT = """You are an AI assistant representing Shreya Wangikar on her personal developer portfolio website.
Answer questions professionally, clearly, and concisely with technical depth.

ABOUT SHREYA WANGIKAR:
- Final-year B.E. Information Technology student (2023–2027) at Pune Institute of Computer Technology (PICT), affiliated with Savitribai Phule Pune University.
- CGPA: 8.87 / 10.0.
- Contact: wangikarshreya@gmail.com | +91 89838 07663 | Pune, Maharashtra, India.
- Profiles: GitHub (https://github.com/Shreyawangikar), LinkedIn (https://www.linkedin.com/in/shreya-wangikar).

TARGET ROLES:
Software Engineer, Software Development Engineer, Full Stack Developer, Frontend Developer, Backend Developer, AI/ML-oriented Software Engineer.

CORE SKILLS:
- Languages: C++, Python, JavaScript, SQL, Java
- Frontend: React.js, Next.js, HTML, CSS, Tailwind CSS
- Backend: Node.js, Express.js, REST APIs
- Databases: MySQL, MongoDB, SQL
- Core CS: Data Structures & Algorithms, Object-Oriented Programming, DBMS, Operating Systems, Computer Networks, Software Engineering
- AI / ML: Machine Learning, Deep Learning, Self-Supervised Learning (SimCLR, BYOL), Computer Vision
- Tools & Specialized: Fabric.js, Liveblocks, Unity, Vuforia, ARCore, Git, GitHub, Vercel, Render, VS Code

EDUCATION:
1. Pune Institute of Computer Technology (PICT): B.E. Information Technology (2023–2027), Savitribai Phule Pune University — CGPA: 8.87
2. Bharat Bharti College, Parbhani: HSC (2023) — 81%
3. Oasis's English School, Parbhani: SSC (2021) — 100%

FEATURED PROJECTS:
1. Collaborative Design Platform
   - Tech Stack: Next.js 14, TypeScript, Fabric.js, Liveblocks, Tailwind CSS
   - Real-time collaborative design platform enabling users to create, edit, and collaborate on designs in a shared workspace.
   - Highlights: Canvas-based editing with Fabric.js, multiplayer presence & state synchronization via Liveblocks, responsive UI.

2. TaskForge — Multithreaded Job Scheduler
   - Tech Stack: C++, STL, CMake, Multithreading
   - Multithreaded C++ job scheduling engine with worker thread pools, priority execution, and DAG dependency resolution with cycle detection.

3. JanNivaran — Civic Issue Reporting & Resolution Platform
   - Tech Stack: React, Node.js, Express.js, MongoDB, REST APIs, Google Gemini, Google Maps
   - Full-stack civic reporting platform with geotagged complaint workflows, Google Gemini AI priority classification, and role-based workflows.

4. Career Tracking Platform
   - Tech Stack: React, Node.js, MongoDB, REST APIs, Tailwind CSS
   - Hackathon Finalist at Mastercard Code for Change 2.0 (2025). AI-driven alumni career tracking and intelligent recommendations.

5. Subscription Management System (ERP)
   - Tech Stack: JavaScript, Node.js, Express, React, PostgreSQL, Tailwind CSS
   - Hackathon Finalist at Odoo x SNS Coimbatore Hackathon 2026. Automated subscription lifecycle (Draft to Active) and recurring invoice generation.

6. AR Image & Surface Tracking Experience
   - Tech Stack: Unity, Vuforia, C#, ARCore
   - Immersive augmented reality application implementing Image Targets and Ground Plane surface detection.

7. Self-Supervised Visual Representation Learning
   - Tech Stack: Python, Deep Learning, Computer Vision, SimCLR, BYOL
   - Academic research exploring contrastive representation learning without manual labels.

Guidelines:
- Answer concisely, politely, and highlighting Shreya's concrete technical skills and achievements.
- If asked about hiring or contacting Shreya, provide her email (wangikarshreya@gmail.com) and phone (+91 89838 07663).
- Do not hallucinate qualifications or professional experience not listed above."""

    def __init__(self):
        """Initialize service with available API keys."""
        self.gemini_key = os.getenv('GEMINI_API_KEY')
        self.openrouter_key = os.getenv('OPENROUTER_API_KEY')
        
        if not self.gemini_key and not self.openrouter_key:
            raise ValueError("Either GEMINI_API_KEY or OPENROUTER_API_KEY must be provided")

    def _call_gemini(self, conversation_history: List[dict]) -> str:
        """Call Google Gemini API."""
        if not self.gemini_key:
            raise ValueError("GEMINI_API_KEY not configured")

        contents = []
        for msg in conversation_history[-5:]:
            role = "user" if msg.get("role") == "user" else "model"
            content = msg.get("content", "")
            contents.append({"role": role, "parts": [{"text": content}]})

        payload = {
            "contents": contents,
            "systemInstruction": {
                "parts": [{"text": self.SYSTEM_PROMPT}]
            },
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 600,
            }
        }

        url = f"{self.GEMINI_API_URL}?key={self.gemini_key}"
        response = requests.post(url, json=payload, timeout=20)
        response.raise_for_status()
        data = response.json()
        
        candidates = data.get("candidates", [])
        if candidates and "content" in candidates[0]:
            parts = candidates[0]["content"].get("parts", [])
            if parts and "text" in parts[0]:
                return parts[0]["text"].strip()
                
        raise ValueError("Invalid format from Gemini API")

    def _call_openrouter(self, conversation_history: List[dict]) -> str:
        """Call OpenRouter API with fallbacks."""
        if not self.openrouter_key:
            raise ValueError("OPENROUTER_API_KEY not configured")

        headers = {
            "Authorization": f"Bearer {self.openrouter_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": os.getenv('FRONTEND_URL', 'http://localhost:8080'),
            "X-Title": "Shreya Portfolio Chatbot"
        }

        messages = [{"role": "system", "content": self.SYSTEM_PROMPT}]
        for msg in conversation_history[-5:]:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })

        for model in self.OPENROUTER_FALLBACK_MODELS:
            try:
                payload = {
                    "model": model,
                    "messages": messages,
                    "max_tokens": 500,
                    "temperature": 0.7
                }
                response = requests.post(
                    self.OPENROUTER_API_URL,
                    headers=headers,
                    json=payload,
                    timeout=20
                )
                if response.status_code == 200:
                    data = response.json()
                    if "choices" in data and len(data["choices"]) > 0:
                        return data["choices"][0]["message"]["content"].strip()
            except Exception as e:
                print(f"OpenRouter model {model} failed: {e}")
                continue

        raise Exception("All OpenRouter models failed")

    def get_chat_response(self, conversation_history: List[dict]) -> str:
        """
        Get AI response from Gemini, falling back to OpenRouter.
        """
        # Try Gemini first if key exists
        if self.gemini_key:
            try:
                return self._call_gemini(conversation_history)
            except Exception as gemini_err:
                print(f"Gemini API attempt failed: {gemini_err}. Trying OpenRouter fallback...")

        # Fallback to OpenRouter
        if self.openrouter_key:
            try:
                return self._call_openrouter(conversation_history)
            except Exception as router_err:
                print(f"OpenRouter fallback failed: {router_err}")

        # If both fail or only Gemini was available
        if self.gemini_key:
            return self._call_gemini(conversation_history)

        raise Exception("Failed to get response from AI providers")


_service_instance: Optional[OpenRouterService] = None


def get_openrouter_service() -> OpenRouterService:
    global _service_instance
    if _service_instance is None:
        _service_instance = OpenRouterService()
    return _service_instance
