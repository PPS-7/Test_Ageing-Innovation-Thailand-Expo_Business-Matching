"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import ContextBar from "@/components/ContextBar";
import SlotGrid from "@/components/SlotGrid";
import { getExhibitor, getSlotsForExhibitor } from "@/lib/mockData";
import type { Slot } from "@/lib/types";

export default function ExhibitorProfilePage() {
  const { lang, t } = useLang();
  const params = useParams();
  const router = useRouter();
  const exhibitorId = params.id as string;

  const exhibitor = getExhibitor(exhibitorId);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedDayDisplay, setSelectedDayDisplay] = useState("");
  const [showSlotWarning, setShowSlotWarning] = useState(false);

  if (!exhibitor) {
    return (
      <div className="text-center py-20 text-text-gray">
        <p className="text-2xl mb-2">404</p>
        <p>Exhibitor not found.</p>
        <Link href="/" className="text-primary underline mt-4 block">Back to Directory</Link>
      </div>
    );
  }

  const totalSlots = getSlotsForExhibitor(exhibitorId).filter((s) => s.is_available).length;

  function handleSlotSelected(slot: Slot, dayDisplay: string) {
    setSelectedSlot(slot);
    setSelectedDayDisplay(dayDisplay);
    setShowSlotWarning(false);
  }

  function handleProceed() {
    if (!selectedSlot) { setShowSlotWarning(true); return; }
    router.push(`/book/${exhibitorId}/${selectedSlot.id}`);
  }

  return (
    <>
      <ContextBar
        crumbs={[
          { label_key: "ctx_bm", href: "/" },
          { label_key: "ctx_directory", href: "/" },
          { label_key: "ctx_profile" },
        ]}
      />

      {/* ── Back bar ── */}
      <Link
        href="/"
        className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-white border-b border-card-border
                   text-primary text-[13px] font-bold hover:bg-light-bg transition-colors"
      >
        ← {t("back_directory")}
      </Link>

      {/* ── Profile hero ── */}
      <section
        className="hex-pattern"
        style={{ background: `linear-gradient(135deg, #01003d, #011a4a)` }}
      >
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 flex gap-5 items-start">
          {/* Logo */}
          <div
            className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center
                       text-white font-display font-black text-2xl flex-shrink-0
                       border-2 border-white/20"
            style={{ background: exhibitor.logo_gradient }}
          >
            {exhibitor.logo_abbr}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold tracking-widest uppercase text-accent-cyan mb-1">
              {lang === "th" ? exhibitor.pillar_label_th : exhibitor.pillar_label}
            </p>
            <h1 className="font-display font-black text-[22px] sm:text-[26px] text-white uppercase leading-tight mb-2">
              {lang === "th" && exhibitor.name_th ? exhibitor.name_th : exhibitor.name}
            </h1>
            <p className="text-[13px] text-white/80 leading-relaxed mb-3">
              {lang === "th" && exhibitor.description_th ? exhibitor.description_th : exhibitor.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {exhibitor.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/15 border border-white/20 text-white px-2.5 py-0.5
                             rounded text-[11px] font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Meta bar ── */}
      <div className="bg-white border-b border-card-border">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-4 items-center text-[12.5px]">
          <span className="text-text-gray">📍 <strong className="text-dark-slate">Booth {exhibitor.booth_number}</strong></span>
          <a href={exhibitor.website_url} target="_blank" rel="noopener noreferrer"
             className="text-primary font-bold hover:underline">
            🌐 {exhibitor.website_url.replace("https://", "")}
          </a>
          <span className="flex items-center gap-1.5 text-status-green font-bold">
            <span className="dot-live" />
            {totalSlots} {t("profile_slots_avail")}
          </span>
          <span className="bg-status-amber-bg text-status-amber text-[10.5px] font-bold
                           px-2 py-0.5 rounded border border-amber-100">
            {t("profile_session_tbc")}
          </span>
        </div>
      </div>

      {/* ── Slot picker ── */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-5">
        {/* How-to banner */}
        <div className="flex gap-3 bg-light-bg border border-card-border rounded-xl p-4 mb-5">
          <span className="text-xl flex-shrink-0">📌</span>
          <p className="text-[12.5px] text-text-gray leading-relaxed">
            <strong className="text-dark-slate">{t("slot_how_heading")}</strong>{" "}
            {t("slot_how_body")}
          </p>
        </div>

        <SlotGrid exhibitorId={exhibitorId} onSlotSelected={handleSlotSelected} />

        {/* Selected slot summary */}
        {selectedSlot && (
          <div className="mt-4 p-3 bg-status-blue-bg border border-blue-200 rounded-lg text-[12.5px] text-status-blue font-semibold">
            ✓ Selected:{" "}
            {selectedDayDisplay} · {selectedSlot.start_time}–{selectedSlot.end_time}
          </div>
        )}

        {showSlotWarning && (
          <p className="mt-2 text-[12.5px] text-status-red font-semibold">{t("slot_select_first")}</p>
        )}

        {/* Proceed button */}
        <button
          onClick={handleProceed}
          className="mt-5 w-full max-w-sm mx-auto block py-3.5 rounded-lg text-white
                     font-display font-bold text-[14px] uppercase tracking-wide shadow-btn
                     transition-all hover:shadow-lg hover:-translate-y-0.5 bg-cta-gradient"
        >
          {t("slot_proceed")}
        </button>
      </div>
    </>
  );
}
