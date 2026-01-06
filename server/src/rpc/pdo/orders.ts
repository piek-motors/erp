import { db, procedure, requireScope, TRPCError } from '#root/deps.js'
import { Day, Scope } from '#root/lib/constants.js'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { formatDate, timedeltaInSeconds } from '#root/lib/time.js'
import { router } from '#root/lib/trpc/trpc.js'
import { Manufacturing } from '#root/service/manufacturing.service.js'
import { ManufacturingOrderStatus as OrderStatus } from 'models'
import z from 'zod'

export const FinishedOrderRetentionDays = 14

export const FinishedOrderRetentionPeriod = FinishedOrderRetentionDays * Day

export interface ListOrdersOutput {
  id: number
  detail_id: number
  detail_name: string
  qty: number
  group_id: number | null
  status: OrderStatus
  created_at: string
  started_at: string | null
  finished_at: string | null
  current_operation: string | null
  current_operation_start_at: string | null
  time_delta: number | null
}

export const orders = router({
  get: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const order = await db
        .selectFrom('pdo.orders as m')
        .selectAll('m')
        .innerJoin('pdo.details as d', 'm.detail_id', 'd.id')
        .select(['d.name as detail_name', 'd.logical_group_id as group_id'])
        .where('m.id', '=', input.id)
        .executeTakeFirst()
      if (!order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Manufacturing order with id ${input.id} not found`
        })
      }
      return {
        ...order,
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
  update_qty: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        orderId: z.number(),
        qty: z.number()
      })
    )
    .mutation(async ({ input }) => {
      return db.transaction().execute(async trx => {
        await trx
          .updateTable('pdo.orders')
          .set({ qty: input.qty })
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
  start_preparation: procedure
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
  start_production: procedure
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
  return_to_production: procedure
    .use(requireScope(Scope.pdo))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const order = await db
        .selectFrom('pdo.orders')
        .select('finished_at')
        .where('status', '=', OrderStatus.Collected)
        .where('id', '=', input.id)
        .executeTakeFirst()
      if (!order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Manufacturing order with id ${input.id} not found`
        })
      }
      if (
        order.finished_at &&
        Date.now() - order.finished_at.getTime() > 5 * Day
      ) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Order finished a long time ago so it cannot be returned'
        })
      }
      await db
        .updateTable('pdo.orders')
        .set({
          finished_at: null,
          status: OrderStatus.Production
        })
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow()
    }),
  //
  list: procedure.query(async () => {
    const cutoffDate = new Date(Date.now() - FinishedOrderRetentionPeriod)
    const [inProduction, finished, dict_operations] = await Promise.all([
      db
        .selectFrom('pdo.orders as m')
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
        .where('m.status', '!=', OrderStatus.Collected)
        .orderBy('m.started_at', 'desc')
        .execute(),
      db
        .selectFrom('pdo.orders as m')
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
        .execute(),
      db.selectFrom('pdo.dict_operation_kinds').selectAll().execute()
    ])

    const operationsMap: Record<number, string> = dict_operations.reduce(
      (acc, each) => {
        acc[each.id] = each.v
        return acc
      },
      {}
    )

    const result = [...inProduction, ...finished].map(o => {
      const current_op_id =
        o.current_operation && o.processing_route?.steps.at(o.current_operation)
      return {
        ...o,
        current_operation: current_op_id && operationsMap[current_op_id],
        created_at: formatDate(o.created_at),
        started_at: formatDate(o.started_at),
        finished_at: formatDate(o.finished_at),

        time_delta:
          o.finished_at && o.started_at
            ? timedeltaInSeconds(o.finished_at, o.started_at)
            : null
      }
    })
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
        .updateTable('pdo.orders')
        .set({
          current_operation: input.operation_index,
          current_operation_start_at: Date.now().toString()
        })
        .where('id', '=', input.id)
        .execute()
    })
})
