import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "CYBERCORE — AI-Powered Digital Security Platform",
    template: "%s | CYBERCORE",
  },
  description:
    "Detect online scams, analyze suspicious websites, check password security, and protect your digital identity with CYBERCORE — your AI-powered cybersecurity platform.",
  keywords: [
    "cybersecurity", "phishing detector", "website scanner", "scam detector",
    "password security", "malware checker", "digital safety", "online security",
  ],
  authors: [{ name: "CYBERCORE Team" }],
  creator: "CYBERCORE",
  metadataBase: new URL("https://cybercore.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cybercore.app",
    siteName: "CYBERCORE",
    title: "CYBERCORE — AI-Powered Digital Security Platform",
    description: "Detect online scams, analyze suspicious websites, and protect your digital identity.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CYBERCORE — AI-Powered Digital Security Platform",
    description: "Detect online scams, analyze suspicious websites, and protect your digital identity.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { AppShell } from "@/components/layout/AppShell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0B0F14] text-[#F8FAFC] antialiased selection:bg-[#3B82F6]/25 selection:text-[#F8FAFC]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
