import type { KDB } from '../../db/index.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.materials')
    .addColumn('safe_stock_leftover', 'integer', col => col.defaultTo(null))
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.materials')
    .dropColumn('safe_stock_leftover')
    .execute()
}
