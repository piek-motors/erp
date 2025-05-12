import { tables } from '../const.ts'
import { type KDB } from '../schema.ts'

export const up = async (db: KDB) => {
  await db.schema
    .alterTable(tables.pdo.detail_materials)
    .dropColumn('cost')
    .execute()
  await db.schema
    .alterTable(tables.pdo.detail_materials)
    .addColumn('data', 'jsonb')
    .execute()
}

export const down = async (db: KDB) => {}
