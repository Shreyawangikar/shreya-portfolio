# 🚀 Deployment Guide: Python Backend + React Frontend

This guide will help you deploy the Python Flask backend and React frontend to production.

---

## 📋 Prerequisites

- GitHub account (for version control)
- OpenRouter API key (free account at https://openrouter.ai)
- Render account (for free Python hosting) or Railway
- (Optional) Vercel account for frontend hosting

---

## 🔑 Step 1: Get OpenRouter API Key

1. Visit https://openrouter.ai
2. Sign up with GitHub (takes 2 minutes)
3. Go to **Settings** → **API Keys**
4. Click **Create Key** and copy it
5. Save it somewhere safe

---

## 🐍 Step 2: Deploy Python Backend (Render.com - Recommended)

### 2.1 Prepare Repository

Make sure your GitHub repo has:
```
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── src/
├── vite.config.ts
└── Procfile
```

### 2.2 Create Render Account

1. Go to https://render.com
2. Click **Sign up with GitHub**
3. Authorize and connect your GitHub account

### 2.3 Deploy Backend

1. Click **New +** → **Web Service**
2. Select your repository
3. Fill in:
   - **Name**: `shreya-portfolio-chat` (or any name)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:app`
   - **Instance Type**: `Free` (Starter plan)

4. Click **Create Web Service** and wait (2-3 minutes)

5. Your backend URL will appear: `https://shreya-portfolio-chat.onrender.com`

### 2.4 Add Environment Variables

1. In Render dashboard, go to your service
2. Click **Environment**
3. Add these variables:

```
OPENROUTER_API_KEY = sk-your-actual-key-here
FRONTEND_URL = https://your-vercel-domain.vercel.app
FLASK_ENV = production
```

4. Click **Save Changes** - service redeploys automatically

### 2.5 Test Backend

Visit: `https://shreya-portfolio-chat.onrender.com/health`

Should return:
```json
{
  "status": "ok",
  "service": "shreya-portfolio-chat"
}
```

✅ **Backend deployed!**

---

## ⚛️ Step 3: Deploy Frontend (Vercel - Recommended)

### 3.1 Create Vercel Account

1. Go to https://vercel.com
2. Click **Sign up with GitHub**
3. Connect your GitHub account

### 3.2 Deploy Frontend

1. Click **Add New...** → **Project**
2. Select your portfolio repository
3. Fill in:
   - **Framework**: `Vite`
   - **Root Directory**: `./` (leave default)
4. Under **Environment Variables**, click **Add**:

```
VITE_PYTHON_API_URL = https://shreya-portfolio-chat.onrender.com/api/chat
```

5. Click **Deploy** and wait (1-2 minutes)

6. Your portfolio URL: `https://shreya-portfolio-xxx.vercel.app`

### 3.3 Verify Deployment

Open your portfolio URL and test the chatbot!

---

## 🔗 Step 4: Connect Backend & Frontend

Update backend environment variables in Render:

1. Go to Render → Your service → **Environment**
2. Update `FRONTEND_URL`:

```
FRONTEND_URL = https://shreya-portfolio-xxx.vercel.app
```

3. Click **Save** (service redeploys)

---

## ✅ Testing Checklist

- [ ] Backend health check returns 200: `https://your-backend.onrender.com/health`
- [ ] Frontend loads without CORS errors
- [ ] Can open chat widget and send messages
- [ ] Chat receives responses from OpenRouter
- [ ] Messages persist in localStorage
- [ ] Rate limiting works (wait 60 seconds after 20 requests)

---

## 📱 Optional: Cloudflare Tunnel (For localhost exposure)

If you want to expose your localhost:

1. Install Cloudflare: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/
2. Run: `cloudflare tunnel create shreya-portfolio`
3. Configure routing to `http://localhost:5173` (frontend)
4. Your tunnel URL: `https://shreya-portfolio.xxx.cfargotunnel.com`

---

## 🐛 Troubleshooting

### Frontend shows "AI request failed"

**Cause**: Backend not running or wrong URL

**Fix**: 
- Check `VITE_PYTHON_API_URL` in Vercel environment variables
- Verify backend is running: `https://your-backend.onrender.com/health`
- Check browser console for CORS errors

### Rate limited (429 error)

**Cause**: More than 20 requests/minute from your IP

**Fix**: Wait 60 seconds before sending more messages

### "OpenRouter API key not configured"

**Cause**: Missing API key in environment

**Fix**:
- Verify `OPENROUTER_API_KEY` in Render dashboard
- Make sure it's not blank or typo'd
- Restart service after adding

### Backend goes to sleep (Render free tier)

**Cause**: Free tier services spin down after 15 minutes of inactivity

**Fix**: Upgrade to Starter plan ($7/month minimum) or use Railway

---

## 🎯 Alternative Hosting (Railway)

If Render doesn't work:

1. Go to https://railway.app
2. Click **New Project** → **Deploy from GitHub**
3. Select your repository
4. Add environment variables (same as Render)
5. Railway handles everything automatically

Your backend URL: `https://yourapp.railway.app`

---

## 📝 Update GitHub README

Add this to your main README:

```markdown
## 🚀 Live Demo

- **Frontend**: https://shreya-portfolio-xxx.vercel.app
- **Backend**: https://shreya-portfolio-chat.onrender.com
- **API**: https://shreya-portfolio-chat.onrender.com/api/chat

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Python Flask
- **AI**: OpenRouter (Mistral 7B Free)
- **Hosting**: Vercel (frontend) + Render (backend)
- **CORS**: Enabled
```

---

## ✨ You're Done!

Your portfolio is now:
- ✅ Live on production
- ✅ Using Python backend (satisfies assignment)
- ✅ Using OpenRouter free model (satisfies assignment)
- ✅ Rate limited for free tier safety
- ✅ Professional UI/UX with conversation memory

---

## 📞 Quick Links

- OpenRouter API: https://openrouter.ai
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- My Repo: https://github.com/yourname/shreya-s-digital-studio
- Assignment Form: https://forms.gle/7AkdJbKDtj4chqqWA

---

**Submitted with ❤️ for the internship assignment**
