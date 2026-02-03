import type { KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.orders')
    .addColumn('current_operation_start_at', 'bigint')
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.orders')
    .dropColumn('current_operation_start_at')
    .execute()
}
