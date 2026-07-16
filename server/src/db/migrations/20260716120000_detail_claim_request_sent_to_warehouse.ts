import type { KDB } from '../../db/index.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.detail_claim_request')
    .addColumn('sent_to_warehouse_at', 'timestamp')
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.detail_claim_request')
    .dropColumn('sent_to_warehouse_at')
    .execute()
}
