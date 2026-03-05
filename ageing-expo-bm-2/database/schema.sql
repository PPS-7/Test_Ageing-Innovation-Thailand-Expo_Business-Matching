-- ============================================================
-- Ageing Innovation Expo 2026 — Business Matching Platform
-- PostgreSQL Schema
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── EXHIBITORS ──────────────────────────────────────────────
-- Synced from ZipEvent API (scheduled + webhook)
CREATE TABLE exhibitors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zipevent_id     VARCHAR(100) UNIQUE,
  name            VARCHAR(255) NOT NULL,
  name_th         VARCHAR(255),
  description     TEXT,
  description_th  TEXT,
  -- Category: one of the 3 official expo pillars
  pillar          VARCHAR(50) CHECK (pillar IN (
                    'longevity_health_care',
                    'active_ageing_wellness',
                    'smart_living_business'
                  )),
  sub_category    VARCHAR(150),
  tags            TEXT[],
  booth_number    VARCHAR(50),
  logo_url        VARCHAR(500),
  website_url     VARCHAR(500),
  contact_email   VARCHAR(255),
  contact_name    VARCHAR(255),
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_exhibitors_pillar ON exhibitors(pillar);
CREATE INDEX idx_exhibitors_active ON exhibitors(is_active);

-- ── TIME SLOTS ──────────────────────────────────────────────
-- Created by organiser on exhibitor's behalf
-- Duration determined by client (30 or 45 min — TBC OQ-01)
CREATE TABLE slots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exhibitor_id    UUID NOT NULL REFERENCES exhibitors(id) ON DELETE CASCADE,
  event_date      DATE NOT NULL CHECK (
                    event_date IN ('2026-05-06', '2026-05-07', '2026-05-08')
                  ),
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  is_available    BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_slot UNIQUE (exhibitor_id, event_date, start_time)
);

CREATE INDEX idx_slots_exhibitor ON slots(exhibitor_id);
CREATE INDEX idx_slots_date ON slots(event_date);
CREATE INDEX idx_slots_available ON slots(is_available);

-- ── BOOKINGS ────────────────────────────────────────────────
-- No visitor account — all details collected at booking time
CREATE TABLE bookings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref                   VARCHAR(20) UNIQUE NOT NULL, -- AT2026-BM-XXXXX
  slot_id               UUID NOT NULL REFERENCES slots(id),
  exhibitor_id          UUID NOT NULL REFERENCES exhibitors(id),

  -- Visitor (Buyer) details — no account required
  visitor_first_name    VARCHAR(100) NOT NULL,
  visitor_last_name     VARCHAR(100) NOT NULL,
  visitor_org           VARCHAR(255) NOT NULL,
  visitor_title         VARCHAR(150),
  visitor_email         VARCHAR(255) NOT NULL,
  visitor_phone         VARCHAR(50),
  visitor_industry      VARCHAR(100),
  visitor_country       VARCHAR(100) DEFAULT 'Thailand',
  meeting_topics        TEXT NOT NULL,

  -- Status
  status                VARCHAR(50) DEFAULT 'confirmed' CHECK (
                          status IN ('confirmed', 'cancelled', 'rescheduled', 'completed', 'no_show')
                        ),
  table_number          VARCHAR(20),
  cancel_token          VARCHAR(100) UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),

  -- Consent & compliance (PDPA)
  pdpa_consent          BOOLEAN NOT NULL DEFAULT false,
  pdpa_consent_at       TIMESTAMPTZ,

  -- Notifications
  confirmation_sent_at  TIMESTAMPTZ,
  reminder_sent_at      TIMESTAMPTZ,
  qr_scanned_at         TIMESTAMPTZ,  -- on-site check-in time

  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_slot ON bookings(slot_id);
CREATE INDEX idx_bookings_exhibitor ON bookings(exhibitor_id);
CREATE INDEX idx_bookings_email ON bookings(visitor_email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_ref ON bookings(ref);
CREATE INDEX idx_bookings_cancel_token ON bookings(cancel_token);

-- ── ADMIN USERS ─────────────────────────────────────────────
CREATE TABLE admin_users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  name            VARCHAR(150),
  role            VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'staff')),
  is_active       BOOLEAN DEFAULT true,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── AUDIT / EVENT LOG ───────────────────────────────────────
CREATE TABLE booking_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  event_type      VARCHAR(50) NOT NULL CHECK (event_type IN (
                    'created',
                    'confirmed',
                    'rescheduled',
                    'cancelled',
                    'confirmation_email_sent',
                    'reminder_email_sent',
                    'exhibitor_notified',
                    'reschedule_email_sent',
                    'cancellation_email_sent',
                    'qr_scanned',
                    'no_show_marked',
                    'completed'
                  )),
  notes           TEXT,
  previous_slot_id UUID REFERENCES slots(id), -- populated on reschedule
  created_by      VARCHAR(100) DEFAULT 'system', -- 'system' or admin email
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_booking_events_booking ON booking_events(booking_id);
CREATE INDEX idx_booking_events_type ON booking_events(event_type);

-- ── ZIPEVENT SYNC LOG ───────────────────────────────────────
CREATE TABLE zipevent_sync_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type       VARCHAR(50) CHECK (sync_type IN ('full', 'delta', 'webhook')),
  status          VARCHAR(50) CHECK (status IN ('success', 'failed', 'partial')),
  exhibitors_added    INTEGER DEFAULT 0,
  exhibitors_updated  INTEGER DEFAULT 0,
  exhibitors_removed  INTEGER DEFAULT 0,
  error_message   TEXT,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

-- ── HELPER FUNCTION: Generate Booking Ref ───────────────────
CREATE OR REPLACE FUNCTION generate_booking_ref()
RETURNS VARCHAR AS $$
DECLARE
  new_ref VARCHAR;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM bookings;
  new_ref := 'AT2026-BM-' || LPAD(counter::TEXT, 5, '0');
  RETURN new_ref;
END;
$$ LANGUAGE plpgsql;

-- ── TRIGGER: Auto-update updated_at ─────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_exhibitors_updated_at
  BEFORE UPDATE ON exhibitors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── TRIGGER: Lock slot on booking creation ──────────────────
CREATE OR REPLACE FUNCTION lock_slot_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE slots SET is_available = false WHERE id = NEW.slot_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lock_slot
  AFTER INSERT ON bookings
  FOR EACH ROW
  WHEN (NEW.status = 'confirmed')
  EXECUTE FUNCTION lock_slot_on_booking();

-- ── TRIGGER: Release slot on cancellation ───────────────────
CREATE OR REPLACE FUNCTION release_slot_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('cancelled') AND OLD.status = 'confirmed' THEN
    UPDATE slots SET is_available = true WHERE id = NEW.slot_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_release_slot
  AFTER UPDATE ON bookings
  FOR EACH ROW
  WHEN (NEW.status = 'cancelled' AND OLD.status != 'cancelled')
  EXECUTE FUNCTION release_slot_on_cancel();

-- ── SEED: Sample admin user (change password in production!) ─
-- Password: admin123 (bcrypt hash — MUST change before go-live)
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'admin@ageinginnovationexpo.com',
  '$2b$12$placeholderhashreplacebeforegoinglivepleasethankyou',
  'KRS XPANSION Admin',
  'super_admin'
);

-- ============================================================
-- NOTE: Session slot duration (30 or 45 min) is TBC (OQ-01).
-- The schema is duration-agnostic — slots store start_time
-- and end_time explicitly, so changing duration only affects
-- the slot generation script, not the schema itself.
-- ============================================================
