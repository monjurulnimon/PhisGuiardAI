from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

from ai_model import predict as ai_predict
from phishing_detector import run_heuristics, get_recommendation


# ── Lifespan: model loads once at startup ─────────────────────────
# FastAPI runs this before accepting any requests.
# The model import in ai_model.py triggers the load automatically.
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("PhishGuard AI backend starting...")
    yield
    print("PhishGuard AI backend shutting down.")


# ── App setup ─────────────────────────────────────────────────────
app = FastAPI(
    title="PhishGuard AI",
    description="AI-powered phishing email detection API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS — allows your Next.js frontend (localhost:3000) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",          # local dev
        "https://unsung11-phishguardai.hf.space",,    # replace with your Vercel URL after deploy
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response schemas ────────────────────────────────────
class EmailRequest(BaseModel):
    sender: str
    subject: str
    body: str

    class Config:
        # Example shown in FastAPI docs UI at /docs
        json_schema_extra = {
            "example": {
                "sender": "security@paypa1-alerts.tk",
                "subject": "URGENT: Your account has been suspended",
                "body": "Dear customer, verify your credentials immediately at http://192.168.1.45/login"
            }
        }


class PredictionResponse(BaseModel):
    prediction: str        # "phishing" or "legitimate"
    confidence: float      # 0.0 to 100.0 (percentage)
    risk_level: str        # "LOW", "MEDIUM", "HIGH"
    reasons: list[str]     # explainability — from heuristics
    urls: list[str]        # extracted URLs from body
    recommendation: str    # action to take
    heuristic_score: int   # raw heuristic score (0–100), useful for UI


# ── Health check ──────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "PhishGuard AI is running"}

@app.get("/health")
def health():
    return {"status": "ok", "model": "distilbert-phishing-v2.4.1"}


# ── Main prediction endpoint ──────────────────────────────────────
@app.post("/predict", response_model=PredictionResponse)
def predict(email: EmailRequest):

    # Basic input validation
    if not email.body.strip():
        raise HTTPException(status_code=400, detail="Email body cannot be empty")

    # Step 1 — AI model inference
    ai_prediction, ai_score = ai_predict(
        email.sender,
        email.subject,
        email.body
    )

    # Step 2 — Heuristic detection
    heuristics = run_heuristics(
        email.sender,
        email.subject,
        email.body
    )

    # Step 3 — Confidence as percentage
    confidence = round(ai_score * 100, 1)

    # Step 4 — Determine final risk level
    # Logic: AI confidence drives risk level for clear cases.
    # If AI is uncertain (<70%), heuristic score breaks the tie.
    if confidence >= 80:
        risk_level = "HIGH"
    elif confidence >= 50:
        risk_level = "MEDIUM"
    else:
        # AI uncertain — let heuristics decide
        risk_level = heuristics.risk_level

    # Step 5 — If AI says legitimate but heuristics scream HIGH, escalate.
    # This catches cases where the AI is fooled but keywords are obvious.
    if ai_prediction == "legitimate" and heuristics.risk_level == "HIGH":
        ai_prediction = "phishing"
        risk_level = "HIGH"
        if not heuristics.reasons:
            heuristics.reasons.append("Strong heuristic indicators despite AI classification")

    # Step 6 — Build response
    return PredictionResponse(
        prediction=ai_prediction,
        confidence=confidence,
        risk_level=risk_level,
        reasons=heuristics.reasons,
        urls=heuristics.urls,
        recommendation=get_recommendation(ai_prediction, risk_level),
        heuristic_score=heuristics.score
    )