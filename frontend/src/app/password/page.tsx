"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Lock, Eye, EyeOff, RefreshCw, Copy, Check,
  AlertTriangle, CheckCircle, XCircle, Shield,
  Key, Sparkles, AlertOctagon, HelpCircle,
  Sliders, ArrowRight, Info
} from "lucide-react";
import { checkPasswordBreach } from "@/lib/api";

const STRENGTH_LEVELS = [
  { label: "Very Weak", color: "text-[#EF4444]", bg: "bg-[#EF4444]", border: "border-[#EF4444]/30" },
  { label: "Weak", color: "text-[#F97316]", bg: "bg-[#F97316]", border: "border-[#F97316]/30" },
  { label: "Moderate", color: "text-[#F59E0B]", bg: "bg-[#F59E0B]", border: "border-[#F59E0B]/30" },
  { label: "Strong", color: "text-[#3B82F6]", bg: "bg-[#3B82F6]", border: "border-[#3B82F6]/30" },
  { label: "Very Strong", color: "text-[#10B981]", bg: "bg-[#10B981]", border: "border-[#10B981]/30" },
];

const WORD_LIST = [
  "falcon", "cobalt", "granite", "aurora", "cipher", "vertex", "horizon",
  "shadow", "glacier", "zenith", "quantum", "stellar", "matrix", "shield",
  "summit", "nebula", "radiant", "obsidian", "pulsar", "solstice", "vortex"
];

