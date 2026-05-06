import re
from dataclasses import dataclass, field
from typing import List


URGENCY_KEYWORDS = [
    "urgent", "immediately", "act now", "limited time", "expires",
    "24 hours", "right now", "don't delay", "respond now", "asap"
]
CREDENTIAL_KEYWORDS = [
    "verify", "confirm your password", "update your account",
    "validate", "login", "sign in", "enter your credentials",
    "click here to verify", "authenticate"
]
FINANCIAL_KEYWORDS = [
    "wire transfer", "bank account", "gift card", "send money",
    "prize", "winner", "claim your reward", "tax refund",
    "inheritance", "lottery"
]
AUTHORITY_KEYWORDS = [
    "it department", "security team", "paypal", "microsoft",
    "apple", "amazon", "irs", "your bank", "helpdesk"
]
THREAT_KEYWORDS = [
    "suspended", "terminated", "legal action",
    "account will be closed", "access denied", "unauthorized access"
]
URL_SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly"]
SUSPICIOUS_TLDS = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".click"]


@dataclass
class HeuristicResult:
    score: int = 0
    reasons: List[str] = field(default_factory=list)
    urls: List[str] = field(default_factory=list)
    risk_level: str = "LOW"


def extract_urls(text: str) -> List[str]:
    pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
    return re.findall(pattern, text)


def _analyze_urls(urls: List[str], result: HeuristicResult):
    for url in urls:
        if re.search(r'https?://\d{1,3}(\.\d{1,3}){3}', url):
            result.score += 40
            result.reasons.append("IP-based URL detected — no legitimate domain")

        elif any(s in url for s in URL_SHORTENERS):
            result.score += 30
            result.reasons.append("URL shortener used — real destination is hidden")

        elif any(tld in url.lower() for tld in SUSPICIOUS_TLDS):
            result.score += 25
            result.reasons.append("Suspicious domain extension detected")

        elif re.search(r'(paypal|amazon|google|microsoft|apple|bank).+\.', url.lower()):
            if url.count('.') > 2:
                result.score += 35
                result.reasons.append("Possible brand impersonation in URL")


def _score_keywords(text: str, result: HeuristicResult):
    t = text.lower()

    urgency = [kw for kw in URGENCY_KEYWORDS if kw in t]
    if urgency:
        result.score += min(len(urgency), 3) * 25
        result.reasons.append(f"Urgency manipulation: {', '.join(urgency[:3])}")

    creds = [kw for kw in CREDENTIAL_KEYWORDS if kw in t]
    if creds:
        result.score += min(len(creds), 2) * 30
        result.reasons.append(f"Credential harvesting attempt: {', '.join(creds[:2])}")

    financial = [kw for kw in FINANCIAL_KEYWORDS if kw in t]
    if financial:
        result.score += len(financial) * 20
        result.reasons.append(f"Financial scam language: {', '.join(financial[:2])}")

    authority = [kw for kw in AUTHORITY_KEYWORDS if kw in t]
    if authority:
        result.score += len(authority) * 15
        result.reasons.append(f"Authority impersonation: {', '.join(authority[:2])}")

    threats = [kw for kw in THREAT_KEYWORDS if kw in t]
    if threats:
        result.score += len(threats) * 20
        result.reasons.append(f"Threat language: {', '.join(threats[:2])}")


def run_heuristics(sender: str, subject: str, body: str) -> HeuristicResult:
    result = HeuristicResult()
    full_text = f"{sender} {subject} {body}"

    result.urls = extract_urls(body)
    _analyze_urls(result.urls, result)
    _score_keywords(full_text, result)

    result.score = min(result.score, 100)
    result.risk_level = (
        "HIGH" if result.score >= 61 else
        "MEDIUM" if result.score >= 31 else
        "LOW"
    )
    return result


def get_recommendation(prediction: str, risk_level: str) -> str:
    if prediction == "phishing":
        if risk_level == "HIGH":
            return "Do not interact. Delete immediately and report to your security team."
        return "Exercise caution. Verify the sender through official channels before clicking anything."
    return "Email appears legitimate. Always stay alert to unexpected requests."