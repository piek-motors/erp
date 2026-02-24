import type { DB } from 'db'
import { sql } from 'kysely'
import {
  MaterialConstructorMap,
  MaterialShape,
  MaterialShapeAbstractionLayer,
  SupplyReason,
  Unit,
  WriteoffReason,
} from 'models'
import { z } from 'zod'
import { Warehouse } from '#root/domains/pdo/services/warehouse_service.js'
import { materials_stat_container } from '#root/ioc/index.js'
import { logger } from '#root/ioc/log.js'
import { isDuplicateKeyError } from '#root/lib/kysely.js'
import { router } from '#root/lib/trpc/trpc.js'
import {
  db,
  matrixEncoder,
  procedure,
  RpcError,
  requireScope,
  Scope,
  TRPCError,
} from '#root/sdk.js'
import { get_details_by_material_id } from './details_rpc.js'

export type MaterialRes = DB.Material & {
  deficit: DeficitInfo
}

const DEFAULT_SHORTAGE_PREDICTION_HORIZON_DAYS = 60

const payload = z.object({
  unit: z.enum(Unit),
  shape: z.enum(MaterialShape),
  shape_data: z.any(),
  alloy: z.string().nullable(),
  shortage_prediction_horizon_days: z.number().nullable(),
})
const id_payload = z.object({ id: z.number() })
const update_payload = payload.extend({ id: z.number() })

export const material = router({
  get: procedure.input(id_payload).query(async ({ input: { id } }) => {
    const [material, detailCount] = await Promise.all([
      db
        .selectFrom('pdo.materials')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirstOrThrow(),
      db
        .selectFrom('pdo.details')
        .where(sql<boolean>`(blank->'material'->>'material_id')::int = ${id}`)
        .select(eb => eb.fn.countAll().as('count'))
        .executeTakeFirstOrThrow(),
    ])
    return {
      material,
      deficit: predict_deficit(material),
      detailCount: Number(detailCount.count),
      writeoff_stat: {
        monthly: materials_stat_container.writeoffs.monthly?.get(id)?.entries,
        quarterly:
          materials_stat_container.writeoffs.quarterly?.get(id)?.entries,
      },
    }
  }),
  //
  list: procedure.query(() =>
    db
      .selectFrom('pdo.materials as m')
      .selectAll()
      .orderBy('m.label')
      .execute()
      .then(materials =>
        matrixEncoder(
          materials.map(
            m =>
              ({
                ...m,
                deficit: predict_deficit(m),
              }) satisfies MaterialRes,
          ),
        ),
      ),
  ),
  //
  create: procedure
    .use(requireScope(Scope.pdo))
    .input(payload)
    .mutation(async ({ input }) => {
      const material = await db
        .insertInto('pdo.materials')
        .values({
          ...input,
          shortage_prediction_horizon_days:
            input.shortage_prediction_horizon_days ||
            DEFAULT_SHORTAGE_PREDICTION_HORIZON_DAYS,
          label: derive_label(input),
          on_hand_balance: 0,
          linear_mass: 0,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
        .catch(e => {
          if (isDuplicateKeyError(e)) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Материал с таким названием уже существует',
            })
          }
          throw e
        })
      return material
    }),
  //
  delete: procedure
    .use(requireScope(Scope.pdo))
    .input(id_payload)
    .mutation(async ({ input: { id }, ctx: { user } }) => {
      await db.transaction().execute(async trx => {
        // Check if we have some relationships with details
        const details = await get_details_by_material_id(id)
        if (details.length) {
          throw new RpcError(
            'FORBIDDEN',
            `Нельзя удалить материал поскольку на него ссылаются ${details.length} деталей`,
          )
        }

        await trx
          .deleteFrom('pdo.operations')
          .where('material_id', '=', id)
          .execute()
        const { label } = await trx
          .deleteFrom('pdo.materials')
          .where('id', '=', id)
          .returning(['label'])
          .executeTakeFirstOrThrow()
        logger.info(`Material deleted: ${id} ${label} by ${user.first_name}`)
      })
      return {
        success: true,
      }
    }),
  update: procedure
    .use(requireScope(Scope.pdo))
    .input(update_payload)
    .mutation(async ({ input }) => {
      await db
        .updateTable('pdo.materials')
        .set({
          ...input,
          shortage_prediction_horizon_days:
            input.shortage_prediction_horizon_days ||
            DEFAULT_SHORTAGE_PREDICTION_HORIZON_DAYS,
          label: derive_label(input),
        })
        .where('id', '=', input.id)
        .executeTakeFirstOrThrow()
      return 'ok'
    }),
  //
  supply: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        material_id: z.number(),
        lengthMeters: z.number().gt(0),
        reason: z.enum(SupplyReason),
      }),
    )
    .mutation(({ input, ctx }) =>
      db.transaction().execute(async trx =>
        new Warehouse(trx, ctx.user.id)
          .supplyMaterial(input.material_id, input.lengthMeters, input.reason)
          .then(({ on_hand_balance: stock }) => ({
            qty: stock.toString(),
          })),
      ),
    ),
  //
  writeoff: procedure
    .use(requireScope(Scope.pdo))
    .input(
      z.object({
        material_id: z.number(),
        lengthMeters: z.number().gt(0),
        reason: z.enum(WriteoffReason),
        type_data: z.any(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await db.transaction().execute(async trx => {
        const warehouse = new Warehouse(trx, ctx.user.id)
        const result = await warehouse.subtractMaterial(
          input.material_id,
          input.lengthMeters,
          input.reason,
        )
        return result.on_hand_balance.toString()
      })
    }),
  //
  dict_distinct_alloys: procedure.query(async () =>
    db
      .selectFrom('pdo.materials')
      .select('alloy')
      .distinct()
      .execute()
      .then(res => res.map(e => e.alloy)),
  ),
})

