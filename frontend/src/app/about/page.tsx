"use client";

import Link from "next/link";
import {
  Shield, Lock, Eye, CheckCircle2, Database, Server,
  Cpu, Users, ArrowUpRight, Zap, Globe, HardDrive
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">About CYBERCORE Platform</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Bridging enterprise threat intelligence with intuitive, high-precision security tooling for everyone.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#111827] border border-[#1F2937] space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6]">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Zero-Knowledge Privacy</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Your secrets never leave your device unhashed. Password breach checks use k-Anonymity (5-character SHA-1 prefix models) with zero raw password transit.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#111827] border border-[#1F2937] space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Eye className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Transient Memory Triage</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Message heuristics and file metadata are evaluated in transient memory. CYBERCORE never indexes or persists personal messages or files.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#111827] border border-[#1F2937] space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8]">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Transparent Evidence</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Zero black-box verdicts. Every risk score is backed by granular technical telemetry: TLS validity, registration age, punycode spoofing, and multi-engine feeds.
          </p>
        </div>
      </div>

      {/* Architecture & Multi-Source Intelligence */}
      <div className="p-6 rounded-xl bg-[#111827] border border-[#1F2937] space-y-4">
        <div className="border-b border-[#1F2937] pb-3">
          <span className="text-[11px] font-mono text-[#38BDF8] uppercase tracking-wider">Under The Hood</span>
          <h2 className="text-base font-semibold text-[#F8FAFC] mt-0.5">Unified Intelligence Engine</h2>
          <p className="text-xs text-[#94A3B8]">
            CYBERCORE Web and Chrome Extension leverage an identical backend pipeline and weighted scoring model.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#0D121C] border border-[#1F2937] space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#3B82F6]" />
              <span className="font-semibold text-[#F8FAFC]">Cryptographic TLS & DNS Telemetry</span>
            </div>
            <p className="text-[#94A3B8] text-[11px] leading-relaxed">
              Full X.509 certificate chain validation, expiration alerts, DNSSEC records, SPF/DMARC mail records, and authoritative nameserver analysis.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0D121C] border border-[#1F2937] space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-[#F8FAFC]">Global Threat Registries</span>
            </div>
            <p className="text-[#94A3B8] text-[11px] leading-relaxed">
              Real-time synchronization with Google Safe Browsing, abuse.ch URLhaus, VirusTotal multi-antivirus scanners, and community blocklists.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0D121C] border border-[#1F2937] space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-[#F8FAFC]">Heuristic & NLP Phishing Analysis</span>
            </div>
            <p className="text-[#94A3B8] text-[11px] leading-relaxed">
              Levenshtein distance checks for 40+ protected financial/tech brands, punycode/homoglyph spoofing detectors, and urgency keyword extraction.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0D121C] border border-[#1F2937] space-y-1">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#38BDF8]" />
              <span className="font-semibold text-[#F8FAFC]">Chrome Extension Manifest V3</span>
            </div>
            <p className="text-[#94A3B8] text-[11px] leading-relaxed">
              Lightweight declarative background service worker, sub-200ms non-blocking evaluation, inline warning interstitials, and toolbar status indicators.
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 rounded-xl bg-[#0D121C] border border-[#1F2937] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="text-[#94A3B8]">
          Ready to verify a suspicious web address or email communication?
        </span>
        <div className="flex items-center gap-2">
          <Link
            href="/scanner"
            className="px-3 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium transition flex items-center gap-1.5"
          >
            <span>Scan URL</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/messages"
            className="px-3 py-1.5 rounded-lg bg-[#161F2E] hover:bg-[#1E293B] border border-[#1F2937] text-[#F8FAFC] font-medium transition flex items-center gap-1.5"
          >
            <span>Scan Message</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
