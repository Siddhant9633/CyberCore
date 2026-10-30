"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Menu, X, ChevronDown, Globe, Lock, MessageSquare,
  Server, FileCheck, LayoutDashboard, Bot, Info, ArrowUpRight,
  Activity, CheckCircle2, Terminal
} from "lucide-react";
import { Chrome } from "@/components/ui/BrandIcons";

const navTools = [
  {
    category: "Primary Detection Engines",
    items: [
      { label: "Website Scanner", href: "/scanner", icon: Globe, desc: "Real-time URL, SSL & DNS threat audit" },
      { label: "Password Vault Audit", href: "/password", icon: Lock, desc: "k-Anonymity breach check & entropy gauge" },
      { label: "Message & SMS Triage", href: "/messages", icon: MessageSquare, desc: "Phishing, OTP & social engineering detection" },
    ]
  },
  {
    category: "Deep Security Intelligence",
    items: [
      { label: "IP & Domain Lookup", href: "/ip-domain", icon: Server, desc: "Authoritative nameservers & RDAP age" },
      { label: "File Security & Malware", href: "/file-security", icon: FileCheck, desc: "Double extension & signature inspection" },
      { label: "CYBERCORE AI Advisor", href: "/ai", icon: Bot, desc: "Conversational incident response triage" },
    ]
  }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setToolsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050811]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-b border-white/[0.04]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 group-hover:shadow-sky-500/40 transition-all duration-300">
              <Shield className="w-5 h-5 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#050811]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  CYBERCORE
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-sky-400 border border-white/[0.08] tracking-widest font-semibold uppercase">
                  ENTERPRISE
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 tracking-tight">AI DEFENSE PLATFORM</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Tools Mega Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  toolsOpen || pathname.startsWith("/scanner") || pathname.startsWith("/password") || pathname.startsWith("/messages")
                    ? "text-white bg-white/[0.08]"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span>Security Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? "rotate-180 text-sky-400" : "text-slate-500"}`} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-[580px] mt-2 p-5 rounded-2xl bg-[#090e1c]/95 border border-white/[0.1] backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] grid grid-cols-2 gap-6"
                  >
                    {navTools.map((col, idx) => (
                      <div key={idx} className="space-y-3">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block pb-1 border-b border-white/[0.06]">
                          {col.category}
                        </span>
                        <div className="space-y-1.5">
                          {col.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all group/item ${
                                  isActive
                                    ? "bg-sky-500/15 border border-sky-500/30"
                                    : "hover:bg-white/[0.05] border border-transparent"
                                }`}
                              >
                                <div className={`p-2 rounded-lg shrink-0 mt-0.5 transition-colors ${
                                  isActive ? "bg-sky-500 text-white" : "bg-white/[0.05] text-slate-300 group-hover/item:text-sky-300 group-hover/item:bg-white/[0.08]"
                                }`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className={`text-xs font-semibold block transition-colors ${
                                    isActive ? "text-sky-300" : "text-slate-200 group-hover/item:text-white"
                                  }`}>
                                    {item.label}
                                  </span>
                                  <span className="text-[11px] text-slate-400 leading-snug line-clamp-1">
                                    {item.desc}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                pathname === "/dashboard"
                  ? "text-sky-300 bg-sky-500/10 border border-sky-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
              <span>Command Center</span>
            </Link>

            <Link
              href="/ai"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                pathname === "/ai"
                  ? "text-sky-300 bg-sky-500/10 border border-sky-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-slate-400" />
              <span>AI Advisor</span>
            </Link>

            <Link
              href="/about"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                pathname === "/about"
                  ? "text-sky-300 bg-sky-500/10 border border-sky-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Architecture</span>
            </Link>
          </nav>

          {/* Right Action: Extension CTA & Threat Telemetry Status */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Live Shield Pip */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wide">CORE DEFENSE: ONLINE</span>
            </div>

            {/* Extension Download Button */}
            <Link
              href="/extension"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-sky-500/20 transition-all hover:shadow-sky-500/35"
            >
              <Chrome className="w-3.5 h-3.5" />
              <span>Browser Shield</span>
              <ArrowUpRight className="w-3 h-3 opacity-75" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl bg-white/[0.06] text-slate-300 hover:text-white border border-white/[0.08]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#070b15] border-b border-white/[0.08] px-4 py-6 space-y-4"
          >
            <div className="space-y-1">
              <Link
                href="/scanner"
                className="block p-3 rounded-xl bg-white/[0.04] text-sm font-semibold text-white"
              >
                Website Threat Scanner
              </Link>
              <Link
                href="/password"
                className="block p-3 rounded-xl bg-white/[0.04] text-sm font-semibold text-white"
              >
                Password Security & Breach Audit
              </Link>
              <Link
                href="/messages"
                className="block p-3 rounded-xl bg-white/[0.04] text-sm font-semibold text-white"
              >
                Message & Email Scam Detector
              </Link>
              <Link
                href="/ip-domain"
                className="block p-3 rounded-xl bg-white/[0.04] text-sm font-semibold text-white"
              >
                IP & Domain Reputation
              </Link>
              <Link
                href="/file-security"
                className="block p-3 rounded-xl bg-white/[0.04] text-sm font-semibold text-white"
              >
                File Malware & Signature Checker
              </Link>
              <Link
                href="/ai"
                className="block p-3 rounded-xl bg-white/[0.04] text-sm font-semibold text-white"
              >
                CYBERCORE AI Cybersecurity Advisor
              </Link>
              <Link
                href="/dashboard"
                className="block p-3 rounded-xl bg-white/[0.04] text-sm font-semibold text-white"
              >
                Command Center Dashboard
              </Link>
              <Link
                href="/extension"
                className="block p-3 rounded-xl bg-sky-500/20 text-sm font-semibold text-sky-300 border border-sky-500/30"
              >
                Chrome Browser Extension
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
