import { Day } from '#root/lib/constants.js'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { formatDate, timedeltaInSeconds } from '#root/lib/time.js'
import { router } from '#root/lib/trpc/trpc.js'
import { type DB, db, procedure, TRPCError } from '#root/sdk.js'
import type { Selectable } from 'kysely'
import {
  fmt,
  type OrderPriority,
  ProductionOrderStatus as OrderStatus,
} from 'models'
import z from 'zod'
import { calc_material_deduction } from './order_service.js'

export const FinishedOrderRetentionDays = 30

export const FinishedOrderRetentionPeriod = FinishedOrderRetentionDays * Day

export interface ListOrdersOutput {
  id: number
  detail_id: number
  detail_name: string
  qty: number
  output_qty: number | null
  group_id: number | null
  status: OrderStatus
  created_at: string | null
  started_at: number | null
  finished_at: string | null
  current_operation: string | null
  current_operation_start_at: string | null
  time_delta: number | null
  /** order id of the same detail already in production, value presented only for orders in waiting/preparing status */
  duplicated: number | null
  priority: OrderPriority
}

const base_query = db
  .selectFrom('pdo.orders as o')
  .select([
    'o.id',
    'o.status',
    'o.detail_id',
    'o.qty',
    'o.output_qty',
    'o.finished_at',
    'o.created_at',
    'o.started_at',
    'o.current_operation',
    'o.current_operation_start_at',
    'o.priority',
  ])
  .innerJoin('pdo.details as d', 'o.detail_id', 'd.id')
  .select([
    'd.name as detail_name',
    'd.logical_group_id as group_id',
    'd.processing_route',
  ])

export const orders = router({
  get: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const order = await db
        .selectFrom('pdo.orders as m')
        .selectAll('m')
        .innerJoin('pdo.details as d', 'm.detail_id', 'd.id')
        .select([
          'd.name as detail_name',
          'd.logical_group_id as group_id',
          'blank',
        ])
        .where('m.id', '=', input.id)
        .executeTakeFirst()

      if (!order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Manufacturing order with id ${input.id} not found`,
        })
      }

      const material_deduction = calc_material_deduction(
        order?.blank?.material,
        order?.qty,
      )
      return {
        ...order,
        material_writeoffs: undefined,
        material_deduction: fmt.roundAndTrim(material_deduction, 3),
      }
    }),
  //
  list: procedure.query(async () => {
    const [orders, dict_operations] = await Promise.all([
      base_query
        .where('o.finished_at', 'is', null)
        .where('o.status', '!=', OrderStatus.Archived)
        .orderBy('o.started_at', 'desc')
        .execute(),

      db.selectFrom('pdo.dict_operation_kinds').selectAll().execute(),
    ])

    const operationsMap: Record<number, string> = dict_operations.reduce(
      (acc, each) => {
        acc[each.id] = each.v
        return acc
      },
      {},
    )

    // detail_id -> order_id
    const details_in_production: Record<number, number> = orders
      .filter(e => e.status == OrderStatus.Production)
      .reduce((acc, order) => {
        acc[order.detail_id] = order.id
        return acc
      }, {})

    const result = orders.map(o => {
      const current_op_id =
        o.current_operation != null
          ? o.processing_route?.steps.at(o.current_operation)
          : null

      const duplicated_order_id =
        [OrderStatus.Waiting, OrderStatus.Preparation].includes(o.status) &&
        details_in_production[o.detail_id]

      return {
        ...o,
        current_operation:
          (current_op_id != null && operationsMap[current_op_id]) || null,
        duplicated: duplicated_order_id || null,
        ...dates_formatter(o),
        started_at: o.started_at?.valueOf() ?? null,
      } satisfies ListOrdersOutput
    })

    return matrixEncoder(result)
  }),
  //,
  list_last_archived: procedure.query(async () => {
    const cutoffDate = new Date(Date.now() - FinishedOrderRetentionPeriod)
    const finished = await base_query
      .where('o.finished_at', '>=', cutoffDate)
      .orderBy('o.finished_at', 'desc')
      .execute()
    return matrixEncoder(
      finished.map(o => ({
        ...o,
        ...dates_formatter(o),
      })),
    )
  }),
  //
  search_in_archive: procedure
    .input(z.object({ term: z.string().nonempty() }))
    .query(async ({ input }) => {
      const normalizedTerm = input.term.trim().toLowerCase()
      // Check if term is a number (integer ID search)
      const isNumericId = /^\d+$/.test(normalizedTerm)

      let query = db
        .selectFrom('pdo.orders as o')
        .select([
          'o.id',
          'o.detail_id',
          'o.qty',
          'o.output_qty',
          'o.finished_at',
          'o.created_at',
          'o.started_at',
        ])
        .innerJoin('pdo.details as d', 'o.detail_id', 'd.id')
        .select(['d.name as detail_name', 'd.logical_group_id as group_id'])
        .innerJoin(
          'pdo.detail_group',
          'pdo.detail_group.id',
          'd.logical_group_id',
        )
        .select('pdo.detail_group.name as group_name')
        .where('o.status', '=', OrderStatus.Archived)
        .where('o.finished_at', 'is not', null)
        .orderBy('o.finished_at', 'desc')

      if (isNumericId) {
        // Search by exact order ID
        const orderId = parseInt(normalizedTerm, 10)
        query = query.where('o.id', '=', orderId)
      } else {
        // Token-based search: split by spaces AND hyphens
        const tokens = normalizedTerm
          .toLowerCase()
          .split(/[\s-]+/)
          .filter(t => t.length > 0)

        if (tokens.length > 0) {
          query = query.where(eb =>
            eb.and(
              tokens.map(token =>
                eb.or([
                  eb('d.name', 'ilike', `%${token}%`),
                  eb('pdo.detail_group.name', 'ilike', `%${token}%`),
                ]),
              ),
            ),
          )
        }
      }

      const orders = await query.execute()
      return matrixEncoder(
        orders.map(o => ({
          ...o,
          ...dates_formatter(o, true),
        })),
      )
    }),
})

const dates_formatter = (
  order: Pick<
    Selectable<DB.ProductionOrderTable>,
    'created_at' | 'started_at' | 'finished_at'
  >,
  withYear?: boolean,
) => ({
  created_at: formatDate(order.created_at),
  finished_at: formatDate(order.finished_at),
  time_delta:
    order.finished_at && order.started_at
      ? timedeltaInSeconds(order.finished_at, order.started_at)
      : null,
})
