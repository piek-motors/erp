import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.details')
    .addColumn('stock_location', 'text')
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.details')
    .dropColumn('stock_location')
    .execute()
}
