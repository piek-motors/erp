import { sql } from 'kysely'
import type { KDB } from '../schema.js'

export async function up(db: KDB): Promise<void> {
  await sql`
      ALTER TABLE pdo.manufacturing RENAME TO orders;
    `.execute(db)
  await db.schema
    .alterTable('pdo.orders')
    .addColumn('output_qty', 'integer')
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await sql`
    ALTER TABLE pdo.orders RENAME TO pdo.manufacturing;
  `.execute(db)

  await db.schema.alterTable('pdo.orders').dropColumn('output_qty').execute()
}
