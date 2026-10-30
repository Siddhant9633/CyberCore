import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CYBERCORE Design System
        cyber: {
          black: "#050507",
          dark: "#0a0a0f",
          surface: "#0f0f1a",
          border: "#1a1a2e",
          green: "#00ff88",
          "green-dim": "#00cc6a",
          blue: "#0088ff",
          cyan: "#00d4ff",
          red: "#ff3366",
          orange: "#ff6600",
          yellow: "#ffcc00",
          purple: "#7c3aed",
          gray: {
            100: "#e4e4f0",
            200: "#c8c8d8",
            300: "#9898b8",
            400: "#6868a0",
            500: "#404060",
            600: "#2a2a48",
            700: "#1e1e38",
            800: "#141428",
            900: "#0a0a18",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "cyber-gradient": "linear-gradient(135deg, #050507 0%, #0a0a0f 50%, #050507 100%)",
        "green-glow": "radial-gradient(ellipse at center, rgba(0,255,136,0.15) 0%, transparent 70%)",
        "blue-glow": "radial-gradient(ellipse at center, rgba(0,136,255,0.15) 0%, transparent 70%)",
        "grid-pattern": `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(0,255,136,0.04)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
      },
      animation: {
        "pulse-green": "pulse-green 2s ease-in-out infinite",
        "scan-line": "scan-line 2s linear infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "typing": "typing 3.5s steps(40, end)",
      },
      keyframes: {
        "pulse-green": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0,255,136,0.3)" },
          "50%": { boxShadow: "0 0 24px rgba(0,255,136,0.7)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "typing": {
          from: { width: "0" },
          to: { width: "100%" },
        },
      },
      boxShadow: {
        "cyber-green": "0 0 20px rgba(0,255,136,0.2), 0 0 40px rgba(0,255,136,0.1)",
        "cyber-blue": "0 0 20px rgba(0,136,255,0.2), 0 0 40px rgba(0,136,255,0.1)",
        "cyber-red": "0 0 20px rgba(255,51,102,0.2), 0 0 40px rgba(255,51,102,0.1)",
        "glass": "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      borderColor: {
        "cyber-green": "rgba(0,255,136,0.3)",
        "cyber-blue": "rgba(0,136,255,0.3)",
        "cyber-border": "rgba(26,26,46,1)",
      },
    },
  },
  plugins: [],
};

export default config;
