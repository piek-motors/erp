import { type KDB } from '../schema'

export const up = async (db: KDB) => {
  async function rn(table: string, column: string, newName: string) {
    await db.schema.alterTable(table).renameColumn(column, newName).execute()
  }

  async function dropColumn(table: string, column: string) {
    await db.schema.alterTable(table).dropColumn(column).execute()
  }
  await rn('orders.attachments', 'Key', 'key')
  await rn('orders.attachments', 'Size', 'size')
  await rn('orders.comments', 'Text', 'text')
  await rn('orders.notifications', 'Viewed', 'seen')
  await rn('orders.order_items', 'Name', 'name')
  await rn('orders.order_items', 'Quantity', 'quantity')
  await rn('orders.order_items', 'Fitter', 'assembler_name')
  await rn('orders.orders', 'Entity', 'contractor')
  await rn('orders.orders', 'City', 'city')
  await rn('orders.orders', 'Comment', 'comment')
}

export const down = async (db: KDB) => {}
