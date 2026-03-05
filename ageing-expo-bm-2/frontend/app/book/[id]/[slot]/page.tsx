"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/context/LangContext";
import ContextBar from "@/components/ContextBar";
import { getExhibitor, getSlot, generateRef, EVENT_DAYS } from "@/lib/mockData";
import type { BookingFormData, PendingBooking } from "@/lib/types";

const INDUSTRIES = [
  "Healthcare / Hospital",
  "Pharmaceuticals",
  "Technology",
  "Finance / Insurance",
  "Government / NGO",
  "Academia / Research",
  "Real Estate",
  "Retail / Consumer",
  "Other",
];

const COUNTRIES = [
  "Thailand", "Japan", "Singapore", "South Korea", "China", "India",
  "Malaysia", "Indonesia", "Vietnam", "Philippines", "Australia",
  "United Kingdom", "United States", "Germany", "France", "Other",
];

export default function BookingFormPage() {
  const { lang, t } = useLang();
  const params = useParams();
  const router = useRouter();
  const exhibitorId = params.id as string;
  const slotId = params.slot as string;

  const exhibitor = getExhibitor(exhibitorId);
  const slot = getSlot(exhibitorId, slotId);

  const eventDay = EVENT_DAYS.find((d) => d.date === slot?.event_date);
  const dayDisplay = lang === "th" ? eventDay?.day_display_th : eventDay?.day_display_en;

  const [form, setForm] = useState<BookingFormData>({
    first_name: "",
    last_name: "",
    organisation: "",
    job_title: "",
    email: "",
    phone: "",
    industry: "",
    country: "Thailand",
    meeting_topics: "",
    pdpa_consent: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!exhibitor || !slot) {
    return (
      <div className="text-center py-20">
        <p className="text-text-gray">Invalid session. <Link href="/" className="text-primary underline">Back to directory</Link></p>
      </div>
    );
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name.trim()) e.last_name = "Required";
    if (!form.organisation.trim()) e.organisation = "Required";
    if (!form.job_title.trim()) e.job_title = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.industry) e.industry = "Required";
    if (!form.meeting_topics.trim()) e.meeting_topics = "Required";
    if (!form.pdpa_consent) e.pdpa_consent = t("form_pdpa_required");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(field: keyof BookingFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const ref = generateRef();
    const ex = exhibitor!;
    const sl = slot!;
    const pending: PendingBooking = {
      ref,
      exhibitor_id: ex.id,
      exhibitor_name: ex.name,
      exhibitor_name_th: ex.name_th,
      booth_number: ex.booth_number,
      slot_id: sl.id,
      event_date: sl.event_date,
      event_date_display: dayDisplay ?? "",
      start_time: sl.start_time,
      end_time: sl.end_time,
      visitor_name: `${form.first_name} ${form.last_name}`,
      visitor_org: form.organisation,
      visitor_title: form.job_title,
      visitor_email: form.email,
      table_number: `T-${String(Math.floor(Math.random() * 15) + 1).padStart(2, "0")}`,
    };

    sessionStorage.setItem("pending_booking", JSON.stringify(pending));

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    router.push(`/confirm/${ref}`);
  }

  function Field({
    label, fieldKey, type = "text", required = false, children,
  }: {
    label: string; fieldKey: keyof BookingFormData; type?: string;
    required?: boolean; children?: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-[11.5px] font-bold text-text-gray flex items-center gap-1">
          {label}
          {required && <span className="text-primary">*</span>}
        </label>
        {children ?? (
          <input
            type={type}
            value={form[fieldKey] as string}
            onChange={(e) => handleChange(fieldKey, e.target.value)}
            className={`field text-[13px] ${errors[fieldKey] ? "border-status-red" : ""}`}
          />
        )}
        {errors[fieldKey] && (
          <span className="text-[11px] text-status-red">{errors[fieldKey]}</span>
        )}
      </div>
    );
  }

  return (
    <>
      <ContextBar
        crumbs={[
          { label_key: "ctx_bm", href: "/" },
          { label_key: "ctx_directory", href: "/" },
          { label_key: "ctx_profile", href: `/exhibitor/${exhibitorId}` },
          { label_key: "ctx_booking" },
        ]}
      />

      <Link
        href={`/exhibitor/${exhibitorId}`}
        className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-white border-b border-card-border
                   text-primary text-[13px] font-bold hover:bg-light-bg transition-colors"
      >
        ← {t("back_profile")}
      </Link>

      <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-6">
        {/* No-login banner */}
        <div className="flex items-center gap-3 bg-status-green-bg border border-green-200
                        rounded-lg px-4 py-3 mb-4">
          <span className="text-xl flex-shrink-0">🔓</span>
          <p className="text-[12.5px] text-status-green font-bold">{t("form_no_login")}</p>
        </div>

        {/* Session pill */}
        <div className="bg-white border border-card-border border-l-4 border-l-primary
                        rounded-xl p-4 mb-4 shadow-card">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1.5">
            {t("form_session_label")}
          </p>
          <p className="text-[13px] text-dark-slate leading-relaxed">
            <strong>{lang === "th" && exhibitor.name_th ? exhibitor.name_th : exhibitor.name}</strong>
            <br />
            {dayDisplay} · {slot.start_time}–{slot.end_time} · Business Matching Area, Hall EH · BITEC Bangna
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white rounded-xl border border-card-border shadow-card p-5">
            <h2 className="font-display font-bold text-[15px] text-dark-slate mb-1">{t("form_your_details")}</h2>
            <p className="text-[12px] text-text-gray mb-5">{t("form_details_sub")}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Field label={t("form_first_name")} fieldKey="first_name" required />
              <Field label={t("form_last_name")} fieldKey="last_name" required />
              <Field label={t("form_org")} fieldKey="organisation" required />
              <Field label={t("form_title")} fieldKey="job_title" required />
              <Field label={t("form_email")} fieldKey="email" type="email" required />
              <Field label={t("form_phone")} fieldKey="phone" type="tel" required />

              {/* Industry select */}
              <div className="flex flex-col gap-1">
                <label className="text-[11.5px] font-bold text-text-gray flex items-center gap-1">
                  {t("form_industry")} <span className="text-primary">*</span>
                </label>
                <select
                  value={form.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  className={`field text-[13px] appearance-none ${errors.industry ? "border-status-red" : ""}`}
                >
                  <option value="">Select…</option>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
                {errors.industry && <span className="text-[11px] text-status-red">{errors.industry}</span>}
              </div>

              {/* Country select */}
              <div className="flex flex-col gap-1">
                <label className="text-[11.5px] font-bold text-text-gray">{t("form_country")}</label>
                <select
                  value={form.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className="field text-[13px] appearance-none"
                >
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Topics textarea — full width */}
              <div className="col-span-1 sm:col-span-2 flex flex-col gap-1">
                <label className="text-[11.5px] font-bold text-text-gray flex items-center gap-1">
                  {t("form_topics")} <span className="text-primary">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.meeting_topics}
                  onChange={(e) => handleChange("meeting_topics", e.target.value)}
                  placeholder={t("form_topics_ph")}
                  className={`field text-[13px] resize-y ${errors.meeting_topics ? "border-status-red" : ""}`}
                />
                {errors.meeting_topics && (
                  <span className="text-[11px] text-status-red">{errors.meeting_topics}</span>
                )}
              </div>
            </div>

            {/* PDPA */}
            <div className={`flex gap-3 bg-light-bg rounded-lg p-3.5 border mb-4 ${
              errors.pdpa_consent ? "border-status-red" : "border-card-border"
            }`}>
              <input
                type="checkbox"
                id="pdpa"
                checked={form.pdpa_consent}
                onChange={(e) => handleChange("pdpa_consent", e.target.checked)}
                className="mt-0.5 flex-shrink-0 accent-primary w-4 h-4"
              />
              <label htmlFor="pdpa" className="text-[12px] text-text-gray leading-relaxed cursor-pointer">
                {t("form_pdpa")}
              </label>
            </div>
            {errors.pdpa_consent && (
              <p className="text-[11.5px] text-status-red mb-3">{errors.pdpa_consent}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-lg text-white font-display font-black text-[14px]
                         uppercase tracking-wide shadow-btn transition-all
                         bg-cta-gradient hover:shadow-lg hover:-translate-y-0.5
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {submitting ? t("form_submitting") : t("form_submit")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
