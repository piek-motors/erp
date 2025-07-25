import { db, TRPCError } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import { z } from 'zod'

export const getDetail = publicProcedure
  .input(
    z.object({
      id: z.number()
    })
  )
  .query(async ({ input }) => {
    const [detail, detailMaterials, attachments, lastManufacturing] =
      await Promise.all([
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
          .leftJoin('attachments', join =>
            join.onRef('attachment_id', '=', 'id')
          )
          .where('detail_id', '=', input.id)
          .selectAll()
          .execute(),
        db
          .selectFrom('metal_flow.manufacturing')
          .select(['finished_at', 'qty'])
          .where('detail_id', '=', input.id)
          .where('finished_at', 'is not', null)
          .orderBy('finished_at', 'desc')
          .limit(1)
          .executeTakeFirst()
      ])
    return {
      detail,
      detail_materials: detailMaterials,
      attachments,
      last_manufacturing: lastManufacturing
        ? {
            date: lastManufacturing.finished_at,
            qty: lastManufacturing.qty
          }
        : null
    }
  })
