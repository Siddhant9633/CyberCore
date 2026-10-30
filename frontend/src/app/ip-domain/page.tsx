"use client";

import { useState } from "react";
import {
  Globe, Search, Server, Shield, AlertTriangle,
  CheckCircle, Calendar, Layers, Database, RefreshCw,
  Info, ExternalLink, HardDrive, Check, Copy, ChevronDown, ChevronUp
} from "lucide-react";
import { analyzeIpDomain } from "@/lib/api";

export default function DomainIpIntelligencePage() {
  const [queryType, setQueryType] = useState<"domain" | "ip">("domain");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (lookupTarget?: string) => {
    const target = (lookupTarget !== undefined ? lookupTarget : query).trim();
    if (!target) {
      setError("Please enter a domain name or IP address.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const data = await analyzeIpDomain(target);
      setResult(data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Intelligence query failed. Please verify the target format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
          Domain & IP Intelligence
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Investigate domains, IP addresses, and suspicious network infrastructure.
        </p>
      </div>

      {/* Search Input with Selector */}
      <div className="saas-card p-5 sm:p-6 space-y-4">
        {/* Selector Tabs */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setQueryType("domain"); setQuery(""); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              queryType === "domain"
                ? "bg-[#3B82F6] text-white"
                : "bg-[#161F2E] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1F2937]"
            }`}
          >
            Domain Name
          </button>
          <button
            type="button"
            onClick={() => { setQueryType("ip"); setQuery(""); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              queryType === "ip"
                ? "bg-[#3B82F6] text-white"
                : "bg-[#161F2E] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1F2937]"
            }`}
          >
            IP Address
          </button>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
              {queryType === "domain" ? <Globe className="w-4 h-4 text-[#38BDF8]" /> : <Server className="w-4 h-4 text-[#38BDF8]" />}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              placeholder={queryType === "domain" ? "e.g. cloudflare.com or github.com" : "e.g. 8.8.8.8 or 1.1.1.1"}
              className="saas-input w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm font-mono placeholder-[#64748B]"
            />
          </div>

          <button
            onClick={() => handleLookup()}
            disabled={loading || !query.trim()}
            className="btn-primary px-5 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition cursor-pointer shrink-0"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Querying...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Investigate</span>
              </>
            )}
          </button>
        </div>

        {/* Example Presets */}
        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <span className="text-[#64748B]">Quick queries:</span>
          {(queryType === "domain" ? ["github.com", "cloudflare.com"] : ["8.8.8.8", "1.1.1.1"]).map((item) => (
            <button
              key={item}
              onClick={() => { setQuery(item); handleLookup(item); }}
              className="text-[#94A3B8] hover:text-[#38BDF8] underline font-mono text-[11px] cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Intelligence Results */}
      {result && (
        <div className="space-y-6">
          {/* Top Target Summary */}
          <div className="saas-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#94A3B8] font-semibold">
                {result.type === "ip" ? "IP Intelligence Record" : "Domain Intelligence Record"}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-mono text-[#F8FAFC]">
                {result.target}
              </h3>
              {result.registration?.registrar && (
                <p className="text-xs text-[#94A3B8]">
                  Registrar: <strong className="text-[#F8FAFC]">{result.registration.registrar}</strong>
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#0D121C] border border-[#1F2937] flex items-center gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#94A3B8] font-bold block">Risk Rating</span>
                <span className={`text-xs font-bold ${(result.reputation?.score || 0) >= 50 ? "text-[#EF4444]" : "text-[#10B981]"}`}>
                  {(result.reputation?.score || 0) >= 50 ? "Suspicious Flags" : "Standard Posture"}
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-[#F8FAFC]">
                {result.reputation?.score || 0}<span className="text-xs font-normal text-[#94A3B8]">/100</span>
              </div>
            </div>
          </div>

          {/* Clean Tables & Expandable Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DNS Records Table */}
            <div className="saas-card overflow-hidden">
              <div className="p-4 border-b border-[#1F2937] flex items-center gap-2">
                <Server className="w-4 h-4 text-[#38BDF8]" />
                <h4 className="text-xs font-bold text-[#F8FAFC]">DNS Resolution (A / AAAA Records)</h4>
              </div>
              <div className="p-4">
                {result.dns?.a_records && result.dns.a_records.length > 0 ? (
                  <table className="saas-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Resolved IP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.dns.a_records.map((ip: string, i: number) => (
                        <tr key={i}>
                          <td className="font-mono text-xs text-[#38BDF8]">A</td>
                          <td className="font-mono text-xs text-[#F8FAFC]">{ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : result.type === "ip" ? (
                  <p className="text-xs font-mono text-[#94A3B8]">
                    Reverse PTR Host: {result.reverse_dns || "No reverse PTR configured"}
                  </p>
                ) : (
                  <p className="text-xs text-[#64748B]">No active A records found.</p>
                )}
              </div>
            </div>

            {/* Registration & Domain Age */}
            <div className="saas-card p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#1F2937]">
                <Calendar className="w-4 h-4 text-[#10B981]" />
                <h4 className="text-xs font-bold text-[#F8FAFC]">Registration & Tenure (RDAP)</h4>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#1F2937]/50">
                  <span className="text-[#94A3B8]">Domain Age:</span>
                  <span className="font-mono text-[#F8FAFC]">
                    {result.registration?.domain_age_days ? `${result.registration.domain_age_days} days` : "Established"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1F2937]/50">
                  <span className="text-[#94A3B8]">Registration Date:</span>
                  <span className="font-mono text-[#F8FAFC]">{result.registration?.registration_date || "Not disclosed"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#94A3B8]">Expiration Date:</span>
                  <span className="font-mono text-[#F8FAFC]">{result.registration?.expiration_date || "Not disclosed"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nameservers & Mail Exchangers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nameservers */}
            <div className="saas-card p-5 space-y-3">
              <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#F59E0B]" />
                <span>Authoritative Nameservers</span>
              </h4>
              <div className="space-y-1.5 font-mono text-xs">
                {result.dns?.ns_records && result.dns.ns_records.length > 0 ? (
                  result.dns.ns_records.map((ns: string, i: number) => (
                    <div key={i} className="p-2 rounded bg-[#0D121C] border border-[#1F2937] text-[#94A3B8] truncate">
                      {ns}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#64748B]">No nameserver records listed.</p>
                )}
              </div>
            </div>

            {/* Mail Exchangers */}
            <div className="saas-card p-5 space-y-3">
              <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#38BDF8]" />
                <span>Mail Exchangers (MX Records)</span>
              </h4>
              <div className="space-y-1.5 font-mono text-xs">
                {result.dns?.mx_records && result.dns.mx_records.length > 0 ? (
                  result.dns.mx_records.map((mx: any, i: number) => (
                    <div key={i} className="p-2 rounded bg-[#0D121C] border border-[#1F2937] text-[#94A3B8] truncate">
                      {typeof mx === "string" ? mx : `${mx.exchange} (Priority: ${mx.preference})`}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#64748B]">No mail exchange records configured.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
