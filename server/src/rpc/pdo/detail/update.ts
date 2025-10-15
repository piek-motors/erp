import { db } from '#root/deps.js'
import { publicProcedure } from '#root/lib/trpc/trpc.js'
import {
  ErrDetailPartCodeUnique,
  isDetailPertCodeUniqueError,
  updateDetailDto
} from '#root/rpc/pdo/detail/shared.js'

export const updateDetail = publicProcedure
  .input(updateDetailDto)
  .mutation(async ({ input }) => {
    await db
      .updateTable('pdo.details')
      .set({
        name: input.name,
        description: input.description,
        part_code: input.partCode,
        logical_group_id: input.groupId,
        blank_spec: input.blankSpec || null,
        updated_at: new Date(),
        processing_route: input.processingRoute || null,
        drawing_name: input.drawingName || null,
        automatic_writeoff: input.automaticWriteoff,
        recommended_batch_size: input.recommendedBatchSize || null
      })
      .where('id', '=', input.id)
      .execute()
      .catch(e => {
        if (isDetailPertCodeUniqueError(e)) {
          throw ErrDetailPartCodeUnique
        }
        throw e
      })

    return {
      id: input.id
    }
  })
