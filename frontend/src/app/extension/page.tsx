"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield, Download, Eye, CheckCircle2, AlertTriangle,
  ExternalLink, Layers, ArrowRight, RefreshCw, Lock,
  Globe, Zap, Terminal, Copy, Check
} from "lucide-react";
import { Chrome } from "@/components/ui/BrandIcons";

export default function ExtensionInfoPage() {
  const [demoUrl, setDemoUrl] = useState("https://secure-login-portal.xyz");
  const [demoRisk, setDemoRisk] = useState(88);
  const [copiedPath, setCopiedPath] = useState(false);

  const demoSites = [
    {
      url: "https://secure-login-portal.xyz",
      score: 88,
      label: "Credential Harvester (Phishing)",
      verdict: "High Risk",
      engines: "18 / 72 flagged",
    },
    {
      url: "https://github.com",
      score: 4,
      label: "Verified Software Repository",
      verdict: "Safe",
      engines: "0 / 72 flagged",
    },
    {
      url: "https://unknown-shop-deal99.top",
      score: 65,
      label: "Suspicious E-Commerce / Low Age",
      verdict: "Suspicious",
      engines: "5 / 72 flagged",
    },
  ];

  const handleCopyPath = () => {
    navigator.clipboard.writeText("extension/");
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">Browser Protection</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Extend CYBERCORE threat intelligence directly into your daily web browsing workflow.
          </p>
        </div>

        <a
          href="#installation-steps"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium transition shadow-sm w-fit"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install Extension</span>
        </a>
      </div>

      {/* Extension Telemetry Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#64748B] block">Protection State</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-[#F8FAFC]">Engine Synchronized</span>
            </div>
          </div>
          <Shield className="w-5 h-5 text-emerald-400 opacity-80" />
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#64748B] block">Manifest Specification</span>
            <span className="text-xs font-semibold text-[#F8FAFC] block mt-1">Manifest V3 (MV3)</span>
          </div>
          <Chrome className="w-5 h-5 text-[#38BDF8]" />
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#64748B] block">Analysis Latency</span>
            <span className="text-xs font-semibold font-mono text-[#F8FAFC] block mt-1">&lt; 180 ms / URL</span>
          </div>
          <Zap className="w-5 h-5 text-amber-400 opacity-80" />
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#64748B] block">Privacy Architecture</span>
            <span className="text-xs font-semibold text-[#F8FAFC] block mt-1">Zero History Stored</span>
          </div>
          <Lock className="w-5 h-5 text-[#3B82F6] opacity-80" />
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#111827] border border-[#1F2937] space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6]">
            <Globe className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Real-Time Page Analysis</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Inspects every visited website against CYBERCORE threat databases, TLS certificate authenticity, and domain age instantly.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#111827] border border-[#1F2937] space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Inline Warning Interstitials</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Blocks high-risk phishing websites and credential-harvesting forms before keystrokes or authentication tokens are submitted.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#111827] border border-[#1F2937] space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8]">
            <Eye className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Toolbar Security Badge</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            A dynamic color-coded badge right on your Chrome toolbar gives you immediate at-a-glance safety feedback for any active tab.
          </p>
        </div>
      </div>

      {/* Interactive Extension Demo */}
      <div className="p-6 rounded-xl bg-[#111827] border border-[#1F2937] space-y-5">
        <div className="border-b border-[#1F2937] pb-3">
          <span className="text-[11px] font-mono text-[#38BDF8] uppercase tracking-wider">Live Simulation</span>
          <h2 className="text-base font-semibold text-[#F8FAFC] mt-0.5">Experience the Extension Popup</h2>
          <p className="text-xs text-[#94A3B8]">
            Simulate how the CYBERCORE extension evaluates and protects active browser tabs in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Target Selector */}
          <div className="lg:col-span-6 space-y-3">
            <label className="text-xs font-medium text-[#F8FAFC] block">
              Select Sample Browsing Target:
            </label>
            <div className="space-y-2">
              {demoSites.map((site) => (
                <button
                  key={site.url}
                  onClick={() => {
                    setDemoUrl(site.url);
                    setDemoRisk(site.score);
                  }}
                  className={`w-full p-3 rounded-lg border text-left transition flex items-center justify-between cursor-pointer ${
                    demoUrl === site.url
                      ? "border-[#3B82F6] bg-[#3B82F6]/10 text-white"
                      : "border-[#1F2937] bg-[#0D121C] text-[#94A3B8] hover:border-[#334155]"
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <span className="text-xs font-mono font-medium text-[#F8FAFC] block truncate">{site.url}</span>
                    <span className="text-[11px] text-[#64748B]">{site.label}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      site.score >= 70
                        ? "bg-red-500/10 text-red-400 border-red-500/25"
                        : site.score >= 40
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                    }`}>
                      {site.score} / 100
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 text-xs text-[#94A3B8] space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Synchronized with CYBERCORE backend threat database</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dynamic toolbar icon badge updates on tab switches</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero browsing telemetry saved to external storage</span>
              </div>
            </div>
          </div>

          {/* Rendered Mockup Extension Popup */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[340px] rounded-2xl bg-[#090D14] border border-[#1F2937] shadow-2xl overflow-hidden">
              {/* Fake Chrome Popup Bar */}
              <div className="px-4 py-3 bg-[#0D121C] border-b border-[#1F2937] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#3B82F6] flex items-center justify-center text-white">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#F8FAFC]">CYBERCORE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${demoRisk >= 70 ? "bg-red-500" : demoRisk >= 40 ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <span className="text-[10px] font-mono text-[#94A3B8]">v1.0.0</span>
                </div>
              </div>

              {/* Popup Content */}
              <div className="p-4 space-y-3.5">
                <div className="p-2.5 rounded-lg bg-[#111827] border border-[#1F2937]">
                  <span className="text-[10px] font-mono text-[#64748B] uppercase">Active Tab</span>
                  <div className="text-xs font-mono text-[#F8FAFC] truncate mt-0.5">{demoUrl}</div>
                </div>

                {/* Score Widget */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0D121C] border border-[#1F2937]">
                  <div>
                    <span className="text-[10px] text-[#64748B] block">Risk Verdict</span>
                    <span className={`text-xs font-semibold ${
                      demoRisk >= 70 ? "text-red-400" : demoRisk >= 40 ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {demoRisk >= 70 ? "High Risk Threat" : demoRisk >= 40 ? "Caution Advised" : "Clean & Verified"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#64748B] block">Security Score</span>
                    <span className="text-base font-bold font-mono text-[#F8FAFC]">
                      {demoRisk} / 100
                    </span>
                  </div>
                </div>

                {/* Telemetry rows */}
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between py-1 border-b border-[#1F2937]/50 text-[#94A3B8]">
                    <span>SSL Certificate</span>
                    <span className="text-[#F8FAFC]">Valid TLS 1.3</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#1F2937]/50 text-[#94A3B8]">
                    <span>Threat Feeds</span>
                    <span className={demoRisk >= 70 ? "text-red-400" : "text-emerald-400"}>
                      {demoRisk >= 70 ? "Flagged Malicious" : "Clean Registry"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 text-[#94A3B8]">
                    <span>Domain Age</span>
                    <span className="text-[#F8FAFC]">{demoRisk >= 70 ? "4 days" : "16+ years"}</span>
                  </div>
                </div>

                <Link
                  href={`/scanner?target=${encodeURIComponent(demoUrl)}`}
                  className="w-full py-2 rounded-lg bg-[#161F2E] hover:bg-[#1E293B] border border-[#1F2937] text-[#F8FAFC] text-xs font-medium transition flex items-center justify-center gap-1.5"
                >
                  <span>Open Full Forensic Report</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Installation Guide */}
      <div id="installation-steps" className="p-6 rounded-xl bg-[#111827] border border-[#1F2937] space-y-4">
        <div className="border-b border-[#1F2937] pb-3">
          <span className="text-[11px] font-mono text-[#38BDF8] uppercase tracking-wider">Setup Instructions</span>
          <h2 className="text-base font-semibold text-[#F8FAFC] mt-0.5">
            Load Extension in Google Chrome (Developer Mode)
          </h2>
          <p className="text-xs text-[#94A3B8]">
            The CYBERCORE extension is already built and ready inside this repository. Follow these four simple steps:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#0D121C] border border-[#1F2937] space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#3B82F6] text-white text-[11px] font-bold flex items-center justify-center">1</span>
              <h3 className="text-xs font-semibold text-[#F8FAFC]">Open Chrome Extensions</h3>
            </div>
            <p className="text-xs text-[#94A3B8] pl-7">
              In your Google Chrome or Brave browser address bar, navigate to:
            </p>
            <div className="pl-7">
              <code className="text-xs font-mono px-2 py-1 rounded bg-[#090D14] border border-[#1F2937] text-[#38BDF8] inline-block">
                chrome://extensions
              </code>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#0D121C] border border-[#1F2937] space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#3B82F6] text-white text-[11px] font-bold flex items-center justify-center">2</span>
              <h3 className="text-xs font-semibold text-[#F8FAFC]">Enable Developer Mode</h3>
            </div>
            <p className="text-xs text-[#94A3B8] pl-7">
              In the top-right corner of the Extensions page, toggle the <strong className="text-[#F8FAFC]">Developer mode</strong> toggle switch to ON.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#0D121C] border border-[#1F2937] space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#3B82F6] text-white text-[11px] font-bold flex items-center justify-center">3</span>
              <h3 className="text-xs font-semibold text-[#F8FAFC]">Click Load Unpacked</h3>
            </div>
            <p className="text-xs text-[#94A3B8] pl-7">
              Click the <strong className="text-[#F8FAFC]">Load unpacked</strong> button and select the extension folder:
            </p>
            <div className="pl-7 flex items-center gap-2">
              <code className="text-xs font-mono px-2 py-1 rounded bg-[#090D14] border border-[#1F2937] text-[#38BDF8]">
                CyberCore/extension
              </code>
              <button
                onClick={handleCopyPath}
                className="px-2 py-1 rounded bg-[#161F2E] text-[#94A3B8] hover:text-[#F8FAFC] text-[11px] flex items-center gap-1 transition"
              >
                {copiedPath ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPath ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#0D121C] border border-[#1F2937] space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#3B82F6] text-white text-[11px] font-bold flex items-center justify-center">4</span>
              <h3 className="text-xs font-semibold text-[#F8FAFC]">Pin to Toolbar</h3>
            </div>
            <p className="text-xs text-[#94A3B8] pl-7">
              Click the puzzle icon in Chrome and pin CYBERCORE to your browser bar for instant threat evaluation on every tab you visit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
