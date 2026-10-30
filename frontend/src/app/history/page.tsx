"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  History, Search, Filter, Globe, MessageSquare, FileCheck,
  Server, Shield, AlertTriangle, CheckCircle, ExternalLink,
  Trash2, RefreshCw, ArrowUpRight, Check
} from "lucide-react";
import { getRecentActivity } from "@/lib/api";

interface ScanRecord {
  id: string;
  target: string;
  scan_type: "url" | "message" | "file" | "ip_domain";
  risk_score: number;
  verdict: "clean" | "suspicious" | "malicious";
  timestamp: string;
  findings_summary?: string;
}

const DEFAULT_HISTORY: ScanRecord[] = [
  {
    id: "sc-001",
    target: "https://secure-login-apple-support.account-update.xyz/verify",
    scan_type: "url",
    risk_score: 94,
    verdict: "malicious",
    timestamp: "2 mins ago",
    findings_summary: "Brand impersonation, punycode spoofing, disposable registrar",
  },
  {
    id: "sc-002",
    target: "Urgent: Your Chase debit card has been frozen. Click here to unlock: http://bit.ly/chase-unfreeze",
    scan_type: "message",
    risk_score: 87,
    verdict: "malicious",
    timestamp: "14 mins ago",
    findings_summary: "Bank impersonation, urgency trigger, shortened URL redirect",
  },
  {
    id: "sc-003",
    target: "invoice_q4_2026.pdf.exe",
    scan_type: "file",
    risk_score: 91,
    verdict: "malicious",
    timestamp: "45 mins ago",
    findings_summary: "Double extension spoofing, detected by 23 AV engines",
  },
  {
    id: "sc-004",
    target: "api.stripe.com",
    scan_type: "ip_domain",
    risk_score: 3,
    verdict: "clean",
    timestamp: "2 hours ago",
    findings_summary: "Valid CAA, high domain age (14 yrs), valid EV TLS certificate",
  },
  {
    id: "sc-005",
    target: "https://github.com",
    scan_type: "url",
    risk_score: 2,
    verdict: "clean",
    timestamp: "4 hours ago",
    findings_summary: "Trusted organization, verified DNSSEC, strict HSTS configured",
  },
  {
    id: "sc-006",
    target: "185.220.101.5",
    scan_type: "ip_domain",
    risk_score: 74,
    verdict: "suspicious",
    timestamp: "5 hours ago",
    findings_summary: "Known Tor exit node, listed in multiple honeypot registries",
  },
  {
    id: "sc-007",
    target: "Meeting notes - team quarterly sync.docx",
    scan_type: "file",
    risk_score: 5,
    verdict: "clean",
    timestamp: "8 hours ago",
    findings_summary: "No macros detected, clean cryptographic hash",
  },
];

