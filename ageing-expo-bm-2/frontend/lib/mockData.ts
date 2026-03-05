import exhibitorsData from "@/data/exhibitors.json";
import slotsData from "@/data/slots.json";
import bookingsData from "@/data/bookings.json";
import type { Exhibitor, Slot, Booking } from "@/lib/types";

export const exhibitors: Exhibitor[] = exhibitorsData as Exhibitor[];

export const allSlots: Record<string, Slot[]> = slotsData as Record<string, Slot[]>;

export const bookings: Booking[] = bookingsData as Booking[];

export function getExhibitor(id: string): Exhibitor | undefined {
  return exhibitors.find((e) => e.id === id);
}

export function getSlotsForExhibitor(exhibitorId: string): Slot[] {
  return allSlots[exhibitorId] ?? [];
}

export function getSlotsForDay(exhibitorId: string, date: string): Slot[] {
  return getSlotsForExhibitor(exhibitorId).filter((s) => s.event_date === date);
}

export function getSlot(exhibitorId: string, slotId: string): Slot | undefined {
  return getSlotsForExhibitor(exhibitorId).find((s) => s.id === slotId);
}

export const EVENT_DAYS = [
  { date: "2026-05-06", label_en: "WED · MAY", label_th: "พ.ค. พุธ",   day: "6", day_display_en: "Wednesday, 6 May 2026", day_display_th: "วันพุธ 6 พ.ค. 2569" },
  { date: "2026-05-07", label_en: "THU · MAY", label_th: "พ.ค. พฤหัส", day: "7", day_display_en: "Thursday, 7 May 2026",  day_display_th: "วันพฤหัส 7 พ.ค. 2569" },
  { date: "2026-05-08", label_en: "FRI · MAY", label_th: "พ.ค. ศุกร์", day: "8", day_display_en: "Friday, 8 May 2026",    day_display_th: "วันศุกร์ 8 พ.ค. 2569" },
] as const;

export const PILLARS = [
  { key: "longevity_health_care",    label_en: "❤️ Longevity Health & Care",  label_th: "❤️ สุขภาพและการดูแลผู้สูงวัย" },
  { key: "active_ageing_wellness",   label_en: "🏃 Active Ageing & Wellness", label_th: "🏃 การมีชีวิตที่กระตือรือร้น" },
  { key: "smart_living_business",    label_en: "🏙️ Smart Living & Business",  label_th: "🏙️ การใช้ชีวิตอัจฉริยะ" },
] as const;

/** Generate a mock booking reference */
export function generateRef(): string {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `AT2026-BM-${n.toString().padStart(5, "0")}`;
}

/** Build Google Calendar pre-fill URL (no OAuth required) */
export function buildGoogleCalURL(opts: {
  exhibitorName: string;
  date: string;
  startTime: string;
  endTime: string;
  ref: string;
  tableNumber?: string;
}): string {
  const { exhibitorName, date, startTime, endTime, ref, tableNumber } = opts;
  const dtStart = `${date.replace(/-/g, "")}T${startTime.replace(":", "")}00`;
  const dtEnd   = `${date.replace(/-/g, "")}T${endTime.replace(":", "")}00`;
  const text    = encodeURIComponent(`Business Meeting — ${exhibitorName} | Ageing Innovation Expo 2026`);
  const loc     = encodeURIComponent("Business Matching Area, Hall EH 103-104, BITEC Bangna, Bangkok");
  const details = encodeURIComponent(`Booking Ref: ${ref}\nTable: ${tableNumber ?? "TBA"}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dtStart}/${dtEnd}&location=${loc}&details=${details}&ctz=Asia%2FBangkok`;
}

/** Build ICS file string (Outlook / Apple Calendar) */
export function buildICS(opts: {
  exhibitorName: string;
  date: string;
  startTime: string;
  endTime: string;
  ref: string;
  tableNumber?: string;
}): string {
  const { exhibitorName, date, startTime, endTime, ref, tableNumber } = opts;
  const dtStart = `${date.replace(/-/g, "")}T${startTime.replace(":", "")}00`;
  const dtEnd   = `${date.replace(/-/g, "")}T${endTime.replace(":", "")}00`;
  const now     = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ageing Innovation Expo 2026//Business Matching//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART;TZID=Asia/Bangkok:${dtStart}`,
    `DTEND;TZID=Asia/Bangkok:${dtEnd}`,
    `DTSTAMP:${now}`,
    `UID:${ref}@ageinginnovationexpo.com`,
    `SUMMARY:Business Meeting — ${exhibitorName} | Ageing Innovation Expo 2026`,
    `DESCRIPTION:Booking Ref: ${ref}\\nTable: ${tableNumber ?? "TBA"}`,
    "LOCATION:Business Matching Area\\, Hall EH 103-104\\, BITEC Bangna\\, Bangkok",
    "ORGANIZER;CN=Ageing Innovation Expo 2026:mailto:noreply@ageinginnovationexpo.com",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
