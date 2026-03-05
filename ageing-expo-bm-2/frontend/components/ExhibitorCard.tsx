"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import type { Exhibitor } from "@/lib/types";

interface Props {
  exhibitor: Exhibitor;
}

export default function ExhibitorCard({ exhibitor: e }: Props) {
  const { lang, t } = useLang();

  return (
    <Link
      href={`/exhibitor/${e.id}`}
      className="group block bg-white rounded-xl border border-card-border shadow-card
                 hover:shadow-card-hover hover:-translate-y-1 hover:border-primary
                 transition-all duration-200 overflow-hidden"
    >
      {/* Colour accent bar */}
      <div
        className="h-1 w-full transition-transform duration-200 origin-left scale-x-0 group-hover:scale-x-100"
        style={{ background: e.logo_gradient }}
      />

      <div className="p-5">
        {/* Logo avatar */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center
                     text-white font-display font-black text-lg mb-3 flex-shrink-0"
          style={{ background: e.logo_gradient }}
        >
          {e.logo_abbr}
        </div>

        {/* Name */}
        <p className="font-display font-bold text-[14px] text-dark-slate leading-snug mb-1">
          {lang === "th" && e.name_th ? e.name_th : e.name}
        </p>

        {/* Category */}
        <p
          className="text-[11px] font-semibold uppercase tracking-wide mb-2"
          style={{ color: e.logo_color }}
        >
          {lang === "th" ? e.pillar_label_th : e.pillar_label}
        </p>

        {/* Description */}
        <p className="text-[12px] text-text-gray leading-relaxed line-clamp-2 mb-3">
          {lang === "th" && e.description_th ? e.description_th : e.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1.5 text-[11.5px] text-status-green font-bold">
            <span className="dot-live" />
            {e.available_slots_count} {t("card_slots_open")}
          </span>
          <span className="text-[10.5px] text-text-gray bg-light-bg px-2 py-0.5 rounded">
            {t("card_booth")} {e.booth_number}
          </span>
        </div>

        {/* CTA button */}
        <div
          className="w-full py-2 rounded text-center text-white text-[12.5px] font-bold
                     transition-all duration-150 group-hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${e.logo_color}, ${e.logo_color}cc)` }}
        >
          {t("card_view_book")}
        </div>
      </div>
    </Link>
  );
}
