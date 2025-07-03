import { db, procedure, TRPCError } from '#root/deps.js'
import { z } from 'zod'

export const getDetailInTheGroup = procedure
  .input(
    z.object({
      groupId: z.number()
    })
  )
  .query(async ({ input }) => {
    const [group, details] = await Promise.all([
      db
        .selectFrom('metal_flow.detail_group')
        .where('id', '=', input.groupId)
        .select(['id', 'name'])
        .executeTakeFirst(),
      db
        .selectFrom('metal_flow.detail_group_details as dgd')
        .where('dgd.group_id', '=', input.groupId)
        .leftJoin('metal_flow.details as d', 'd.id', 'dgd.detail_id')
        .where('d.logical_group_id', 'is', null)
        .select(['d.id', 'd.name', 'd.part_code', 'd.logical_group_id'])
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
        group_id: d.logical_group_id
      }))
    }
  })
