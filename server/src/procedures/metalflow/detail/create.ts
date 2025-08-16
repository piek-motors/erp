import { db, procedure } from '#root/deps.js'
import {
  detailDto,
  ErrDetailPartCodeUnique,
  isDetailPertCodeUniqueError
} from '#root/procedures/metalflow/detail/shared.js'
import { EnUnit } from 'models'

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
        params: input.technicalParams || null,
        processing_route: input.processingRoute || null,
        drawing_name: input.drawingName || null,
        automatic_writeoff: input.automaticWriteoff,
        updated_at: new Date(),
        unit: EnUnit.Countable
      })
      .returning('id')
      .executeTakeFirstOrThrow()
      .catch(e => {
        if (isDetailPertCodeUniqueError(e)) {
          throw ErrDetailPartCodeUnique
        }
        throw e
      })

    return {
      id: detail.id
    }
  })
