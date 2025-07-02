import { db } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import {
  ErrDetailPartCodeUnique,
  isDetailPertCodeUniqueError
} from '#root/procedures/metalflow/detail/shared.js'
import { z } from 'zod'

export const createDetailProcedure = publicProcedure
  .input(
    z.object({
      name: z.string(),
      partCode: z.string(),
      groupId: z.number().nullable(),
      materialRelations: z.array(
        z.object({
          materialId: z.number(),
          length: z.string(),
          weight: z.string()
        })
      )
    })
  )
  .mutation(async ({ input }) => {
    const detail = await db
      .insertInto('metal_flow.details')
      .values({
        name: input.name,
        part_code: input.partCode,
        stock: 0,
        logical_group_id: input.groupId
      })
      .returning('id')
      .executeTakeFirstOrThrow()
      .catch(e => {
        if (isDetailPertCodeUniqueError(e)) {
          throw ErrDetailPartCodeUnique
        }
        throw e
      })

    for (const materialRelation of input.materialRelations) {
      await db
        .insertInto('metal_flow.detail_materials')
        .values({
          detail_id: detail.id,
          material_id: materialRelation.materialId,
          data: {
            length: Number(materialRelation.length),
            weight: Number(materialRelation.weight)
          }
        })
        .execute()
    }

    return {
      id: detail.id
    }
  })
