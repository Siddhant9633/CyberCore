import { ShieldCheck } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-primary">
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        <span>Security overview</span>
      </div>
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
        Your digital security, under control.
      </h1>
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
        Identify suspicious websites and understand online threats before they affect you.
      </p>
    </header>
  );
}
