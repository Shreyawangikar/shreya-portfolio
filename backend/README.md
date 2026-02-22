# Shreya's Portfolio - Python Backend

A Flask-based Python backend for the AI-powered portfolio chat assistant using OpenRouter API with free Mistral 7B model.

## Tech Stack

- **Framework**: Flask 3.0
- **AI Engine**: OpenRouter (Mistral 7B - Free)
- **Language**: Python 3.8+
- **CORS**: Enabled for frontend integration
- **Rate Limiting**: 20 requests/minute per IP

## Features

✅ OpenRouter integration with free Mistral model  
✅ Conversation history management (last 5 messages)  
✅ Rate limiting protection  
✅ CORS enabled for React frontend  
✅ Health check endpoint  
✅ Error handling & logging  
✅ Environment-based configuration  

## Local Development

### 1. Setup

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Create `.env` file

```bash
cp .env.example .env
```

Edit `.env` and add your OpenRouter API key:

```
OPENROUTER_API_KEY=sk-your-key-here
FRONTEND_URL=http://localhost:5173
FLASK_ENV=development
PORT=5000
```

**Get OpenRouter API Key:**
1. Visit https://openrouter.ai
2. Sign up (free)
3. Navigate to API keys → Create new key
4. Copy the key to `.env`

### 3. Run locally

```bash
python app.py
```

Server will start on `http://localhost:5000`

## API Endpoints

### POST `/api/chat`
Send messages and get AI responses.

**Request:**
```json
{
  "messages": [
    {"role": "user", "content": "What projects has Shreya built?"},
    {"role": "assistant", "content": "She has built..."},
    {"role": "user", "content": "Tell me about skills"}
  ]
}
```

**Response:**
```json
{
  "reply": "Shreya has skills in..."
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "shreya-portfolio-chat"
}
```

### GET `/api/stats`
Get current rate limiting stats.

**Response:**
```json
{
  "total_ips": 5,
  "rate_limit": 20,
  "window_seconds": 60
}
```

## Deployment (Render.com - Recommended)

### 1. Connect GitHub repo to Render

1. Push this code to GitHub
2. Go to https://render.com
3. Sign up with GitHub
4. Click "New +" → "Web Service"
5. Connect your repository

### 2. Configure in Render

- **Name**: `shreya-portfolio-chat`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `cd backend && gunicorn app:app`
- **Port**: `5000`

### 3. Add Environment Variables

In Render dashboard, add:
- `OPENROUTER_API_KEY`: Your API key
- `FRONTEND_URL`: Your deployed frontend URL (e.g., `https://shreya-portfolio.vercel.app`)

### 4. Deploy

Click "Create Web Service" and it will deploy automatically.

Your API will be available at: `https://shreya-portfolio-chat.onrender.com`

---

## Deployment (Railway.app)

1. Sign up at https://railway.app
2. Click "Create New Project" → "GitHub Repo"
3. Select your repository
4. Add environment variables (same as above)
5. Railway auto-detects Python and deploys

Your URL will be: `https://yourapp.railway.app`

---

## Update Frontend

In `src/components/ChatWidget.tsx`, update the API URL:

```typescript
// Local development
const CHAT_URL = "http://localhost:5000/api/chat";

// Production (Render)
const CHAT_URL = "https://shreya-portfolio-chat.onrender.com/api/chat";
```

Or use environment variables:

```typescript
const CHAT_URL = import.meta.env.VITE_PYTHON_API_URL || "http://localhost:5000/api/chat";
```

## Rate Limiting

- **Limit**: 20 requests per minute per IP
- **Window**: 60 seconds
- **Response**: 429 status when exceeded

## Error Handling

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 400 | Bad request (no messages) |
| 429 | Rate limited |
| 500 | Server error |
| 503 | OpenRouter unavailable |
| 504 | Request timeout |

## Troubleshooting

### "OpenRouter API key not configured"
- Ensure `.env` file exists
- Verify `OPENROUTER_API_KEY` is set
- Restart Flask app

### "Rate limited" (429)
- Wait 60 seconds before sending more messages
- Limit per IP per minute

### "No response from OpenRouter"
- Check OpenRouter account has credits (free tier gets free requests)
- Verify internet connection
- Check API key validity

## Free Tier Limits

- **OpenRouter Free**: 5 requests/minute (can be increased)
- **Our Rate Limit**: 20 requests/minute per IP
- **Model**: Mistral 7B (free tier)

## Project Structure

```
backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .env.example       # Environment variables template
├── Procfile           # Deployment configuration
└── README.md          # This file
```

## Support

For issues, check:
1. OpenRouter API status: https://status.openrouter.ai
2. Flask logs in terminal
3. Network tab in browser DevTools

---

**Built with ❤️ for the internship assignment**
