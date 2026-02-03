import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .createTable('attendance.events')
    .addColumn('id', 'integer', b => b.primaryKey())
    .addColumn('card', 'text', b => b.notNull())
    .addColumn('timestamp', 'timestamp', b => b.notNull())
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema.dropTable('attendance.events').execute()
}
