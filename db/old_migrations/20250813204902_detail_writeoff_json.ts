import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.details')
    .addColumn('automatic_writeoff', 'jsonb')
    .execute()

  const detailMaterials: any[] = []
  // Group all materials for each detail_id
  const materialsByDetail: Record<
    number,
    Array<{ material_id: number; length: number }>
  > = {}
  for (const record of detailMaterials) {
    if (!materialsByDetail[record.detail_id]) {
      materialsByDetail[record.detail_id] = []
    }
    materialsByDetail[record.detail_id].push({
      material_id: record.material_id,
      length: record.data.length
    })
  }

  // for (const detailIdStr of Object.keys(materialsByDetail)) {
  //   const detailId = Number(detailIdStr)
  //   const materials = materialsByDetail[detailId]
  //   await db
  //     .updateTable('pdo.details')
  //     .set({
  //       automatic_writeoff: {
  //         materials,
  //         details: []
  //       }
  //     })
  //     .where('id', '=', detailId)
  //     .execute()
  // }
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('pdo.details')
    .dropColumn('automatic_writeoff')
    .execute()
}
