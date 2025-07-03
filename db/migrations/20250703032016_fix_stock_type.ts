import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  // Change stock column type from numeric to real in material table
  await db.schema
    .alterTable('metal_flow.materials')
    .alterColumn('stock', col => col.setDataType('real'))
    .execute()

  // Change stock column type from numeric to real in detail table
  await db.schema
    .alterTable('metal_flow.details')
    .alterColumn('stock', col => col.setDataType('real'))
    .execute()
}

export async function down(db: KDB): Promise<void> {
  // Revert stock column type back to numeric in material table
  await db.schema
    .alterTable('metal_flow.materials')
    .alterColumn('stock', col => col.setDataType('numeric'))
    .execute()

  // Revert stock column type back to numeric in detail table
  await db.schema
    .alterTable('metal_flow.details')
    .alterColumn('stock', col => col.setDataType('numeric'))
    .execute()
}
