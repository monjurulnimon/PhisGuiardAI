"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.04 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 2rem 4rem",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--accent-cyan-dim)",
          border: "1px solid rgba(0,212,255,0.3)",
          borderRadius: "100px",
          padding: "5px 14px",
          marginBottom: "2rem",
          animation: "fadeInUp 0.5s ease 0.1s both",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "var(--accent-cyan)",
            display: "inline-block",
            animation: "pulse-ring 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            color: "var(--accent-cyan)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          AI-Powered Threat Detection
        </span>
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: 800,
          lineHeight: 1.05,
          textAlign: "center",
          letterSpacing: "-0.03em",
          maxWidth: "900px",
          animation: "fadeInUp 0.6s ease 0.2s both",
          color: "var(--text-primary)",
        }}
      >
        Detect Phishing Emails
        <br />
        <span
          style={{
            background: "linear-gradient(135deg, #00d4ff, #4f8ef7, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Before They Strike
        </span>
      </h1>

      {/* Subheadline */}
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "clamp(14px, 2vw, 17px)",
          textAlign: "center",
          maxWidth: "560px",
          marginTop: "1.5rem",
          lineHeight: 1.8,
          animation: "fadeInUp 0.6s ease 0.3s both",
        }}
      >
        Powered by DistilBERT + heuristic analysis. Paste any suspicious email
        and get instant threat intelligence — confidence scores, risk levels,
        and actionable security guidance.
      </p>

      {/* CTA Buttons */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "2.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
          animation: "fadeInUp 0.6s ease 0.4s both",
        }}
      >
        <Link href="/analyze">
          <button
            style={{
              background: "var(--accent-cyan)",
              color: "#050508",
              border: "none",
              borderRadius: "8px",
              padding: "12px 28px",
              fontSize: "14px",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = "#33ddff";
              (e.target as HTMLElement).style.transform = "translateY(-2px)";
              (e.target as HTMLElement).style.boxShadow =
                "0 8px 24px rgba(0,212,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "var(--accent-cyan)";
              (e.target as HTMLElement).style.transform = "translateY(0)";
              (e.target as HTMLElement).style.boxShadow = "none";
            }}
          >
            analyze an email →
          </button>
        </Link>
        <a href="#how-it-works" style={{ textDecoration: "none" }}>
          <button
            style={{
              background: "transparent",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-mid)",
              borderRadius: "8px",
              padding: "12px 28px",
              fontSize: "14px",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "var(--text-primary)";
              (e.target as HTMLElement).style.borderColor =
                "var(--border-bright)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "var(--text-secondary)";
              (e.target as HTMLElement).style.borderColor = "var(--border-mid)";
            }}
          >
            how it works
          </button>
        </a>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: "3rem",
          marginTop: "5rem",
          animation: "fadeInUp 0.6s ease 0.5s both",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { value: "97.3%", label: "detection accuracy" },
          { value: "<200ms", label: "response time" },
          { value: "2 models", label: "AI + heuristic" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--accent-cyan)",
                letterSpacing: "-0.02em",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                color: "var(--text-muted)",
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginTop: "4px",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          color: "var(--text-muted)",
          fontSize: "11px",
          letterSpacing: "0.1em",
          animation: "fadeIn 1s ease 1s both",
        }}
      >
        <span>scroll</span>
        <div
          style={{
            width: "1px",
            height: "32px",
            background:
              "linear-gradient(to bottom, var(--text-muted), transparent)",
          }}
        />
      </div>
    </section>
  );
}