export default function ScanHistoryPage() {
  const [history, setHistory] = useState<ScanRecord[]>(DEFAULT_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<"all" | "low" | "moderate" | "high">("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optionally fetch dynamic activity from backend and merge
    const loadDynamicScans = async () => {
      try {
        const data = await getRecentActivity();
        if (data && data.recent_scans && data.recent_scans.length > 0) {
          const mapped: ScanRecord[] = data.recent_scans.map((s, idx) => ({
            id: `api-${idx}-${Date.now()}`,
            target: s.target || s.url || "Scanned Target",
            scan_type: (s.type as any) || "url",
            risk_score: s.risk_score || 0,
            verdict: s.risk_score >= 70 ? "malicious" : s.risk_score >= 35 ? "suspicious" : "clean",
            timestamp: s.timestamp || "Recent",
            findings_summary: s.findings || "Analyzed by CYBERCORE Security Engine",
          }));
          setHistory(prev => {
            const combined = [...mapped, ...prev];
            // Unique by target
            const seen = new Set();
            return combined.filter(item => {
              if (seen.has(item.target)) return false;
              seen.add(item.target);
              return true;
            });
          });
        }
      } catch {
        // Fallback to initial seed history
      }
    };

    loadDynamicScans();
  }, []);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your local scan history log?")) {
      setHistory([]);
    }
  };

  const filteredHistory = history.filter((item) => {
    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = item.target.toLowerCase().includes(q) || (item.findings_summary?.toLowerCase().includes(q) ?? false);
      if (!match) return false;
    }

    // Type filter
    if (selectedTypeFilter !== "all" && item.scan_type !== selectedTypeFilter) {
      return false;
    }

    // Risk score filter
    if (selectedRiskFilter === "low" && item.risk_score >= 35) return false;
    if (selectedRiskFilter === "moderate" && (item.risk_score < 35 || item.risk_score >= 70)) return false;
    if (selectedRiskFilter === "high" && item.risk_score < 70) return false;

    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "url": return <Globe className="w-3.5 h-3.5 text-[#3B82F6]" />;
      case "message": return <MessageSquare className="w-3.5 h-3.5 text-purple-400" />;
      case "file": return <FileCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case "ip_domain": return <Server className="w-3.5 h-3.5 text-[#38BDF8]" />;
      default: return <Shield className="w-3.5 h-3.5 text-[#94A3B8]" />;
    }
  };

  const getVerdictBadge = (score: number, verdict: string) => {
    if (score >= 70 || verdict === "malicious") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
          <AlertTriangle className="w-3 h-3" />
          <span>Malicious ({score})</span>
        </span>
      );
    }
    if (score >= 35 || verdict === "suspicious") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <AlertTriangle className="w-3 h-3" />
          <span>Suspicious ({score})</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <CheckCircle className="w-3 h-3" />
        <span>Clean ({score})</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">Scan History & Audit Log</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Complete audit trail of inspected URLs, incoming communications, cryptographic hashes, and DNS queries.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1F2937] hover:border-red-500/40 text-xs text-[#94A3B8] hover:text-red-400 transition cursor-pointer w-fit"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by target, keyword, or indicator..."
              className="w-full bg-[#090D14] border border-[#1F2937] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          {/* Type dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              aria-label="Filter scans by target type"
              className="bg-[#090D14] border border-[#1F2937] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="all">All Analysis Types</option>
              <option value="url">URL Scans</option>
              <option value="message">Email & SMS Scans</option>
              <option value="file">File Scans</option>
              <option value="ip_domain">Domain & IP Queries</option>
            </select>
          </div>
        </div>

        {/* Severity Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1F2937]/60">
          <span className="text-[11px] text-[#64748B] mr-1">Risk Filter:</span>
          {[
            { id: "all", label: "All Risk Levels" },
            { id: "low", label: "Clean / Low Risk (0–34)" },
            { id: "moderate", label: "Suspicious / Moderate (35–69)" },
            { id: "high", label: "High / Malicious (70–100)" },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedRiskFilter(chip.id as any)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                selectedRiskFilter === chip.id
                  ? "bg-[#1E293B] text-[#F8FAFC] border border-[#334155]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0D121C] border border-transparent"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      {filteredHistory.length > 0 ? (
        <div className="rounded-xl border border-[#1F2937] bg-[#111827] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D121C] text-[#64748B] border-b border-[#1F2937] text-[11px] uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Target / Query</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Verdict & Score</th>
                  <th className="py-3 px-4">Key Finding</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#161F2E]/60 transition">
                    {/* Target */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#0D121C] border border-[#1F2937] flex items-center justify-center shrink-0">
                          {getTypeIcon(item.scan_type)}
                        </div>
                        <span className="font-mono text-[#F8FAFC] truncate block font-medium">
                          {item.target}
                        </span>
                      </div>
                    </td>

                    {/* Scan Type */}
                    <td className="py-3 px-4 text-[#94A3B8] uppercase text-[10px] font-mono">
                      {item.scan_type.replace("_", " ")}
                    </td>

                    {/* Verdict */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getVerdictBadge(item.risk_score, item.verdict)}
                    </td>

                    {/* Findings */}
                    <td className="py-3 px-4 text-[#94A3B8] max-w-sm truncate">
                      {item.findings_summary || "—"}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4 text-[#64748B] whitespace-nowrap font-mono text-[11px]">
                      {item.timestamp}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {item.scan_type === "url" ? (
                        <Link
                          href={`/scanner?target=${encodeURIComponent(item.target)}`}
                          className="inline-flex items-center gap-1 text-[#3B82F6] hover:text-[#60A5FA] font-medium transition"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      ) : item.scan_type === "ip_domain" ? (
                        <Link
                          href={`/ip-domain?q=${encodeURIComponent(item.target)}`}
                          className="inline-flex items-center gap-1 text-[#38BDF8] hover:text-[#7DD3FC] font-medium transition"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      ) : item.scan_type === "message" ? (
                        <Link
                          href="/messages"
                          className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium transition"
                        >
                          <span>Open</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      ) : (
                        <Link
                          href="/file-security"
                          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition"
                        >
                          <span>Scan</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-[#0D121C] border-t border-[#1F2937] flex items-center justify-between text-xs text-[#64748B]">
            <span>Showing {filteredHistory.length} of {history.length} security events</span>
            <span className="font-mono text-[11px]">Encrypted Session Cache</span>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl bg-[#111827] border border-[#1F2937] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#161F2E] border border-[#1F2937] flex items-center justify-center text-[#64748B] mx-auto">
            <History className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-[#F8FAFC]">No Matching Scan Records</h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
            {searchQuery
              ? "No recorded events matched your current search filters."
              : "Your audit history is currently empty. Run your first security evaluation now."}
          </p>
          <div className="pt-2">
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium transition"
            >
              <span>Scan a URL</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
