from transformers import pipeline

# Model loads once when the module is imported.
# First run downloads ~250MB and caches it locally.
print("Loading phishing detection model...")

_classifier = pipeline(
    "text-classification",
    model="cybersectony/phishing-email-detection-distilbert_v2.4.1",
    truncation=True,
    max_length=512
)

print("Model ready.")


def predict(sender: str, subject: str, body: str) -> tuple[str, float]:
    """
    Returns (prediction, confidence).
    prediction: "phishing" or "legitimate"
    confidence: float 0.0 to 1.0
    """
    # Combine all fields — gives the model full context
    email_text = f"From: {sender}\nSubject: {subject}\n\n{body}"

    result = _classifier(email_text)[0]

    label = result["label"]   # e.g. "LABEL_1" or "phishing"
    score = result["score"]   # probability of that label

    # Normalize label — different model versions use different label names
    label_lower = label.lower()
    if label_lower in ("label_1", "phishing", "spam"):
        prediction = "phishing"
    else:
        prediction = "legitimate"

    return prediction, round(score, 4)