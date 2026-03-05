# Open Questions — Ageing Innovation Expo 2026 Business Matching Platform

Last updated: March 2026

Items marked ✅ are confirmed. Items marked ⏳ are still pending client confirmation.
**Critical items (marked 🔴) must be resolved before development of the affected feature begins.**

---

## 🔴 Critical — Resolve Before Dev Starts

| ID | Question | Assumption | Impact |
|---|---|---|---|
| OQ-01 | Session slot duration: 30 min or 45 min? | 30–45 min range | Affects total slot capacity per day and slot generation logic |
| OQ-02 | Business Matching Area operating hours each day? | 10:00–18:00 (full event hours) | Affects number of slots generated per exhibitor per day |
| OQ-05 | When will ZipEvent API credentials be available? | TBD | Blocks all exhibitor data sync — dev can use mock data in interim |

## 🟡 Important — Resolve Before Phase 2

| ID | Question | Assumption | Impact |
|---|---|---|---|
| OQ-03 | Maximum bookings per visitor per day? | 6 sessions/day | Affects booking form validation logic |
| OQ-04 | Business Matching Area: how many tables? Who assigns numbers? | ~15 tables, organiser assigns | Affects admin dashboard table assignment UX |
| OQ-06 | Calendar invite (.ics) language: Thai, English, or follow user's language toggle? | Follow user's selected language | Affects .ics file generation |
| OQ-07 | Table assignment: auto-assign by system or manually by organiser? | Manual by organiser | Affects admin workflow |

## 🟢 Nice to Have — Lower Priority

| ID | Question | Assumption | Impact |
|---|---|---|---|
| OQ-08 | Should visitors be able to book multiple sessions with different exhibitors? | Yes, up to daily limit | Low — just needs validation check |
| OQ-09 | Do exhibitors need to be notified of cancellations? | Yes | Minor email template addition |
| OQ-10 | Is there a lunch break / restricted window in the BM Area? | No (full 10:00–18:00) | Affects slot generation if yes |
| OQ-11 | Can the organiser bulk-import exhibitor availability (CSV upload)? | No (manual entry) | Nice-to-have admin feature |
| OQ-12 | Walk-in bookings on the day — handled via admin manual booking or a separate kiosk flow? | Admin manual booking | Affects on-site ops planning |

---

## ✅ Confirmed (No Longer Open)

| ID | Question | Answer | Confirmed By |
|---|---|---|---|
| - | Visitor login required? | No login required | Organiser |
| - | Languages | Bilingual TH + EN | Organiser |
| - | Calendar reminder method | Email + QR + .ics + Google Cal + Outlook | Organiser |
| - | LINE notifications | Out of scope | Organiser |
| - | Booking confirmation flow | Instant (no approval) | Organiser |
| - | Exhibitor availability input | Organiser enters on behalf of exhibitors | Organiser |
| - | Admin dashboard | In scope | Organiser |
| - | Rescheduling | Organiser-managed, auto-notify both parties | Organiser |
| - | On-site check-in method | QR code shown by visitor, scanned by staff | Organiser |
| - | Website domain | ageinginnovationexpo.com (live) | Client website |
| - | Platform subdomain | match.ageinginnovationexpo.com | Decision |
| - | Visitor/Exhibitor terminology | Buyer / Seller | Client website nav |
