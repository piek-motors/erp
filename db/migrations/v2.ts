import { tables } from '../const'
import { type KDB } from '../schema'

export const up = async (db: KDB) => {
  await db.schema
    .createTable(tables.pdo.details)
    .addColumn('id', 'serial', b => b.primaryKey())
    // add column which will be used to store the input materials (several materials ids can be input)
    .addColumn('name', 'text', b => b.notNull())
    .execute()

  await db.schema
    .createTable(tables.pdo.detail_materials)
    .addColumn('detail_id', 'integer', b =>
      b.references('metal_flow.details.id').onDelete('cascade')
    )
    .addColumn('material_id', 'integer', b =>
      b.references('metal_flow.materials.id').onDelete('cascade')
    )
    .addPrimaryKeyConstraint('detail_materials_p_key', [
      'detail_id',
      'material_id'
    ])
    .execute()
}

export const down = async (db: KDB) => {
  await db.schema.dropTable(tables.pdo.detail_materials).execute()
  await db.schema
    .alterTable(tables.pdo.details)
    .addColumn('materials', 'integer', b => b)
    .execute()
}
