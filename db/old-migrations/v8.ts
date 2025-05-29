import { type KDB } from '../schema'

export const up = async (db: KDB) => {
  await db.schema
    .alterTable('erp.Users')
    .dropConstraint('Users_AccessLevelID_fkey')
    .execute()
  await db.schema.dropTable('erp.AccessLevels').ifExists().execute()
  await db.schema
    .alterTable('erp.Orders')
    .dropConstraint('Orders_OrderStatusID_fkey')
    .execute()
  await db.schema.dropTable('erp.OrderStatus').ifExists().execute()
  await db.schema.alterTable('erp.Users').renameTo('users').execute()
  await db.schema.alterTable('erp.Tokens').renameTo('refresh_tokens').execute()
  await db.schema
    .alterTable('erp.PaymentHistory')
    .renameTo('order_payments')
    .execute()
  await db.schema.alterTable('erp.Orders').renameTo('orders').execute()
  await db.schema.alterTable('erp.OrderItems').renameTo('order_items').execute()
  await db.schema
    .alterTable('erp.Notifications')
    .renameTo('notifications')
    .execute()
  await db.schema.alterTable('erp.Docs').renameTo('attachments').execute()
  await db.schema.alterTable('erp.Comments').renameTo('comments').execute()

  await db.schema.alterTable('erp.users').dropColumn('AccessLevelID').execute()
  await db.schema
    .alterTable('erp.users')
    .addColumn('role', 'integer', b => b.notNull().defaultTo(2))
    .execute()
}

export const down = async (db: KDB) => {}
