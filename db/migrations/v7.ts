import { tables } from '../const'
import { type KDB } from '../schema'

export const up = async (db: KDB) => {
  await db.schema
    .alterTable(tables.pdo.materials)
    .addColumn('label', 'text', b => b.notNull().unique())
    .execute()
}

export const down = async (db: KDB) => {
  await db.schema.alterTable(tables.pdo.materials).dropColumn('label').execute()
}
