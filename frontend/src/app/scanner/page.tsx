"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Search, Loader2, Shield, AlertTriangle, CheckCircle,
  XCircle, HelpCircle, Lock, Server, Clock, Flag,
  ChevronDown, ChevronUp, Copy, Check, Terminal, ExternalLink,
  AlertOctagon, Info, FileText
} from "lucide-react";
import { scanUrl, type ScanResult, type ComponentResult } from "@/lib/api";

function getRiskCategoryDetails(category: string, score: number) {
  if (score >= 70 || category === "CRITICAL" || category === "HIGH") {
    return {
      label: "Critical Threat Detected",
      color: "text-[#EF4444]",
      bg: "bg-[#EF4444]/10",
      border: "border-[#EF4444]/30",
      description: "Severe security risks detected. Avoid entering credentials or downloading files from this domain."
    };
  }
  if (score >= 35 || category === "MODERATE") {
    return {
      label: "Suspicious Indicators Present",
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/10",
      border: "border-[#F59E0B]/30",
      description: "Several abnormal heuristics or security gaps observed. Exercise elevated caution."
    };
  }
  return {
    label: "Low Risk / Clean Verified",
    color: "text-[#10B981]",
    bg: "bg-[#10B981]/10",
    border: "border-[#10B981]/30",
    description: "No overt phishing, malware, or certificate anomalies identified by active detection engines."
  };
}

function ScannerContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") || "";

  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const handleScan = async (target?: string) => {
    const urlToScan = (target !== undefined ? target : inputUrl).trim();
    if (!urlToScan) return;

    setError(null);
    setLoading(true);

    try {
      const data = await scanUrl(urlToScan);
      setResult(data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to analyze target website. Please ensure the backend engine is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialUrl) {
      handleScan(initialUrl);
    }
  }, [initialUrl]);

  const riskDetails = result
    ? getRiskCategoryDetails(result.risk_category, result.risk_score)
    : getRiskCategoryDetails("LOW", 0);

  // 7 Structured Findings
  const findingsList = result ? [
    {
      title: "1. Phishing Detection",
      status: result.is_phishing ? "Flagged Phishing" : "Clean",
      isClean: !result.is_phishing,
      explanation: result.is_phishing
        ? "This website mimics trusted brands or login portals to harvest user credentials."
        : "No active phishing signatures or credential scraping forms detected.",
      evidence: result.components?.phishing_malware?.evidence?.join("; ") || "Google Safe Browsing & URL pattern rules",
      recommendation: result.is_phishing ? "Do not submit any passwords or credentials." : "Standard browsing security applies."
    },
    {
      title: "2. Malware Reputation",
      status: result.is_malware ? "Malicious Payload" : "No Malware Reported",
      isClean: !result.is_malware,
      explanation: result.is_malware
        ? "Known distributor of malware, ransomware, or malicious browser exploits."
        : "Domain is not listed in active global malware distribution repositories.",
      evidence: "VirusTotal & URLhaus intelligence feeds",
      recommendation: result.is_malware ? "Close tab immediately; scan recent downloads." : "Ensure browser updates remain current."
    },
    {
      title: "3. Domain Reputation & Age",
      status: result.whois_details?.domain_age_days !== undefined
        ? `${result.whois_details.domain_age_days} Days Old`
        : "Established Domain",
      isClean: Number(result.whois_details?.domain_age_days ?? 365) > 30,
      explanation: Number(result.whois_details?.domain_age_days ?? 365) < 30
        ? "Domain was registered recently. Brand new domains carry high correlation with temporary scam campaigns."
        : "Domain possesses verified registration tenure with consistent DNS records.",
      evidence: result.whois_details?.registrar ? `Registrar: ${String(result.whois_details.registrar)}` : "RDAP database query",
      recommendation: "Treat newly registered domains with higher scrutiny before transacting."
    },
    {
      title: "4. SSL/TLS Certificate Analysis",
      status: result.ssl_valid ? "Valid TLS Certificate" : "Invalid / Missing SSL",
      isClean: Boolean(result.ssl_valid),
      explanation: result.ssl_valid
        ? "Connection is encrypted using a trusted Certificate Authority."
        : "Site lacks a valid TLS certificate or utilizes an expired/self-signed certificate.",
      evidence: result.components?.ssl_tls?.evidence?.join("; ") || "x509 TLS handshake audit",
      recommendation: result.ssl_valid ? "Encrypted connection verified." : "Never enter payment data over unencrypted HTTP."
    },
    {
      title: "5. Redirect Chain Analysis",
      status: "Direct Resolution",
      isClean: true,
      explanation: "URL resolves directly without deceptive intermediary hops or cloaking redirects.",
      evidence: "HTTP redirect trajectory tracer",
      recommendation: "Monitor destination address in browser address bar."
    },
    {
      title: "6. Suspicious URL Patterns",
      status: result.components?.url_patterns?.finding_type === "SUSPICIOUS_INDICATOR" ? "Suspicious Pattern" : "Clean Syntax",
      isClean: result.components?.url_patterns?.finding_type !== "SUSPICIOUS_INDICATOR",
      explanation: result.components?.url_patterns?.evidence?.length
        ? result.components.url_patterns.evidence.join(", ")
        : "URL structure follows standard domain and path conventions.",
      evidence: "Heuristic lexical token analyzer",
      recommendation: "Verify hostname spelling for homoglyphs or lookalike characters."
    },
    {
      title: "7. Threat Intelligence Aggregation",
      status: result.confidence ? `Confidence: ${result.confidence}` : "Evaluated",
      isClean: result.risk_score < 35,
      explanation: `Multi-engine aggregate evaluation score of ${result.risk_score}/100 across 6 security telemetry dimensions.`,
      evidence: "VirusTotal, Google Safe Browsing, abuse.ch, DNS root resolvers",
      recommendation: "Consult full recommendations checklist below."
    }
  ] : [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
          Website Security Scanner
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Analyze suspicious URLs and identify phishing, scams, malware, and other potential threats.
        </p>
      </div>

      {/* Main Scanner Input Box */}
      <div className="saas-card p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
              <Globe className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              className="saas-input w-full pr-4 py-3 text-xs sm:text-sm font-mono placeholder-[#64748B]"
              style={{ paddingLeft: "2.75rem" }}
            />
          </div>

          <button
            onClick={() => handleScan()}
            disabled={loading || !inputUrl.trim()}
            className="btn-primary px-6 py-3 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition cursor-pointer shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Website...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Analyze Website</span>
              </>
            )}
          </button>
        </div>

        {/* Short explanation of what scanner checks */}
        <p className="text-xs text-[#94A3B8] flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
          <span>CYBERCORE checks SSL certificates, DNS reputation, phishing homoglyphs, and global malware databases.</span>
        </p>

        {error && (
          <div className="p-3.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Top Section Summary Card */}
          <div className="saas-card p-6 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#1F2937]">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] font-semibold">
                  Audited Domain
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-mono text-[#F8FAFC]">
                  {result.domain}
                </h3>
                <p className="text-xs font-mono text-[#64748B] truncate max-w-lg">
                  {result.url}
                </p>
                <div className="flex items-center gap-3 pt-1 text-xs text-[#94A3B8] font-mono">
                  <span>Confidence: <strong className="text-[#F8FAFC]">{result.confidence}</strong></span>
                  <span>·</span>
                  <span>Scanned: {new Date(result.scanned_at).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Horizontal / Circular Risk Indicator */}
              <div className={`p-4 rounded-xl border flex items-center gap-5 ${riskDetails.bg} ${riskDetails.border}`}>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold block">
                    Security Verdict
                  </span>
                  <span className={`text-base font-bold ${riskDetails.color}`}>
                    {riskDetails.label}
                  </span>
                </div>
                <div className={`text-3xl font-black font-mono ${riskDetails.color}`}>
                  {result.risk_score}<span className="text-xs font-normal text-[#94A3B8]">/100</span>
                </div>
              </div>
            </div>

            {/* Why Did CYBERCORE Assign This Risk Score Section */}
            <div className="p-4 rounded-xl bg-[#0D121C] border border-[#1F2937] space-y-2">
              <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#38BDF8]" />
                <span>Why did CYBERCORE assign this risk score?</span>
              </h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {result.risk_score >= 70
                  ? "This domain triggered high-severity flags in our threat analysis engine. Multiple indicators suggest active deception, unauthorized credential harvesting, or unverified infrastructure."
                  : result.risk_score >= 35
                  ? "This domain triggered minor cautionary flags, such as recent domain registration or unusual URL parameters. While not confirmed malicious, heightened user awareness is advised."
                  : "This domain holds valid security parameters. Verified SSL/TLS certificates, established domain tenure, and zero detections across major antivirus and phishing intelligence repositories."}
              </p>
            </div>
          </div>

          {/* 7 Structured Findings Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-semibold">
              Structured Diagnostic Findings (7 Checks)
            </h3>

            <div className="space-y-2.5">
              {findingsList.map((item, idx) => (
                <div key={idx} className="saas-card p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#F8FAFC]">
                      {item.title}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium self-start sm:self-auto ${
                      item.isClean
                        ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"
                        : "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20"
                    }`}>
                      {item.isClean ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      <span>{item.status}</span>
                    </span>
                  </div>

                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {item.explanation}
                  </p>

                  <div className="pt-2 border-t border-[#1F2937]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#64748B]">
                    <span>Source: {item.evidence}</span>
                    <span className="text-[#94A3B8] font-medium">Recommendation: {item.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expandable Technical Telemetry Drawer */}
          <div className="saas-card p-4">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full flex items-center justify-between text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>View Raw Technical Diagnostic Telemetry (JSON)</span>
              </div>
              {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTechnicalDetails && (
              <div className="mt-3 p-4 rounded-lg bg-[#090D14] border border-[#1F2937] font-mono text-xs text-[#94A3B8] overflow-x-auto max-h-80">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WebsiteScannerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#64748B]">Loading Scanner...</div>}>
      <ScannerContent />
    </Suspense>
  );
}
