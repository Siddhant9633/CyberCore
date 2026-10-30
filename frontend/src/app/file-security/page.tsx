"use client";

import { useState, useRef } from "react";
import {
  FileCheck, Shield, AlertTriangle, CheckCircle, UploadCloud,
  FileCode, Hash, Copy, Check, RefreshCw, AlertOctagon,
  ChevronDown, ChevronUp, Info, ExternalLink, HardDrive, ArrowUpRight
} from "lucide-react";
import { uploadAndAnalyzeFile, checkFileHash, FileAnalysisResponse } from "@/lib/api";

export default function FileSecurityPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "hash">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [hashInput, setHashInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FileAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (selectedFile: File) => {
    if (selectedFile.size > 32 * 1024 * 1024) {
      setError("File exceeds 32 MB maximum size limit.");
      return;
    }

    setError(null);
    setFile(selectedFile);
    setLoading(true);

    try {
      const data = await uploadAndAnalyzeFile(selectedFile);
      setResult(data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to analyze file.");
    } finally {
      setLoading(false);
    }
  };

  const handleHashLookup = async () => {
    const h = hashInput.trim();
    if (!h) {
      setError("Please enter a valid SHA-256, SHA-1, or MD5 cryptographic hash.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const data = await checkFileHash(h);
      setResult(data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to query file hash.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getVerdictStyle = (score: number) => {
    if (score >= 70) {
      return {
        badge: "bg-red-500/10 text-red-400 border-red-500/25",
        label: "Malicious Threat Detected",
        icon: AlertOctagon,
        barColor: "bg-red-500",
      };
    }
    if (score >= 35) {
      return {
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/25",
        label: "Suspicious Indicators",
        icon: AlertTriangle,
        barColor: "bg-amber-500",
      };
    }
    return {
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
      label: "Clean / No Malicious Signatures",
      icon: CheckCircle,
      barColor: "bg-emerald-500",
    };
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">File Security Scanner</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Analyze files and verify their reputation against multi-vendor threat intelligence and cryptographic registries.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1F2937] pb-3">
        <button
          onClick={() => { setActiveTab("upload"); setError(null); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
            activeTab === "upload"
              ? "bg-[#1E293B] text-[#F8FAFC] border border-[#334155]"
              : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]"
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Upload File</span>
        </button>
        <button
          onClick={() => { setActiveTab("hash"); setError(null); }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
            activeTab === "hash"
              ? "bg-[#1E293B] text-[#F8FAFC] border border-[#334155]"
              : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]"
          }`}
        >
          <Hash className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Hash Lookup</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2.5">
          <AlertCircleIcon className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Box Mode */}
      {activeTab === "upload" && (
        <div className="space-y-3">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const dropped = e.dataTransfer.files?.[0];
              if (dropped) handleFileUpload(dropped);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition cursor-pointer ${
              isDragging
                ? "border-[#3B82F6] bg-[#3B82F6]/5"
                : "border-[#1F2937] hover:border-[#334155] bg-[#111827]/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) handleFileUpload(selected);
              }}
            />
            <div className="w-12 h-12 rounded-xl bg-[#161F2E] border border-[#1F2937] flex items-center justify-center mx-auto mb-3.5 text-[#3B82F6]">
              {loading ? (
                <RefreshCw className="w-6 h-6 animate-spin text-[#3B82F6]" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <h3 className="text-sm font-semibold text-[#F8FAFC]">
              {loading ? "Analyzing file payload..." : "Drop your file here, or click to browse"}
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-md mx-auto">
              Inspect suspicious executables, archives (.zip, .rar), PDF/Office documents, and scripts.
            </p>
            <div className="inline-flex items-center gap-2 mt-4 px-2.5 py-1 rounded bg-[#090D14] border border-[#1F2937] text-[11px] text-[#64748B]">
              <span>Maximum size: 32 MB</span>
              <span>•</span>
              <span>Local SHA-256 digest computed instantly</span>
            </div>
          </div>

          {file && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0D121C] border border-[#1F2937] text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCode className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span className="font-mono text-[#F8FAFC] truncate">{file.name}</span>
                <span className="text-[#64748B]">({formatBytes(file.size)})</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setResult(null);
                }}
                className="text-[11px] text-[#94A3B8] hover:text-red-400 transition"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hash Lookup Mode */}
      {activeTab === "hash" && (
        <div className="p-5 rounded-xl bg-[#111827] border border-[#1F2937] space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#F8FAFC] mb-1.5">
              Cryptographic File Hash
            </label>
            <p className="text-[11px] text-[#94A3B8] mb-3">
              Search by SHA-256 (64 characters), SHA-1 (40 characters), or MD5 (32 characters) without sending the file contents.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type="text"
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleHashLookup()}
                  placeholder="e.g. 275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f"
                  className="w-full bg-[#090D14] border border-[#1F2937] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
              <button
                onClick={handleHashLookup}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-white text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <HardDrive className="w-3.5 h-3.5" />}
                <span>Check Reputation</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#64748B]">
            <span>Try sample hash:</span>
            <button
              onClick={() => {
                setHashInput("275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f");
              }}
              className="px-2 py-0.5 rounded bg-[#0D121C] border border-[#1F2937] hover:border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] font-mono transition"
            >
              EICAR Test File (SHA-256)
            </button>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {result && (
        <div className="space-y-4">
          {/* Main Verdict Card */}
          <div className="p-5 rounded-xl bg-[#111827] border border-[#1F2937] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2937]">
              <div>
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">Analysis Target</span>
                <h2 className="text-base font-semibold text-[#F8FAFC] font-mono mt-0.5 break-all">
                  {result.filename || "Identified by Cryptographic Hash"}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#94A3B8]">
                  <span>Size: {formatBytes(result.file_size)}</span>
                  <span>•</span>
                  <span>Detected MIME: <code className="text-[#38BDF8]">{result.detected_mime}</code></span>
                  <span>•</span>
                  <span>Extension: <code className="text-[#F8FAFC]">{result.declared_extension || "None"}</code></span>
                </div>
              </div>

              {/* Verdict Badge */}
              <div className="sm:text-right">
                {(() => {
                  const style = getVerdictStyle(result.risk_score);
                  const Icon = style.icon;
                  return (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border ${style.badge}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{style.label}</span>
                      </span>
                      <span className="font-mono text-sm font-bold text-[#F8FAFC]">
                        {result.risk_score} / 100
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Extension Spoofing Warning if active */}
            {result.is_spoofed_extension && (
              <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-3">
                <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-red-200">Dangerous Extension Spoofing Detected: </span>
                  The actual file header bytes indicate an executable or script payload disguised with an innocent document extension.
                </div>
              </div>
            )}

            {/* Malware Reputation / Multi-Engine Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg bg-[#0D121C] border border-[#1F2937]">
                <span className="text-[11px] text-[#64748B] block mb-1">Antivirus Engine Detections</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-[#F8FAFC]">
                    {result.vt_reputation ? result.vt_reputation.malicious : 0}
                  </span>
                  <span className="text-xs text-[#94A3B8]">
                    / {result.vt_reputation?.total_engines || 72} security vendors
                  </span>
                </div>
                <div className="w-full bg-[#1F2937] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      (result.vt_reputation?.malicious || 0) > 0 ? "bg-red-500" : "bg-emerald-500"
                    }`}
                    style={{
                      width: `${Math.min(100, (((result.vt_reputation?.malicious || 0) / 72) * 100) || 5)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0D121C] border border-[#1F2937]">
                <span className="text-[11px] text-[#64748B] block mb-1">Suspicious / Ambiguous Flags</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-[#F8FAFC]">
                    {result.vt_reputation ? result.vt_reputation.suspicious : 0}
                  </span>
                  <span className="text-xs text-[#94A3B8]">heuristic alerts</span>
                </div>
                <span className="text-[11px] text-[#64748B] block mt-2">
                  {result.vt_reputation?.suspicious === 0 ? "No heuristic anomalies" : "Under review"}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0D121C] border border-[#1F2937]">
                <span className="text-[11px] text-[#64748B] block mb-1">Threat Classification</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-semibold text-[#F8FAFC]">
                    {result.threat_level || "Clean"}
                  </span>
                </div>
                <span className="text-[11px] text-[#64748B] block mt-2">
                  CYBERCORE Threat Core v2.4
                </span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-lg bg-[#090D14] border border-[#1F2937] space-y-2">
              <h4 className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Security Recommendations</span>
              </h4>
              <ul className="text-xs text-[#94A3B8] space-y-1.5 pl-5 list-disc">
                {result.risk_score >= 70 ? (
                  <>
                    <li className="text-red-300 font-medium">Do not open, execute, or decompress this file.</li>
                    <li>Permanently delete the file from your download history and empty your recycle bin.</li>
                    <li>If already executed, run a full offline endpoint scan immediately and monitor network egress.</li>
                  </>
                ) : result.risk_score >= 35 ? (
                  <>
                    <li className="text-amber-300 font-medium">Exercise caution before executing this binary or macro.</li>
                    <li>Verify the original download source and verify publisher cryptographic signature if available.</li>
                    <li>Inspect extracted contents in an isolated sandbox environment before running.</li>
                  </>
                ) : (
                  <>
                    <li className="text-emerald-300 font-medium">File signature matches clean status across integrated threat feeds.</li>
                    <li>Standard precautions apply when granting system administrative privileges.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Findings List */}
            {result.findings && result.findings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-[#F8FAFC]">Analytical Findings</h4>
                <div className="space-y-1.5">
                  {result.findings.map((f, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded bg-[#0D121C] border border-[#1F2937] text-xs text-[#94A3B8] flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Details Accordion */}
            <div className="border-t border-[#1F2937] pt-3">
              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="flex items-center justify-between w-full text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer"
              >
                <span>Cryptographic Hashes & Technical Manifest</span>
                {showTechnicalDetails ? (
                  <ChevronUp className="w-4 h-4 text-[#64748B]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#64748B]" />
                )}
              </button>

              {showTechnicalDetails && (
                <div className="mt-3 space-y-2 pt-2 border-t border-[#1F2937]/50">
                  <div className="p-3 rounded bg-[#090D14] border border-[#1F2937] flex items-center justify-between text-xs font-mono">
                    <div className="min-w-0 pr-2">
                      <span className="text-[#64748B] block text-[10px] uppercase font-sans mb-0.5">SHA-256</span>
                      <span className="text-[#F8FAFC] break-all">{result.sha256}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.sha256, "sha256")}
                      className="px-2 py-1 rounded bg-[#161F2E] text-[#94A3B8] hover:text-[#F8FAFC] text-[11px] shrink-0 ml-2"
                    >
                      {copiedHash === "sha256" ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {result.sha1 && (
                    <div className="p-3 rounded bg-[#090D14] border border-[#1F2937] flex items-center justify-between text-xs font-mono">
                      <div className="min-w-0 pr-2">
                        <span className="text-[#64748B] block text-[10px] uppercase font-sans mb-0.5">SHA-1</span>
                        <span className="text-[#F8FAFC] break-all">{result.sha1}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.sha1, "sha1")}
                        className="px-2 py-1 rounded bg-[#161F2E] text-[#94A3B8] hover:text-[#F8FAFC] text-[11px] shrink-0 ml-2"
                      >
                        {copiedHash === "sha1" ? "Copied" : "Copy"}
                      </button>
                    </div>
                  )}

                  {result.md5 && (
                    <div className="p-3 rounded bg-[#090D14] border border-[#1F2937] flex items-center justify-between text-xs font-mono">
                      <div className="min-w-0 pr-2">
                        <span className="text-[#64748B] block text-[10px] uppercase font-sans mb-0.5">MD5</span>
                        <span className="text-[#F8FAFC] break-all">{result.md5}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.md5, "md5")}
                        className="px-2 py-1 rounded bg-[#161F2E] text-[#94A3B8] hover:text-[#F8FAFC] text-[11px] shrink-0 ml-2"
                      >
                        {copiedHash === "md5" ? "Copied" : "Copy"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
