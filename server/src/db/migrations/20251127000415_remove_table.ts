import type { KDB } from '../schema/index.js'

export async function up(db: KDB): Promise<void> {
  await db.schema.dropTable('hr.config').execute()
}

export async function down(db: KDB): Promise<void> {}
