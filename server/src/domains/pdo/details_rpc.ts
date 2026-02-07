import { BlankSchema, type DB } from 'db'
import { type Selectable, sql } from 'kysely'
import { SupplyReason, Unit, WriteoffReason } from 'models'
import { z } from 'zod'
import { Warehouse } from '#root/domains/pdo/warehouse_service.js'
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

const isDetailPertCodeUniqueError = (e: Error) => {
  return e.message.includes(
    `duplicate key value violates unique constraint "details_part_code_key"`,
  )
}

const ErrDetailPartCodeUnique = new TRPCError({
  code: 'CONFLICT',
  message: 'Деталь с таким конструкторским кодом уже существует',
})

const ProcessingRouteSchema = z.object({
  steps: z.array(z.number()),
})

// const BlankSpecSchema = z.object({
// 	arr: z.array(
// 		z.object({
// 			key: z.string(),
// 			value: z.any(),
// 		}),
// 	),
// })

// const BlankSchema = z.object({
// 	details: z.array(
// 		z.object({
// 			detail_id: z.number(),
// 			qty: z.number(),
// 		}),
// 	),
// 	material: z.tuple([z.number(), z.number()]).nullable(),
// })

const DetailSchema = z.object({
  name: z.string().min(5, 'Название должно быть не менее 5 символов'),
  description: z.string().nullable(),
  drawing_number: z.string().nullable(),
  drawing_name: z.string().nullable(),
  logical_group_id: z.number().nullable(),
  // blank_spec: BlankSpecSchema.nullable(), // TODO: rename to blank.params
  processing_route: ProcessingRouteSchema.nullable(),
  blank: BlankSchema.nullable(),
  stock_location: z.string().nullable(),
  recommended_batch_size: z.number().nullable(),
})

export interface ListDetailsOutput {
  id: number
  name: string
  part_code: string
  logical_group_id: number | null
  stock: number
}

export type SelectableDetail = Selectable<DB.DetailTable>
export type Blank = DB.Blank

export const details = router({
  get: procedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const [detail, attachments, lastManufacturing] = await Promise.all([
        db
          .selectFrom('pdo.details')
          .where('id', '=', input.id)
          .selectAll()
          .executeTakeFirstOrThrow()
          .catch(err => {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: err.message,
            })
          }),
        db
          .selectFrom('pdo.detail_attachments')
          .leftJoin('attachments', join =>
            join.onRef('attachment_id', '=', 'id'),
          )
          .where('detail_id', '=', input.id)
          .selectAll()
          .execute(),
        db
          .selectFrom('pdo.orders')
          .select(['finished_at', 'qty'])
          .where('detail_id', '=', input.id)
          .where('finished_at', 'is not', null)
          .orderBy('finished_at', 'desc')
          .limit(1)
          .executeTakeFirst(),
      ])
      return {
        detail,
        attachments,
        last_manufacturing: lastManufacturing
          ? {
              date: lastManufacturing.finished_at,
              qty: lastManufacturing.qty,
            }
          : null,
      }
    }),
  //
  list: procedure.query(async () =>
    db
      .selectFrom('pdo.details as d')
      .select([
        'd.id',
        'd.name',
        'd.drawing_number',
        'd.logical_group_id',
        'd.on_hand_balance',
      ])
      .orderBy('d.id', 'desc')
      .execute()
      .then(rows => matrixEncoder(rows)),
  ),
  //
  create: procedure
    .use(requireScope(Scope.pdo))
    .input(DetailSchema)
    .mutation(async ({ input }) => {
      const detail = await db
        .insertInto('pdo.details')
        .values({
          ...input,
          on_hand_balance: 0,
          updated_at: new Date(),
          unit: Unit.Countable,
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
        id: detail.id,
      }
    }),
  //
  update: procedure
    .use(requireScope(Scope.pdo))
    .input(
      DetailSchema.extend({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .updateTable('pdo.details')
        .set({
          ...input,
          updated_at: new Date(),
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
        id: input.id,
      }
    }),
  //
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
  //
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
  //
  filter_by_material: procedure
    .input(z.object({ material_id: z.number() }))
    .query(async ({ input }) => get_details_by_material_id(input.material_id)),
  //
  delete: procedure
    .use(requireScope(Scope.pdo))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) =>
      db.transaction().execute(async trx => {
        // CASCADE constraints will automatically delete related records from:
        // - pdo.manufacturing
        // - pdo.operations
        // - pdo.detail_group_details
        await trx.deleteFrom('pdo.details').where('id', '=', input.id).execute()
        logger.warn(`Detail deleted: ${input.id}`)
        return {
          success: true,
        }
      }),
    ),
})

export const get_details_by_material_id = (material_id: number) => {
  return db
    .selectFrom('pdo.details')
    .where(
      sql<boolean>`(blank->'material'->>'material_id')::int = ${material_id}`,
    )
    .selectAll()
    .execute()
}
