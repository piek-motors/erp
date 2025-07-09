import { db, z } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import {
  ErrDetailPartCodeUnique,
  isDetailPertCodeUniqueError
} from '#root/procedures/metalflow/detail/shared.js'

export const updateDetailProcedure = publicProcedure
  .input(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      partCode: z.string(),
      groupId: z.number().nullable(),
      params: z.record(z.any()).nullable(),
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
    await db
      .updateTable('metal_flow.details')
      .set({
        name: input.name,
        description: input.description,
        part_code: input.partCode,
        logical_group_id: input.groupId,
        params: input.params || null
      } as any)
      .where('id', '=', input.id)
      .execute()
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
          detail_id: input.id,
          material_id: materialRelation.materialId,
          data: {
            length: Number(materialRelation.length),
            weight: Number(materialRelation.weight)
          }
        })
        .onConflict(b =>
          b.constraint('detail_materials_p_key').doUpdateSet({
            data: {
              length: Number(materialRelation.length),
              weight: Number(materialRelation.weight)
            }
          })
        )
        .execute()
    }

    return {
      id: input.id
    }
  })
