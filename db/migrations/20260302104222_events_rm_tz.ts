import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    ALTER TABLE attendance.events
    ALTER COLUMN "timestamp"
    TYPE timestamp WITHOUT time zone
    USING "timestamp" AT TIME ZONE 'UTC'
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    ALTER TABLE attendance.events
    ALTER COLUMN "timestamp"
    TYPE timestamp WITH time zone
    USING "timestamp" AT TIME ZONE 'UTC'
  `.execute(db)
}
