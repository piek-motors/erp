import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('metal_flow.materials')
    .addColumn('stock', 'numeric', eb => eb.defaultTo(0))
    .execute()

  await db.schema
    .alterTable('metal_flow.details')
    .addColumn('stock', 'int8', eb => eb.defaultTo(0))
    .execute()
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('metal_flow.materials')
    .dropColumn('stock')
    .execute()
  await db.schema.alterTable('metal_flow.details').dropColumn('stock').execute()
}
