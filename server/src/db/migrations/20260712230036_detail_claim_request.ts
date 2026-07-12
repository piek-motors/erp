import type { KDB } from '../../db/index.js'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .createTable('pdo.detail_claim_request')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('order_id', 'varchar', col => col.notNull())
    .addColumn('product_name', 'varchar', col => col.notNull())
    .addColumn('product_qty', 'integer', col => col.notNull())
    .addColumn('created_at', 'timestamp', col =>
      col.notNull().defaultTo(db.fn('now')),
    )
    .addColumn('fulfilled_at', 'timestamp')
    .execute()

  await db.schema
    .createTable('pdo.detail_claim_request_detail')
    .addColumn('request_id', 'integer', col =>
      col
        .notNull()
        .references('pdo.detail_claim_request.id')
        .onDelete('cascade'),
    )
    .addColumn('detail_id', 'integer', col =>
      col.notNull().references('pdo.details.id').onDelete('cascade'),
    )
    .addColumn('qty', 'integer', col => col.notNull())
    .addPrimaryKeyConstraint('detail_claim_request_detail_pk', [
      'request_id',
      'detail_id',
    ])
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema.dropTable('pdo.detail_claim_request_detail').execute()
  await db.schema.dropTable('pdo.detail_claim_request').execute()
}
