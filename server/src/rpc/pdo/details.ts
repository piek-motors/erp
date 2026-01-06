import {
  db,
  procedure,
  requireScope,
  router,
  Scope,
  TRPCError
} from '#root/deps.js'
import { logger } from '#root/ioc/log.js'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { Warehouse } from '#root/service/warehouse.service.js'
import { DB } from 'db'
import { Selectable, sql } from 'kysely'
import { SupplyReason, Unit, WriteoffReason } from 'models'
import { z } from 'zod'

const isDetailPertCodeUniqueError = (e: Error) => {
  return e.message.includes(
    `duplicate key value violates unique constraint "details_part_code_key"`
  )
}

const ErrDetailPartCodeUnique = new TRPCError({
  code: 'CONFLICT',
  message: 'Деталь с таким конструкторским кодом уже существует'
})

const processingRouteSchema = z.object({
  steps: z.array(z.number())
})

const blankSpecSchema = z.object({
  arr: z.array(
    z.object({
      key: z.string(),
      value: z.any()
    })
  )
})

const automaticWriteoffSchema = z.object({
  details: z.array(
    z.object({
      detail_id: z.number(),
      qty: z.number()
    })
  ),
  material: z.tuple([z.number(), z.number()]).nullable()
})

const detailBaseSchema = z.object({
  name: z.string().min(5, 'Название должно быть не менее 5 символов'),
  description: z.string().nullable(),
  partCode: z.string().nullable(),
  groupId: z.number().nullable(),
  blankSpec: blankSpecSchema.nullable(),
  processingRoute: processingRouteSchema.nullable(),
  drawingName: z.string().nullable(),
  automaticWriteoff: automaticWriteoffSchema.nullable(),
  stockLocation: z.string().nullable(),
  recommendedBatchSize: z.number().nullable()
})

export interface ListDetailsOutput {
  id: number
  name: string
  part_code: string
  logical_group_id: number | null
  stock: number
}

export type SelectableDetail = Selectable<DB.DetailTable>
export type DetailAutomaticWriteoffData = DB.DetailAutomaticWriteoffData

export const details = router({
  get: procedure
    .input(
      z.object({
        id: z.number()
      })
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
              message: err.message
            })
          }),
        db
          .selectFrom('pdo.detail_attachments')
          .leftJoin('attachments', join =>
            join.onRef('attachment_id', '=', 'id')
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
          .executeTakeFirst()
      ])
      return {
        detail,
        attachments,
        last_manufacturing: lastManufacturing
          ? {
              date: lastManufacturing.finished_at,
              qty: lastManufacturing.qty
            }
          : null
      }
    }),
  //
  list: procedure.query(async () =>
    db
      .selectFrom('pdo.details as d')
      .select([
        'd.id',
        'd.name',
        'd.part_code',
        'd.logical_group_id',
        'd.stock'
      ])
      .orderBy('d.id', 'desc')
      .execute()
      .then(rows => matrixEncoder(rows))
  ),
  //
  create: procedure
    .use(requireScope(Scope.pdo))
    .input(detailBaseSchema)
    .mutation(async ({ input }) => {
      const detail = await db
        .insertInto('pdo.details')
        .values({
          name: input.name,
          description: input.description,
          part_code: input.partCode,
          stock: 0,
          stock_location: input.stockLocation,
          logical_group_id: input.groupId,
          blank_spec: input.blankSpec || null,
          processing_route: input.processingRoute || null,
          drawing_name: input.drawingName || null,
          automatic_writeoff: input.automaticWriteoff,
          updated_at: new Date(),
          unit: Unit.Countable,
          recommended_batch_size: input.recommendedBatchSize || null
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
    }),
  //
  update: procedure
    .use(requireScope(Scope.pdo))
    .input(
      detailBaseSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      await db
        .updateTable('pdo.details')
        .set({
          name: input.name,
          description: input.description,
          part_code: input.partCode,
          logical_group_id: input.groupId,
          blank_spec: input.blankSpec || null,
          processing_route: input.processingRoute || null,
          drawing_name: input.drawingName || null,
          automatic_writeoff: input.automaticWriteoff,
          recommended_batch_size: input.recommendedBatchSize || null,
          stock_location: input.stockLocation,
          updated_at: new Date()
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
    }),
  //
  writeoff: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        detailId: z.number(),
        qty: z.number().gt(0),
        reason: z.enum(WriteoffReason)
      })
    )
    .mutation(async ({ input, ctx }) =>
      db
        .transaction()
        .execute(async trx =>
          new Warehouse(trx, ctx.user.id)
            .writeoffDetails(input.detailId, input.qty, input.reason)
            .then(({ stock }) => stock)
        )
    ),
  //
  supply: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        detailId: z.number(),
        qty: z.number().gt(0),
        reason: z.enum(SupplyReason)
      })
    )
    .mutation(async ({ input, ctx }) =>
      db
        .transaction()
        .execute(async trx =>
          new Warehouse(trx, ctx.user.id)
            .supplyDetails(input.detailId, input.qty, input.reason)
            .then(({ stock }) => ({ stock }))
        )
    ),
  //
  filter_by_material: procedure
    .input(z.object({ material_id: z.number() }))
    .query(async ({ input }) =>
      db
        .selectFrom('pdo.details')
        .where(
          sql<boolean>`(automatic_writeoff->'material'->>0)::int = ${input.material_id}`
        )
        .selectAll()
        .execute()
    ),
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
          success: true
        }
      })
    )
})
