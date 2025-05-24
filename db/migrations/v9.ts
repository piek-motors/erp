import { sql } from 'kysely'
import { type KDB } from '../schema'

export const up = async (db: KDB) => {
  await db.schema.alterTable('erp.users').setSchema('public').execute()
  await db.schema.alterTable('erp.refresh_tokens').setSchema('public').execute()
  await sql`ALTER SCHEMA erp RENAME TO orders`.execute(db)
  await sql`ALTER SCHEMA metal_flow RENAME TO metal_flow`.execute(db)

  await db.schema
    .alterTable('public.users')
    .renameColumn('UserID', 'id')
    .execute()

  await db.schema
    .alterTable('public.users')
    .renameColumn('FirstName', 'first_name')
    .execute()

  await db.schema
    .alterTable('public.users')
    .renameColumn('LastName', 'last_name')
    .execute()
  await db.schema
    .alterTable('public.users')
    .renameColumn('Password', 'password')
    .execute()

  await db.schema
    .alterTable('public.users')
    .renameColumn('Email', 'email')
    .execute()

  // await db.schema
  //   .alterTable('public.refresh_tokens')
  //   .renameColumn('UserID', 'user_id')
  //   .renameColumn('RefreshToken', 'token')
  //   .renameColumn('ID', 'id')
  //   .execute()

  // await db.schema
  //   .alterTable('orders.orders')
  //   .renameColumn('OrderID', 'id')
  //   .renameColumn('OrderStatusID', 'status')
  //   .renameColumn('ManagerID', 'manager_id')
  //   .renameColumn('CreatingDate', 'created_at')
  //   .renameColumn('TotalAmount', 'total_amount')
  //   .renameColumn('InvoiceNumber', 'invoice_number')
  //   .renameColumn('ShippingDate', 'shipping_date')
  //   .renameColumn('AwaitingDispatch', 'awaiting_dispatch')
  //   .renameColumn('AcceptanceDate', 'acceptance_date')
  //   .renameColumn('ActualShippingDate', 'actual_shipping_date')
  //   .renameColumn('OrderNumber', 'order_number')
  //   .renameColumn('IsReclamation', 'is_reclamation')
  //   .renameColumn('NeedAttention', 'need_attention')
  //   .execute()

  // await db.schema
  //   .alterTable('orders.order_payments')
  //   .renameColumn('OrderID', 'order_id')
  //   .renameColumn('Date', 'date')
  //   .renameColumn('PaidAmount', 'amount')
  //   .renameColumn('ID', 'id')
  //   .execute()

  // await db.schema
  //   .alterTable('orders.order_items')
  //   .renameColumn('OrderItemID', 'id')
  //   .renameColumn('OrderID', 'order_id')
  //   .renameColumn('FullName', 'full_name')
  //   .renameColumn('SerialStarts', 'serial_starts')
  //   .renameColumn('SerialEnds', 'serial_ends')
  //   .execute()

  // await db.schema
  //   .alterTable('orders.notifications')
  //   .renameColumn('ID', 'id')
  //   .renameColumn('OrderID', 'order_id')
  //   .renameColumn('CommentID', 'comment_id')
  //   .renameColumn('MentionedUser', 'mentioned_user')
  //   .execute()

  // await db.schema
  //   .alterTable('orders.comments')
  //   .renameColumn('CommentID', 'id')
  //   .renameColumn('OrderID', 'order_id')
  //   .renameColumn('UserID', 'user_id')
  //   .renameColumn('Timestamp', 'created_at')
  //   .execute()

  // await db.schema
  //   .alterTable('orders.attachments')
  //   .renameColumn('OrderID', 'order_id')
  //   .renameColumn('FileName', 'filename')
  //   .renameColumn('ID', 'id')
  //   .renameColumn('UploadingDate', 'uploaded_at')
  //   .execute()
}

export const down = async (db: KDB) => {
  await db.schema.alterTable('public.users').setSchema('orders').execute()
  await db.schema
    .alterTable('public.refresh_tokens')
    .setSchema('orders')
    .execute()

  await db.schema
    .alterTable('orders.users')
    .renameColumn('id', 'UserID')
    .execute()

  await sql`ALTER SCHEMA orders RENAME TO erp`.execute(db)
  await sql`ALTER SCHEMA metal_flow RENAME TO metal_flow`.execute(db)
}
