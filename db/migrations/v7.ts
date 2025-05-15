import { tables } from '../const'
import { type KDB } from '../schema'

export const up = async (db: KDB) => {
  await db.deleteFrom('metal_pdo.materials').execute()
  await db.schema
    .alterTable(tables.pdo.materials)
    .addColumn('label', 'text', b => b.notNull().unique())
    .execute()

  await db.schema.alterTable(tables.pdo.materials).dropColumn('shape').execute()
  await db.schema
    .alterTable(tables.pdo.materials)
    .addColumn('shape', 'integer', b => b.notNull())
    .execute()
}

export const down = async (db: KDB) => {
  await db.schema.alterTable(tables.pdo.materials).dropColumn('label').execute()
}
