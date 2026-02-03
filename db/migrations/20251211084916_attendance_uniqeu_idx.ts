import { sql } from 'kysely'
import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await sql`
        DELETE FROM attendance.intervals
        WHERE ent_event_id IN (
            SELECT ent_event_id
            FROM (
                SELECT
                    ent_event_id,
                    ROW_NUMBER() OVER(PARTITION BY card, ent, ext) as rn
                FROM attendance.intervals
            ) as subquery
            WHERE rn > 1
        );
    `.execute(db)

  await sql`
        CREATE UNIQUE INDEX "attendance_intervals_unique_card_ent_ext"
        ON attendance.intervals (card, ent, ext)
    `.execute(db)
}

export async function down(db: KDB): Promise<void> {
  await sql`DROP INDEX "attendance_intervals_unique_card_ent_ext"`.execute(db)
}
