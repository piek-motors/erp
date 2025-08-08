import { EnUnit } from 'models'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.deleteFrom('metal_flow.operations').execute()
  await db.deleteFrom('metal_flow.manufacturing').execute()
  await db
    .updateTable('metal_flow.materials')
    .set({
      stock: 0,
      unit: EnUnit.MilliMeter
    })
    .execute()
  await db
    .updateTable('metal_flow.details')
    .set({
      stock: 0
    })
    .execute()
}

export async function down(db: KDB): Promise<void> {}
