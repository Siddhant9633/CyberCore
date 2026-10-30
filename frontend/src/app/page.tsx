"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ScannerHero } from "@/components/dashboard/ScannerHero";
import { SecurityMetrics } from "@/components/dashboard/SecurityMetrics";
import { RecentActivity, type RecentScan } from "@/components/dashboard/RecentActivity";
import { SecurityTools } from "@/components/dashboard/SecurityTools";
import { getDashboardStats, getRecentActivity, scanUrl, type DashboardStats, type ScanResult } from "@/lib/api";

function validateUrl(input: string): { isValid: boolean; normalized: string; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) return { isValid: false, normalized: "", error: "Please enter a website URL or domain name to scan." };
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const hostname = new URL(candidate).hostname;
    if (!hostname.includes(".") && hostname !== "localhost") return { isValid: false, normalized: "", error: "Please enter a valid domain (e.g. example.com or https://example.com)." };
    if (!/^[a-zA-Z0-9.-]+$/.test(hostname)) return { isValid: false, normalized: "", error: "The domain name contains invalid characters." };
    return { isValid: true, normalized: trimmed };
  } catch { return { isValid: false, normalized: "", error: "Please enter a valid website URL or domain." }; }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return date.toDateString() === new Date().toDateString() ? `Today, ${time}` : `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
}

export default function HomePage() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [loadingTelemetry, setLoadingTelemetry] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getDashboardStats().catch(() => null), getRecentActivity().catch(() => ({ recent_scans: [] }))]).then(([statsData, recentData]) => {
      if (!mounted) return;
      if (statsData) setStats(statsData);
      if (Array.isArray(recentData?.recent_scans)) setRecentScans(recentData.recent_scans as RecentScan[]);
      setLoadingTelemetry(false);
    });
    return () => { mounted = false; };
  }, []);

  const handleScanSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setValidationError(null); setScanError(null);
    const validation = validateUrl(urlInput);
    if (!validation.isValid) { setValidationError(validation.error || "Invalid URL."); return; }
    setScanning(true); setScanResult(null);
    try { setScanResult(await scanUrl(validation.normalized)); } catch (error) { setScanError(error instanceof Error ? error.message : "Failed to analyze target website. Please check the backend connection."); } finally { setScanning(false); }
  };

  const handleInputChange = (value: string) => { setUrlInput(value); setValidationError(null); setScanError(null); };
  const handleClear = () => { setUrlInput(""); setScanResult(null); setValidationError(null); setScanError(null); };
  const recentScores = recentScans.map((scan) => Number(scan.risk_score)).filter(Number.isFinite);

  return <div className="mx-auto max-w-[1200px] space-y-8 pb-16 sm:space-y-10">
    <DashboardHeader />
    <ScannerHero urlInput={urlInput} scanning={scanning} validationError={validationError} scanError={scanError} scanResult={scanResult} onInputChange={handleInputChange} onSubmit={handleScanSubmit} onPreset={handleInputChange} onClear={handleClear} />
    <SecurityMetrics loading={loadingTelemetry} total={stats?.total_scans_today ?? null} safe={loadingTelemetry ? null : recentScores.length ? recentScores.filter((score) => score < 35).length : null} suspicious={loadingTelemetry ? null : recentScores.length ? recentScores.filter((score) => score >= 35 && score < 70).length : null} dangerous={loadingTelemetry ? null : recentScores.length ? recentScores.filter((score) => score >= 70).length : null} />
    <SecurityTools />
    <RecentActivity scans={recentScans} formatDate={formatDate} />
  </div>;
}
