import { sql } from 'kysely' // or whatever SQL helper you use
import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  // 1. Remove duplicates (keep lowest id)
  await sql`
    DELETE FROM attendance.events e
    USING attendance.events dup
    WHERE e.id > dup.id
      AND e.card = dup.card
      AND e."timestamp" = dup."timestamp";
  `.execute(db)

  // 1. Drop employee_id column if exists
  await sql`
    ALTER TABLE attendance.events
    DROP COLUMN employee_id;
  `.execute(db)

  // 2. Create sequence for id if it doesn't exist
  await sql`
    CREATE SEQUENCE attendance_events_id_seq;
  `.execute(db)

  // 3. Backfill sequence to avoid conflicts with existing ids
  await sql`
    SELECT setval(
      'attendance_events_id_seq',
      COALESCE((SELECT MAX(id) FROM attendance.events), 0)
    );
  `.execute(db)

  // 4. Set id default to use the sequence
  await sql`
    ALTER TABLE attendance.events
    ALTER COLUMN id SET DEFAULT nextval('attendance_events_id_seq');
  `.execute(db)

  // 5. Add unique index on (card, timestamp)
  await sql`
    CREATE UNIQUE INDEX attendance_events_card_ts_idx
    ON attendance.events (card, timestamp);
  `.execute(db)

  // 6. Add regular index on timestamp
  await sql`
    CREATE INDEX attendance_events_timestamp_idx
    ON attendance.events (timestamp);
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
  // 1. Drop the regular timestamp index
  await sql`
    DROP INDEX attendance_events_timestamp_idx;
  `.execute(db)

  // 1. Drop the unique index
  await sql`
    DROP INDEX attendance_events_card_ts_idx;
  `.execute(db)

  // 2. Remove default from id
  await sql`
    ALTER TABLE attendance.events
    ALTER COLUMN id DROP DEFAULT;
  `.execute(db)

  // 3. Drop the sequence
  await sql`
    DROP SEQUENCE attendance_events_id_seq;
  `.execute(db)

  // 4. Add employee_id column back as nullable
  await sql`
    ALTER TABLE attendance.events
    ADD COLUMN employee_id BIGINT;
  `.execute(db)
}
