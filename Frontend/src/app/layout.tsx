import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhishGuard AI — Phishing Email Detection",
  description: "AI-powered phishing email detection using DistilBERT. Analyze emails for phishing threats, risk levels, and threat indicators in real time.",
  keywords: "phishing detection, email security, AI cybersecurity, machine learning",
  openGraph: {
    title: "PhishGuard AI",
    description: "Detect phishing emails with AI — powered by DistilBERT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
