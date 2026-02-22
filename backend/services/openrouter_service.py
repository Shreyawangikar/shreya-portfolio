"""
OpenRouter API Service for AI chat functionality.
Handles communication with OpenRouter API using Mistral 7B model.
"""

import os
import requests
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class OpenRouterService:
    """
    Service class for interacting with OpenRouter API.
    Uses Liquid LFM 2.5 Instruct as the free AI model (good for chat).
    """
    
    # OpenRouter API configuration
    API_URL = "https://openrouter.ai/api/v1/chat/completions"
    MODEL = "liquid/lfm-2.5-1.2b-instruct:free"
    
    # System prompt for portfolio assistant
    SYSTEM_PROMPT = """You are an AI assistant for Shreya Wangikar's personal portfolio website.
Answer professionally, clearly, and confidently.

ABOUT SHREYA:
Shreya Wangikar is a Full-Stack Developer and third-year B.E. Information Technology student (2023-2027) at Pune Institute of Computer Technology (PICT), Pune, with a CGPA of 8.8.

She specializes in:
- Backend architecture
- Full-stack system design
- ERP-style lifecycle systems
- Algorithmic problem solving
- Applied AI & LLM integrations

She has solved 200+ DSA problems on LeetCode using C++.

---

MAJOR PROJECTS:

1. Subscription Management System (ERP)
- Built during Odoo x SNS Hackathon 2026
- Production-style subscription lifecycle engine
- Role-based access control (Admin, Internal User, Portal User)
- Recurring billing automation
- Auto invoice generation & payment tracking
- Tax & discount rule engines
- PostgreSQL + Prisma ORM
- MVC architecture
- Selected as Hackathon Finalist (3-4 architecture review rounds)

2. Career Tracking Platform (Mastercard Code for Change 2.0)
- AI-powered alumni career tracking system
- Built in 36-hour hackathon
- Dashboard + recommendation system
- Team of 8
- Finalist

3. GlobeTrotter (Travel Planning Platform)
- Multi-city trip planner
- Budget tracking & interactive calendar
- Normalized relational schema
- React + Node.js + MySQL

4. SkillSprint (Career Acceleration SaaS)
- Kanban boards
- Real-time tracking
- PostgreSQL + Prisma
- Authentication & public portfolio support

5. WordleX (Entropy-Based Wordle Solver)
- Uses information theory (entropy maximization)
- Optimized search algorithm
- Firebase deployment
- CI/CD with GitHub Actions
- Interactive visualizations

---

TECH STACK:

Languages:
C, C++, Python, JavaScript, TypeScript

Frontend:
React.js, Vite, TailwindCSS, Framer Motion

Backend:
Node.js, Express.js, Prisma ORM

Databases:
PostgreSQL, MySQL, MongoDB

Cloud & DevOps:
AWS (EC2, S3, IAM fundamentals)
Firebase Hosting
GitHub Actions CI/CD

AI / Systems:
Prompt Engineering
LLM integration
RAG pipelines (foundational)
Information theory-based optimization

---
CERTIFICATIONS:

AWS Cloud Fundamentals Bootcamp: 
Completed cloud fundamentals training via AWS Cloud Club at PICT. 
Hands-on exposure to EC2, S3, IAM, cloud security basics, and deployment concepts.

AR/VR Bootcamp — Unity & Vuforia (2025): 
Completed a 3-day immersive bootcamp organized by PICT IT Department in collaboration with CDAC Pune. Worked with Image Target, Multi-Image Target, and Ground Plane technologies
---

HACKATHONS:
- Finalist: Odoo x SNS Hackathon 2026
- Finalist: Mastercard Code for Change 2.0 (2025)

---

Answer concisely but with technical depth.
If asked about projects, explain architecture and impact.
If asked about skills, categorize clearly.
Do not invent information."""

    def __init__(self):
        """Initialize the OpenRouter service with API key."""
        self.api_key = os.getenv('OPENROUTER_API_KEY')
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is required")
    
    def _build_messages(self, conversation_history: List[dict]) -> List[dict]:
        """
        Build the messages array for the API request.
        Includes system prompt and conversation history.
        
        Args:
            conversation_history: List of message dicts with 'role' and 'content'
        
        Returns:
            Complete messages array for API request
        """
        messages = [
            {"role": "system", "content": self.SYSTEM_PROMPT}
        ]
        
        # Add conversation history (limited to last 5 messages)
        for msg in conversation_history[-5:]:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
        
        return messages
    
    def get_chat_response(self, conversation_history: List[dict]) -> str:
        """
        Get AI response from OpenRouter API.
        
        Args:
            conversation_history: List of previous messages for context
        
        Returns:
            The AI assistant's response text
        
        Raises:
            Exception: If API request fails
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": os.getenv('FRONTEND_URL', 'http://localhost:8080'),
            "X-Title": "Shreya's Portfolio Chatbot"
        }
        
        payload = {
            "model": self.MODEL,
            "messages": self._build_messages(conversation_history),
            "max_tokens": 500,
            "temperature": 0.7
        }
        
        try:
            response = requests.post(
                self.API_URL,
                headers=headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            
            data = response.json()
            
            # Extract response text from API response
            if "choices" in data and len(data["choices"]) > 0:
                return data["choices"][0]["message"]["content"]
            else:
                raise ValueError("No response content in API response")
                
        except requests.exceptions.Timeout:
            raise Exception("API request timed out. Please try again.")
        except requests.exceptions.HTTPError as e:
            if response.status_code == 401:
                raise Exception("Invalid API key. Please check configuration.")
            elif response.status_code == 429:
                raise Exception("Rate limit exceeded. Please wait and try again.")
            else:
                raise Exception(f"API error: {e}")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Network error: {e}")
    
    def validate_api_key(self) -> bool:
        """
        Validate that the API key is working.
        Makes a minimal test request to verify authentication.
        
        Returns:
            True if API key is valid, False otherwise
        """
        try:
            test_messages = [{"role": "user", "content": "Hi"}]
            self.get_chat_response(test_messages)
            return True
        except Exception:
            return False


# Create singleton instance for easy import
_service_instance: Optional[OpenRouterService] = None


def get_openrouter_service() -> OpenRouterService:
    """
    Get or create the OpenRouter service singleton.
    
    Returns:
        OpenRouterService instance
    """
    global _service_instance
    if _service_instance is None:
        _service_instance = OpenRouterService()
    return _service_instance
