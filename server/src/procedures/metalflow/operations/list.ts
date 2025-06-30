import { db, publicProcedure, z } from '#root/deps.js'

export const listOperations = publicProcedure
  .input(z.object({}))
  .query(async ({ ctx, input }) => {
    const operations = await db
      .selectFrom('metal_flow.operations as o')
      .leftJoin('metal_flow.materials as m', 'o.material_id', 'm.id')
      .leftJoin('metal_flow.details as d', 'o.detail_id', 'd.id')
      .select([
        'o.id as operation_id',
        'o.qty',
        'o.timestamp',
        'o.operation_type',
        'o.data',
        'o.reason',
        'm.label as material_label',
        'm.unit as material_unit',
        'd.name as detail_name'
      ])
      .limit(100)
      .orderBy('operation_id', 'desc')
      .execute()

    return operations
  })
