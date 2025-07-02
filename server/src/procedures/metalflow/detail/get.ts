import { db, TRPCError } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { z } from 'zod'

export const getDetailProcedure = publicProcedure
  .input(
    z.object({
      id: z.number()
    })
  )
  .query(async ({ input }) => {
    const [detail, detailMaterials, attachments] = await Promise.all([
      db
        .selectFrom('metal_flow.details')
        .where('id', '=', input.id)
        .selectAll()
        .executeTakeFirstOrThrow()
        .catch(err => {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: err.message
          })
        }),
      db
        .selectFrom('metal_flow.detail_materials as dm')
        .leftJoin('metal_flow.materials', join =>
          join
            .onRef('material_id', '=', 'dm.material_id')
            .onRef('id', '=', 'material_id')
        )
        .selectAll()
        .where('detail_id', '=', input.id)
        .execute(),
      db
        .selectFrom('metal_flow.detail_attachments')
        .leftJoin('attachments', join => join.onRef('attachment_id', '=', 'id'))
        .where('detail_id', '=', input.id)
        .selectAll()
        .execute()
    ])
    const group = await db
      .selectFrom('metal_flow.detail_group')
      .where('id', '=', detail.logical_group_id)
      .select('name')
      .executeTakeFirst()

    return {
      detail,
      detail_materials: detailMaterials,
      attachments,
      groupName: group?.name ?? null
    }
  })
