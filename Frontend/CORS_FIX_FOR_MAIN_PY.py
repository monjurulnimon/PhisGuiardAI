"""
CORS FIX FOR main.py
====================
Add this to your existing main.py to allow the Vercel frontend to call the Render backend.
Insert it right after your imports and before your router setup.

Replace YOUR_VERCEL_URL with your actual Vercel deployment URL.
"""

from fastapi.middleware.cors import CORSMiddleware

# Add this block right after `app = FastAPI()`
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",               # local dev
        "https://phishguard-ai.vercel.app",    # replace with YOUR Vercel URL
        "https://*.vercel.app",                # all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
