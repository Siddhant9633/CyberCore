/**
 * CYBERCORE Frontend API Client
 * All backend communication goes through this module.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// ─────────────────────────────────────────────
// Website Scanner
// ─────────────────────────────────────────────

export interface ComponentResult {
  score: number | null;
  confidence: "HIGH" | "MEDIUM" | "LOW" | "UNAVAILABLE";
  finding_type:
    | "CONFIRMED_THREAT"
    | "SUSPICIOUS_INDICATOR"
    | "HEURISTIC_ASSESSMENT"
    | "NO_KNOWN_DETECTION"
    | "UNABLE_TO_VERIFY";
  details: Record<string, unknown>;
  evidence: string[];
}

export interface ScanResult {
  scan_id: string;
  url: string;
  domain: string;
  risk_score: number;
  risk_category: "LOW" | "MODERATE_LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  confidence: "HIGH" | "MEDIUM" | "LOW" | "UNAVAILABLE";
  coverage_percent: number;
  is_phishing: boolean | null;
  is_malware: boolean | null;
  ssl_valid: boolean | null;
  components: Record<string, ComponentResult>;
  unavailable_checks: string[];
  dns_details: Record<string, unknown>;
  whois_details: Record<string, unknown>;
  source: string;
  scanned_at: string;
  scan_duration_ms: number;
  recommended_actions: string[];
  from_cache: boolean;
}

export async function scanUrl(url: string, source = "web"): Promise<ScanResult> {
  return apiRequest<ScanResult>("/scan/", {
    method: "POST",
    body: JSON.stringify({ url, source }),
  });
}

export async function getScan(scanId: string): Promise<ScanResult> {
  return apiRequest<ScanResult>(`/scan/${scanId}`);
}

// ─────────────────────────────────────────────
// Password (HIBP k-anonymity)
// ─────────────────────────────────────────────

export async function checkPasswordBreach(
  hashPrefix: string
): Promise<{ data: string; hash_prefix: string }> {
  return apiRequest(`/password/breached/${hashPrefix}`);
}

// ─────────────────────────────────────────────
// Message Scanner
// ─────────────────────────────────────────────

export interface MessageAnalysis {
  risk_score: number;
  scam_type: string | null;
  indicators: Array<{
    type?: string;
    description: string;
    severity?: number;
    matched_snippet?: string;
    pattern_type?: string;
  }>;
  urls_found: string[];
  manipulation_tactics: string[];
  impersonation_targets: string[];
  recommended_actions: string[];
  message_hash: string;
}

export async function analyzeMessage(text: string): Promise<MessageAnalysis> {
  return apiRequest<MessageAnalysis>("/messages/analyze", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

// ─────────────────────────────────────────────
// IP & Domain
// ─────────────────────────────────────────────

export interface IpDomainAnalysis {
  query: string;
  query_type: "ip" | "domain";
  risk_score: number;
  risk_category: string;
  components: Record<string, ComponentResult>;
  dns_records: Record<string, unknown>;
  rdap_info: Record<string, unknown>;
}

export async function analyzeIpDomain(query: string): Promise<IpDomainAnalysis> {
  return apiRequest<IpDomainAnalysis>("/ip-domain/analyze", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

export interface FileAnalysisResponse {
  filename: string;
  file_size: number;
  md5: string;
  sha1: string;
  sha256: string;
  detected_mime: string;
  declared_extension: string;
  is_spoofed_extension: boolean;
  risk_score: number;
  threat_level: string;
  findings: string[];
  vt_reputation?: {
    malicious: number;
    suspicious: number;
    undetected: number;
    harmless: number;
    total_engines: number;
    reputation: number;
  };
}

export async function checkFileHash(hashValue: string, filename?: string): Promise<FileAnalysisResponse> {
  return apiRequest<FileAnalysisResponse>("/files/check-hash", {
    method: "POST",
    body: JSON.stringify({ hash_value: hashValue, filename }),
  });
}

export async function uploadAndAnalyzeFile(file: File): Promise<FileAnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${API_BASE}/files/analyze`;
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Upload failed: ${response.statusText}`);
  }

  return response.json();
}

// ─────────────────────────────────────────────
// Dashboard & Feed
// ─────────────────────────────────────────────

export interface DashboardStats {
  safety_index: number;
  total_scans_today: number;
  threats_intercepted: number;
  phishing_campaigns_detected: number;
  malware_signatures_verified: number;
  extension_active_users: number;
  system_status: string;
  protection_status: string;
  threat_level: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>("/dashboard/stats");
}

export async function getRecentActivity(): Promise<{ recent_scans: any[] }> {
  return apiRequest<{ recent_scans: any[] }>("/dashboard/recent");
}

export async function getLiveThreatFeed(): Promise<{ active_campaigns: any[] }> {
  return apiRequest<{ active_campaigns: any[] }>("/dashboard/threat-feed");
}

// ─────────────────────────────────────────────
// Report Threat
// ─────────────────────────────────────────────

export async function reportThreat(
  url: string,
  threatType: string,
  description?: string
): Promise<{ status: string; message: string }> {
  return apiRequest("/dashboard/report", {
    method: "POST",
    body: JSON.stringify({ url, threat_type: threatType, description }),
  });
}

// ─────────────────────────────────────────────
// AI Chat
// ─────────────────────────────────────────────

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiChatResponse {
  response: string;
  suggested_followups: string[];
}

export async function sendAiMessage(
  message: string,
  history: AiChatMessage[] = []
): Promise<AiChatResponse> {
  return apiRequest<AiChatResponse>("/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message, history }),
  });
}

export async function getAiSuggestions(): Promise<{ suggestions: string[] }> {
  return apiRequest<{ suggestions: string[] }>("/ai/suggestions");
}
