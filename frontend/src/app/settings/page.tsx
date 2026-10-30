"use client";

import { useState } from "react";
import {
  Settings, User, Shield, Key, Bell, Lock, Eye,
  CheckCircle2, RefreshCw, Save, HardDrive, Smartphone,
  Info, ExternalLink, Moon, Check
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [vtKey, setVtKey] = useState("vt_sec_••••••••••••••••3a9f");
  const [gsbKey, setGsbKey] = useState("gsb_••••••••••••••••7b2e");
  const [showVtKey, setShowVtKey] = useState(false);

  // Toggle states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [browserAlerts, setBrowserAlerts] = useState(true);
  const [transientData, setTransientData] = useState(true);
  const [telemetryOptIn, setTelemetryOptIn] = useState(false);
  const [monoFont, setMonoFont] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">Platform Settings & Preferences</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Configure threat intelligence integrations, local security policies, and privacy preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium transition cursor-pointer w-fit shadow-sm"
        >
          {saved ? <Check className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saved ? "Preferences Saved" : "Save Changes"}</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Security configurations updated successfully. All preferences applied locally.</span>
        </div>
      )}

      {/* Section 1: Profile & Identity */}
      <div className="p-5 rounded-xl bg-[#111827] border border-[#1F2937] space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#1F2937]">
          <User className="w-4 h-4 text-[#3B82F6]" />
          <h2 className="text-sm font-semibold text-[#F8FAFC]">Operator Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#94A3B8] text-[11px] mb-1">Operator Name</label>
            <input
              type="text"
              readOnly
              value="Security Analyst"
              className="w-full bg-[#090D14] border border-[#1F2937] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[#94A3B8] text-[11px] mb-1">Assigned Role</label>
            <div className="flex items-center gap-2 bg-[#090D14] border border-[#1F2937] rounded-lg px-3 py-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[#F8FAFC] font-medium">SecOps Tier 2 / Incident Responder</span>
            </div>
          </div>

          <div>
            <label className="block text-[#94A3B8] text-[11px] mb-1">Organization</label>
            <input
              type="text"
              readOnly
              value="CYBERCORE Enterprise Defense"
              className="w-full bg-[#090D14] border border-[#1F2937] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[#94A3B8] text-[11px] mb-1">Authentication Method</label>
            <input
              type="text"
              readOnly
              value="Hardware MFA / WebAuthn FIDO2"
              className="w-full bg-[#090D14] border border-[#1F2937] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Threat Intelligence Feeds & API Keys */}
      <div className="p-5 rounded-xl bg-[#111827] border border-[#1F2937] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="text-sm font-semibold text-[#F8FAFC]">Threat Intelligence Integrations</h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            Multi-Source Engine Online
          </span>
        </div>

        <div className="space-y-3">
          {/* VirusTotal Key */}
          <div className="p-3.5 rounded-lg bg-[#0D121C] border border-[#1F2937] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#F8FAFC]">VirusTotal API Integration</span>
                <p className="text-[11px] text-[#94A3B8]">
                  Enables reputation lookup for hashes and URLs across 70+ antivirus engines.
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type={showVtKey ? "text" : "password"}
                value={vtKey}
                onChange={(e) => setVtKey(e.target.value)}
                placeholder="Enter VirusTotal v3 API key..."
                className="flex-1 bg-[#090D14] border border-[#1F2937] rounded-lg px-3 py-1.5 text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
              />
              <button
                type="button"
                onClick={() => setShowVtKey(!showVtKey)}
                className="px-2.5 py-1.5 rounded-lg bg-[#161F2E] text-[#94A3B8] hover:text-[#F8FAFC] text-xs transition"
              >
                {showVtKey ? "Hide" : "Reveal"}
              </button>
            </div>
          </div>

          {/* URLhaus & AbuseIPDB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#0D121C] border border-[#1F2937] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#F8FAFC] block">abuse.ch URLhaus</span>
                <span className="text-[11px] text-[#94A3B8]">Real-time malware payload feeds</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Active
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#0D121C] border border-[#1F2937] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#F8FAFC] block">Google Safe Browsing</span>
                <span className="text-[11px] text-[#94A3B8]">Lookup v4 API endpoint</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Privacy & Data Retention */}
      <div className="p-5 rounded-xl bg-[#111827] border border-[#1F2937] space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#1F2937]">
          <Lock className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-[#F8FAFC]">Privacy & Data Retention Controls</h2>
        </div>

        <div className="space-y-3 text-xs">
          {/* Transient Analysis */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0D121C] border border-[#1F2937]">
            <div className="pr-4">
              <span className="font-semibold text-[#F8FAFC] block">Transient Message Analysis</span>
              <p className="text-[11px] text-[#94A3B8]">
                Scanned SMS and email text is evaluated in memory and never logged to permanent database disks.
              </p>
            </div>
            <button
              onClick={() => setTransientData(!transientData)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                transientData ? "bg-[#3B82F6]" : "bg-[#334155]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  transientData ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* k-Anonymity Local Hashing */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0D121C] border border-[#1F2937]">
            <div className="pr-4">
              <span className="font-semibold text-[#F8FAFC] block">k-Anonymity Cryptographic Verification</span>
              <p className="text-[11px] text-[#94A3B8]">
                Passwords and hashes are always checked using 5-character SHA-1 prefixes. Raw secrets never leave your browser.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded shrink-0">
              Always Enforced
            </span>
          </div>

          {/* Telemetry Sharing */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0D121C] border border-[#1F2937]">
            <div className="pr-4">
              <span className="font-semibold text-[#F8FAFC] block">Anonymized Threat Telemetry Contribution</span>
              <p className="text-[11px] text-[#94A3B8]">
                Share newly discovered malicious URLs with global open cybersecurity research databases.
              </p>
            </div>
            <button
              onClick={() => setTelemetryOptIn(!telemetryOptIn)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                telemetryOptIn ? "bg-[#3B82F6]" : "bg-[#334155]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  telemetryOptIn ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Notifications & Alerting */}
      <div className="p-5 rounded-xl bg-[#111827] border border-[#1F2937] space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#1F2937]">
          <Bell className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-[#F8FAFC]">Alerting & Notification Rules</h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0D121C] border border-[#1F2937]">
            <div className="pr-4">
              <span className="font-semibold text-[#F8FAFC] block">Critical Threat Email Notifications</span>
              <p className="text-[11px] text-[#94A3B8]">
                Receive instant high-priority alerts whenever a scanned resource triggers a Risk Score ≥ 90.
              </p>
            </div>
            <button
              onClick={() => setEmailAlerts(!emailAlerts)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                emailAlerts ? "bg-[#3B82F6]" : "bg-[#334155]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  emailAlerts ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0D121C] border border-[#1F2937]">
            <div className="pr-4">
              <span className="font-semibold text-[#F8FAFC] block">Chrome Extension Native Notifications</span>
              <p className="text-[11px] text-[#94A3B8]">
                Display desktop notifications when navigation to a known phishing or credential-harvesting domain is intercepted.
              </p>
            </div>
            <button
              onClick={() => setBrowserAlerts(!browserAlerts)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                browserAlerts ? "bg-[#3B82F6]" : "bg-[#334155]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  browserAlerts ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 5: Appearance */}
      <div className="p-5 rounded-xl bg-[#111827] border border-[#1F2937] space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#1F2937]">
          <Moon className="w-4 h-4 text-[#38BDF8]" />
          <h2 className="text-sm font-semibold text-[#F8FAFC]">Interface Display Theme</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#0D121C] border border-[#3B82F6]/50 flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#F8FAFC] block">Enterprise Dark Theme</span>
              <span className="text-[11px] text-[#94A3B8]">Curated high-contrast slate & obsidian palette</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center text-white">
              <Check className="w-3 h-3" />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0D121C] border border-[#1F2937] opacity-50 flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#64748B] block">Light Theme</span>
              <span className="text-[11px] text-[#475569]">Disabled for mission-critical SecOps clarity</span>
            </div>
            <Lock className="w-4 h-4 text-[#475569]" />
          </div>
        </div>
      </div>
    </div>
  );
}
