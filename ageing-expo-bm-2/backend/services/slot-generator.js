/**
 * Ageing Innovation Expo 2026 — Slot Generator
 *
 * Generates time slots for an exhibitor across all 3 event days.
 * Run this from the admin dashboard when inputting exhibitor availability.
 *
 * ⚠️  SESSION DURATION IS TBC (OQ-01) — defaults to 30 min.
 *     Update SLOT_DURATION_MINUTES once confirmed with client.
 */

const { Pool } = require('pg');

// ── CONFIG ──────────────────────────────────────────────────
const SLOT_DURATION_MINUTES = 30; // ⚠️ TBC: 30 or 45 — confirm with client (OQ-01)
const EVENT_DATES = ['2026-05-06', '2026-05-07', '2026-05-08'];
const BM_AREA_OPEN  = '10:00'; // ⚠️ TBC: confirm operating hours (OQ-02)
const BM_AREA_CLOSE = '18:00';

// ── HELPERS ─────────────────────────────────────────────────
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Generate all slots for a given day within the operating window.
 * @param {string} date - e.g. '2026-05-06'
 * @param {string} openTime - e.g. '10:00'
 * @param {string} closeTime - e.g. '18:00'
 * @param {number} durationMins - slot duration in minutes
 * @returns {Array} Array of {start_time, end_time} objects
 */
function generateDaySlots(date, openTime = BM_AREA_OPEN, closeTime = BM_AREA_CLOSE, durationMins = SLOT_DURATION_MINUTES) {
  const slots = [];
  let current = timeToMinutes(openTime);
  const end = timeToMinutes(closeTime);

  while (current + durationMins <= end) {
    slots.push({
      event_date: date,
      start_time: minutesToTime(current),
      end_time:   minutesToTime(current + durationMins),
    });
    current += durationMins;
  }

  return slots;
}

/**
 * Insert slots for an exhibitor across all 3 event days.
 * @param {string} exhibitorId - UUID of the exhibitor
 * @param {Object} availability - Per-day availability windows
 *   e.g. { '2026-05-06': { open: '10:00', close: '17:00' }, ... }
 *   Pass null for a date to skip that day entirely.
 */
async function createExhibitorSlots(exhibitorId, availability = null) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let totalCreated = 0;

    for (const date of EVENT_DATES) {
      const dayConfig = availability?.[date];
      if (dayConfig === null) {
        console.log(`Skipping ${date} — exhibitor marked as unavailable`);
        continue;
      }

      const open  = dayConfig?.open  || BM_AREA_OPEN;
      const close = dayConfig?.close || BM_AREA_CLOSE;
      const slots = generateDaySlots(date, open, close);

      for (const slot of slots) {
        await client.query(
          `INSERT INTO slots (exhibitor_id, event_date, start_time, end_time)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (exhibitor_id, event_date, start_time) DO NOTHING`,
          [exhibitorId, slot.event_date, slot.start_time, slot.end_time]
        );
        totalCreated++;
      }

      console.log(`  ✓ ${date}: ${slots.length} slots (${open}–${close}, ${SLOT_DURATION_MINUTES}min)`);
    }

    await client.query('COMMIT');
    console.log(`\nTotal slots created: ${totalCreated} for exhibitor ${exhibitorId}`);
    return totalCreated;

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

/**
 * Preview slots without inserting (for confirmation before save)
 */
function previewSlots(availability = null) {
  console.log(`\n📅 Slot Preview (${SLOT_DURATION_MINUTES}min duration)\n`);
  for (const date of EVENT_DATES) {
    const dayConfig = availability?.[date];
    if (dayConfig === null) { console.log(`${date}: SKIPPED`); continue; }
    const open  = dayConfig?.open  || BM_AREA_OPEN;
    const close = dayConfig?.close || BM_AREA_CLOSE;
    const slots = generateDaySlots(date, open, close);
    console.log(`${date} (${open}–${close}): ${slots.length} slots`);
    slots.forEach(s => console.log(`  ${s.start_time} – ${s.end_time}`));
  }
}

// ── EXAMPLE USAGE ────────────────────────────────────────────
/*
// Preview all 3 days with default hours:
previewSlots();

// Custom availability per day:
previewSlots({
  '2026-05-06': { open: '10:00', close: '17:00' },
  '2026-05-07': { open: '11:00', close: '18:00' },
  '2026-05-08': null, // not available on day 3
});

// Create slots for a real exhibitor:
createExhibitorSlots('uuid-of-exhibitor-here', {
  '2026-05-06': { open: '10:00', close: '17:00' },
  '2026-05-07': { open: '10:00', close: '18:00' },
  '2026-05-08': null,
});
*/

module.exports = { generateDaySlots, createExhibitorSlots, previewSlots, SLOT_DURATION_MINUTES };
