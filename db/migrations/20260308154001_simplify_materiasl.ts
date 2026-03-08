import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.materials')
    .dropColumn('shape')
    .dropColumn('shape_data')
    .execute()
}

export async function down(db: KDB): Promise<void> {}
