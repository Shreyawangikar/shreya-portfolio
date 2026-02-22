# ⚡ Quick Start: Local Development

Get the full stack running on your machine in 5 minutes.

## Prerequisites

- Node.js 18+ (for React/Vite)
- Python 3.8+ (for Flask backend)
- Git

## 🚀 Start Frontend & Backend

### Terminal 1: Frontend (React + Vite)

```bash
# Navigate to project root
cd shreya-s-digital-studio-main/shreyaPortfolio

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

### Terminal 2: Backend (Python Flask)

```bash
# Navigate to backend
cd shreya-s-digital-studio-main/shreyaPortfolio/backend

# Create virtual environment
python -m venv venv

# Activate venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your OpenRouter API key
# OPENROUTER_API_KEY=sk-your-key-here
```

Then start Flask:

```bash
python app.py
```

Backend runs on: `http://localhost:5000`

---

## 🔑 Get OpenRouter API Key (Free)

1. Go to https://openrouter.ai
2. Click **Sign up** (use GitHub)
3. Navigate to **API Keys**
4. Click **Create New Key**
5. Copy key to `backend/.env`

```
OPENROUTER_API_KEY=sk-your-actual-key
```

---

## ✅ Test Everything

1. Open browser → `http://localhost:5173`
2. Click chat button (bottom right)
3. Send message like: "What projects has Shreya built?"
4. Should get response from Mistral 7B ✨

---

## 📁 Project Structure

```
shreya-s-digital-studio-main/
├── shreyaPortfolio/
│   ├── src/                    # React components
│   ├── backend/               # Python Flask backend
│   │   ├── app.py            # Main Flask app
│   │   ├── requirements.txt   # Python dependencies
│   │   ├── .env.example       # Template for env vars
│   │   └── README.md          # Backend docs
│   ├── vite.config.ts         # Vite configuration
│   ├── package.json           # Frontend dependencies
│   ├── .env.example           # Frontend env template
│   ├── Procfile              # Deployment config
│   ├── DEPLOYMENT.md         # Production deployment guide
│   └── QUICKSTART.md         # This file
```

---

## 🧪 Debugging

### Frontend Issues

Check browser console (F12):
- CORS errors? Backend not running
- Wrong API URL? Check `VITE_PYTHON_API_URL`
- Rate limit? Wait 60 seconds

### Backend Issues

Check terminal output:
- "OPENROUTER_API_KEY not configured"? Add to `.env`
- Connection refused? Backend not running
- "No response"? Check OpenRouter account status

### Test Backend Directly

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hi"}]}'
```

---

## 📦 Environment Variables

### Frontend (.env)

```
VITE_PYTHON_API_URL=http://localhost:5000/api/chat
```

### Backend (.env)

```
OPENROUTER_API_KEY=sk-your-key-here
FRONTEND_URL=http://localhost:5173
FLASK_ENV=development
PORT=5000
```

---

## 🎯 Next Steps

1. **Local testing complete?** → Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Want to deploy?** → Use Render + Vercel (see deployment guide)
3. **Submit assignment?** → Fill form at https://forms.gle/7AkdJbKDtj4chqqWA

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot GET /api/chat" | Backend not running on :5000 |
| CORS error | Check `FRONTEND_URL` in backend/.env |
| Rate limited | Wait 60 seconds, max 20 req/min |
| No AI response | Check OpenRouter API key in .env |
| Chat not persistent | Check localStorage enabled in browser |

---

## 💡 Tips

- **Hot reload enabled**: Changes to code refresh automatically
- **Rate limit resets**: Every 60 seconds per IP
- **Free tier**: OpenRouter offers free requests on signup
- **Messages save**: localStorage keeps chat history

---

**Happy coding! 🚀**
