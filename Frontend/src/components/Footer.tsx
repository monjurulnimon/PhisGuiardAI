export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-dim)",
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            background: "var(--accent-cyan-dim)",
            border: "1px solid var(--accent-cyan)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
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

      <div
        style={{
          color: "var(--text-muted)",
          fontSize: "12px",
          fontFamily: "var(--font-mono)",
        }}
      >
        built for research & portfolio purposes · 2025
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--text-muted)",
          fontSize: "12px",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "var(--safe)",
            display: "inline-block",
            animation: "pulse-ring 2s ease-in-out infinite",
          }}
        />
        system online
      </div>
    </footer>
  );
}
