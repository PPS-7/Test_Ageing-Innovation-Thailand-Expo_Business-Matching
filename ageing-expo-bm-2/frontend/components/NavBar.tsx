"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/context/LangContext";

export default function NavBar() {
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();

  const navItems = [
    { href: "/",      label_key: "nav_directory" as const },
    { href: "/admin", label_key: "nav_admin"    as const },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-[0_2px_20px_rgba(1,0,61,0.5)]">
      <nav className="flex items-center justify-between gap-3 px-4 sm:px-6 h-[68px] max-w-[1280px] mx-auto">

        {/* ── Brand logo ── */}
        <Link href="/" className="flex-shrink-0 flex flex-col leading-none group">
          <span className="font-display font-bold text-[15px] tracking-wide text-white group-hover:text-accent-cyan transition-colors">
            AGEING{" "}
            <span className="text-accent-cyan">INNOVATION</span>{" "}
            EXPO
          </span>
          <span className="font-display font-semibold text-[11px] tracking-widest text-white/60">
            THAILAND{" "}
            <span className="text-accent-green">2026</span>
          </span>
        </Link>

        {/* ── Divider ── */}
        <div className="hidden sm:block w-px h-9 bg-navy-border flex-shrink-0" />

        {/* ── Platform label ── */}
        <div className="hidden sm:block flex-shrink-0">
          <p className="text-[10px] text-white/40 leading-none uppercase tracking-widest">Platform</p>
          <p className="text-[13px] font-bold text-accent-cyan leading-tight">{t("nav_bm_label")}</p>
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Nav links ── */}
        <div className="hidden sm:flex items-center gap-1">
          {navItems.map(({ href, label_key }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded text-[12.5px] font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {t(label_key)}
              </Link>
            );
          })}
        </div>

        {/* ── Language toggle ── */}
        <div className="flex items-center gap-0.5 bg-white/10 rounded p-0.5 ml-2 flex-shrink-0">
          {(["en", "th"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2.5 py-1 text-[11.5px] font-bold rounded transition-all ${
                lang === l
                  ? "bg-primary text-white shadow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
