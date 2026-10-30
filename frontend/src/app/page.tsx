"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Globe, Search, Loader2, Shield, AlertTriangle, AlertOctagon,
  CheckCircle2, ArrowRight, Lock, MessageSquare, FileCheck,
  ExternalLink, X, RefreshCw, ChevronRight, ShieldCheck,
  Activity, ArrowUpRight, Server
} from "lucide-react";
import {
  getDashboardStats,
  getRecentActivity,
  scanUrl,
  type DashboardStats,
  type ScanResult
} from "@/lib/api";

function validateUrl(input: string): { isValid: boolean; normalized: string; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      isValid: false,
      normalized: "",
      error: "Please enter a website URL or domain name to scan.",
    };
  }

  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const parsed = new URL(candidate);
    const hostname = parsed.hostname;

    if (!hostname.includes(".") && hostname !== "localhost") {
      return {
        isValid: false,
        normalized: "",
        error: "Please enter a valid domain (e.g. example.com or https://example.com).",
      };
    }

    if (!/^[a-zA-Z0-9.-]+$/.test(hostname)) {
      return {
        isValid: false,
        normalized: "",
        error: "The domain name contains invalid characters.",
      };
    }

    return { isValid: true, normalized: trimmed };
  } catch {
    return {
      isValid: false,
      normalized: "",
      error: "Please enter a valid website URL or domain.",
    };
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Just now";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (isToday) return `Today, ${time}`;
    return `${d.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
  } catch {
    return dateStr;
  }
}

export default function HomePage() {
  const router = useRouter();

  // Scanner state
  const [urlInput, setUrlInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // Telemetry & Activity state (Real backend data only)
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [loadingTelemetry, setLoadingTelemetry] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchTelemetry() {
      try {
        const [statsData, recentData] = await Promise.all([
          getDashboardStats().catch(() => null),
          getRecentActivity().catch(() => ({ recent_scans: [] })),
        ]);
        if (mounted) {
          if (statsData) setStats(statsData);
          if (recentData?.recent_scans && Array.isArray(recentData.recent_scans)) {
            setRecentScans(recentData.recent_scans);
          }
        }
      } catch {
        // Fallback to real zero/empty states
      } finally {
        if (mounted) setLoadingTelemetry(false);
      }
    }
    fetchTelemetry();
    return () => {
      mounted = false;
    };
  }, []);

  const derivedStats = {
    total: stats?.total_scans_today ?? recentScans.length,
    safe: recentScans.filter((scan) => Number(scan.risk_score ?? 0) < 35).length,
    suspicious: recentScans.filter((scan) => {
      const score = Number(scan.risk_score ?? 0);
      return score >= 35 && score < 70;
    }).length,
    dangerous: recentScans.filter((scan) => Number(scan.risk_score ?? 0) >= 70).length,
  };

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setScanError(null);

    const validation = validateUrl(urlInput);
    if (!validation.isValid) {
      setValidationError(validation.error || "Invalid URL.");
      return;
    }

    setScanning(true);
    setScanResult(null);

    try {
      const result = await scanUrl(validation.normalized);
      setScanResult(result);
    } catch (err: unknown) {
      const e = err as Error;
      setScanError(
        e.message || "Failed to analyze target website. Please check the backend connection."
      );
    } finally {
      setScanning(false);
    }
  };

  const handlePresetClick = (preset: string) => {
    setUrlInput(preset);
    setValidationError(null);
    setScanError(null);
    setScanResult(null);
  };

  const getVerdictBadge = (score: number, category?: string) => {
    if (score >= 70 || category === "CRITICAL" || category === "HIGH") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>High Risk ({score}/100)</span>
        </span>
      );
    }
    if (score >= 35 || category === "MODERATE") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Caution ({score}/100)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Clean ({score}/100)</span>
      </span>
    );
  };

  const getStatusBadge = (score: number, level?: string) => {
    const isCritical = score >= 70 || level === "CRITICAL";
    const isSuspicious = score >= 35 && score < 70;
    
    if (isCritical) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
          Threat
        </span>
      );
    }
    if (isSuspicious) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          Suspicious
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
        Clean
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-12 pb-20">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP WELCOME HEADER
          Spacious, minimalist, professional
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 pt-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-[#F8FAFC]">
            Good morning. Stay ahead of risk.
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1.5 font-normal">
            A calm, clear view of the websites and files that matter to you.
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. PRIMARY SECTION: PROMINENT WEBSITE SCANNER
          Main visual focus, clean SaaS input, validation & results
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-[#263244] bg-[#111821] p-7 sm:p-10 space-y-8 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
        <div>
          <div className="flex items-start gap-3">
            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 items-center justify-center text-[#60A5FA]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3B82F6] mb-1">Website risk analysis</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#F8FAFC] tracking-tight">
                The internet is unpredictable. Browse with confidence.
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                Run a focused risk analysis before you trust a website. Results stay private to your workspace.
              </p>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleScanSubmit} className="space-y-3">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (validationError) setValidationError(null);
                  if (scanError) setScanError(null);
                }}
                placeholder="Enter website URL or domain (e.g. secure-login.example.com)"
                className="w-full bg-[#0B0F14] border border-[#1E2633] hover:border-[#2A3649] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-lg pl-10 pr-10 py-3 text-sm font-mono text-[#F8FAFC] placeholder-[#64748B] focus:outline-none transition"
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={() => {
                    setUrlInput("");
                    setScanResult(null);
                    setValidationError(null);
                    setScanError(null);
                  }}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#F8FAFC] transition cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={scanning || !urlInput.trim()}
              className="px-6 py-3 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-40 disabled:hover:bg-[#3B82F6] text-white text-sm font-medium flex items-center justify-center gap-2 transition cursor-pointer shrink-0 shadow-sm"
            >
              {scanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning Website...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Scan Website</span>
                </>
              )}
            </button>
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Backend Error Banner */}
          {scanError && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>{scanError}</span>
            </div>
          )}

          {/* Quick Presets for Convenient Testing */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#94A3B8]">
            <span className="text-[#64748B]">Quick tests:</span>
            {[
              { label: "github.com", desc: "Clean" },
              { label: "paypal-security-update.xyz", desc: "Suspicious" },
              { label: "cloudflare.com", desc: "Verified" },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.label)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10151D] hover:bg-[#1B2430] border border-[#1E2633] hover:border-[#2A3649] text-[11px] font-mono text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer"
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </form>

        {/* Live Inline Scan Result Card */}
        {scanResult && (
          <div className="mt-4 p-5 rounded-lg bg-[#10151D] border border-[#1E2633] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E2633]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#151C26] border border-[#1E2633] flex items-center justify-center text-[#3B82F6]">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#64748B] block">Scanned Target</span>
                  <span className="text-sm font-mono font-medium text-[#F8FAFC]">
                    {scanResult.domain || scanResult.url}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getVerdictBadge(scanResult.risk_score, scanResult.risk_category)}
                <Link
                  href={`/scanner?url=${encodeURIComponent(scanResult.url)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151C26] hover:bg-[#1E2633] border border-[#1E2633] text-xs font-medium text-[#F8FAFC] transition cursor-pointer"
                >
                  <span>Full Forensic Report</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#3B82F6]" />
                </Link>
              </div>
            </div>

            {/* Quick Metrics from Real Scan */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[#151C26] border border-[#1E2633]">
                <span className="text-[11px] text-[#64748B] block">SSL Status</span>
                <span className="font-medium text-[#F8FAFC] mt-0.5 block">
                  {scanResult.ssl_valid === true
                    ? "Valid Certificate"
                    : scanResult.ssl_valid === false
                    ? "Untrusted / Invalid"
                    : "Not Applicable"}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#151C26] border border-[#1E2633]">
                <span className="text-[11px] text-[#64748B] block">Phishing Risk</span>
                <span className="font-medium text-[#F8FAFC] mt-0.5 block">
                  {scanResult.is_phishing ? "Flagged Threat" : "No Phishing Detected"}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#151C26] border border-[#1E2633]">
                <span className="text-[11px] text-[#64748B] block">Malware Engine</span>
                <span className="font-medium text-[#F8FAFC] mt-0.5 block">
                  {scanResult.is_malware ? "Malicious Hit" : "Zero Signatures"}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#151C26] border border-[#1E2633]">
                <span className="text-[11px] text-[#64748B] block">Audit Time</span>
                <span className="font-medium text-[#F8FAFC] mt-0.5 block font-mono">
                  {scanResult.scan_duration_ms ? `${scanResult.scan_duration_ms}ms` : "< 1s"}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FOUR COMPACT STATISTICS
          Real backend data only, zero invented metrics, graceful empty states
          ───────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-[#263244] bg-[#263244]">
        {[
          { label: "Total Scans", value: derivedStats.total, tone: "text-[#F8FAFC]", icon: Activity },
          { label: "Safe Websites", value: derivedStats.safe, tone: "text-[#22C55E]", icon: CheckCircle2 },
          { label: "Suspicious Websites", value: derivedStats.suspicious, tone: "text-[#F59E0B]", icon: AlertTriangle },
          { label: "Dangerous Websites", value: derivedStats.dangerous, tone: "text-[#EF4444]", icon: AlertOctagon },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-[#151E29] p-5 sm:p-6 flex items-start justify-between min-h-[116px]">
              <div>
                <span className="text-xs font-medium text-[#94A3B8]">{stat.label}</span>
                <div className={`mt-2 text-2xl font-semibold tracking-tight ${stat.tone}`}>
                  {loadingTelemetry ? <span className="inline-block w-10 h-7 bg-[#263244] animate-pulse rounded" /> : stat.value.toLocaleString()}
                </div>
                
              </div>
              <Icon className={`w-4 h-4 ${stat.tone}`} aria-hidden="true" />
            </div>
          );
        })}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. QUICK ACCESS
          Four compact tool cards, not oversized, subtle interactions
          ───────────────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-[#F8FAFC]">Security tools</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Email and SMS Scanner */}
          <Link
            href="/messages"
            className="group bg-[#151C26] hover:bg-[#18202C] border border-[#1E2633] hover:border-[#2A3649] rounded-xl p-4 transition-all duration-150 flex flex-col justify-between space-y-3 cursor-pointer"
          >
            <div className="space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#10151D] border border-[#1E2633] flex items-center justify-center text-[#3B82F6] group-hover:border-[#3B82F6]/30 transition">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#F8FAFC] group-hover:text-white transition">
                  Email &amp; SMS Scanner
                </h4>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  Detect social engineering, scams, and urgent lures.
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-medium text-[#3B82F6] gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Inspect message</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2: Password Security */}
          <Link
            href="/password"
            className="group bg-[#151C26] hover:bg-[#18202C] border border-[#1E2633] hover:border-[#2A3649] rounded-xl p-4 transition-all duration-150 flex flex-col justify-between space-y-3 cursor-pointer"
          >
            <div className="space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#10151D] border border-[#1E2633] flex items-center justify-center text-[#3B82F6] group-hover:border-[#3B82F6]/30 transition">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#F8FAFC] group-hover:text-white transition">
                  Password Security
                </h4>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  Check if credentials have appeared in data breaches.
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-medium text-[#3B82F6] gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Check breach</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3: Domain Intelligence */}
          <Link
            href="/ip-domain"
            className="group bg-[#151C26] hover:bg-[#18202C] border border-[#1E2633] hover:border-[#2A3649] rounded-xl p-4 transition-all duration-150 flex flex-col justify-between space-y-3 cursor-pointer"
          >
            <div className="space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#10151D] border border-[#1E2633] flex items-center justify-center text-[#3B82F6] group-hover:border-[#3B82F6]/30 transition">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#F8FAFC] group-hover:text-white transition">
                  Domain Intelligence
                </h4>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  Review domain ownership, reputation, and network signals.
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-medium text-[#3B82F6] gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Inspect message</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 4: File Scanner */}
          <Link
            href="/file-security"
            className="group bg-[#151C26] hover:bg-[#18202C] border border-[#1E2633] hover:border-[#2A3649] rounded-xl p-4 transition-all duration-150 flex flex-col justify-between space-y-3 cursor-pointer"
          >
            <div className="space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#10151D] border border-[#1E2633] flex items-center justify-center text-[#3B82F6] group-hover:border-[#3B82F6]/30 transition">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#F8FAFC] group-hover:text-white transition">
                  File Scanner
                </h4>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  Inspect files and hashes for malicious signatures.
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-medium text-[#3B82F6] gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Audit file</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. RECENT ACTIVITY
          Clean, professional SaaS table with appropriate empty state
          ───────────────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Recent Activity</h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Latest security scans and incident inspections
            </p>
          </div>

          <Link
            href="/history"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151C26] hover:bg-[#1B2430] border border-[#1E2633] hover:border-[#2A3649] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-[#151C26] border border-[#1E2633] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#10151D] border-b border-[#1E2633] text-[11px] font-medium text-[#64748B] uppercase tracking-wider">
                  <th className="py-3 px-4">Website</th>
                  <th className="py-3 px-4">Scan Type</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2633]/60">
                {recentScans.length > 0 ? (
                  recentScans.slice(0, 5).map((scan, idx) => (
                    <tr
                      key={scan.id || idx}
                      className="hover:bg-[#18202C]/60 transition-colors duration-100"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-[#F8FAFC] max-w-[240px] truncate">
                        {scan.target}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-[#10151D] border border-[#1E2633] text-[#94A3B8]">
                          {scan.type || "URL"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span
                          className={`font-semibold ${
                            scan.risk_score >= 70
                              ? "text-[#EF4444]"
                              : scan.risk_score >= 35
                              ? "text-[#F59E0B]"
                              : "text-[#22C55E]"
                          }`}
                        >
                          {scan.risk_score}
                        </span>
                        <span className="text-[#64748B] text-[10px]"> / 100</span>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(scan.risk_score, scan.risk_level)}
                      </td>
                      <td className="py-3 px-4 text-[#94A3B8] whitespace-nowrap">
                        {formatDate(scan.timestamp)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={
                            scan.type === "URL" || !scan.type
                              ? `/scanner?url=${encodeURIComponent(scan.target)}`
                              : scan.type === "MESSAGE"
                              ? `/messages`
                              : scan.type === "FILE"
                              ? `/file-security`
                              : `/scanner`
                          }
                          className="inline-flex items-center gap-1 text-xs text-[#3B82F6] hover:text-[#60A5FA] font-medium transition cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 text-[#64748B]">
                        <Shield className="w-8 h-8 opacity-40 text-[#94A3B8]" />
                        <span className="text-xs text-[#94A3B8] font-medium">
                          No recent activity recorded
                        </span>
                        <p className="text-[11px] text-[#64748B] max-w-sm">
                          Run your first website or target scan above to generate threat telemetry.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
