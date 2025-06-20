import { db, procedure, z } from '../../../deps.ts'
import {
  ErrDetailPartCodeUnique,
  isDetailPertCodeUniqueError
} from './shared.ts'

export const createDetailProcedure = procedure
  .input(
    z.object({
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
    const detail = await db
      .insertInto('metal_flow.details')
      .values({ name: input.name, part_code: input.partCode })
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
