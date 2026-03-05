# Ageing Innovation Expo 2026 — Business Matching Platform

**Platform URL (target):** https://match.ageinginnovationexpo.com
**Main website:** https://ageinginnovationexpo.com
**Organiser:** KRS XPANSION CO.,LTD
**Event:** 6–8 May 2026 · Hall EH 103-104, BITEC Bangna, Bangkok

---

## Quick Start

```bash
# Frontend (Next.js)
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev

# Database
psql -U postgres -f database/schema.sql
```

## Project Structure

```
ageing-expo-bm/
├── CLAUDE.md              ← Full project brief for Claude Code (read this first)
├── README.md              ← This file
├── docs/
│   ├── requirements.docx  ← Full requirements document
│   ├── mockup.html        ← Interactive 6-screen UI mockup
│   └── OPEN_QUESTIONS.md  ← Pending client confirmations
├── frontend/              ← Next.js app
├── backend/               ← API server
├── database/              ← PostgreSQL schema + seed data
└── emails/                ← Email HTML templates
```

## Key Decisions

- **No visitor login** — public booking form, no account needed
- **Bilingual** — Thai (primary) + English
- **Buyers** = Visitors · **Sellers** = Exhibitors (website terminology)
- **3 category pillars:** Longevity Health & Care · Active Ageing & Wellness · Smart Living & Business
- **Check-in:** QR code (in confirmation email) scanned by staff on event day
- **Rescheduling:** Organiser-managed via admin dashboard

## ⚠️ Before Starting Development

1. Confirm session duration with client: 30 min or 45 min? (affects slot engine)
2. Obtain ZipEvent API credentials (blocks exhibitor data sync)
3. See `docs/OPEN_QUESTIONS.md` for full list

## Tech Stack

- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Node.js (Express) or FastAPI
- **Database:** PostgreSQL + Redis
- **Email:** SendGrid or AWS SES
- **Fonts:** Barlow Condensed (headlines) + Sarabun (body, bilingual)

## Brand Colours

| Token | Hex | Use |
|---|---|---|
| `--or-primary` | `#F07800` | Primary orange — CTAs, accents |
| `--or-deep` | `#D95F00` | Dark orange — gradients, hover |
| `--logo-green` | `#1B6B2E` | Brand green — logo, headings |
| `--logo-yellow` | `#F5C400` | Accent yellow — "INNOVATION" word |

---

*Generated from design & requirements session in Claude.ai — March 2026*
