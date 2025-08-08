import dotenv from 'dotenv'
import { sql } from 'kysely'
import {
  getMaterialConstructor,
  Material,
  MaterialShapeAbstractionLayer
} from 'models'
import { KDB } from 'schema'
import { connect } from '../connect'

function main() {
  dotenv.config({ path: '../.env' })
  const dbConnectionUrl = process.env['PG_CONN_STR']
  if (!dbConnectionUrl) {
    throw new Error('PG_CONN_STR is not set')
  }

  const db = connect(dbConnectionUrl)
  return recalculateMaterialLabels(db)
}

export async function recalculateMaterialLabels(db: KDB) {
  const materials = await db
    .selectFrom('metal_flow.materials')
    .selectAll()
    .execute()

  const updateBuffer: Material[] = []

  for (const material of materials) {
    const constructor = getMaterialConstructor(material.shape)
    const m = new constructor(material.id, material.label, material.alloy)
    MaterialShapeAbstractionLayer.importShapeData(m, material.shape_data)
    try {
      m.label = m.deriveLabel()
      updateBuffer.push(m)
    } catch (error) {
      console.log(material.shape_data)
      console.error(
        `failed to derive label for ${material.id} ${material.label} ${error}`
      )
    }
  }

  await db
    .updateTable('metal_flow.materials')
    .from(
      updateBuffer
        .reduce((qb, material) => {
          return qb.union(
            db.selectNoFrom([
              sql<number>`${material.id}::integer`.as('id'),
              sql<string>`${material.label}::text`.as('label')
            ])
          )
        }, db.selectNoFrom([sql<number>`${updateBuffer[0].id}::integer`.as('id'), sql<string>`${updateBuffer[0].label}::text`.as('label')]))
        .as('data_table')
    )
    .set(eb => ({
      label: eb.ref('data_table.label')
    }))
    .whereRef('metal_flow.materials.id', '=', 'data_table.id')
    .execute()

  console.log('done')
}

main()
