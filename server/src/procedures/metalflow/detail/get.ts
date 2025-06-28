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
        .leftJoin('metal_flow.detail_materials', join =>
          join.onRef('detail_id', '=', 'id')
        )
        .where('id', '=', input.id)
        .selectAll()
        .executeTakeFirstOrThrow()
        .catch(d => {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Detail not found'
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
    return { detail, detail_materials: detailMaterials, attachments }
  })
