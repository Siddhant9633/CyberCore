"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, Bell, Shield } from "lucide-react";
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
    <header className="h-14 border-b border-[#1E2633] bg-[#0B0F14]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Page Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151C26] md:hidden cursor-pointer"
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
            className="w-full bg-[#151C26] border border-[#1E2633] hover:border-[#2A3649] focus:border-[#3B82F6] rounded-lg pr-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none transition"
            style={{ paddingLeft: "2.25rem" }}
          />
        </form>

        {/* Notifications Icon */}
        <Link
          href="/history"
          className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151C26] transition relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
        </Link>

        {/* User Profile Pill */}
        <Link
          href="/settings"
          className="flex items-center gap-2 pl-1.5 py-1 pr-2 rounded-lg hover:bg-[#151C26] transition cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-[#1B2430] border border-[#1E2633] flex items-center justify-center text-[#3B82F6] text-[11px] font-medium">
            AM
          </div>
          <span className="text-xs font-medium text-[#F8FAFC] hidden md:inline">Alex Mitchell</span>
        </Link>
      </div>
    </header>
  );
}
