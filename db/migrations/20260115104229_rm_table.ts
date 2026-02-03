import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema.dropTable('pdo.materials_quarterly_spending').execute()
}

export async function down(db: KDB): Promise<void> {}
