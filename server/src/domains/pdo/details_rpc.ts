import { BlankSchema, type DB, DetailWorkFlowSchema } from 'db'
import { type Selectable, sql } from 'kysely'
import { SupplyReason, Unit, WriteoffReason } from 'models'
import { z } from 'zod'
import { Warehouse } from '#root/domains/pdo/services/warehouse_service.js'
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
import { create_detail_group_map } from './utils.js'

const isDetailPertCodeUniqueError = (e: Error) => {
  return e.message.includes(
    `duplicate key value violates unique constraint "details_part_code_key"`,
  )
}

const ErrDetailPartCodeUnique = new TRPCError({
  code: 'CONFLICT',
  message: 'Деталь с таким конструкторским кодом уже существует',
})

export type DetailWorkflow = DB.DetailWorkflow

const DetailSchema = z.object({
  name: z.string().min(3, 'Название должно быть не менее 3 символов'),
  description: z.string().nullable(),
  drawing_number: z.string().nullable(),
  drawing_name: z.string().nullable(),
  group_ids: z.array(z.number()).optional(),
  workflow: DetailWorkFlowSchema.nullable(),
  blank: BlankSchema.nullable(),
  stock_location: z.string().nullable(),
  recommended_batch_size: z.number().nullable(),
})

export interface ListDetailsOutput {
  id: number
  name: string
  drawing_number: string | null
  group_ids: number[]
  on_hand_balance: number
}

export interface DetailWithGroups {
  detail: Selectable<DB.DetailTable>
  group_ids: number[]
  attachments: any[]
  last_manufacturing: { date: Date; qty: number } | null
}

export type SelectableDetail = Selectable<DB.DetailTable>
export type Blank = DB.DetailBlank

export const details = router({
  get: procedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const [detail, attachments, lastManufacturing, groupDetails] =
        await Promise.all([
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
          db
            .selectFrom('pdo.detail_group_details')
            .where('detail_id', '=', input.id)
            .select('group_id')
            .execute(),
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
        group_ids: groupDetails.map(d => d.group_id),
      } as DetailWithGroups
    }),
  //
  list: procedure.query(async () => {
    const [details, groupDetails] = await Promise.all([
      db
        .selectFrom('pdo.details as d')
        .select(['d.id', 'd.name', 'd.drawing_number', 'd.on_hand_balance'])
        .orderBy('d.id', 'desc')
        .execute(),
      db
        .selectFrom('pdo.detail_group_details')
        .select(['detail_id', 'group_id'])
        .execute(),
    ])

    const detail_group_map = create_detail_group_map(groupDetails)

    const rows_with_groups = details.map(d => ({
      ...d,
      group_ids: detail_group_map.get(d.id) || [],
    }))

    return matrixEncoder<ListDetailsOutput>(rows_with_groups)
  }),
  //
  create: procedure
    .use(requireScope(Scope.pdo))
    .input(DetailSchema)
    .mutation(async ({ input }) => {
      const detail = await db.transaction().execute(async trx => {
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
            if (isDetailPertCodeUniqueError(e)) {
              throw ErrDetailPartCodeUnique
            }
            throw e
          })

        // Create group associations if group_ids is provided
        if (group_ids && group_ids.length > 0) {
          await trx
            .insertInto('pdo.detail_group_details')
            .values(
              group_ids.map(group_id => ({
                group_id,
                detail_id: result.id,
              })),
            )
            .execute()
        }

        return result
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
        .transaction()
        .execute(async trx => {
          // Update detail base fields
          const { group_ids, ...detailData } = input
          await trx
            .updateTable('pdo.details')
            .set({
              ...detailData,
              updated_at: new Date(),
            })
            .where('id', '=', input.id)
            .execute()

          // Update group associations if group_ids is provided
          if (group_ids !== undefined) {
            // Delete existing associations
            await trx
              .deleteFrom('pdo.detail_group_details')
              .where('detail_id', '=', input.id)
              .execute()

            // Insert new associations
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
    .mutation(async ({ input: { id }, ctx: { user } }) =>
      db.transaction().execute(async trx => {
        const detail = await trx
          .selectFrom('pdo.details')
          .selectAll()
          .where('id', '=', id)
          .executeTakeFirst()
        // CASCADE constraints will automatically delete related records from:
        // - pdo.manufacturing
        // - pdo.operations
        // - pdo.detail_group_details
        await trx.deleteFrom('pdo.details').where('id', '=', id).execute()
        logger.info(detail, `Detail deleted by ${user.full_name}`)
        return {
          success: true,
        }
      }),
    ),
})

export const get_details_by_material_id = async (material_id: number) => {
  const [details, groupDetails] = await Promise.all([
    db
      .selectFrom('pdo.details')
      .where(
        sql<boolean>`(blank->'material'->>'material_id')::int = ${material_id}`,
      )
      .selectAll()
      .execute(),
    db
      .selectFrom('pdo.detail_group_details')
      .select(['detail_id', 'group_id'])
      .execute(),
  ])

  const detail_group_map = create_detail_group_map(groupDetails)
  return details.map(d => ({
    ...d,
    group_ids: detail_group_map.get(d.id) || [],
  }))
}

export const get_details_by_operation_id = async (
  dict_operation_id: number,
) => {
  const details = await db
    .selectFrom('pdo.details')
    .select(['id', 'workflow'])
    .execute()
  return details.filter(d =>
    d.workflow?.workflow.some(task => task[0] == dict_operation_id),
  )
}