type UpdatePayload = z.infer<typeof payload>

function derive_label(input: UpdatePayload) {
  const materialConstructor = MaterialConstructorMap[input.shape]
  const model = new materialConstructor(input.shape_data, '', input.alloy)
  MaterialShapeAbstractionLayer.importShapeData(model, input.shape_data)
  return model.deriveLabel()
}

export interface DeficitInfo {
  deficit: boolean
  days_until_stockout: number
}

function predict_deficit(
  material: Pick<
    DB.Material,
    'id' | 'on_hand_balance' | 'shortage_prediction_horizon_days'
  >,
): DeficitInfo {
  const series = materials_stat_container.writeoffs.quarterly?.get(material.id)
  // No data available - can't predict
  if (!series || !series.map || series.map.size === 0) {
    return {
      deficit: false,
      days_until_stockout: Infinity,
    }
  }

  // Already in deficit
  if (material.on_hand_balance <= 0) {
    return {
      deficit: true,
      days_until_stockout: 0,
    }
  }

  // Calculate total consumption and time period
  const buckets = Array.from(series.map.entries())
  const total_consumption = series.sum()

  // No consumption - no deficit predicted
  if (total_consumption === 0) {
    return {
      deficit: false,
      days_until_stockout: Infinity,
    }
  }

  // ⚠️ FIX: Count only non-zero quarters to avoid diluting the rate
  const nonZeroQuarters = buckets.filter(([_, amount]) => amount > 0).length
  const totalDays = nonZeroQuarters * 91.25

  // Calculate average daily consumption rate
  const dailyConsumptionRate = total_consumption / totalDays

  // Predict days until stock runs out
  const daysUntilStockout = material.on_hand_balance / dailyConsumptionRate

  // Return true if predicted stockout is within the warning horizon
  const in_deficit =
    daysUntilStockout <= material.shortage_prediction_horizon_days

  return {
    deficit: in_deficit,
    days_until_stockout: daysUntilStockout,
  }
}