export default function PasswordSecurityPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Local zxcvbn strength state
  const [zxcvbnResult, setZxcvbnResult] = useState<any>(null);

  // HIBP k-Anonymity breach state
  const [breachResult, setBreachResult] = useState<{
    checked: boolean;
    breached: boolean;
    count: number;
    loading: boolean;
  }>({ checked: false, breached: false, count: 0, loading: false });

  // Generator state
  const [genLength, setGenLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [passphraseMode, setPassphraseMode] = useState(false);

  // Evaluate password locally using zxcvbn
  const evaluateLocalPassword = useCallback(async (pwd: string) => {
    if (!pwd) {
      setZxcvbnResult(null);
      setBreachResult({ checked: false, breached: false, count: 0, loading: false });
      return;
    }

    try {
      const zxcvbn = (await import("zxcvbn")).default;
      const res = zxcvbn(pwd);
      setZxcvbnResult(res);
    } catch (e) {
      console.warn("zxcvbn evaluation error", e);
    }
  }, []);

  useEffect(() => {
    evaluateLocalPassword(password);
  }, [password, evaluateLocalPassword]);

  // HIBP Breach Checker via k-Anonymity (Only 5 chars of SHA-1 hash sent)
  const handleCheckBreach = async () => {
    if (!password) return;
    setBreachResult(prev => ({ ...prev, loading: true, checked: false }));

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-1", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha1 = hashArray.map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();

      const prefix = sha1.slice(0, 5);
      const suffix = sha1.slice(5);

      const res = await checkPasswordBreach(prefix);
      const lines = res.data.split("\n");

      let found = false;
      let breachCount = 0;

      for (const line of lines) {
        const [hashSuffix, count] = line.trim().split(":");
        if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
          found = true;
          breachCount = parseInt(count, 10) || 1;
          break;
        }
      }

      setBreachResult({
        checked: true,
        breached: found,
        count: breachCount,
        loading: false,
      });
    } catch (e) {
      setBreachResult({ checked: true, breached: false, count: 0, loading: false });
    }
  };

  // Secure local generator
  const generateSecurePassword = () => {
    if (passphraseMode) {
      const selected = [];
      const array = new Uint32Array(4);
      crypto.getRandomValues(array);
      for (let i = 0; i < 4; i++) {
        selected.push(WORD_LIST[array[i] % WORD_LIST.length]);
      }
      const sep = includeSymbols ? "-" : "_";
      const num = includeNumbers ? String(array[0] % 900 + 100) : "";
      const generated = selected.join(sep) + (num ? `${sep}${num}` : "");
      setPassword(generated);
      return;
    }

    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const randomVals = new Uint32Array(genLength);
    crypto.getRandomValues(randomVals);

    let res = "";
    for (let i = 0; i < genLength; i++) {
      res += chars[randomVals[i] % chars.length];
    }
    setPassword(res);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculations for composition
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const scoreIndex = zxcvbnResult?.score ?? 0;
  const strength = STRENGTH_LEVELS[scoreIndex];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
          Password Security
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Understand your password strength and improve your digital security.
        </p>
      </div>

      {/* Main Password Analysis Section */}
      <div className="saas-card p-5 sm:p-6 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#38BDF8]" />
              <span>Enter Password to Analyze</span>
            </label>
            {password && (
              <span className="text-xs font-mono text-[#94A3B8]">
                Length: <strong className="text-[#F8FAFC]">{password.length}</strong> characters
              </span>
            )}
          </div>

          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or paste a password..."
              className="saas-input w-full pl-4 pr-24 py-3 text-xs sm:text-sm font-mono placeholder-[#64748B]"
            />
            <div className="absolute right-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 rounded-md text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#161F2E] transition"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {password && (
                <button
                  type="button"
                  onClick={copyPassword}
                  className="p-2 rounded-md text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#161F2E] transition"
                  title="Copy password"
                >
                  {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Strength Meter (Very Weak, Weak, Moderate, Strong, Very Strong) */}
        {password && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#94A3B8]">Strength Rating:</span>
                <span className={`font-bold ${strength.color}`}>{strength.label}</span>
              </div>
              <span className="text-[#94A3B8] font-mono text-[11px]">
                Estimated Crack Time: <strong className="text-[#F8FAFC]">{zxcvbnResult?.crack_times_display?.offline_slow_hashing_1e4_per_second || "Instant"}</strong>
              </span>
            </div>

            {/* 5-Level Progress Bar */}
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    scoreIndex >= idx ? strength.bg : "bg-[#1F2937]"
                  }`}
                />
              ))}
            </div>

            {/* Character Composition Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
              <span className={`px-2 py-0.5 rounded border ${hasUpper ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30" : "bg-[#161F2E] text-[#64748B] border-[#1F2937]"}`}>
                {hasUpper ? "✓ Uppercase" : "✕ Uppercase"}
              </span>
              <span className={`px-2 py-0.5 rounded border ${hasLower ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30" : "bg-[#161F2E] text-[#64748B] border-[#1F2937]"}`}>
                {hasLower ? "✓ Lowercase" : "✕ Lowercase"}
              </span>
              <span className={`px-2 py-0.5 rounded border ${hasNumber ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30" : "bg-[#161F2E] text-[#64748B] border-[#1F2937]"}`}>
                {hasNumber ? "✓ Numbers" : "✕ Numbers"}
              </span>
              <span className={`px-2 py-0.5 rounded border ${hasSymbol ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30" : "bg-[#161F2E] text-[#64748B] border-[#1F2937]"}`}>
                {hasSymbol ? "✓ Symbols" : "✕ Symbols"}
              </span>
            </div>

            {/* Common Pattern Warning */}
            {zxcvbnResult?.feedback?.warning && (
              <div className="p-3 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{zxcvbnResult.feedback.warning}</span>
              </div>
            )}

            {/* Suggestions */}
            {zxcvbnResult?.feedback?.suggestions && zxcvbnResult.feedback.suggestions.length > 0 && (
              <div className="space-y-1 text-xs text-[#94A3B8]">
                {zxcvbnResult.feedback.suggestions.map((sugg: string, i: number) => (
                  <p key={i} className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>{sugg}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3 Separate Sections: Generator, Breach Checker, Security Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool 1: Password Generator */}
        <div className="saas-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
            <h3 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              <span>Password Generator</span>
            </h3>
            <button
              onClick={generateSecurePassword}
              className="btn-primary px-3 py-1 text-xs flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Generate</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[#94A3B8]">
                <span>Length:</span>
                <span className="font-mono text-[#F8FAFC] font-bold">{genLength}</span>
              </div>
              <input
                type="range"
                min={12}
                max={32}
                value={genLength}
                onChange={(e) => setGenLength(parseInt(e.target.value, 10))}
                className="w-full accent-[#3B82F6] cursor-pointer"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#94A3B8] hover:text-[#F8FAFC]">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded border-[#1F2937] text-[#3B82F6]"
                />
                <span>Include Symbols (!@#$)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[#94A3B8] hover:text-[#F8FAFC]">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded border-[#1F2937] text-[#3B82F6]"
                />
                <span>Include Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[#94A3B8] hover:text-[#F8FAFC]">
                <input
                  type="checkbox"
                  checked={passphraseMode}
                  onChange={(e) => setPassphraseMode(e.target.checked)}
                  className="rounded border-[#1F2937] text-[#3B82F6]"
                />
                <span>Passphrase Mode (Memorable Words)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Tool 2: Password Breach Checker (k-Anonymity) */}
        <div className="saas-card p-5 space-y-4">
          <div className="pb-3 border-b border-[#1F2937]">
            <h3 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#10B981]" />
              <span>Password Breach Checker</span>
            </h3>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">k-Anonymity database search.</p>
          </div>

          <div className="space-y-3 text-xs text-[#94A3B8]">
            <p className="leading-relaxed">
              Verify if this password appeared in past corporate data breaches without revealing your identity or password.
            </p>

            <button
              onClick={handleCheckBreach}
              disabled={!password || breachResult.loading}
              className="btn-secondary w-full py-2 text-xs flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
            >
              {breachResult.loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching 14B+ Breaches...</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Check Against Breaches</span>
                </>
              )}
            </button>

            {breachResult.checked && (
              <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
                breachResult.breached
                  ? "bg-[#EF4444]/15 border-[#EF4444]/30 text-[#EF4444]"
                  : "bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]"
              }`}>
                {breachResult.breached ? (
                  <span>
                    <strong>Vulnerable:</strong> Seen {breachResult.count.toLocaleString()} times in known breaches. Do not use.
                  </span>
                ) : (
                  <span>
                    <strong>Clean:</strong> Zero breach matches recorded in HaveIBeenPwned.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tool 3: Password Security Tips */}
        <div className="saas-card p-5 space-y-3">
          <div className="pb-3 border-b border-[#1F2937]">
            <h3 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#F59E0B]" />
              <span>Password Security Tips</span>
            </h3>
          </div>

          <ul className="space-y-2.5 text-xs text-[#94A3B8] leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-[#3B82F6] font-bold">•</span>
              <span><strong>Length beats complexity:</strong> A 16+ character passphrase is exponentially stronger than short scrambled strings.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3B82F6] font-bold">•</span>
              <span><strong>Never reuse credentials:</strong> A breach on one site leads to credential stuffing attacks on all other services.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3B82F6] font-bold">•</span>
              <span><strong>Always enable 2FA:</strong> Prefer Authenticator Apps or security keys over SMS verification.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
