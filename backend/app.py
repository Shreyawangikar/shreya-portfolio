"""
Portfolio Chatbot API - Production Flask Application
====================================================
A production-ready Flask backend for an AI-powered portfolio chatbot.
Uses OpenRouter API with Mistral 7B model and SQLite for chat logging.

Features:
- Rate limiting (20 requests/minute per IP)
- Conversation memory (last 5 messages)
- SQLite database for chat logs
- Modular service architecture
- CORS support for frontend integration
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
from collections import defaultdict
from dotenv import load_dotenv

# Import modular components
from database import init_database, save_chat_log, get_chat_stats, get_recent_logs
from services import get_openrouter_service
from models import ChatRequest, ChatResponse

# Load environment variables
load_dotenv()

# ============================================================
# Flask Application Setup
# ============================================================

app = Flask(__name__)

# Configure CORS for frontend
CORS(app, origins=["https://shreya-portfolio-azure.vercel.app"])


# Initialize database on startup
init_database()

# ============================================================
# Configuration
# ============================================================

RATE_LIMIT = 20  # Maximum requests per minute per IP
WINDOW = 60      # Rate limit window in seconds

# In-memory rate limiting store (consider Redis for production cluster)
ip_requests = defaultdict(list)

# ============================================================
# Helper Functions
# ============================================================

def get_client_ip() -> str:
    """
    Extract client IP address from request headers.
    Handles common proxy headers (X-Forwarded-For, CF-Connecting-IP).
    
    Returns:
        Client IP address string
    """
    forwarded_for = request.headers.get('X-Forwarded-For')
    if forwarded_for:
        return forwarded_for.split(',')[0].strip()
    
    cloudflare_ip = request.headers.get('CF-Connecting-IP')
    if cloudflare_ip:
        return cloudflare_ip.strip()
    
    return request.remote_addr or '127.0.0.1'


def check_rate_limit(client_ip: str) -> bool:
    """
    Check if client has exceeded rate limit.
    Uses sliding window algorithm for fair rate limiting.
    
    Args:
        client_ip: The client's IP address
    
    Returns:
        True if request allowed, False if rate limited
    """
    now = datetime.now()
    window_start = now - timedelta(seconds=WINDOW)
    
    # Remove expired requests from the window
    ip_requests[client_ip] = [
        req_time for req_time in ip_requests[client_ip]
        if req_time > window_start
    ]
    
    # Check if limit exceeded
    if len(ip_requests[client_ip]) >= RATE_LIMIT:
        return False
    
    # Record this request
    ip_requests[client_ip].append(now)
    return True


# ============================================================
# API Endpoints
# ============================================================

@app.route("/health", methods=["GET"])
def health():
    """
    Health check endpoint for monitoring and load balancers.
    Returns service status and basic info.
    """
    return jsonify({
        "status": "ok",
        "service": "shreya-portfolio-chat",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }), 200


@app.route("/api/chat", methods=["POST", "OPTIONS"])
def chat():
    
    """
    Main chat endpoint for AI conversation.
    
    Request Body:
        {
            "messages": [
                {"role": "user", "content": "Hello"},
                {"role": "assistant", "content": "Hi there!"},
                ...
            ]
        }
    
    Response:
        {
            "reply": "AI response text",
            "success": true
        }
    
    Errors:
        - 400: Invalid request body
        - 429: Rate limit exceeded
        - 500: Server/API error
    """
    client_ip = get_client_ip()
    
    # Rate limiting check
    if not check_rate_limit(client_ip):
        return jsonify({
            "error": "Rate limited. Maximum 20 requests per minute allowed.",
            "success": False
        }), 429
    
    try:
        # Parse and validate request
        data = request.json
        if not data:
            return jsonify({"error": "Invalid JSON body", "success": False}), 400
        
        chat_request = ChatRequest.from_json(data)
        
        if not chat_request.messages:
            return jsonify({"error": "No messages provided", "success": False}), 400
        
        # Get the last user message for logging
        user_message = chat_request.get_last_user_message()
        if not user_message:
            return jsonify({"error": "No user message found", "success": False}), 400
        
        # Get AI response from OpenRouter service
        openrouter = get_openrouter_service()
        conversation_history = [msg.to_dict() for msg in chat_request.messages]
        
        reply = openrouter.get_chat_response(conversation_history)
        
        # Log the chat exchange to database
        try:
            save_chat_log(
                user_message=user_message,
                assistant_reply=reply,
                ip_address=client_ip
            )
        except Exception as log_error:
            # Don't fail the request if logging fails
            print(f"Warning: Failed to log chat: {log_error}")
        
        # Return successful response
        response = ChatResponse(reply=reply, success=True)
        return jsonify(response.to_dict()), 200
    
    except ValueError as e:
        # Configuration or validation errors
        print(f"Validation error: {e}")
        return jsonify({"error": str(e), "success": False}), 400
    
    except Exception as e:
        # Unexpected errors
        print(f"Chat error: {e}")
        return jsonify({
            "error": "An error occurred processing your request. Please try again.",
            "success": False
        }), 500


@app.route("/api/stats", methods=["GET"])
def stats():
    """
    Get chat statistics from the database.
    Useful for admin dashboard and monitoring.
    
    Response:
        {
            "total_chats": 100,
            "unique_visitors": 25,
            "chats_last_24h": 10,
            "rate_limit_config": {...}
        }
    """
    try:
        db_stats = get_chat_stats()
        
        return jsonify({
            **db_stats,
            "rate_limit_config": {
                "requests_per_minute": RATE_LIMIT,
                "window_seconds": WINDOW
            },
            "active_ips": len(ip_requests)
        }), 200
    
    except Exception as e:
        print(f"Stats error: {e}")
        return jsonify({"error": "Failed to retrieve stats"}), 500


@app.route("/api/logs", methods=["GET"])
def logs():
    """
    Get recent chat logs (for admin dashboard).
    
    Query Parameters:
        limit: Maximum number of logs to return (default: 50)
    
    Response:
        {
            "logs": [...],
            "count": 50
        }
    """
    try:
        limit = request.args.get('limit', 50, type=int)
        limit = min(limit, 100)  # Cap at 100 to prevent abuse
        
        recent_logs = get_recent_logs(limit=limit)
        
        return jsonify({
            "logs": recent_logs,
            "count": len(recent_logs)
        }), 200
    
    except Exception as e:
        print(f"Logs error: {e}")
        return jsonify({"error": "Failed to retrieve logs"}), 500


# ============================================================
# Error Handlers
# ============================================================

@app.errorhandler(404)
def not_found(e):
    """Handle 404 Not Found errors."""
    return jsonify({
        "error": "Endpoint not found",
        "success": False
    }), 404


@app.errorhandler(405)
def method_not_allowed(e):
    """Handle 405 Method Not Allowed errors."""
    return jsonify({
        "error": "Method not allowed for this endpoint",
        "success": False
    }), 405


@app.errorhandler(500)
def server_error(e):
    """Handle 500 Internal Server errors."""
    return jsonify({
        "error": "Internal server error",
        "success": False
    }), 500


# ============================================================
# Application Entry Point
# ============================================================

if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_ENV", "production") == "development"
    port = int(os.getenv("PORT", 5000))
    
    print(f"""
    ===========================================================
    |       Shreya's Portfolio Chatbot API                    |
    ===========================================================
    |  Server:     http://localhost:{port:<4}                      |
    |  Mode:       {'Development' if debug_mode else 'Production':<11}                        |
    |  Rate Limit: {RATE_LIMIT} requests/minute                       |
    ===========================================================
    """)
    
    app.run(debug=debug_mode, host="0.0.0.0", port=port)
