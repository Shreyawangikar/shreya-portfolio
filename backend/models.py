"""
Data models for the portfolio chatbot.
Defines the structure for chat messages and API responses.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional


@dataclass
class ChatMessage:
    """
    Represents a single message in a conversation.
    
    Attributes:
        role: Either 'user' or 'assistant'
        content: The message text content
    """
    role: str
    content: str
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization."""
        return {
            'role': self.role,
            'content': self.content
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'ChatMessage':
        """Create ChatMessage from dictionary."""
        return cls(
            role=data.get('role', 'user'),
            content=data.get('content', '')
        )


@dataclass
class ChatRequest:
    """
    Represents an incoming chat request from the frontend.
    
    Attributes:
        messages: List of conversation messages (last 5 for context)
    """
    messages: List[ChatMessage]
    
    @classmethod
    def from_json(cls, data: dict) -> 'ChatRequest':
        """Create ChatRequest from JSON data."""
        messages = [
            ChatMessage.from_dict(m) 
            for m in data.get('messages', [])
        ]
        return cls(messages=messages)
    
    def get_last_user_message(self) -> Optional[str]:
        """Extract the most recent user message."""
        for msg in reversed(self.messages):
            if msg.role == 'user':
                return msg.content
        return None


@dataclass
class ChatResponse:
    """
    Represents the response sent back to the frontend.
    
    Attributes:
        reply: The AI assistant's response text
        success: Whether the request was successful
        error: Error message if success is False
    """
    reply: str
    success: bool = True
    error: Optional[str] = None
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON response."""
        response = {
            'reply': self.reply,
            'success': self.success
        }
        if self.error:
            response['error'] = self.error
        return response


@dataclass
class ChatLog:
    """
    Represents a logged chat exchange in the database.
    
    Attributes:
        id: Database primary key
        user_message: The user's input
        assistant_reply: The AI's response
        ip_address: Client IP for analytics
        timestamp: When the exchange occurred
    """
    id: int
    user_message: str
    assistant_reply: str
    ip_address: Optional[str]
    timestamp: datetime
    
    @classmethod
    def from_db_row(cls, row: dict) -> 'ChatLog':
        """Create ChatLog from database row."""
        return cls(
            id=row['id'],
            user_message=row['user_message'],
            assistant_reply=row['assistant_reply'],
            ip_address=row.get('ip_address'),
            timestamp=datetime.fromisoformat(row['timestamp']) if row['timestamp'] else datetime.now()
        )


# Portfolio context data model
@dataclass
class PortfolioInfo:
    """
    Contains information about Shreya for the AI assistant context.
    """
    name: str = "Shreya"
    role: str = "Full Stack Developer"
    skills: List[str] = None
    education: str = "B.Tech in Computer Science"
    experience_years: int = 2
    
    def __post_init__(self):
        if self.skills is None:
            self.skills = [
                "React", "TypeScript", "Node.js", "Python",
                "Flask", "FastAPI", "PostgreSQL", "MongoDB",
                "AWS", "Docker", "Git", "REST APIs"
            ]
    
    def to_context_string(self) -> str:
        """Generate context string for AI system prompt."""
        return f"""
        Name: {self.name}
        Role: {self.role}
        Education: {self.education}
        Experience: {self.experience_years} years
        Skills: {', '.join(self.skills)}
        """
