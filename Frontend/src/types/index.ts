export interface AnalysisRequest {
  sender: string;
  subject: string;
  body: string;
}

export interface AnalysisResponse {
  prediction: "phishing" | "legitimate";
  confidence: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  reasons: string[];
  urls: string[];
  recommendation: string;
  heuristic_score: number;
}

export type AnalysisState = "idle" | "loading" | "success" | "error";
