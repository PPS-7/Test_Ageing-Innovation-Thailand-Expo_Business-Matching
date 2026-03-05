"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/context/LangContext";
import ContextBar from "@/components/ContextBar";
import ExhibitorCard from "@/components/ExhibitorCard";
import { exhibitors, PILLARS } from "@/lib/mockData";
import type { Exhibitor } from "@/lib/types";

export default function DirectoryPage() {
  const { lang, t } = useLang();
  const [search, setSearch] = useState("");
  const [activePillar, setActivePillar] = useState<string>("all");

  const filtered: Exhibitor[] = useMemo(() => {
    let list = exhibitors;
    if (activePillar !== "all") {
      list = list.filter((e) => e.pillar === activePillar);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.name_th.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          e.sub_category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activePillar]);

  return (
    <>
      <ContextBar
        crumbs={[
          { label_key: "ctx_bm", href: "/" },
          { label_key: "ctx_directory" },
        ]}
      />

      {/* ── Hero ── */}
      <section className="relative bg-hero-gradient hex-pattern overflow-hidden">
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-8 -left-8 w-40 h-40 rounded-full bg-accent-cyan/5 pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20
                          text-white text-[11px] font-bold tracking-widest uppercase
                          px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            🤝 {t("hero_eyebrow")}
          </div>

          <h1 className="font-display font-black text-[28px] sm:text-[36px] text-white leading-tight uppercase mb-2">
            {t("hero_h1a")}{" "}
            <span className="text-accent-cyan">{t("hero_h1b")}</span>
            <br />
            {t("hero_h1c")}
          </h1>

          <p className="text-[13px] text-white/80 font-medium mb-6">{t("hero_sub")}</p>

          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { icon: "📅", label: t("hero_chip_dates") },
              { icon: "⏰", label: "10:00–18:00" },
              { icon: "📍", label: t("hero_chip_venue") },
              { icon: "🏆", label: t("hero_chip_theme") },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 bg-white/15 border border-white/20
                           text-white text-[12px] font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-sm"
              >
                {icon} {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Search & Filters ── */}
      <div className="bg-white border-b border-card-border sticky top-[68px] z-30 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex gap-2 mb-2.5">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray/40 pointer-events-none"
                width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search_placeholder")}
                className="field pl-9 text-[13.5px] h-10"
              />
            </div>
            <button className="px-5 h-10 bg-primary hover:bg-primary-dark text-white rounded
                               text-[13px] font-bold transition-colors whitespace-nowrap shadow-btn">
              {t("search_btn")}
            </button>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setActivePillar("all")}
              className={`px-3 py-1 rounded-full text-[11.5px] font-semibold border transition-all ${
                activePillar === "all"
                  ? "bg-primary border-primary text-white"
                  : "bg-white border-card-border text-text-gray hover:border-primary hover:text-primary"
              }`}
            >
              {t("filter_all")}
            </button>
            {PILLARS.map((p) => (
              <button
                key={p.key}
                onClick={() => setActivePillar(p.key)}
                className={`px-3 py-1 rounded-full text-[11.5px] font-semibold border transition-all ${
                  activePillar === p.key
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-card-border text-text-gray hover:border-primary hover:text-primary"
                }`}
              >
                {lang === "th" ? p.label_th : p.label_en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-[16px] text-dark-slate">
            {t("dir_heading")}
          </h2>
          <span className="bg-light-bg border border-card-border text-primary
                           text-[11.5px] font-bold px-3 py-1 rounded-full">
            {filtered.length} {t("dir_count_suffix")}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-text-gray">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-[15px] font-semibold">No exhibitors found</p>
            <p className="text-[13px] mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((e) => (
              <ExhibitorCard key={e.id} exhibitor={e} />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="bg-navy mt-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="font-display font-bold text-white text-[15px] mb-1">
            AGEING <span className="text-accent-cyan">INNOVATION</span> EXPO THAILAND{" "}
            <span className="text-accent-green">2026</span>
          </p>
          <p className="text-[12px] text-white/50 mb-0.5">{t("footer_event")}</p>
          <p className="text-[11px] text-white/35">{t("footer_organiser")}</p>
          <p className="text-[10px] text-white/25 font-mono mt-2">{t("footer_mockup")}</p>
        </div>
      </footer>
    </>
  );
}
