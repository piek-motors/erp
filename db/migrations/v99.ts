import { type KDB } from '../schema'

export const up = async (db: KDB) => {
  async function rn(table: string, column: string, newName: string) {
    await db.schema.alterTable(table).renameColumn(column, newName).execute()
  }

  async function dropColumn(table: string, column: string) {
    await db.schema.alterTable(table).dropColumn(column).execute()
  }

  await rn('public.refresh_tokens', 'UserID', 'user_id')
  await rn('public.refresh_tokens', 'RefreshToken', 'token')
  await rn('public.refresh_tokens', 'ID', 'id')

  await dropColumn('orders.orders', 'PaidAmount')
  await dropColumn('orders.orders', 'CheckListTPLID')

  await rn('orders.orders', 'OrderID', 'id')
  await rn('orders.orders', 'OrderStatusID', 'status')
  await rn('orders.orders', 'ManagerID', 'manager_id')
  await rn('orders.orders', 'CreatingDate', 'created_at')
  await rn('orders.orders', 'TotalAmount', 'total_amount')
  await rn('orders.orders', 'InvoiceNumber', 'invoice_number')
  await rn('orders.orders', 'ShippingDate', 'shipping_date')
  await rn('orders.orders', 'AwaitingDispatch', 'awaiting_dispatch')
  await rn('orders.orders', 'AcceptanceDate', 'acceptance_date')
  await rn('orders.orders', 'ActualShippingDate', 'actual_shipping_date')
  await rn('orders.orders', 'OrderNumber', 'order_number')
  await rn('orders.orders', 'IsReclamation', 'is_reclamation')
  await rn('orders.orders', 'NeedAttention', 'need_attention')

  await rn('orders.order_payments', 'OrderID', 'order_id')
  await rn('orders.order_payments', 'Date', 'date')
  await rn('orders.order_payments', 'PaidAmount', 'amount')
  await rn('orders.order_payments', 'ID', 'id')

  await rn('orders.order_items', 'OrderItemID', 'id')
  await rn('orders.order_items', 'OrderID', 'order_id')
  await rn('orders.order_items', 'FullName', 'description')

  await dropColumn('orders.order_items', 'SerialStarts')
  await dropColumn('orders.order_items', 'SerialEnds')

  await rn('orders.notifications', 'ID', 'id')
  await rn('orders.notifications', 'OrderID', 'order_id')
  await rn('orders.notifications', 'CommentID', 'comment_id')
  await rn('orders.notifications', 'MentionedUser', 'user_id')

  await rn('orders.comments', 'CommentID', 'id')
  await rn('orders.comments', 'OrderID', 'order_id')
  await rn('orders.comments', 'UserID', 'user_id')
  await rn('orders.comments', 'Timestamp', 'created_at')

  await rn('orders.attachments', 'OrderID', 'order_id')
  await rn('orders.attachments', 'FileName', 'filename')
  await rn('orders.attachments', 'ID', 'id')
  await rn('orders.attachments', 'UploadingDate', 'uploaded_at')
}

export const down = async (db: KDB) => {}
