"use client";

import { useState } from "react";
import {
  MessageSquare, Shield, AlertTriangle, CheckCircle,
  XCircle, Copy, Check, RefreshCw, Send, AlertOctagon,
  ExternalLink, Lock, Info, ArrowRight, Zap
} from "lucide-react";
import { analyzeMessage, MessageAnalysis } from "@/lib/api";

const PRESET_MESSAGES = [
  {
    label: "Fake KYC Suspension (Phishing)",
    text: "URGENT: Your SBI account will be blocked within 2 hours. Complete your mandatory KYC update immediately at http://sbi-kyc-verify-update.xyz or share the 6-digit OTP sent to your phone."
  },
  {
    label: "Lottery / Prize Fraud",
    text: "CONGRATULATIONS! You have been selected as the lucky winner of $175,000 in our international drawing. To claim your prize, send the $25 clearance fee to unlock transfer at http://claim-cash-reward.top"
  },
  {
    label: "Work From Home Task Scam",
    text: "Work from home! Earn $300-$500 per day simply by liking YouTube videos and following Instagram channels. No experience needed. Contact our Telegram manager @easy_money_tasks to begin."
  },
  {
    label: "Legitimate Security Alert",
    text: "Security Notification: A new login to your GitHub account was detected from Chrome on macOS. If this was you, you can ignore this email. Never share your 2FA security codes with anyone."
  }
];

export default function MessageScannerPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MessageAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (msgText?: string) => {
    const input = (msgText !== undefined ? msgText : text).trim();
    if (!input) {
      setError("Please paste or type a message to analyze.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const data = await analyzeMessage(input);
      setResult(data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to analyze message. Ensure the backend engine is running.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskDetails = (score: number) => {
    if (score >= 70) {
      return {
        label: "High Scam Risk Detected",
        color: "text-[#EF4444]",
        bg: "bg-[#EF4444]/10",
        border: "border-[#EF4444]/30"
      };
    }
    if (score >= 35) {
      return {
        label: "Suspicious Social Engineering",
        color: "text-[#F59E0B]",
        bg: "bg-[#F59E0B]/10",
        border: "border-[#F59E0B]/30"
      };
    }
    return {
      label: "Low Risk / No Known Scams",
      color: "text-[#10B981]",
      bg: "bg-[#10B981]/10",
      border: "border-[#10B981]/30"
    };
  };

  const risk = result ? getRiskDetails(result.risk_score) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
          Message Security Scanner
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Identify suspicious messages, phishing attempts, and social engineering attacks.
        </p>
      </div>

      {/* Input Section */}
      <div className="saas-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#38BDF8]" />
            <span>Paste Message Content (Email, SMS, WhatsApp, or Chat)</span>
          </label>
          {text && (
            <button
              onClick={() => { setText(""); setResult(null); }}
              className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer transition"
            >
              Clear
            </button>
          )}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste full email text, SMS message, WhatsApp alert, or suspicious notification here..."
          rows={6}
          className="saas-input w-full p-3.5 text-xs sm:text-sm font-sans placeholder-[#64748B] resize-y"
        />

        {error && (
          <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
            <Lock className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Transient memory processing. Zero message text is logged or stored.</span>
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={loading || !text.trim()}
            className="btn-primary px-6 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating Indicators...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Analyze Message</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="pt-3 border-t border-[#1F2937] space-y-2">
          <span className="text-[11px] font-mono uppercase text-[#64748B] font-semibold block">
            Test Real-World Scenarios
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_MESSAGES.map((preset, i) => (
              <button
                key={i}
                onClick={() => {
                  setText(preset.text);
                  handleAnalyze(preset.text);
                }}
                className="text-left px-3 py-1.5 rounded-lg bg-[#0D121C] hover:bg-[#161F2E] border border-[#1F2937] text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Results Report */}
      {result && risk && (
        <div className="space-y-6">
          {/* Top Score & Classification */}
          <div className="saas-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#94A3B8] font-semibold">
                Scam Classification
              </span>
              <h3 className="text-xl font-bold text-[#F8FAFC]">
                {result.scam_type || "Generic Text Message"}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Deterministic indicator score calculated from pattern signatures and psychological pressure tactics.
              </p>
            </div>

            <div className={`p-4 rounded-xl border flex items-center gap-4 ${risk.bg} ${risk.border}`}>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#94A3B8] font-bold block">Threat Rating</span>
                <span className={`text-sm font-bold ${risk.color}`}>{risk.label}</span>
              </div>
              <div className={`text-3xl font-black font-mono ${risk.color}`}>
                {result.risk_score}<span className="text-xs font-normal text-[#94A3B8]">/100</span>
              </div>
            </div>
          </div>

          {/* Grid: Impersonation & Manipulation Tactics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Impersonation Targets */}
            <div className="saas-card p-5 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-semibold">
                Target Impersonation
              </h4>
              {result.impersonation_targets && result.impersonation_targets.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.impersonation_targets.map((target, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/25">
                      Impersonating: {target}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#64748B]">No recognizable brand or authority impersonation identified.</p>
              )}
            </div>

            {/* Manipulation Tactics */}
            <div className="saas-card p-5 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-semibold">
                Detected Manipulation Techniques
              </h4>
              {result.manipulation_tactics && result.manipulation_tactics.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.manipulation_tactics.map((tactic, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/25">
                      {tactic} Pressure
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#64748B]">No high-pressure manipulation tactics detected.</p>
              )}
            </div>
          </div>

          {/* Suspicious Phrases / Indicators */}
          <div className="saas-card p-5 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-semibold">
              Suspicious Phrases & Triggers
            </h4>
            {result.indicators && result.indicators.length > 0 ? (
              <div className="space-y-2">
                {result.indicators.map((ind, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#0D121C] border border-[#1F2937] text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-semibold text-[#F8FAFC] block">{ind.description}</span>
                      {ind.matched_snippet && (
                        <span className="text-[11px] font-mono text-[#94A3B8] mt-0.5 block">
                          Matched text: &quot;{ind.matched_snippet}&quot;
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#64748B]">No specific high-risk scam triggers matched.</p>
            )}
          </div>

          {/* Suspicious Links Found */}
          {result.urls_found && result.urls_found.length > 0 && (
            <div className="saas-card p-5 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-semibold">
                Extracted Links
              </h4>
              <div className="space-y-2">
                {result.urls_found.map((url, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#0D121C] border border-[#1F2937] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#EF4444] truncate mr-2">{url}</span>
                    <a
                      href={`/scanner?url=${encodeURIComponent(url)}`}
                      className="text-xs text-[#38BDF8] hover:underline shrink-0"
                    >
                      Audit Link →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          {result.recommended_actions && result.recommended_actions.length > 0 && (
            <div className="saas-card p-5 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-semibold">
                Recommended Actions
              </h4>
              <ul className="space-y-2 text-xs">
                {result.recommended_actions.map((act, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#F8FAFC]">
                    <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
