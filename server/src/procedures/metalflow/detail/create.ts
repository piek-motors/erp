import { db, procedure } from '#root/deps.js'
import {
  detailDto,
  ErrDetailPartCodeUnique,
  isDetailPertCodeUniqueError
} from '#root/procedures/metalflow/detail/shared.js'

export const createDetail = procedure
  .input(detailDto)
  .mutation(async ({ input }) => {
    const detail = await db
      .insertInto('metal_flow.details')
      .values({
        name: input.name,
        description: input.description,
        part_code: input.partCode,
        stock: 0,
        logical_group_id: input.groupId,
        params: input.params || null
      } as any)
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
            length: Number(materialRelation.length)
          }
        })
        .execute()
    }

    return {
      id: detail.id
    }
  })
