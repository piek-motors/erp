import { db, procedure, z } from '../../../deps.ts'
import {
  ErrDetailPartCodeUnique,
  isDetailPertCodeUniqueError
} from './shared.ts'

export const updateDetailProcedure = procedure
  .input(
    z.object({
      id: z.number(),
      name: z.string(),
      partCode: z.string(),
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
        part_code: input.partCode
      })
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
