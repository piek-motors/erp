import type { DB } from 'db'
import type { Selectable } from 'kysely'
import { OrderStatus, UserRole } from 'models'
import { attachmentService } from '#root/ioc/index.js'
import { logger } from '#root/ioc/log.js'
import { type Matrix, matrixEncoder } from '#root/lib/matrix_encoder.js'
import { fromMs } from '#root/lib/time.js'
import { router } from '#root/lib/trpc/trpc.js'
import {
  db,
  procedure,
  requireScope,
  Scope,
  sql,
  TRPCError,
  z,
} from '#root/sdk.js'
import { comments, type OrderComment } from './comments_rpc.js'
import { mentions } from './mentions_rpc.js'
import { payments } from './payments_rpc.js'
import { positions } from './positions_rpc.js'

export type OrderPosition = Selectable<DB.OrderItemsTable>

export type ClientOrder = Selectable<DB.OrderTable> & {
  positions: Matrix<OrderPosition>
  manager?: {
    id: number
    first_name: string
    last_name: string
  }
  total_paid?: number
  payments?: Omit<Selectable<DB.OrderPaymentsTable>, 'order_id'>[]
  comments?: OrderComment[]
  attachments?: Selectable<DB.AttachmentTable>[]
}

const insertOrderSchema = z.object({
  status: z.enum(OrderStatus),
  manager_id: z.number().nullish(),
  contractor: z.string().optional(),
  city: z.string().nullish(),
  awaiting_dispatch: z.boolean().optional(),
  is_reclamation: z.boolean().optional(),
  need_attention: z.string().optional().nullable(),
  invoice_number: z.string().optional(),
  order_number: z.string().optional(),
  shipping_date: z.number().nullish(),
  total_amount: z.number().nullish(),
  comment: z.string().optional(),
})

const updateOrderSchema = insertOrderSchema.extend({
  id: z.number(),
  status: z.enum(OrderStatus).optional(),
  acceptance_date: z.number().optional(),
  actual_shipping_date: z.number().optional(),
})

export type OrderUpdateInput = z.infer<typeof updateOrderSchema>

