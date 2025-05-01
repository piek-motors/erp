import { tables } from '../const.ts'
import { type KDB } from '../schema.ts'

export const up = async (db: KDB) => {
  await db.schema.alterTable(tables.pdo.materials).dropColumn('name').execute()
  await db.schema
    .alterTable(tables.pdo.materials)
    .dropColumn('category')
    .execute()
}

export const down = async (db: KDB) => {}
