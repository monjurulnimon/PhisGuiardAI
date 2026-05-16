# PhishGuard AI 🛡️

> AI-powered phishing email detection system using DistilBERT + heuristic analysis

![PhishGuard AI](https://img.shields.io/badge/Status-Live-brightgreen) ![Python](https://img.shields.io/badge/Python-3.11-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![HuggingFace](https://img.shields.io/badge/🤗-DistilBERT-yellow)

## 🔗 Live Demo

**Frontend:** [https://phisguiardai.vercel.app](https://phisguiardai.vercel.app)  
**Backend API:** [https://unsung11-phishguardai.hf.space](https://unsung11-phishguardai.hf.space)  
**API Docs:** [https://unsung11-phishguardai.hf.space/docs](https://unsung11-phishguardai.hf.space/docs)

---

## 📌 What It Does

PhishGuard AI analyzes suspicious emails and returns:

- ✅ **Prediction** — Phishing or Legitimate
- ✅ **Confidence Score** — AI model probability (0–100%)
- ✅ **Risk Level** — LOW / MEDIUM / HIGH
- ✅ **Threat Indicators** — Explainable reasons why
- ✅ **Extracted URLs** — All links found in the email body
- ✅ **Security Recommendation** — Actionable guidance

---

## 🧠 How It Works

Two independent analysis engines cross-validate every email:

```
Email Input (sender + subject + body)
        │
        ├──► DistilBERT NLP Model ──► AI confidence score
        │
        └──► Heuristic Engine ──────► Rule-based threat score
                                              │
                                    Confidence Fusion
                                              │
                                    Final Risk Classification
                                              │
                              Prediction + Report Output
```

### AI Model
- Model: `cybersectony/phishing-email-detection-distilbert_v2.4.1`
- Transformer-based deep learning model trained on phishing email corpora
- Understands linguistic manipulation, urgency patterns, and deceptive framing

### Heuristic Engine
- Scans for urgency keywords (URGENT, IMMEDIATE, 24 hours)
- Detects IP-based URLs (e.g. `http://192.168.x.x/login`)
- Flags credential harvesting patterns (password, SSN, CVV requests)
- Identifies brand impersonation and suspicious TLDs

---

## 🏗️ Architecture

```
PhishGuardAI/
├── Backend/                    # FastAPI + Python
│   ├── main.py                 # API routes, CORS, request/response schemas
│   ├── ai_model.py             # DistilBERT model loading + inference
│   ├── phishing_detector.py    # Heuristic scoring engine
│   └── requirements.txt
│
└── Frontend/                   # Next.js 14 + TypeScript
    └── src/
        ├── app/
        │   ├── page.tsx        # Landing page
        │   └── analyze/
        │       └── page.tsx    # Analyzer dashboard
        ├── components/
        │   ├── Navbar.tsx
        │   ├── Footer.tsx
        │   └── sections/
        │       ├── HeroSection.tsx
        │       ├── FeaturesSection.tsx
        │       └── HowItWorksSection.tsx
        ├── lib/
        │   └── api.ts          # Backend API client
        └── types/
            └── index.ts        # TypeScript types
```

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| AI Model | HuggingFace Transformers — DistilBERT |
| Backend | FastAPI, Python 3.11, Pydantic |
| Frontend | Next.js 14, TypeScript, TailwindCSS |
| Backend Hosting | Hugging Face Spaces (Docker) |
| Frontend Hosting | Vercel |

---

## 📡 API Reference

### `POST /predict`

**Request:**
```json
{
  "sender": "security@paypa1-alerts.tk",
  "subject": "URGENT: Your account has been suspended",
  "body": "Dear customer, verify your credentials at http://192.168.1.45/login"
}
```

**Response:**
```json
{
  "prediction": "phishing",
  "confidence": 97.3,
  "risk_level": "HIGH",
  "reasons": ["Urgency manipulation", "IP-based URL detected"],
  "urls": ["http://192.168.1.45/login"],
  "recommendation": "Do not interact. Report to security team immediately.",
  "heuristic_score": 100
}
```

### `GET /health`
Returns model status and version.

---

## 🛠️ Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+

### Backend
```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API running at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Frontend
```bash
cd Frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
# App running at http://localhost:3000
```

---

## 📊 Sample Results

| Email Type | Prediction | Confidence | Risk |
|---|---|---|---|
| PayPal phishing with IP URL | Phishing | 97.3% | HIGH |
| Password reset scam | Phishing | 89.1% | HIGH |
| Legitimate order confirmation | Legitimate | 94.2% | LOW |
| Suspicious lottery win | Phishing | 76.5% | MEDIUM |

---

## 👤 Author

**Nimon** — Cybersecurity & ML Researcher  
Built as a  project demonstrating full-stack AI application development.

---

## ⚠️ Disclaimer

This tool is built for **educational and research purposes**. It is not a replacement for enterprise email security solutions.