export const orders = router({
  positions,
  //
  payments,
  //
  comments,
  //
  mentions,
  //
  get: procedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const [order, positions, payments, comments, attachments] =
        await Promise.all([
          db
            .selectFrom('orders.orders')
            .where('id', '=', input.id)
            .selectAll()
            .executeTakeFirst(),
          //
          db
            .selectFrom('orders.order_items')
            .selectAll()
            .where('order_id', '=', input.id)
            .execute(),
          //
          db
            .selectFrom('orders.order_payments')
            .select(['id', 'amount', 'date'])
            .where('order_id', '=', input.id)
            .execute(),
          //
          db
            .selectFrom('orders.comments as c')
            .innerJoin('users as u', 'u.id', 'c.user_id')
            .select([
              'c.user_id',
              'c.order_id',
              'c.id',
              'c.text',
              'c.created_at',
              'u.first_name',
              'u.last_name',
              'u.id as user_id',
            ])
            .where('order_id', '=', input.id)
            .execute(),
          //
          attachmentService.getOrderAttachments(input.id),
        ])
      if (!order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Order with id ${input.id} not found`,
        })
      }
      const enriched = await enrichOrders([order])
      return {
        ...enriched[0],
        payments,
        positions,
        comments,
        attachments,
      }
    }),
  //
  insert: procedure
    .use(requireScope(Scope.orders))
    .input(insertOrderSchema)
    .mutation(async ({ input }) => {
      return db
        .insertInto('orders.orders')
        .values({
          ...input,
          shipping_date: input.shipping_date
            ? new Date(input.shipping_date)
            : null,
          is_reclamation: input.is_reclamation ?? false,
          awaiting_dispatch: false,
          created_at: new Date(),
        })
        .returning('id')
        .executeTakeFirstOrThrow()
    }),
  //
  update: procedure
    .use(requireScope(Scope.orders))
    .input(updateOrderSchema)
    .mutation(async ({ input, ctx }) => {
      await db
        .updateTable('orders.orders')
        .set({
          ...input,
          shipping_date: fromMs(input.shipping_date),
          acceptance_date: fromMs(input.acceptance_date),
          actual_shipping_date: fromMs(input.actual_shipping_date),
        })
        .where('id', '=', input.id)
        .execute()
        .then(() => {
          logger.info(
            `Client order ${input.id} updated by ${ctx.user.first_name} ${ctx.user.last_name}`,
          )
        })
    }),
  //
  list: procedure
    .input(
      z.object({
        status: z.enum(OrderStatus).optional(),
        statuses: z.array(z.enum(OrderStatus)).optional(),
        shipped_before: z.number().optional(),
        shipped_after: z.number().optional(),
        ordering: z
          .object({
            column: z.enum(['id', 'actual_shipping_date', 'shipping_date']),
            type: z.enum(['asc', 'desc']),
          })
          .optional(),
      }),
    )
    .query(async ({ input }) => {
      let q = db.selectFrom('orders.orders')
      if (!input.status && !input.statuses) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Status or statuses is required',
        })
      }
      if (input.status) {
        q = q.where('status', '=', input.status)
      }
      if (input.statuses) {
        q = q.where('status', 'in', input.statuses)
      }
      if (input.shipped_before) {
        q = q.where(
          'actual_shipping_date',
          '>=',
          new Date(input.shipped_before),
        )
      }
      if (input.shipped_after) {
        q = q.where('actual_shipping_date', '<=', new Date(input.shipped_after))
      }
      if (input.ordering) {
        q = q.orderBy(input.ordering.column, input.ordering.type)
      }
      const orders = await q.selectAll().execute()
      const enriched = await enrichOrders(orders)
      return matrixEncoder(enriched)
    }),
  //
  search_archived: procedure
    .input(
      z.object({
        keyword: z.string(),
        order_status: z.enum(OrderStatus),
      }),
    )
    .query(async ({ input }) => {
      let q = db
        .selectFrom('orders.orders')
        .where('status', '=', input.order_status)

      if (input.keyword) {
        q = q.where(q =>
          q.or([
            q('invoice_number', 'ilike', `%${input.keyword}%`),
            q('contractor', 'ilike', `%${input.keyword}%`),
          ]),
        )
      }
      const orders = await q
        .selectAll()
        .where('actual_shipping_date', 'is not', null)
        .orderBy('actual_shipping_date', 'desc')
        .limit(200)
        .execute()
      const enriched = await enrichOrders(orders)
      return matrixEncoder(enriched)
    }),
  //
  delete: procedure
    .use(requireScope(Scope.orders))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx: { user } }) => {
      await db
        .deleteFrom('orders.orders')
        .where('id', '=', input.id)
        .execute()
        .then(() => {
          logger.info(`Order ${input.id} deleted by ${user.full_name}`)
        })
    }),
  //
  suggestions: procedure.query(async () => {
    const [citiesRes, contractorsRes, managers] = await Promise.all([
      db.selectFrom('orders.orders').select('city').distinct().execute(),
      db.selectFrom('orders.orders').select('contractor').distinct().execute(),
      db
        .selectFrom('users')
        .select(['id', 'first_name', 'last_name', 'roles'])
        .where('is_deleted', '=', false)
        .where(sql<boolean>`roles @> ${[UserRole.OrderManager]}`)
        .execute(),
    ])
    return {
      cities: citiesRes.map(r => r.city).filter(Boolean) as string[],
      contractors: contractorsRes
        .map(r => r.contractor)
        .filter(Boolean) as string[],
      managers,
    }
  }),
})

async function enrichOrders(
  orders: Selectable<DB.OrderTable>[],
): Promise<ClientOrder[]> {
  if (orders.length === 0) {
    return []
  }
  try {
    const [positions, payments, managers] = await Promise.all([
      db
        .selectFrom('orders.order_items')
        .where(
          'order_id',
          'in',
          orders.map(order => order.id),
        )
        .selectAll()
        .execute(),
      db
        .selectFrom('orders.order_payments')
        .where(
          'order_id',
          'in',
          orders.map(order => order.id),
        )
        .select(['amount', 'order_id'])
        .execute(),
      db
        .selectFrom('users')
        .where(
          'id',
          'in',
          orders.map(order => order.manager_id),
        )
        .select(['id', 'first_name', 'last_name'])
        .execute(),
    ])
    return orders.map(order => {
      return {
        ...order,
        positions: matrixEncoder(
          positions.filter(item => item.order_id === order.id),
        ),
        total_paid: payments
          .filter(payment => payment.order_id === order.id)
          .reduce((acc, payment) => acc + Number(payment.amount), 0),
        manager: managers.find(manager => manager.id === order.manager_id),
      }
    })
  } catch (error) {
    throw new Error(`Failed to enrich orders: ${error}`)
  }
}
