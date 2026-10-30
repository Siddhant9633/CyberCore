"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Shield } from "lucide-react";

/**
 * Inline URL scanner for the homepage hero.
 * Quick scan that redirects to the full scanner page with results.
 */
export function URLScannerInline() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    // Navigate to the scanner page with the URL as a query param
    router.push(`/scanner?url=${encodeURIComponent(url.trim())}`);
  };

  return (
    <form onSubmit={handleScan} className="relative">
      <div className="border-animated rounded-xl">
        <div className="flex items-center gap-3 p-2 glass rounded-xl border border-cyber-border">
          <div className="flex-shrink-0 pl-2">
            <Shield className="w-5 h-5 text-cyber-green/60" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter any URL to check — e.g. https://example.com"
            className="flex-1 bg-transparent text-white placeholder-cyber-gray-500 text-sm outline-none py-3"
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="flex-shrink-0 btn-cyber-primary py-3 px-5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Scan</span>
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-cyber-gray-500 text-center">
        URL analysis · No account required · Privacy-respecting
      </p>
    </form>
  );
}
