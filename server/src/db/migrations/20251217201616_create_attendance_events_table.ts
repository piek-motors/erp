import type { KDB } from '../schema/index.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .createTable('hr.events')
    .addColumn('id', 'integer', b => b.primaryKey())
    .addColumn('card', 'text', b => b.notNull())
    .addColumn('timestamp', 'timestamp', b => b.notNull())
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema.dropTable('hr.events').execute()
}
