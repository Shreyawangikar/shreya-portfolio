# 🎨 Shreya's Digital Portfolio

A professional AI-powered portfolio website featuring an intelligent chat assistant that answers questions about Shreya's skills, projects, and achievements.

## ✨ Features

- **AI Chat Assistant**: Ask questions about Shreya's resume and projects
- **Conversation Memory**: Chat maintains context across 5 recent messages
- **Beautiful UI**: Glass morphism design with Framer Motion animations
- **localStorage Persistence**: Chat history preserved across sessions
- **Rate Limiting**: 20 requests/minute per IP for free tier safety
- **Responsive Design**: Mobile-friendly portfolio
- **Production Ready**: Deployed and accessible online

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Framer Motion for animations

### Backend
- Python 3.8+ Flask framework
- OpenRouter API with free Mistral 7B
- CORS enabled
- Rate Limiting per IP
- Error Handling & logging

---

## 🚀 Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for local development setup.

```bash
# Terminal 1: Frontend
npm install && npm run dev

# Terminal 2: Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt && python app.py
```

Add to `backend/.env`:
```
OPENROUTER_API_KEY=sk-your-key-here
```

---

## 📖 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Local setup
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [backend/README.md](./backend/README.md) - Backend API docs

---

## 📋 Assignment Status

✅ **All requirements met:**
- Frontend: React + TypeScript
- Backend: Python Flask
- Chat Engine: OpenRouter (Mistral 7B)
- Beautiful UI/UX
- Conversation memory & rate limiting
- GitHub & deployment ready

---

## 🔗 Live Links

- Portfolio: https://shreya-portfolio-xxx.vercel.app
- Backend: https://shreya-portfolio-chat.onrender.com

---

**❤️ Built for internship assignment - February 2026**
