import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  await db.schema.dropTable('attendance.config').execute()
}

export async function down(db: KDB): Promise<void> {}
