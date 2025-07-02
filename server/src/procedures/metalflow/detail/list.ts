import { db, publicProcedure, sql } from '#root/deps.js'

export const getDetailListProcedure = publicProcedure.query(
  async ({ input }) => {
    const result = await db
      .selectFrom('metal_flow.details as d')
      .leftJoin('metal_flow.detail_materials as dm', 'dm.detail_id', 'd.id')
      .leftJoin('metal_flow.materials as m', 'm.id', 'dm.material_id')
      .select([
        'd.id',
        'd.name',
        'd.part_code',
        'd.logical_group_id',
        sql<
          {
            material_id: number
            data: {
              length: string
              weight: string
            }
          }[]
        >`COALESCE(JSON_AGG(dm.*) FILTER (WHERE dm.detail_id IS NOT NULL), '[]')`.as(
          'materials'
        ),
        sql<string>`COALESCE(JSON_AGG(m.label) FILTER (WHERE m.id IS NOT NULL), '[]')`.as(
          'materials_labels'
        )
      ])
      .groupBy('d.id')
      .orderBy('d.id', 'desc')
      .execute()

    return result.map((row, idx) => {
      return [
        row.id,
        row.name,
        row.part_code,
        row.materials.map(material => [
          material.material_id,
          row.materials_labels[idx],
          material.data.length,
          material.data.weight
        ]),
        row.logical_group_id
      ]
    })
  }
)
