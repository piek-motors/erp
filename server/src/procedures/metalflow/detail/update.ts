import { db } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import {
  ErrDetailPartCodeUnique,
  isDetailPertCodeUniqueError,
  updateDetailDto
} from '#root/procedures/metalflow/detail/shared.js'

export const updateDetail = publicProcedure
  .input(updateDetailDto)
  .mutation(async ({ input }) => {
    await db
      .updateTable('metal_flow.details')
      .set({
        name: input.name,
        description: input.description,
        part_code: input.partCode,
        logical_group_id: input.groupId,
        params: input.params || null,
        updated_at: new Date(),
        processing_route: input.processingRoute || null,
        drawing_name: input.drawingName || null
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
            length: Number(materialRelation.length)
          }
        })
        .onConflict(b =>
          b.constraint('detail_materials_p_key').doUpdateSet({
            data: {
              length: Number(materialRelation.length)
            }
          })
        )
        .execute()
    }

    return {
      id: input.id
    }
  })
