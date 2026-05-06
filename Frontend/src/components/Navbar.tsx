"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 2rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled
          ? "rgba(5, 5, 8, 0.92)"
          : "transparent",
        borderBottom: scrolled
          ? "1px solid var(--border-dim)"
          : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "var(--accent-cyan-dim)",
              border: "1px solid var(--accent-cyan)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L12 4V10L7 13L2 10V4L7 1Z" stroke="#00d4ff" strokeWidth="1.2" fill="none"/>
              <path d="M7 4L9.5 5.5V8.5L7 10L4.5 8.5V5.5L7 4Z" fill="#00d4ff" fillOpacity="0.5"/>
            </svg>
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "16px",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            PhishGuard<span style={{ color: "var(--accent-cyan)" }}>AI</span>
          </span>
        </div>
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Link href="#features" style={{ textDecoration: "none" }}>
          <span
            style={{
              color: "var(--text-secondary)",
              fontSize: "13px",
              padding: "6px 12px",
              borderRadius: "6px",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "var(--text-primary)";
              (e.target as HTMLElement).style.background = "var(--border-dim)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "var(--text-secondary)";
              (e.target as HTMLElement).style.background = "transparent";
            }}
          >
            features
          </span>
        </Link>
        <Link href="#how-it-works" style={{ textDecoration: "none" }}>
          <span
            style={{
              color: "var(--text-secondary)",
              fontSize: "13px",
              padding: "6px 12px",
              borderRadius: "6px",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "var(--text-primary)";
              (e.target as HTMLElement).style.background = "var(--border-dim)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "var(--text-secondary)";
              (e.target as HTMLElement).style.background = "transparent";
            }}
          >
            how it works
          </span>
        </Link>
        <Link href="/analyze">
          <button
            style={{
              background: "var(--accent-cyan)",
              color: "#050508",
              border: "none",
              borderRadius: "6px",
              padding: "7px 16px",
              fontSize: "13px",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = "#33ddff";
              (e.target as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "var(--accent-cyan)";
              (e.target as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            analyze →
          </button>
        </Link>
      </div>
    </nav>
  );
}
