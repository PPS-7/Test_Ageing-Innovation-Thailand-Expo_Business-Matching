import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Live site brand palette (ageinginnovationexpo.com) ── */
        primary:            "#046bd2",
        "primary-dark":     "#045cb4",
        navy:               "#01003d",
        "navy-mid":         "#0e0e27",
        "navy-border":      "#11116b",
        "accent-green":     "#5ccc00",
        "accent-cyan":      "#75d0fa",
        /* ── Neutral / layout ── */
        "dark-slate":       "#1e293b",
        "text-gray":        "#334155",
        "light-bg":         "#f0f5fa",
        "card-border":      "#e2e8f0",
        /* ── Status colours ── */
        "status-green":     "#16a34a",
        "status-green-bg":  "#f0fdf4",
        "status-blue":      "#1d4ed8",
        "status-blue-bg":   "#eff6ff",
        "status-amber":     "#d97706",
        "status-amber-bg":  "#fffbeb",
        "status-red":       "#dc2626",
        "status-red-bg":    "#fef2f2",
      },
      fontFamily: {
        sans:    ["Noto Sans Thai", "Inter", "sans-serif"],
        display: ["Noto Sans Thai", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "navy-gradient": "linear-gradient(135deg, #01003d 0%, #0e0e27 50%, #011a4a 100%)",
        "hero-gradient": "linear-gradient(160deg, #01003d 0%, #011a4a 40%, #012b6b 100%)",
        "cta-gradient":  "linear-gradient(135deg, #046bd2, #0384ff)",
      },
      boxShadow: {
        card:        "0 2px 12px rgba(1, 0, 61, 0.08)",
        "card-hover":"0 8px 32px rgba(1, 0, 61, 0.18)",
        btn:         "0 4px 14px rgba(4, 107, 210, 0.30)",
      },
    },
  },
  plugins: [],
};

export default config;
