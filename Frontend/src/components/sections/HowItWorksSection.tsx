"use client";

import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Paste Email",
    desc: "Input sender address, subject line, and email body into the analyzer form.",
    color: "#00d4ff",
  },
  {
    num: "02",
    title: "Dual Analysis",
    desc: "DistilBERT tokenizes and classifies the text while heuristic rules scan for threat patterns simultaneously.",
    color: "#4f8ef7",
  },
  {
    num: "03",
    title: "Confidence Fusion",
    desc: "AI confidence score is blended with heuristic indicators to compute the final risk classification.",
    color: "#8b5cf6",
  },
  {
    num: "04",
    title: "Threat Report",
    desc: "Get a full report: prediction, confidence percentage, risk level, extracted URLs, and security recommendations.",
    color: "#10b981",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
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
          pipeline
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
          How it works
        </h2>
      </div>

      {/* Steps */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
          position: "relative",
        }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-dim)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem",
              position: "relative",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = `${step.color}40`;
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--border-dim)";
              el.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: step.color,
                letterSpacing: "0.1em",
                marginBottom: "1.25rem",
                opacity: 0.8,
              }}
            >
              {step.num}
            </div>
            <div
              style={{
                width: "32px",
                height: "2px",
                background: step.color,
                marginBottom: "1rem",
                opacity: 0.6,
                borderRadius: "1px",
              }}
            />
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "17px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "0.75rem",
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "13px",
                lineHeight: 1.7,
              }}
            >
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Tech stack pills */}
      <div
        style={{
          marginTop: "4rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {[
          "FastAPI",
          "HuggingFace Transformers",
          "DistilBERT",
          "Python",
          "Next.js 14",
          "TypeScript",
        ].map((tech) => (
          <span
            key={tech}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-dim)",
              color: "var(--text-secondary)",
              fontSize: "12px",
              padding: "5px 14px",
              borderRadius: "100px",
              fontFamily: "var(--font-mono)",
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <Link href="/analyze">
          <button
            style={{
              background: "transparent",
              color: "var(--accent-cyan)",
              border: "1px solid var(--accent-cyan)",
              borderRadius: "8px",
              padding: "14px 36px",
              fontSize: "14px",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={(e) => {
              const el = e.target as HTMLElement;
              el.style.background = "var(--accent-cyan)";
              el.style.color = "#050508";
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = "0 8px 24px rgba(0,212,255,0.25)";
            }}
            onMouseLeave={(e) => {
              const el = e.target as HTMLElement;
              el.style.background = "transparent";
              el.style.color = "var(--accent-cyan)";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
            }}
          >
            try the analyzer →
          </button>
        </Link>
      </div>
    </section>
  );
}
