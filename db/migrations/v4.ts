import { tables } from '../const'
import { KDB } from '../schema'

export const up = async (db: KDB) => {
  await db.schema
    .alterTable(tables.pdo.materials)
    .addColumn('shape_data', 'jsonb')
    .execute()
}

export const down = async (db: KDB) => {}
