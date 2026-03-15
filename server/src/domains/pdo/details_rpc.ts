import { SupplyReason, Unit, WriteoffReason } from 'models'
import { z } from 'zod'
import { Warehouse } from '#root/domains/pdo/services/warehouse_service.js'
import { DetailRepo } from '#root/domains/pdo/storage/detail_repo.js'
import { logger } from '#root/ioc/log.js'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import {
  db,
  procedure,
  requireScope,
  router,
  Scope,
  TRPCError,
} from '#root/sdk.js'

export type {
  Blank,
  DetailAttachment,
  DetailWithGroups,
  DetailWorkflow,
  ListDetailsOutput,
  SelectableDetail,
} from '#root/domains/pdo/storage/detail_repo.js'

const repo = new DetailRepo(db)

const DetailInputSchema = z.object({
  name: z.string().min(3, 'Название должно быть не менее 3 символов'),
  description: z.string().nullable(),
  drawing_number: z.string().nullable(),
  drawing_name: z.string().nullable(),
  group_ids: z.array(z.number()).optional(),
  workflow: z.any().nullable(),
  blank: z.any().nullable(),
  stock_location: z.string().nullable(),
  recommended_batch_size: z.number().nullable(),
})

const isDetailPartCodeUniqueError = (e: Error) => {
  return e.message.includes(
    `duplicate key value violates unique constraint "details_part_code_key"`,
  )
}

const ErrDetailPartCodeUnique = new TRPCError({
  code: 'CONFLICT',
  message: 'Деталь с таким конструкторским кодом уже существует',
})

export const details = router({
  get: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await repo.get_detail_full(input.id)
    }),

  list: procedure.query(async () =>
    repo.list_details().then(details => matrixEncoder(details)),
  ),

  create: procedure
    .use(requireScope(Scope.pdo))
    .input(DetailInputSchema)
    .mutation(async ({ input }) =>
      db.transaction().execute(async trx => {
        const { group_ids, ...detailData } = input
        const result = await trx
          .insertInto('pdo.details')
          .values({
            ...detailData,
            on_hand_balance: 0,
            updated_at: new Date(),
            unit: Unit.Countable,
          })
          .returning('id')
          .executeTakeFirstOrThrow()
          .catch(e => {
            if (isDetailPartCodeUniqueError(e)) {
              throw ErrDetailPartCodeUnique
            }
            throw e
          })

        // Create group associations if group_ids is provided
        if (group_ids && group_ids.length > 0) {
          await trx
            .insertInto('pdo.detail_group_details')
            .values(
              group_ids.map(group_id => ({ group_id, detail_id: result.id })),
            )
            .execute()
        }

        return { id: result.id }
      }),
    ),

  update: procedure
    .use(requireScope(Scope.pdo))
    .input(DetailInputSchema.extend({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .transaction()
        .execute(async trx => {
          const { group_ids, ...detailData } = input
          await trx
            .updateTable('pdo.details')
            .set({ ...detailData, updated_at: new Date() })
            .where('id', '=', input.id)
            .execute()

          if (group_ids !== undefined) {
            await trx
              .deleteFrom('pdo.detail_group_details')
              .where('detail_id', '=', input.id)
              .execute()

            if (group_ids.length > 0) {
              await trx
                .insertInto('pdo.detail_group_details')
                .values(
                  group_ids.map(group_id => ({
                    group_id,
                    detail_id: input.id,
                  })),
                )
                .execute()
            }
          }
        })
        .catch(e => {
          if (isDetailPartCodeUniqueError(e)) {
            throw ErrDetailPartCodeUnique
          }
          throw e
        })

      return { id: input.id }
    }),

  writeoff: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        detailId: z.number(),
        qty: z.number().gt(0),
        reason: z.enum(WriteoffReason),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      db
        .transaction()
        .execute(async trx =>
          new Warehouse(trx, ctx.user.id)
            .writeoffDetails(input.detailId, input.qty, input.reason)
            .then(({ on_hand_balance }) => on_hand_balance),
        ),
    ),

  supply: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        detailId: z.number(),
        qty: z.number().gt(0),
        reason: z.enum(SupplyReason),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      db
        .transaction()
        .execute(async trx =>
          new Warehouse(trx, ctx.user.id)
            .supplyDetails(input.detailId, input.qty, input.reason)
            .then(({ on_hand_balance }) => ({ stock: on_hand_balance })),
        ),
    ),

  filter_by_material: procedure
    .input(z.object({ material_id: z.number() }))
    .query(async ({ input }) => {
      return await repo.filter_by_material_id(input.material_id)
    }),

  delete: procedure
    .use(requireScope(Scope.pdo))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input: { id }, ctx: { user } }) => {
      const detail = await repo.get_by_id(id)
      await db.deleteFrom('pdo.details').where('id', '=', id).execute()
      logger.info(detail, `Detail deleted by ${user.full_name}`)
      return { success: true }
    }),
})
