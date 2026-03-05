"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { EVENT_DAYS, getSlotsForDay } from "@/lib/mockData";
import type { Slot } from "@/lib/types";

interface Props {
  exhibitorId: string;
  onSlotSelected?: (slot: Slot, dayDisplay: string) => void;
}

export default function SlotGrid({ exhibitorId, onSlotSelected }: Props) {
  const { lang, t } = useLang();
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const activeDay = EVENT_DAYS[activeDayIdx];
  const slots = getSlotsForDay(exhibitorId, activeDay.date);

  function handleSlotClick(slot: Slot) {
    if (!slot.is_available) return;
    setSelectedSlotId(slot.id);
    onSlotSelected?.(slot, lang === "th" ? activeDay.day_display_th : activeDay.day_display_en);
  }

  return (
    <div>
      {/* ── Day tabs ── */}
      <p className="text-[13px] font-bold text-dark-slate mb-3">{t("slot_select_day")}</p>
      <div className="flex gap-2 mb-4 flex-wrap">
        {EVENT_DAYS.map((day, idx) => (
          <button
            key={day.date}
            onClick={() => { setActiveDayIdx(idx); setSelectedSlotId(null); }}
            className={`min-w-[76px] px-4 py-2.5 rounded-lg border-2 text-center transition-all duration-150 ${
              activeDayIdx === idx
                ? "bg-primary border-primary text-white font-bold"
                : "bg-white border-card-border text-text-gray hover:border-primary hover:text-primary"
            }`}
          >
            <span className="font-display font-black text-[22px] block leading-none">{day.day}</span>
            <span className="text-[11px]">{lang === "th" ? day.label_th : day.label_en}</span>
          </button>
        ))}
      </div>

      {/* ── Legend ── */}
      <div className="flex gap-4 mb-3 flex-wrap">
        {[
          { dot: "bg-white border-2 border-card-border", label: t("slot_legend_avail") },
          { dot: "bg-primary",                            label: t("slot_legend_sel") },
          { dot: "bg-[#e0e0e0]",                          label: t("slot_legend_bkd") },
        ].map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-[11px] text-text-gray">
            <span className={`w-3 h-3 rounded-sm ${dot}`} />
            {label}
          </div>
        ))}
      </div>

      {/* ── Slot grid ── */}
      {slots.length === 0 ? (
        <p className="text-[13px] text-text-gray py-4 text-center">{t("slot_no_slots")}</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
          {slots.map((slot) => {
            const isSelected = slot.id === selectedSlotId;
            const isBooked   = !slot.is_available;
            return (
              <button
                key={slot.id}
                disabled={isBooked}
                onClick={() => handleSlotClick(slot)}
                className={`py-2.5 px-2 rounded-lg border text-center transition-all duration-150 ${
                  isBooked
                    ? "bg-[#f5f5f5] border-[#e0e0e0] text-[#ccc] cursor-not-allowed"
                    : isSelected
                    ? "bg-primary border-primary text-white shadow-btn"
                    : "bg-white border-card-border text-dark-slate hover:border-primary hover:bg-light-bg hover:text-primary"
                }`}
              >
                <div className="text-[13px] font-bold">{slot.start_time}</div>
                <div className={`text-[9.5px] mt-0.5 ${isBooked ? "text-[#ddd]" : isSelected ? "text-white/80" : "text-text-gray"}`}>
                  {isBooked ? t("slot_booked") : isSelected ? t("slot_selected") : t("slot_available")}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
