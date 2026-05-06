"use client";

import { useState } from "react";
import Link from "next/link";
import { analyzeEmail } from "@/lib/api";
import { AnalysisRequest, AnalysisResponse, AnalysisState } from "@/types";

// ─── Sub-components ────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div
      style={{
        width: "16px",
        height: "16px",
        border: "2px solid rgba(5,5,8,0.3)",
        borderTopColor: "#050508",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        display: "inline-block",
      }}
    />
  );
}

function RiskMeter({ level }: { level: "LOW" | "MEDIUM" | "HIGH" }) {
  const config = {
    LOW: { color: "#10b981", pct: 25, label: "LOW RISK" },
    MEDIUM: { color: "#f59e0b", pct: 60, label: "MEDIUM RISK" },
    HIGH: { color: "#ff4444", pct: 95, label: "HIGH RISK" },
  }[level];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
          risk meter
        </span>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: config.color,
            letterSpacing: "0.1em",
          }}
        >
          {config.label}
        </span>
      </div>
      <div
        style={{
          height: "6px",
          background: "var(--bg-surface)",
          borderRadius: "100px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${config.pct}%`,
            background: config.color,
            borderRadius: "100px",
            transition: "width 1s ease",
          }}
        />
      </div>
    </div>
  );
}

function ConfidenceArc({ value }: { value: number }) {
  const r = 52;
  const cx = 70;
  const cy = 70;
  const circ = 2 * Math.PI * r;
  const arc = circ * 0.75;
  const filled = arc * (value / 100);
  const offset = circ * 0.125;

  const color =
    value >= 80 ? "#ff4444" : value >= 50 ? "#f59e0b" : "#10b981";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="140" height="100" viewBox="0 0 140 100">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--bg-surface)"
          strokeWidth="8"
          strokeDasharray={`${arc} ${circ - arc}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transform: "rotate(-135deg)", transformOrigin: `${cx}px ${cy}px` }}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transform: "rotate(-135deg)",
            transformOrigin: `${cx}px ${cy}px`,
            transition: "stroke-dasharray 1s ease",
          }}
        />
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fill={color}
          fontSize="22"
          fontWeight="700"
          fontFamily="'Syne', sans-serif"
        >
          {value.toFixed(1)}%
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="10"
          fontFamily="'Space Mono', monospace"
        >
          confidence
        </text>
      </svg>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────

const SAMPLE_EMAIL = {
  sender: "security-alert@paypa1-support.com",
  subject: "URGENT: Your account has been suspended - Action required",
  body: `Dear Valued Customer,

We have detected suspicious activity on your PayPal account. Your account has been temporarily suspended for security reasons.

To restore your account access immediately, you must verify your information within 24 hours or your account will be permanently closed.

Click here to verify: http://192.168.1.45/paypal-verify/login

You will need to confirm:
- Full name and date of birth  
- Credit card number and CVV
- Social Security Number
- Current password

Failure to comply within 24 hours will result in permanent account termination and possible legal action.

PayPal Security Team
© 2024 PayPal Inc.`,
};

export default function AnalyzePage() {
  const [form, setForm] = useState<AnalysisRequest>({
    sender: "",
    subject: "",
    body: "",
  });
  const [state, setState] = useState<AnalysisState>("idle");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string>("");

  const handleAnalyze = async () => {
    if (!form.sender && !form.subject && !form.body) {
      setError("Please enter at least some email content to analyze.");
      return;
    }
    setState("loading");
    setError("");
    setResult(null);
    try {
      const data = await analyzeEmail(form);
      setResult(data);
      setState("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect to backend. Make sure the FastAPI server is running.";
      setError(msg);
      setState("error");
    }
  };

  const handleReset = () => {
    setState("idle");
    setResult(null);
    setError("");
    setForm({ sender: "", subject: "", body: "" });
  };

  const loadSample = () => {
    setForm(SAMPLE_EMAIL);
    setState("idle");
    setResult(null);
    setError("");
  };

  const isPhishing = result?.prediction === "phishing";
  const predColor = isPhishing ? "#ff4444" : "#10b981";
  const predBg = isPhishing ? "var(--danger-dim)" : "var(--safe-dim)";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-void)",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Top bar */}
      <header
        style={{
          borderBottom: "1px solid var(--border-dim)",
          padding: "0 2rem",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(5,5,8,0.8)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "5px",
                  background: "var(--accent-cyan-dim)",
                  border: "1px solid var(--accent-cyan)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L12 4V10L7 13L2 10V4L7 1Z" stroke="#00d4ff" strokeWidth="1.2" fill="none"/>
                  <path d="M7 4L9.5 5.5V8.5L7 10L4.5 8.5V5.5L7 4Z" fill="#00d4ff" fillOpacity="0.5"/>
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                }}
              >
                PhishGuard<span style={{ color: "var(--accent-cyan)" }}>AI</span>
              </span>
            </div>
          </Link>
          <span style={{ color: "var(--border-bright)" }}>/</span>
          <span
            style={{
              color: "var(--text-primary)",
              fontSize: "13px",
              fontFamily: "var(--font-mono)",
            }}
          >
            analyzer
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--safe)",
              animation: "pulse-ring 2s ease-in-out infinite",
            }}
          />
          <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>
            model online
          </span>
        </div>
      </header>

      {/* Main layout */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem",
          display: "grid",
          gridTemplateColumns: state === "success" ? "1fr 1fr" : "1fr",
          gap: "24px",
          alignItems: "start",
          transition: "grid-template-columns 0.3s ease",
        }}
      >
        {/* ─── INPUT PANEL ─── */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-dim)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          {/* Panel header */}
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid var(--border-dim)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Email Input
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "2px" }}>
                paste the suspicious email below
              </p>
            </div>
            <button
              onClick={loadSample}
              style={{
                background: "transparent",
                color: "var(--accent-cyan)",
                border: "1px solid rgba(0,212,255,0.3)",
                borderRadius: "6px",
                padding: "5px 12px",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.05em",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = "var(--accent-cyan-dim)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "transparent";
              }}
            >
              load sample
            </button>
          </div>

          {/* Form fields */}
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Sender */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Sender Address
              </label>
              <input
                type="text"
                value={form.sender}
                onChange={(e) => setForm((f) => ({ ...f, sender: e.target.value }))}
                placeholder="e.g. noreply@suspicious-domain.com"
                style={{
                  width: "100%",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-dim)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontFamily: "var(--font-mono)",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-cyan)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-dim)";
                }}
              />
            </div>

            {/* Subject */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Subject Line
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="e.g. URGENT: Your account needs verification"
                style={{
                  width: "100%",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-dim)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontFamily: "var(--font-mono)",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-cyan)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-dim)";
                }}
              />
            </div>

            {/* Body */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Email Body
              </label>
              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                placeholder="Paste the full email body here..."
                rows={12}
                style={{
                  width: "100%",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-dim)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontFamily: "var(--font-mono)",
                  outline: "none",
                  resize: "vertical",
                  transition: "border-color 0.2s",
                  lineHeight: 1.7,
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-cyan)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-dim)";
                }}
              />
            </div>

            {/* Error */}
            {state === "error" && (
              <div
                style={{
                  background: "var(--danger-dim)",
                  border: "1px solid rgba(255,68,68,0.3)",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  color: "#ff4444",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <span style={{ flexShrink: 0, marginTop: "1px" }}>⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleAnalyze}
                disabled={state === "loading"}
                style={{
                  flex: 1,
                  background:
                    state === "loading"
                      ? "rgba(0,212,255,0.7)"
                      : "var(--accent-cyan)",
                  color: "#050508",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "14px",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  cursor: state === "loading" ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  letterSpacing: "0.02em",
                }}
              >
                {state === "loading" ? (
                  <>
                    <LoadingSpinner />
                    analyzing...
                  </>
                ) : (
                  "analyze email →"
                )}
              </button>
              {(state === "success" || state === "error") && (
                <button
                  onClick={handleReset}
                  style={{
                    background: "transparent",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-mid)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "13px",
                    fontFamily: "var(--font-mono)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.borderColor = "var(--border-bright)";
                    (e.target as HTMLElement).style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.borderColor = "var(--border-mid)";
                    (e.target as HTMLElement).style.color = "var(--text-secondary)";
                  }}
                >
                  clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── RESULTS PANEL ─── */}
        {state === "success" && result && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              animation: "fadeInUp 0.5s ease",
            }}
          >
            {/* Verdict card */}
            <div
              style={{
                background: "var(--bg-card)",
                border: `1px solid ${predColor}30`,
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Glow accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: predColor,
                  opacity: 0.8,
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                {/* Verdict label */}
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    verdict
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: predColor,
                        animation: isPhishing ? "threat-pulse 2s ease-in-out infinite" : "pulse-ring 2s ease-in-out infinite",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "28px",
                        fontWeight: 800,
                        color: predColor,
                        letterSpacing: "-0.02em",
                        textTransform: "uppercase",
                      }}
                    >
                      {result.prediction}
                    </span>
                  </div>
                </div>

                {/* Confidence arc */}
                <ConfidenceArc value={result.confidence} />
              </div>

              {/* Risk meter */}
              <div style={{ marginTop: "1.5rem" }}>
                <RiskMeter level={result.risk_level} />
              </div>
            </div>

            {/* Threat indicators */}
            {result.reasons.length > 0 && (
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-dim)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "1rem 1.5rem",
                    borderBottom: "1px solid var(--border-dim)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#ff4444",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    Threat Indicators
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "var(--danger-dim)",
                      color: "#ff4444",
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "100px",
                      border: "1px solid rgba(255,68,68,0.3)",
                    }}
                  >
                    {result.reasons.length} detected
                  </span>
                </div>
                <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {result.reasons.map((reason, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        padding: "8px 12px",
                        background: "var(--bg-surface)",
                        borderRadius: "6px",
                        border: "1px solid var(--border-dim)",
                      }}
                    >
                      <span style={{ color: "#ff4444", flexShrink: 0, fontSize: "12px", marginTop: "1px" }}>
                        ⚠
                      </span>
                      <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                        {reason}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted URLs */}
            {result.urls.length > 0 && (
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-dim)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "1rem 1.5rem",
                    borderBottom: "1px solid var(--border-dim)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#f59e0b",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    Extracted URLs
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "var(--warn-dim)",
                      color: "#f59e0b",
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "100px",
                      border: "1px solid rgba(245,158,11,0.3)",
                    }}
                  >
                    {result.urls.length} found
                  </span>
                </div>
                <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {result.urls.map((url, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "8px 12px",
                        background: "var(--bg-surface)",
                        borderRadius: "6px",
                        border: "1px solid var(--border-dim)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        color: "#f59e0b",
                        wordBreak: "break-all",
                      }}
                    >
                      {url}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div
              style={{
                background: "var(--bg-card)",
                border: `1px solid ${isPhishing ? "rgba(255,68,68,0.2)" : "rgba(16,185,129,0.2)"}`,
                borderRadius: "var(--radius-lg)",
                padding: "1.25rem 1.5rem",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: isPhishing ? "var(--danger-dim)" : "var(--safe-dim)",
                  border: `1px solid ${isPhishing ? "rgba(255,68,68,0.3)" : "rgba(16,185,129,0.3)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "14px",
                }}
              >
                {isPhishing ? "🛡" : "✓"}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  recommendation
                </div>
                <p
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    lineHeight: 1.7,
                  }}
                >
                  {result.recommendation}
                </p>
              </div>
            </div>

            {/* Heuristic score */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-dim)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "2px",
                  }}
                >
                  Heuristic Score
                </div>
                <div
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  rule-based threat indicators
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "32px",
                  fontWeight: 800,
                  color:
                    result.heuristic_score >= 70
                      ? "#ff4444"
                      : result.heuristic_score >= 40
                      ? "#f59e0b"
                      : "#10b981",
                  letterSpacing: "-0.02em",
                }}
              >
                {result.heuristic_score}
                <span
                  style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 400 }}
                >
                  /100
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {state === "loading" && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: "var(--bg-card)",
            border: "1px solid var(--accent-cyan)",
            borderRadius: "10px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "fadeIn 0.2s ease",
            zIndex: 200,
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              border: "2px solid var(--border-mid)",
              borderTopColor: "var(--accent-cyan)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            running dual analysis...
          </span>
        </div>
      )}
    </div>
  );
}
