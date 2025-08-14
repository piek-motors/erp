import { type KDB } from '../schema'

export async function up(db: KDB): Promise<void> {
  await db.schema
    .alterTable('metal_flow.details')
    .addColumn('automatic_writeoff', 'jsonb')
    .execute()

  const detailMaterials = await db
    .selectFrom('metal_flow.detail_materials')
    .selectAll()
    .execute()

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

  for (const detailIdStr of Object.keys(materialsByDetail)) {
    const detailId = Number(detailIdStr)
    const materials = materialsByDetail[detailId]
    await db
      .updateTable('metal_flow.details')
      .set({
        automatic_writeoff: {
          materials,
          details: []
        }
      })
      .where('id', '=', detailId)
      .execute()
  }
}

export async function down(db: KDB): Promise<void> {
  await db.schema
    .alterTable('metal_flow.details')
    .dropColumn('automatic_writeoff')
    .execute()
}
