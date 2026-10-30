"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield, LayoutDashboard, Globe, MessageSquare, Lock,
  Server, FileCheck, Bot, History, Settings,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Chrome } from "@/components/ui/BrandIcons";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const NAVIGATION_SECTIONS: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "SECURITY TOOLS",
    items: [
      { label: "URL Scanner", href: "/scanner", icon: Globe },
      { label: "Email & SMS Scanner", href: "/messages", icon: MessageSquare },
      { label: "Password Security", href: "/password", icon: Lock },
      { label: "Domain & IP Intelligence", href: "/ip-domain", icon: Server },
      { label: "File Scanner", href: "/file-security", icon: FileCheck },
    ],
  },
  {
    title: "PROTECTION",
    items: [
      { label: "Browser Protection", href: "/extension", icon: Chrome },
      { label: "AI Security Assistant", href: "/ai", icon: Bot },
    ],
  },
  {
    title: "GENERAL",
    items: [
      { label: "Scan History", href: "/history", icon: History },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AppSidebarProps) {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onMobileClose}
        />
      )}

      {/* 220px Fixed/Collapsible Sidebar in Document Flow */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 flex flex-col bg-[#10151D] border-r border-[#1E2633] transition-all duration-200 ${
          collapsed ? "w-16" : "w-[220px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand / Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-[#1E2633]">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-[#3B82F6] flex items-center justify-center text-white shrink-0 shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            {!collapsed && (
              <span className="font-semibold text-sm tracking-tight text-[#F8FAFC]">
                CYBERCORE
              </span>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggle}
            className="hidden md:flex p-1.5 rounded-md text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151C26] transition cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5">
          {NAVIGATION_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              {!collapsed && (
                <div className="px-2 text-[10px] font-semibold tracking-wider text-[#64748B] uppercase">
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onMobileClose()}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                        active
                          ? "bg-[#151C26] text-[#F8FAFC] font-semibold border border-[#1E2633]"
                          : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151C26]/60 border border-transparent"
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          active ? "text-[#3B82F6]" : "text-[#94A3B8]"
                        }`}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>


      </aside>
    </>
  );
}
