import { db, procedure, requireScope, TRPCError } from '#root/deps.js'
import { Day, Scope } from '#root/lib/constants.js'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { formatDate, timedeltaInSeconds } from '#root/lib/time.js'
import { router } from '#root/lib/trpc/trpc.js'
import { Manufacturing } from '#root/service/manufacturing.service.js'
import { DB } from 'db'
import { Updateable } from 'kysely'
import { ManufacturingOrderStatus } from 'models'
import z from 'zod'

const ShowFinishedOrders = 14 * Day

export interface ListManufacturingOutput {
  id: number
  detail_id: number
  detail_name: string
  qty: number
  group_id: number | null
  status: ManufacturingOrderStatus
  created_at: string
  started_at: string | null
  finished_at: string | null
  current_operation: string | null
  current_operation_start_at: string | null
  time_delta: number | null
}

export const manufacturing = router({
  get: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const manufacturingOrder = await db
        .selectFrom('pdo.manufacturing as m')
        .selectAll('m')
        .innerJoin('pdo.details as d', 'm.detail_id', 'd.id')
        .select(['d.name as detail_name', 'd.logical_group_id as group_id'])
        .where('m.id', '=', input.id)
        .executeTakeFirst()
      if (!manufacturingOrder) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Manufacturing order with id ${input.id} not found`
        })
      }
      return {
        ...manufacturingOrder,
        material_writeoffs: undefined
      }
    }),
  //
  create: procedure
    .use(requireScope(Scope.pdo))
    .input(z.object({ detailId: z.number() }))
    .mutation(({ input, ctx }) =>
      db.transaction().execute(trx =>
        new Manufacturing(trx, ctx.user.id)
          .createOrder(input.detailId)
          .then(order => ({
            ...order,
            material_writeoffs: undefined
          }))
      )
    ),
  //
  update: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        orderId: z.number(),
        qty: z.number().nullable()
      })
    )
    .mutation(async ({ input }) => {
      const update: Updateable<DB.ManufacturingTable> = {}
      if (input.qty != null) {
        update.qty = input.qty
      }
      return db.transaction().execute(async trx => {
        await trx
          .updateTable('pdo.manufacturing')
          .set(update)
          .where('id', '=', input.orderId)
          .execute()
        return {
          success: true
        }
      })
    }),
  //
  delete: procedure
    .use(requireScope(Scope.pdo))
    .input(z.object({ id: z.number() }))
    .mutation(({ input, ctx }) =>
      db
        .transaction()
        .execute(async trx =>
          new Manufacturing(trx, ctx.user.id)
            .deleteOrder(input.id)
            .then(() => 'ok')
        )
    ),
  //
  startMaterialPreparationPhase: procedure
    .use(requireScope(Scope.pdo))
    .input(z.object({ orderId: z.number() }))
    .mutation(({ input, ctx }) =>
      db.transaction().execute(trx =>
        new Manufacturing(trx, ctx.user.id)
          .startMaterialPreparationPhase(input.orderId)
          .then(() => ({
            success: true
          }))
      )
    ),
  //
  startProductionPhase: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        orderId: z.number(),
        qty: z.number(),
        force: z.boolean().optional()
      })
    )
    .mutation(({ input, ctx }) =>
      db
        .transaction()
        .execute(trx =>
          new Manufacturing(trx, ctx.user.id).startProductionPhase(
            input.orderId,
            input.qty,
            input.force
          )
        )
    ),
  //
  list: procedure.query(async () => {
    const cutoffDate = new Date(Date.now() - ShowFinishedOrders)
    const [inProduction, finished] = await Promise.all([
      db
        .selectFrom('pdo.manufacturing as m')
        .select([
          'm.id',
          'm.status',
          'm.detail_id',
          'm.qty',
          'm.finished_at',
          'm.created_at',
          'm.started_at',
          'm.current_operation',
          'm.current_operation_start_at'
        ])
        .innerJoin('pdo.details as d', 'm.detail_id', 'd.id')
        .select([
          'd.name as detail_name',
          'd.logical_group_id as group_id',
          'd.processing_route'
        ])
        .where('m.finished_at', 'is', null)
        .where('m.status', '!=', ManufacturingOrderStatus.Collected)
        .orderBy('m.created_at', 'desc')
        .execute(),
      db
        .selectFrom('pdo.manufacturing as m')
        .select([
          'm.id',
          'm.status',
          'm.detail_id',
          'm.qty',
          'm.finished_at',
          'm.created_at',
          'm.started_at',
          'm.current_operation',
          'm.current_operation_start_at'
        ])
        .innerJoin('pdo.details as d', 'm.detail_id', 'd.id')
        .select([
          'd.name as detail_name',
          'd.logical_group_id as group_id',
          'd.processing_route'
        ])
        .where('m.finished_at', '>=', cutoffDate)
        .orderBy('m.finished_at', 'desc')
        .execute()
    ])
    const result = [...inProduction, ...finished].map(o => ({
      ...o,
      current_operation:
        o.current_operation != null &&
        o.processing_route?.steps.at(o.current_operation)?.name,
      created_at: formatDate(o.created_at),
      started_at: formatDate(o.started_at),
      finished_at: formatDate(o.finished_at),
      time_delta:
        o.finished_at && o.started_at
          ? timedeltaInSeconds(o.finished_at, o.started_at)
          : null
    }))
    return matrixEncoder(result)
  }),
  //
  finish: procedure
    .use(requireScope(Scope.pdo))
    .input(z.object({ id: z.number() }))
    .mutation(({ input, ctx }) =>
      db
        .transaction()
        .execute(async trx =>
          new Manufacturing(trx, ctx.user.id).finishOrder(input.id)
        )
    ),
  //
  set_current_operation: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        id: z.number(),
        operation_index: z.number()
      })
    )
    .mutation(async ({ input }) => {
      await db
        .updateTable('pdo.manufacturing')
        .set({
          current_operation: input.operation_index,
          current_operation_start_at: Date.now().toString()
        })
        .where('id', '=', input.id)
        .execute()
    })
})
