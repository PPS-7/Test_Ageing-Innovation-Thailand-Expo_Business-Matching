"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import ContextBar from "@/components/ContextBar";
import QRDisplay from "@/components/QRDisplay";
import { buildGoogleCalURL, buildICS } from "@/lib/mockData";
import type { PendingBooking } from "@/lib/types";

export default function ConfirmationPage() {
  const { lang, t } = useLang();
  const params = useParams();
  const ref = params.ref as string;

  const [booking, setBooking] = useState<PendingBooking | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("pending_booking");
    if (raw) {
      try { setBooking(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  // If no booking in session (direct URL access), show placeholder data
  const b: PendingBooking = booking ?? {
    ref,
    exhibitor_id: "ex-001",
    exhibitor_name: "MedEase Technologies",
    exhibitor_name_th: "เมดอีส เทคโนโลยี",
    booth_number: "EH-047",
    slot_id: "s-demo",
    event_date: "2026-05-06",
    event_date_display: lang === "th" ? "วันพุธ 6 พ.ค. 2569" : "Wednesday, 6 May 2026",
    start_time: "14:00",
    end_time: "14:30",
    visitor_name: "Visitor",
    visitor_org: "Your Organisation",
    visitor_title: "Your Title",
    visitor_email: "you@example.com",
    table_number: "T-07",
  };

  const qrValue = `https://match.ageinginnovationexpo.com/checkin/${b.ref}`;
  const googleCalURL = buildGoogleCalURL({
    exhibitorName: b.exhibitor_name,
    date: b.event_date,
    startTime: b.start_time,
    endTime: b.end_time,
    ref: b.ref,
    tableNumber: b.table_number,
  });

  function handleICSDownload() {
    const ics = buildICS({
      exhibitorName: b.exhibitor_name,
      date: b.event_date,
      startTime: b.start_time,
      endTime: b.end_time,
      ref: b.ref,
      tableNumber: b.table_number,
    });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${b.ref}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const exhibitorDisplay = lang === "th" && b.exhibitor_name_th ? b.exhibitor_name_th : b.exhibitor_name;

  return (
    <>
      <ContextBar
        crumbs={[
          { label_key: "ctx_bm", href: "/" },
          { label_key: "ctx_directory", href: "/" },
          { label_key: "ctx_confirmation" },
        ]}
      />

      <div className="max-w-[580px] mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-card-border shadow-card-hover overflow-hidden">
          {/* Accent bar */}
          <div className="h-1.5 w-full bg-cta-gradient" />

          <div className="p-6 sm:p-8">
            {/* Icon + heading */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#16a34a] to-[#4ade80]
                              flex items-center justify-center text-white text-[32px] mb-4
                              shadow-[0_4px_20px_rgba(22,163,74,0.3)]">
                ✓
              </div>
              <h1 className="font-display font-black text-[26px] uppercase tracking-wide text-dark-slate mb-1">
                {t("conf_heading")}
              </h1>
              {lang === "th" && (
                <p className="text-[14px] text-text-gray mb-2">การประชุมจับคู่ธุรกิจของคุณได้รับการยืนยันแล้ว</p>
              )}
              <p className="text-[12.5px] text-text-gray leading-relaxed max-w-sm">{t("conf_sub")}</p>
            </div>

            {/* Session summary */}
            <div className="bg-light-bg rounded-xl p-4 mb-5 border border-card-border">
              {[
                { icon: "🏢", label: t("conf_exhibitor"), value: exhibitorDisplay },
                {
                  icon: "📅", label: t("conf_datetime"),
                  value: `${b.event_date_display} · ${b.start_time} – ${b.end_time}`,
                },
                {
                  icon: "📍", label: t("conf_location"),
                  value: `${t("conf_location_val")} · Table ${b.table_number}`,
                },
                { icon: "👤", label: t("conf_visitor"), value: `${b.visitor_name} · ${b.visitor_title}` },
              ].map(({ icon, label, value }) => (
                <div key={label}
                  className="flex items-start gap-3 py-2.5 border-b border-card-border last:border-b-0">
                  <span className="w-8 h-8 bg-white border border-card-border rounded-lg flex items-center
                                   justify-center text-[15px] flex-shrink-0">
                    {icon}
                  </span>
                  <div>
                    <p className="text-[10px] text-text-gray uppercase tracking-wide">{label}</p>
                    <p className="text-[13px] font-bold text-dark-slate">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* QR Section */}
            <div className="flex gap-4 items-center bg-white border-2 border-light-bg rounded-xl p-4 mb-5
                            shadow-[0_2px_12px_rgba(4,107,210,0.08)]">
              <QRDisplay value={qrValue} size={100} />
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-[13.5px] text-dark-slate mb-1">{t("qr_heading")}</h3>
                <p className="text-[11.5px] text-text-gray leading-relaxed mb-2">{t("qr_sub")}</p>
                <p className="text-[11px] text-text-gray">
                  {t("qr_ref_label")}{" "}
                  <code className="font-mono font-bold text-dark-slate bg-light-bg px-1.5 py-0.5 rounded text-[11px]">
                    {b.ref}
                  </code>
                </p>
              </div>
            </div>

            {/* Calendar */}
            <p className="text-[12.5px] font-bold text-dark-slate mb-2 flex items-center gap-2">
              {t("cal_heading")}
              <span className="bg-status-green-bg text-status-green text-[10px] font-bold px-2 py-0.5 rounded">
                ✅ Confirmed
              </span>
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <a
                href={googleCalURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-card-border
                           text-[#1a73e8] text-[12.5px] font-bold hover:bg-[#eef3ff] hover:border-[#1a73e8]
                           transition-all hover:-translate-y-0.5"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {t("cal_google")}
              </a>
              <button
                onClick={handleICSDownload}
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-card-border
                           text-[#0078d4] text-[12.5px] font-bold hover:bg-[#eef6ff] hover:border-[#0078d4]
                           transition-all hover:-translate-y-0.5"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {t("cal_outlook")}
              </button>
            </div>

            {/* Reminder note */}
            <div className="bg-light-bg border border-card-border rounded-lg px-3.5 py-3 text-[12px]
                            text-text-gray mb-4">
              📧 <strong className="text-dark-slate">24h Reminder:</strong> {t("reminder_note")}
            </div>

            <div className="border-t border-card-border pt-4">
              <p className="text-[11px] text-text-gray mb-3">{t("conf_reschedule")}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-card-border
                           text-[13px] font-bold text-dark-slate hover:bg-light-bg hover:border-primary
                           hover:text-primary transition-all"
              >
                {t("conf_book_another")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
