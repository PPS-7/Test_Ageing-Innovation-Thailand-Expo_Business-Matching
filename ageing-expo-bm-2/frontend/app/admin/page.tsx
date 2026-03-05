"use client";

import { Fragment, useState } from "react";
import { useLang } from "@/context/LangContext";
import ContextBar from "@/components/ContextBar";
import { bookings, exhibitors } from "@/lib/mockData";
import type { Booking, BookingStatus } from "@/lib/types";

const ADMIN_PIN = "admin123";

function StatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, string> = {
    confirmed:   "badge badge-confirmed",
    cancelled:   "badge badge-cancelled",
    rescheduled: "badge badge-rescheduled",
    completed:   "badge badge-confirmed",
    no_show:     "badge badge-cancelled",
  };
  const labels: Record<BookingStatus, string> = {
    confirmed:   "Confirmed",
    cancelled:   "Cancelled",
    rescheduled: "Rescheduled",
    completed:   "Completed",
    no_show:     "No Show",
  };
  return <span className={map[status]}>{labels[status]}</span>;
}

function ReschedulePanel({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const { t } = useLang();
  return (
    <div className="bg-white border border-card-border border-l-4 border-l-status-blue
                    rounded-xl p-4 mt-3 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-display font-bold text-[13.5px] text-dark-slate">
          🔄 {t("rsch_heading")} —{" "}
          <span className="font-normal text-text-gray">
            {booking.ref} · {booking.visitor_first_name} ↔ {booking.exhibitor_name}
          </span>
        </h4>
        <button onClick={onClose} className="text-text-gray hover:text-dark-slate text-lg leading-none">×</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-text-gray">{t("rsch_new_date")}</label>
          <select className="field text-[12.5px]">
            <option>6 May 2026 (Day 1)</option>
            <option>7 May 2026 (Day 2)</option>
            <option>8 May 2026 (Day 3)</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-text-gray">{t("rsch_new_time")}</label>
          <select className="field text-[12.5px]">
            <option>11:00 – 11:30</option>
            <option>11:30 – 12:00</option>
            <option>15:00 – 15:30</option>
            <option>17:00 – 17:30</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-text-gray">{t("rsch_table")}</label>
          <select className="field text-[12.5px]">
            {["T-01","T-02","T-03","T-04","T-05","T-06","T-07","T-08","T-09","T-10"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <button
          onClick={onClose}
          className="py-2.5 px-3 bg-status-blue text-white rounded text-[12.5px]
                     font-bold hover:bg-status-blue/90 transition-colors whitespace-nowrap"
        >
          {t("rsch_confirm_btn")}
        </button>
      </div>
      <p className="text-[11px] text-text-gray mt-2.5 flex items-center gap-1.5">
        ⚡ {t("rsch_note")}
      </p>
    </div>
  );
}

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const { t } = useLang();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === ADMIN_PIN) { onUnlock(); }
    else { setError(true); setPin(""); }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-card-border shadow-card-hover p-8 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">
          🔐
        </div>
        <h2 className="font-display font-black text-[22px] text-dark-slate uppercase mb-1">{t("pin_heading")}</h2>
        <p className="text-[12.5px] text-text-gray mb-6">{t("pin_sub")}</p>
        <form onSubmit={handleSubmit}>
          <label className="text-[11.5px] font-bold text-text-gray block text-left mb-1.5">{t("pin_label")}</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            placeholder="••••••••"
            className={`field text-[16px] tracking-widest text-center mb-3 ${error ? "border-status-red" : ""}`}
            autoFocus
          />
          {error && <p className="text-[12px] text-status-red mb-3">{t("pin_wrong")}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded
                       font-bold text-[14px] transition-colors shadow-btn"
          >
            {t("pin_btn")}
          </button>
        </form>
        <p className="text-[10px] text-text-gray/50 mt-4 font-mono">Demo PIN: admin123</p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { t } = useLang();
  const [unlocked, setUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [rschBookingId, setRschBookingId] = useState<string | null>(null);

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const rate = Math.round((confirmed / bookings.length) * 100);

  function exportCSV() {
    const headers = ["Ref", "Visitor", "Organisation", "Exhibitor", "Date", "Time", "Table", "Status"];
    const rows = bookings.map((b) => [
      b.ref, `${b.visitor_first_name} ${b.visitor_last_name}`, b.visitor_org,
      b.exhibitor_name, b.event_date_display, `${b.start_time}–${b.end_time}`,
      b.table_number, b.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bookings-AT2026.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const tabs = [
    `📋 ${t("admin_tab_bookings")} (${bookings.length})`,
    `🔄 ${t("admin_tab_reschedule")} (1)`,
    `🏢 ${t("admin_tab_exhibitors")} (${exhibitors.length})`,
    `📊 ${t("admin_tab_analytics")}`,
  ];

  if (!unlocked) {
    return (
      <>
        <ContextBar crumbs={[{ label_key: "ctx_bm", href: "/" }, { label_key: "ctx_admin" }]} />
        <PinGate onUnlock={() => setUnlocked(true)} />
      </>
    );
  }

  return (
    <>
      <ContextBar crumbs={[{ label_key: "ctx_bm", href: "/" }, { label_key: "ctx_admin" }]} />

      {/* ── Admin header ── */}
      <div className="bg-navy-gradient">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center
                        justify-between gap-3">
          <div>
            <h1 className="font-display font-black text-[20px] text-white uppercase tracking-wide">
              {t("admin_heading")}
            </h1>
            <p className="text-[11.5px] text-white/50">{t("admin_sub")}</p>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-white/60">
            <span className="dot-live" />
            {t("admin_live")}
          </div>
        </div>

        {/* Tab bar */}
        <div className="border-t border-navy-border overflow-x-auto">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex">
            {tabs.map((label, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-3 text-[12px] whitespace-nowrap border-b-2 transition-all ${
                  activeTab === i
                    ? "text-accent-cyan border-accent-cyan font-bold"
                    : "text-white/40 border-transparent hover:text-white/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { num: bookings.length,  label: t("admin_stat_total"),      color: "#046bd2" },
            { num: confirmed,         label: t("admin_stat_confirmed"),   color: "#16a34a" },
            { num: exhibitors.length, label: t("admin_stat_exhibitors"),  color: "#0369a1" },
            { num: `${rate}%`,        label: t("admin_stat_rate"),        color: "#f59e0b" },
          ].map(({ num, label, color }) => (
            <div key={label} className="bg-white rounded-xl border border-card-border shadow-card p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: color }} />
              <p className="font-display font-black text-[28px] text-dark-slate leading-none mb-1">{num}</p>
              <p className="text-[11px] text-text-gray">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Booking table ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-10">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-display font-bold text-[14.5px] text-dark-slate">{t("admin_booking_log")}</h3>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="px-3.5 py-2 rounded border border-card-border bg-white text-text-gray
                         text-[12px] font-bold hover:border-primary hover:text-primary transition-all"
            >
              {t("admin_export")}
            </button>
            <button className="px-3.5 py-2 rounded bg-primary text-white text-[12px] font-bold
                               hover:bg-primary-dark transition-colors">
              {t("admin_manual")}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-card">
          <table className="w-full text-[12.5px] bg-white border-collapse">
            <thead>
              <tr>
                {[
                  t("tbl_ref"), t("tbl_visitor"), t("tbl_org"), t("tbl_exhibitor"),
                  t("tbl_date"), t("tbl_time"), t("tbl_table"), t("tbl_status"), t("tbl_actions"),
                ].map((h) => (
                  <th key={h} className="bg-navy-mid text-white px-3 py-3 text-left text-[11.5px]
                                         font-bold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <Fragment key={b.id}>
                  <tr
                    className={`border-b border-card-border hover:bg-light-bg transition-colors ${
                      b.status === "rescheduled" ? "bg-[#eff6ff]" : ""
                    }`}
                  >
                    <td className="px-3 py-3">
                      <code className="text-[11px] font-mono font-bold text-dark-slate">{b.ref}</code>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {b.visitor_first_name} {b.visitor_last_name.slice(0, 1)}.
                    </td>
                    <td className="px-3 py-3 max-w-[140px] truncate">{b.visitor_org}</td>
                    <td className="px-3 py-3 max-w-[140px] truncate">{b.exhibitor_name}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{b.event_date.slice(5)}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{b.start_time}</td>
                    <td className="px-3 py-3 font-bold">{b.table_number}</td>
                    <td className="px-3 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <button className="text-primary text-[11.5px] font-bold hover:underline mr-2">
                        {t("act_view")}
                      </button>
                      {b.status === "confirmed" && (
                        <button
                          onClick={() => setRschBookingId(rschBookingId === b.id ? null : b.id)}
                          className="text-primary text-[11.5px] font-bold hover:underline"
                        >
                          {t("act_reschedule")}
                        </button>
                      )}
                      {b.status === "rescheduled" && (
                        <button
                          onClick={() => setRschBookingId(rschBookingId === b.id ? null : b.id)}
                          className="text-status-blue text-[11.5px] font-black hover:underline"
                        >
                          {t("act_process")}
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Reschedule inline panel */}
                  {rschBookingId === b.id && (
                    <tr>
                      <td colSpan={9} className="px-3 pb-3">
                        <ReschedulePanel booking={b} onClose={() => setRschBookingId(null)} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
