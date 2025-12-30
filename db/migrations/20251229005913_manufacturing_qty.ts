import { sql } from 'kysely'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.orders')
    .addColumn('output_qty', 'integer')
    .execute()

  await sql`
    ALTER TABLE pdo.manufacturing RENAME TO pdo.orders;
  `.execute(db)
}

export async function down(db: KDB): Promise<void> {
  await sql`
    ALTER TABLE pdo.orders RENAME TO pdo.manufacturing;
  `.execute(db)

  await db.schema.alterTable('pdo.orders').dropColumn('output_qty').execute()
}
