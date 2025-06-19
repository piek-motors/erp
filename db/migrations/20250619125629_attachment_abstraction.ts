import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .createTable('attachments')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('key', 'text', col => col.notNull())
    .addColumn('filename', 'text', col => col.notNull())
    .addColumn('size', 'integer', col => col.notNull())
    .addColumn('uploaded_at', 'timestamp', col => col.notNull())
    .execute()

  await db.schema
    .createTable('orders.order_attachments')
    .addColumn('order_id', 'integer', col =>
      col.references('orders.orders.id').onDelete('cascade').notNull()
    )
    .addColumn('attachment_id', 'integer', col =>
      col.references('attachments.id').onDelete('cascade').notNull()
    )
    .addPrimaryKeyConstraint('orders_attachments_pkey', [
      'order_id',
      'attachment_id'
    ])
    .execute()

  await db.schema
    .createTable('metal_flow.detail_attachments')
    .addColumn('detail_id', 'integer', col =>
      col.references('metal_flow.details.id').onDelete('cascade').notNull()
    )
    .addColumn('attachment_id', 'integer', col =>
      col.references('attachments.id').onDelete('cascade').notNull()
    )
    .addPrimaryKeyConstraint('detail_attachments_pkey', [
      'detail_id',
      'attachment_id'
    ])
    .execute()

  const existingOrderAttachments = await db
    .selectFrom('orders.attachments')
    .selectAll()
    .execute()

  console.log(
    `Found ${existingOrderAttachments.length} existing order attachments to migrate`
  )

  if (existingOrderAttachments.length > 0) {
    const insertResult = await db
      .insertInto('attachments')
      .values(
        existingOrderAttachments.map(each => ({
          id: each.id,
          key: each.key,
          filename: each.filename,
          size: each.size || 0,
          uploaded_at: each.uploaded_at
        }))
      )
      .returning('id')
      .execute()

    console.log(`Successfully migrated ${insertResult.length} attachments`)

    if (existingOrderAttachments.length > 0) {
      await db
        .insertInto('orders.order_attachments')
        .values(
          existingOrderAttachments.map(each => ({
            order_id: each.order_id,
            attachment_id: each.id
          }))
        )
        .execute()
    }
  }
  console.log('Successfully created detail_attachments junction table')
}

export async function down(db: KDB): Promise<void> {
  await db.schema.dropTable('metal_flow.detail_attachments').execute()
  await db.schema.dropTable('orders.order_attachments').execute()
  await db.schema.dropTable('attachments').execute()
}
