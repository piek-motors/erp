import { db, procedure, TRPCError } from '#root/deps.js'
import { z } from 'zod'

export const getDetailInTheGroup = procedure
  .input(
    z.object({
      id: z.number()
    })
  )
  .query(async ({ input }) => {
    const [group, details] = await Promise.all([
      db
        .selectFrom('metal_flow.detail_group')
        .where('id', '=', input.id)
        .select(['id', 'name'])
        .executeTakeFirst(),
      db
        .selectFrom('metal_flow.detail_group_details as dgd')
        .innerJoin('metal_flow.details as d', 'd.id', 'dgd.detail_id')
        .where('dgd.group_id', '=', input.id)
        .select(['d.id', 'd.name', 'd.part_code'])
        .orderBy('d.name', 'asc')
        .execute()
    ])

    if (!group) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Detail group not found'
      })
    }

    const directDetails = await db
      .selectFrom('metal_flow.details')
      .selectAll()
      .where('logical_group_id', '=', group.id)
      .execute()

    return {
      group,
      details: [...directDetails, ...details].map(d => ({
        id: d.id,
        name: d.name,
        part_code: d.part_code,
        group_id: group.id
      }))
    }
  })
