"use client";

import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { FloatingAIChatbot } from "@/components/ai/FloatingAIChatbot";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F8FAFC] flex">
      {/* 240px Fixed/Collapsible Sidebar in Document Flow */}
      <AppSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Viewport Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onMobileMenuOpen={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-10 xl:p-12 max-w-[1480px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating AI Chatbot (Closed by default) */}
      <FloatingAIChatbot />
    </div>
  );
}
