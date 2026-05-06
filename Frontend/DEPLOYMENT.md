# PhishGuard AI — Deployment Guide

## Overview

| Part     | Service | URL pattern                          |
|----------|---------|--------------------------------------|
| Frontend | Vercel  | https://phishguard-ai.vercel.app     |
| Backend  | Render  | https://phishguard-api.onrender.com  |

---

## Step 1 — Fix CORS in your FastAPI backend

Open `backend/main.py` and add this right after `app = FastAPI()`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://phishguard-ai.vercel.app",   # replace with your Vercel URL
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

This is **critical** — without it, your frontend will get blocked by CORS.

---

## Step 2 — Deploy backend to Render

1. Push your `backend/` folder to a GitHub repo (can be in a `backend/` subfolder of a monorepo)

2. Go to [render.com](https://render.com) → New → Web Service

3. Connect your GitHub repo

4. Configure:
   - **Name**: `phishguard-api`
   - **Root Directory**: `backend` (if using monorepo)
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. Click **Create Web Service**

6. Wait for first deploy (5–10 min). Note your URL: `https://phishguard-api.onrender.com`

> ⚠️ Free Render instances spin down after 15 min of inactivity. First request after sleep takes ~30s.

---

## Step 3 — Deploy frontend to Vercel

1. Push your `frontend/` folder to GitHub

2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo

3. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend` (if using monorepo)

4. Add Environment Variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://phishguard-api.onrender.com` (your Render URL)

5. Click **Deploy**

6. Note your URL: `https://phishguard-ai.vercel.app`

---

## Step 4 — Update CORS with final URL

Go back to `backend/main.py` and replace the placeholder with your actual Vercel URL.
Commit and push — Render will auto-redeploy.

---

## Step 5 — Verify end-to-end

Open your Vercel URL → Click "analyze an email" → Load sample → Click "analyze email →"

You should see the results panel animate in with prediction, confidence arc, risk meter, and threat indicators.

---

## Local development

```bash
# Terminal 1 — backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 — frontend
cd frontend
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

Open http://localhost:3000

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| CORS error in browser console | Check Step 1 — add CORSMiddleware |
| "Failed to connect to backend" | Make sure Render is awake (hit the /docs URL first) |
| Results don't appear | Check browser Network tab for /predict response |
| Render deploy fails | Check build logs — usually a missing package in requirements.txt |
| Vercel build fails | Check Node version compatibility — should auto-detect Next.js 14 |
