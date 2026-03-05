# Ageing Innovation Expo 2026 — Business Matching Platform
## Claude Code Project Brief

This file is read automatically by Claude Code at startup. It contains the full context
of this project so you can continue development without needing any prior conversation history.

---

## 🎯 Project Overview

**Client:** KRS XPANSION CO.,LTD
**Event:** Ageing Innovation Expo Thailand 2026
**Dates:** 6–8 May 2026, 10:00–18:00 daily
**Venue:** Hall EH 103-104, BITEC Bangna, Bangkok
**Website:** https://ageinginnovationexpo.com
**Theme:** "Longevity Meets Innovation"

**What we're building:** A standalone Business Matching web platform that allows
event visitors (Buyers) to browse exhibitors (Sellers) and book 30–45 min on-site
meeting sessions at the Business Matching Area during the expo. The platform sits at:

```
match.ageinginnovationexpo.com
```

It will be linked from the existing nav item at:
https://ageinginnovationexpo.com/business-matching/

---

## ✅ Confirmed Requirements (Do Not Re-ask)

| # | Decision | Answer |
|---|---|---|
| 1 | Visitor login required? | ❌ NO — public, no login or registration |
| 2 | Languages | ✅ Bilingual: Thai (primary) + English |
| 3 | Calendar reminder method | ✅ Email + QR code + .ics attachment + Google Calendar link + Outlook .ics |
| 4 | LINE notifications | ❌ OUT OF SCOPE — removed by organiser |
| 5 | Session duration | ⏳ 30–45 min (TBC with client — **confirm before building slot engine**) |
| 6 | Exhibitor availability input | ✅ Organiser inputs on exhibitor's behalf (no self-serve portal needed) |
| 7 | Admin dashboard | ✅ IN SCOPE — for traffic monitoring, reschedule management, client reporting |
| 8 | Booking confirmation flow | ✅ Instant (no approval workflow) |
| 9 | On-site check-in | ✅ QR code shown by visitor, scanned by staff at BM Area desk |
| 10 | Rescheduling | ✅ Managed by organiser via admin dashboard; auto-notifies both parties |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Next.js / React)                             │
│  match.ageinginnovationexpo.com                         │
│  ├── /                   Exhibitor Directory            │
│  ├── /exhibitor/[id]     Exhibitor Profile + Slots      │
│  ├── /book/[id]/[slot]   Inquiry / Booking Form         │
│  ├── /confirm/[ref]      Confirmation + QR Code         │
│  └── /admin              Organiser Dashboard (auth)     │
└────────────────────┬────────────────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────────────────┐
│  Backend (Node.js / FastAPI)                            │
│  ├── GET  /api/exhibitors          List + filter        │
│  ├── GET  /api/exhibitors/:id      Single profile       │
│  ├── GET  /api/slots/:exhibitorId  Available slots      │
│  ├── POST /api/bookings            Create booking       │
│  ├── GET  /api/bookings/:ref       Get booking by ref   │
│  ├── PUT  /api/bookings/:ref       Reschedule           │
│  ├── DELETE /api/bookings/:ref     Cancel               │
│  └── /admin/*                     Admin endpoints       │
└────────────────────┬────────────────────────────────────┘
          ┌──────────┴──────────┐
          ▼                     ▼
   PostgreSQL              Redis
   (bookings,              (slot locking,
    exhibitors,             session cache)
    slots, users)
```

**Email:** SendGrid or AWS SES — transactional, with .ics attachment generation
**ZipEvent API:** Exhibitor data sync (API credentials TBD — see open questions)

---

## 📁 Project File Structure (Target)

```
ageing-expo-bm/
├── CLAUDE.md                   ← YOU ARE HERE (Claude Code reads this)
├── docs/
│   ├── requirements.docx       ← Full requirements document
│   ├── mockup.html             ← Interactive 6-screen UI mockup (reference)
│   └── OPEN_QUESTIONS.md       ← Items still pending client confirmation
├── frontend/                   ← Next.js app
│   ├── pages/
│   ├── components/
│   └── styles/
├── backend/                    ← API server
│   ├── routes/
│   ├── models/
│   └── services/
├── database/
│   └── schema.sql              ← PostgreSQL schema
├── emails/
│   └── templates/              ← Email HTML templates
└── README.md
```

---

## 🎨 Brand & Design System

**Official website:** https://ageinginnovationexpo.com

### Colour Palette
```css
--or-primary:  #F07800;   /* Main orange — dominant brand colour */
--or-deep:     #D95F00;   /* Deep orange for shadows/gradients */
--or-light:    #FF9500;   /* Bright orange highlight */
--or-pale:     #FFF0DC;   /* Light tint for backgrounds */
--logo-green:  #1B6B2E;   /* Brand green (AGEING INNOVATION EXPO text) */
--logo-yellow: #F5C400;   /* Accent yellow (INNOVATION word) */
--dark:        #1A1A1A;
--white:       #FFFFFF;
```

### Logo Treatment
```
AGEING INNOVATION EXPO    ← green + orange (INNOVATION)
THAILAND 2026             ← green + orange (2026)
```

### Typography
- **Headlines:** Barlow Condensed, weight 700–900, uppercase
- **Body / UI:** Sarabun (bilingual Thai+EN support), weight 400–700
- **Accent:** Prompt, weight 700–800

### Background Texture
Hexagonal honeycomb SVG pattern (semi-transparent white) over orange gradient —
used on hero sections and exhibitor profile headers.

---

## 👥 User Groups & Terminology

| Platform term | Website term | Description |
|---|---|---|
| Visitor | **Buyer** | Event attendees who book meetings (`/buyer-register`) |
| Exhibitor | **Seller** | Companies with booths who receive meetings (`/seller-register`) |
| Organiser | Admin | KRS XPANSION staff who manage the platform |

---

## 🗂️ Exhibitor Category Taxonomy

The platform uses the 3 official pillars from the live website:

1. **❤️ Longevity Health & Care Innovation**
   - Medical & Clinical Innovation
   - Preventive Care & Longevity Solutions
   - MedTech / HealthTech / Devices
   - Telehealth & Digital Health Platforms
   - Elderly Care Business Solutions
   - Pharma & Biotech
   - Data, AI & Hospital/Clinic Solutions (B2B SaaS)

2. **🏃 Active Ageing & Wellness**
   - Rehabilitation & Mobility Technology
   - Active Lifestyle & Fitness Solutions
   - Wellness & Longevity Lifestyle
   - Wellness Tech & Smart Monitoring
   - Mental & Cognitive Wellness
   - Spa, Rejuvenation & Lifestyle Wellness
   - Corporate & Community Wellness Solutions
   - Travel, Leisure & Active Ageing Experiences

3. **🏙️ Smart Living & Business Transformation**
   - Smart Home & Assisted Living Technology
   - Senior Finance, Insurtech & Wealth Management
   - Silver Economy Business Solutions
   - Property & Real Estate for Seniors
   - Government & Policy Innovation

---

## 📋 Functional Requirements Summary

### Visitor (Buyer) Flow
- FR-01: Exhibitor directory — searchable, filterable by 3 pillars + sub-categories
- FR-02: Exhibitor profile page — description, tags, available slots, booth number
- FR-03: Time slot picker — visual calendar per event day (6, 7, 8 May)
- FR-04: Slot availability — real-time, prevent double-booking (Redis lock)
- FR-05: Inquiry/booking form — name, title, org, email, phone, industry, country, topics
- FR-06: PDPA consent checkbox — required before submission
- FR-07: Instant booking confirmation — no approval workflow
- FR-08: Confirmation email — session details + unique QR code + .ics + Google Cal link + Outlook .ics
- FR-09: 24-hour reminder email — resends QR code + session details
- FR-10: Cancel/reschedule — via secure link in confirmation email → triggers organiser notification

### Exhibitor (Seller) Management
- FR-11: Organiser inputs exhibitor availability into admin dashboard (no self-serve portal)
- FR-12: Exhibitor receives email notification on each new booking (with visitor inquiry details)
- FR-13: Exhibitor data synced from ZipEvent API (scheduled + webhook)

### Admin Dashboard
- FR-14: View all bookings — filter by date / exhibitor / status / visitor
- FR-15: Reschedule management — reassign slot + table, auto-notify both parties with new QR
- FR-16: Cancellation management — cancel booking, notify both parties
- FR-17: Manual booking creation — organiser can create booking on visitor's behalf
- FR-18: Export CSV — all booking data for client reporting
- FR-19: Analytics — total bookings, confirmed sessions, completion rate, exhibitor stats
- FR-20: Table assignment — map table numbers to bookings

### On-site Check-in
- FR-21: QR code encodes unique booking reference (AT2026-BM-XXXXX)
- FR-22: Staff scan interface — confirm session, direct visitor to assigned table

---

## 🗄️ Database Schema (PostgreSQL)

```sql
-- Exhibitors (synced from ZipEvent)
CREATE TABLE exhibitors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zipevent_id   VARCHAR(100) UNIQUE,
  name          VARCHAR(255) NOT NULL,
  name_th       VARCHAR(255),
  description   TEXT,
  description_th TEXT,
  category      VARCHAR(100),   -- pillar: 'health_care' | 'active_ageing' | 'smart_living'
  sub_category  VARCHAR(100),
  tags          TEXT[],
  booth_number  VARCHAR(50),
  logo_url      VARCHAR(500),
  website_url   VARCHAR(500),
  contact_email VARCHAR(255),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Available time slots (set by organiser on exhibitor's behalf)
CREATE TABLE slots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exhibitor_id  UUID REFERENCES exhibitors(id) ON DELETE CASCADE,
  event_date    DATE NOT NULL,              -- 2026-05-06, 07, or 08
  start_time    TIME NOT NULL,              -- e.g. 14:00
  end_time      TIME NOT NULL,              -- e.g. 14:30 (or 14:45)
  is_available  BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref           VARCHAR(20) UNIQUE NOT NULL, -- AT2026-BM-XXXXX
  slot_id       UUID REFERENCES slots(id),
  exhibitor_id  UUID REFERENCES exhibitors(id),
  -- Visitor details (no account — collected at booking time)
  visitor_first_name   VARCHAR(100) NOT NULL,
  visitor_last_name    VARCHAR(100) NOT NULL,
  visitor_org          VARCHAR(255) NOT NULL,
  visitor_title        VARCHAR(150),
  visitor_email        VARCHAR(255) NOT NULL,
  visitor_phone        VARCHAR(50),
  visitor_industry     VARCHAR(100),
  visitor_country      VARCHAR(100),
  meeting_topics       TEXT,
  -- Status
  status        VARCHAR(50) DEFAULT 'confirmed',
  -- 'confirmed' | 'cancelled' | 'rescheduled' | 'completed'
  table_number  VARCHAR(20),
  cancel_token  VARCHAR(100) UNIQUE,        -- secure token for cancel/reschedule link
  pdpa_consent  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users
CREATE TABLE admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(150),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log
CREATE TABLE booking_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id    UUID REFERENCES bookings(id),
  event_type    VARCHAR(50),   -- 'created' | 'rescheduled' | 'cancelled' | 'reminder_sent' | 'qr_scanned'
  notes         TEXT,
  created_by    VARCHAR(100),  -- 'system' | admin email
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📧 Email Templates Required

1. **confirmation.html** — sent immediately on booking
   - Session summary (exhibitor, date, time, table, venue)
   - QR code (embedded as base64 PNG)
   - Google Calendar button (pre-filled URL)
   - Outlook .ics download button
   - Cancel/reschedule link (using cancel_token)
   - Bilingual: TH primary, EN secondary

2. **reminder.html** — sent 24h before session
   - Same as confirmation but shorter
   - QR code re-attached
   - Venue directions to Business Matching Area

3. **exhibitor-notification.html** — sent to exhibitor on each new booking
   - Visitor name, title, organisation, industry
   - Meeting topics/objectives
   - Date, time, table number

4. **reschedule-confirmation.html** — sent to both parties after reschedule
   - New session details + new QR code

5. **cancellation.html** — sent to both parties on cancellation

---

## 🔗 ZipEvent API Integration

**Status:** API documentation not yet received — this is a **critical blocker**.

**Action required before development:**
- Contact ZipEvent to request: API documentation, sandbox credentials, webhook support info
- Confirm fields exposed: exhibitor ID, name, logo, description, category, contact email, booth number

**Integration pattern (once credentials received):**
```javascript
// services/zipevent-sync.js
// 1. Initial full sync on deploy
// 2. Scheduled delta sync every 30 minutes (cron)
// 3. Webhook endpoint POST /api/webhooks/zipevent (if supported)
```

---

## 🌐 Integration with Main Website

**Main site:** https://ageinginnovationexpo.com (WordPress, live)
**Business Matching nav:** https://ageinginnovationexpo.com/business-matching/ (currently a placeholder page)

**Integration approach:**
- Platform deployed at `match.ageinginnovationexpo.com`
- Client updates the `/business-matching/` page to link/redirect to `match.ageinginnovationexpo.com`
- Optional future: embed via iframe on the WordPress page

**Nav breadcrumb context bar** (shown at top of platform):
```
ageinginnovationexpo.com > BUSINESS MATCHING > Exhibitor Directory
```

---

## ❓ Open Questions (Still Pending Client Confirmation)

See `docs/OPEN_QUESTIONS.md` for full list. **Critical ones before dev starts:**

| # | Question | Impact |
|---|---|---|
| OQ-01 | Session duration: 30 min or 45 min? | Affects slot generation across all 3 days |
| OQ-02 | BM Area operating hours each day? | Affects total slots available |
| OQ-03 | Max bookings per visitor per day? (assume 6) | Affects booking form validation |
| OQ-04 | Table assignment — how many tables? Who assigns numbers? | Affects admin UX |
| OQ-05 | ZipEvent API credentials — when available? | Blocks exhibitor data sync |
| OQ-06 | Calendar invite language: TH, EN, or follow user's language toggle? | Affects .ics generation |

---

## 🚀 Development Phases

### Phase 1 — Core (Target: March–April 2026)
- [ ] Project setup: Next.js + Node.js/FastAPI + PostgreSQL + Redis
- [ ] Exhibitor directory page with search + 3-pillar filter
- [ ] Exhibitor profile + slot picker
- [ ] Booking/inquiry form with PDPA consent
- [ ] Booking engine with Redis slot locking (prevent race conditions)
- [ ] Confirmation email with QR code + .ics + Google Cal link
- [ ] 24-hour reminder email (cron job)
- [ ] Cancel/reschedule via secure token link

### Phase 2 — Admin + Polish (Target: April 2026)
- [ ] Admin dashboard: booking log, filters, export CSV
- [ ] Reschedule management: slot reassignment + auto-notify
- [ ] Exhibitor availability input (admin enters on exhibitor's behalf)
- [ ] Bilingual UI (TH/EN toggle, Sarabun font)
- [ ] ZipEvent API sync (once credentials received)
- [ ] Mobile responsive QA

### Phase 3 — Pre-launch (Target: Late April 2026)
- [ ] Load testing (target: 500+ concurrent users)
- [ ] Staging deployment to match.ageinginnovationexpo.com
- [ ] Organiser team training
- [ ] QR scan interface for on-site staff

### Go-Live
- **1 May 2026** — production launch (1 week buffer before event)
- **6–8 May 2026** — live event support

---

## 📞 Key Contacts

| Role | Name / Org | Contact |
|---|---|---|
| Organiser | KRS XPANSION CO.,LTD | +66 90 981 2989 |
| International (SG) | New Age Entrepreneurs Pte. Ltd. | michelle@new-age-e.com · +65 9369 9263 |
| International (CN) | Guangzhou Baisheng Exhibition | april@baishengexpo.com · +86 139 2814 9904 |

---

## 💡 How to Use This Project in Claude Code

```bash
# 1. Install Claude Code (if not already installed)
npm install -g @anthropic-ai/claude-code

# 2. Navigate to this project folder
cd ageing-expo-bm

# 3. Start Claude Code — it will read CLAUDE.md automatically
claude

# 4. Suggested first prompts:
# "Set up the Next.js frontend project structure with Tailwind and Sarabun font"
# "Create the PostgreSQL schema from the spec in CLAUDE.md"
# "Build the exhibitor directory page with search and the 3-pillar filter chips"
# "Create the booking engine with Redis slot locking"
# "Build the admin dashboard booking log table"
```

---

*This CLAUDE.md was generated from a full design + requirements session in Claude.ai.*
*Reference mockup and full requirements doc are in the `docs/` folder.*
*Last updated: March 2026*
