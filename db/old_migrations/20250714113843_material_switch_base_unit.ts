import { EnUnit } from 'models'
import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.deleteFrom('pdo.operations').execute()
  await db.deleteFrom('pdo.manufacturing').execute()
  await db
    .updateTable('pdo.materials')
    .set({
      stock: 0,
      unit: EnUnit.MilliMeter
    })
    .execute()
  await db
    .updateTable('pdo.details')
    .set({
      stock: 0
    })
    .execute()
}

export async function down(db: KDB): Promise<void> {}
