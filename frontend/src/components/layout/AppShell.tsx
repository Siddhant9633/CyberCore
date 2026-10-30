"use client";

import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { FloatingAIChatbot } from "@/components/ai/FloatingAIChatbot";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground md:flex">
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

        <main className="min-w-0 w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9 xl:px-10">
          {children}
        </main>
      </div>

      {/* Floating AI Chatbot (Closed by default) */}
      <FloatingAIChatbot />
    </div>
  );
}
