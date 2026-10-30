import Link from "next/link";
import { Shield, Globe, Lock, MessageSquare, Server, FileCheck, CheckCircle2, Cpu, ExternalLink } from "lucide-react";
import { Github, Twitter } from "@/components/ui/BrandIcons";

const footerLinks = {
  "Detection Modules": [
    { label: "Website Threat Scanner", href: "/scanner" },
    { label: "Password Vault & Breach Audit", href: "/password" },
    { label: "Social Engineering & Phishing", href: "/messages" },
    { label: "IP & Authoritative DNS", href: "/ip-domain" },
    { label: "File Signature & Binary Analysis", href: "/file-security" },
  ],
  "Platform & Ecosystem": [
    { label: "Security Command Center", href: "/dashboard" },
    { label: "Chrome Security Extension", href: "/extension" },
    { label: "CYBERCORE AI Advisor", href: "/ai" },
    { label: "REST API Documentation", href: "http://localhost:8000/api/docs" },
    { label: "Architecture Manifesto", href: "/about" },
  ],
  "Security Principles": [
    { label: "Zero-Knowledge k-Anonymity", href: "/about#zero-knowledge" },
    { label: "Transient Memory Processing", href: "/about#privacy" },
    { label: "SSRF Network Boundary Isolation", href: "/about#ssrf" },
    { label: "Deterministic Threat Attribution", href: "/about#heuristics" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#04060d] text-slate-400 text-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight text-white">
                  CYBERCORE
                </span>
                <span className="text-[10px] font-mono text-slate-500 tracking-wider">
                  ENTERPRISE THREAT INTELLIGENCE
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Unified AI-powered cybersecurity defense platform protecting users against phishing campaigns, credential exposure, malicious domains, and zero-day threats.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Security Systems Operational</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-3">
              <h4 className="text-white text-xs font-mono font-semibold uppercase tracking-wider">
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-sky-300 transition-colors text-xs flex items-center gap-1.5"
                    >
                      <span>{link.label}</span>
                      {link.href.startsWith("http") && <ExternalLink className="w-3 h-3 opacity-60" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500 font-mono">
            © {new Date().getFullYear()} CYBERCORE Systems Inc. Cryptographic integrity verified.
          </p>
          <div className="flex items-center gap-6 text-[11px] text-slate-500 font-mono">
            <span>VirusTotal · Google Safe Browsing · URLhaus · HIBP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
