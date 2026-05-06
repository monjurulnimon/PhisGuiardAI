"use client";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" stroke="#00d4ff" strokeWidth="1.2" fill="none"/>
        <path d="M10 6L13 8V12L10 14L7 12V8L10 6Z" fill="#00d4ff" fillOpacity="0.4"/>
      </svg>
    ),
    title: "DistilBERT NLP Model",
    desc: "Transformer-based deep learning model trained specifically on phishing email corpora. Understands linguistic patterns, tone manipulation, and deceptive framing.",
    tag: "AI/ML",
    tagColor: "#4f8ef7",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="6" height="6" rx="1" stroke="#f59e0b" strokeWidth="1.2" fill="none"/>
        <rect x="11" y="3" width="6" height="6" rx="1" stroke="#f59e0b" strokeWidth="1.2" fill="none"/>
        <rect x="3" y="11" width="6" height="6" rx="1" stroke="#f59e0b" strokeWidth="1.2" fill="none"/>
        <rect x="11" y="11" width="6" height="6" rx="1" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1.2"/>
      </svg>
    ),
    title: "Heuristic Scoring",
    desc: "Rule-based scoring system analyzes urgency keywords, suspicious domains, IP-based URLs, credential harvesting patterns, and brand impersonation markers.",
    tag: "heuristics",
    tagColor: "#f59e0b",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="#10b981" strokeWidth="1.2" fill="none"/>
        <path d="M10 6V10L13 12" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Instant Analysis",
    desc: "Real-time inference pipeline returns prediction, confidence score, risk level, extracted URLs, and human-readable threat reasons in under 200ms.",
    tag: "real-time",
    tagColor: "#10b981",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3L14 7H11V13H9V7H6L10 3Z" fill="#8b5cf6" fillOpacity="0.5" stroke="#8b5cf6" strokeWidth="1"/>
        <rect x="3" y="14" width="14" height="3" rx="1" stroke="#8b5cf6" strokeWidth="1.2" fill="none"/>
      </svg>
    ),
    title: "URL Extraction",
    desc: "Automatically parses and extracts all URLs from email body, flagging IP-based links, shortened URLs, homograph attacks, and suspicious TLDs.",
    tag: "URL analysis",
    tagColor: "#8b5cf6",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 10H16M4 6H12M4 14H9" stroke="#ff4444" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="15" cy="14" r="3" stroke="#ff4444" strokeWidth="1.2" fill="none"/>
        <path d="M15 13V14.5L16 15" stroke="#ff4444" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    title: "Risk Classification",
    desc: "Three-tier risk system (LOW / MEDIUM / HIGH) computed from blended AI confidence and heuristic score for nuanced, actionable threat classification.",
    tag: "risk scoring",
    tagColor: "#ff4444",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 5H17V15H3V5Z" stroke="#00d4ff" strokeWidth="1.2" fill="none" rx="2"/>
        <path d="M7 9H13M7 12H10" stroke="#00d4ff" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    title: "Security Recommendations",
    desc: "Context-aware guidance tailored to the detected threat level — from 'treat with caution' to 'report to security team immediately', with specific action steps.",
    tag: "recommendations",
    tagColor: "#00d4ff",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        padding: "6rem 2rem",
        maxWidth: "1100px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <div
          style={{
            display: "inline-block",
            color: "var(--accent-cyan)",
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          capabilities
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}
        >
          Multi-layer threat detection
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            maxWidth: "480px",
            margin: "1rem auto 0",
            lineHeight: 1.8,
          }}
        >
          Two independent analysis engines cross-validate every email, so you
          get robust detection even when attackers try to evade one method.
        </p>
      </div>

      {/* Feature grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1px",
          background: "var(--border-dim)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          border: "1px solid var(--border-dim)",
        }}
      >
        {features.map((f, i) => (
          <div
            key={i}
            style={{
              background: "var(--bg-card)",
              padding: "2rem",
              transition: "background 0.2s",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--bg-card-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--bg-card)";
            }}
          >
            {/* Icon + tag row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-dim)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {f.icon}
              </div>
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: f.tagColor,
                  background: `${f.tagColor}18`,
                  border: `1px solid ${f.tagColor}30`,
                  borderRadius: "100px",
                  padding: "3px 10px",
                }}
              >
                {f.tag}
              </span>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "0.5rem",
              }}
            >
              {f.title}
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "13px",
                lineHeight: 1.7,
              }}
            >
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
