import { Activity, AlertOctagon, AlertTriangle, CheckCircle2 } from "lucide-react";

interface SecurityMetricsProps { loading: boolean; total: number | null; safe: number | null; suspicious: number | null; dangerous: number | null; }

const metrics = [
  { key: "total", label: "Total scans", icon: Activity, tone: "text-foreground" },
  { key: "safe", label: "Safe websites", icon: CheckCircle2, tone: "text-success" },
  { key: "suspicious", label: "Suspicious websites", icon: AlertTriangle, tone: "text-warning" },
  { key: "dangerous", label: "Dangerous websites", icon: AlertOctagon, tone: "text-danger" },
] as const;

export function SecurityMetrics({ loading, total, safe, suspicious, dangerous }: SecurityMetricsProps) {
  const values = { total, safe, suspicious, dangerous };
  return <section aria-label="Security metrics" className="space-y-2"><p className="text-xs text-muted-foreground">Threat classifications reflect the recent activity window. Lifetime category totals are not exposed by the current API.</p><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{metrics.map(({ key, label, icon: Icon, tone }) => <article key={key} className="surface-card flex min-h-28 items-start justify-between p-4 sm:p-5"><div><span className="text-xs font-medium text-muted-foreground">{label}</span><div className={`mt-2 text-2xl font-semibold tracking-tight ${tone}`}>{loading ? <span className="inline-block h-7 w-10 animate-pulse rounded bg-border" /> : values[key] === null ? "—" : values[key]?.toLocaleString()}</div></div><Icon className={`h-4 w-4 ${tone}`} aria-hidden="true" /></article>)}</div></section>;
}
