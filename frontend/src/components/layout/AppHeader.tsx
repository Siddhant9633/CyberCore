"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, Shield } from "lucide-react";
import Link from "next/link";

interface AppHeaderProps {
  onMobileMenuOpen: () => void;
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/scanner": "URL Scanner",
  "/messages": "Email & SMS Scanner",
  "/password": "Password Security",
  "/ip-domain": "Domain & IP Intelligence",
  "/file-security": "File Scanner",
  "/extension": "Browser Protection",
  "/ai": "AI Security Assistant",
  "/history": "Scan History",
  "/settings": "Settings",
};

export function AppHeader({ onMobileMenuOpen }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const title = pageTitles[pathname] || "Dashboard";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    if (q.startsWith("http") || q.includes(".")) {
      router.push(`/scanner?url=${encodeURIComponent(q)}`);
    } else {
      router.push(`/history`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Page Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#64748B] hidden sm:inline">CYBERCORE</span>
          <span className="text-[#64748B] hidden sm:inline">/</span>
          <span className="font-semibold text-[#F8FAFC] text-sm">{title}</span>
        </div>
      </div>

      {/* Right: Search, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative hidden sm:block w-48 md:w-64">
          <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or enter URL..."
            className="w-full bg-[#151C26] border border-[#1E2633] hover:border-[#2A3649] focus:border-[#3B82F6] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none transition"
          />
        </form>

        <Link href="/settings" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-primary transition hover:border-primary" title="Open settings" aria-label="Open settings">
          <Shield className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
