// ── Exhibitor (Seller) ────────────────────────────────────────────────────────
export interface Exhibitor {
  id: string;
  name: string;
  name_th: string;
  description: string;
  description_th: string;
  pillar: "longevity_health_care" | "active_ageing_wellness" | "smart_living_business";
  pillar_label: string;
  pillar_label_th: string;
  sub_category: string;
  tags: string[];
  booth_number: string;
  logo_abbr: string;
  logo_color: string;
  logo_gradient: string;
  website_url: string;
  contact_email: string;
  contact_name: string;
  is_active: boolean;
  available_slots_count: number;
}

// ── Time Slot ─────────────────────────────────────────────────────────────────
export interface Slot {
  id: string;
  event_date: string;     // "2026-05-06" | "2026-05-07" | "2026-05-08"
  start_time: string;     // "14:00"
  end_time: string;       // "14:30"
  is_available: boolean;
}

// ── Booking ───────────────────────────────────────────────────────────────────
export type BookingStatus = "confirmed" | "cancelled" | "rescheduled" | "completed" | "no_show";

export interface Booking {
  id: string;
  ref: string;                  // "AT2026-BM-XXXXX"
  exhibitor_id: string;
  exhibitor_name: string;
  visitor_first_name: string;
  visitor_last_name: string;
  visitor_org: string;
  visitor_title: string;
  visitor_email: string;
  visitor_phone: string;
  visitor_industry: string;
  visitor_country: string;
  meeting_topics: string;
  event_date: string;
  event_date_display: string;
  start_time: string;
  end_time: string;
  table_number: string;
  status: BookingStatus;
  created_at: string;
}

// ── Booking Form submission ───────────────────────────────────────────────────
export interface BookingFormData {
  first_name: string;
  last_name: string;
  organisation: string;
  job_title: string;
  email: string;
  phone: string;
  industry: string;
  country: string;
  meeting_topics: string;
  pdpa_consent: boolean;
}

// ── Pending booking stored in sessionStorage ──────────────────────────────────
export interface PendingBooking {
  ref: string;
  exhibitor_id: string;
  exhibitor_name: string;
  exhibitor_name_th: string;
  booth_number: string;
  slot_id: string;
  event_date: string;
  event_date_display: string;
  start_time: string;
  end_time: string;
  visitor_name: string;
  visitor_org: string;
  visitor_title: string;
  visitor_email: string;
  table_number: string;
}

// ── Language ──────────────────────────────────────────────────────────────────
export type Lang = "en" | "th";
