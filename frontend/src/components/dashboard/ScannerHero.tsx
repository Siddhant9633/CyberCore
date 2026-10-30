"use client";

import Link from "next/link";
import { AlertOctagon, AlertTriangle, ArrowRight, CheckCircle2, Globe, Loader2, Shield, ShieldCheck, X } from "lucide-react";
import type { ScanResult } from "@/lib/api";

interface ScannerHeroProps {
  urlInput: string;
  scanning: boolean;
  validationError: string | null;
  scanError: string | null;
  scanResult: ScanResult | null;
  onInputChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onPreset: (value: string) => void;
  onClear: () => void;
}

function Verdict({ score, category }: { score: number; category?: string }) {
  const dangerous = score >= 70 || category === "CRITICAL" || category === "HIGH";
  const suspicious = score >= 35 || category === "MODERATE";
  const tone = dangerous ? "danger" : suspicious ? "warning" : "success";
  const Icon = dangerous ? AlertOctagon : suspicious ? AlertTriangle : CheckCircle2;
  const label = dangerous ? "High risk" : suspicious ? "Caution" : "Clean";
  return <span className={`status-badge status-badge-${tone}`}><Icon className="h-3.5 w-3.5" aria-hidden="true" />{label} ({score}/100)</span>;
}

export function ScannerHero({ urlInput, scanning, validationError, scanError, scanResult, onInputChange, onSubmit, onPreset, onClear }: ScannerHeroProps) {
  return (
    <section className="surface-card overflow-hidden p-5 sm:p-7 lg:p-8">
      <div className="flex items-start gap-3">
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary sm:flex"><ShieldCheck className="h-5 w-5" /></div>
        <div>
          <p className="eyebrow">Website risk analysis</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Check before you click.</h2>
          <p className="mt-1 text-sm text-muted-foreground">Analyze websites for phishing, scams and malicious activity.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-7 space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input aria-label="Website URL or domain" value={urlInput} onChange={(event) => onInputChange(event.target.value)} placeholder="Enter website URL or domain" className="field-input pl-10 pr-10 font-mono" />
            {urlInput && <button type="button" onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear website URL"><X className="h-4 w-4" /></button>}
          </div>
          <button type="submit" disabled={scanning || !urlInput.trim()} className="primary-button min-h-11 shrink-0 lg:px-6">
            {scanning ? <><Loader2 className="h-4 w-4 animate-spin" />Scanning website...</> : <><Shield className="h-4 w-4" />Scan website</>}
          </button>
        </div>
        {validationError && <div role="alert" className="feedback feedback-danger"><AlertTriangle className="h-4 w-4 shrink-0" />{validationError}</div>}
        {scanError && <div role="alert" className="feedback feedback-danger"><AlertOctagon className="h-4 w-4 shrink-0" />{scanError}</div>}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className="mr-1">Try a safe test:</span>{["github.com", "paypal-security-update.xyz", "cloudflare.com"].map((preset) => <button key={preset} type="button" onClick={() => onPreset(preset)} className="chip-button font-mono">{preset}</button>)}</div>
        <p className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-success" />Your URL is analyzed securely and is not shared publicly.</p>
      </form>

      {scanResult && <div className="mt-6 rounded-xl border border-border bg-background/50 p-4 sm:p-5">
        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2.5"><div className="icon-tile"><Globe className="h-4 w-4" /></div><div className="min-w-0"><span className="block text-xs text-muted-foreground">Scanned target</span><span className="block truncate font-mono text-sm font-medium text-foreground">{scanResult.domain || scanResult.url}</span></div></div>
          <div className="flex flex-wrap items-center gap-2"><Verdict score={scanResult.risk_score} category={scanResult.risk_category} /><Link href={`/scanner?url=${encodeURIComponent(scanResult.url)}`} className="secondary-button">Full report<ArrowRight className="h-3.5 w-3.5" /></Link></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">{[
          ["SSL status", scanResult.ssl_valid === true ? "Valid certificate" : scanResult.ssl_valid === false ? "Invalid certificate" : "Not applicable"],
          ["Phishing risk", scanResult.is_phishing ? "Flagged threat" : "No phishing detected"],
          ["Malware engine", scanResult.is_malware ? "Malicious hit" : "No signatures"],
          ["Audit time", scanResult.scan_duration_ms ? `${scanResult.scan_duration_ms}ms` : "< 1s"],
        ].map(([label, value]) => <div key={label} className="rounded-lg border border-border bg-surface p-3"><span className="block text-[11px] text-muted-foreground">{label}</span><span className="mt-1 block text-xs font-medium text-foreground">{value}</span></div>)}</div>
      </div>}
    </section>
  );
}
