import { db, publicProcedure, TRPCError, z } from '#root/deps.js'

export const getManufacturingOrder = publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    const manufacturingOrder = await db
      .selectFrom('metal_flow.manufacturing as m')
      .selectAll('m')
      .innerJoin('metal_flow.details as d', 'm.detail_id', 'd.id')
      .select(['d.name as detail_name', 'd.logical_group_id as group_id'])
      .where('m.id', '=', input.id)
      .executeTakeFirst()

    if (!manufacturingOrder) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Manufacturing order with id ${input.id} not found`
      })
    }

    return {
      ...manufacturingOrder,
      material_writeoffs: undefined
    }
  })
