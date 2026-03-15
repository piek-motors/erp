import type { DB } from 'db'
import { SupplyReason, Unit, WriteoffReason } from 'models'
import { z } from 'zod'
import { Warehouse } from '#root/domains/pdo/services/warehouse_service.js'
import { MaterialRepo } from '#root/domains/pdo/storage/material_repo.js'
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
} from '#root/sdk.js'
import { DetailRepo } from './storage/detail_repo.js'

export type { MaterialWithDeficit as MaterialRes } from '#root/domains/pdo/storage/material_repo.js'

export interface DeficitInfo {
  deficit: boolean
  days_until_stockout: number
}

const material_repo = new MaterialRepo(db)
const detail_repo = new DetailRepo(db)

const DEFAULT_SHORTAGE_PREDICTION_HORIZON_DAYS = 60

const payload = z.object({
  unit: z.enum(Unit),
  label: z.string().nonempty(),
  alloy: z.string().nullable(),
  shortage_prediction_horizon_days: z.number().nullable(),
})
const id_payload = z.object({ id: z.number() })
const update_payload = payload.extend({ id: z.number() })

export const material = router({
  get: procedure.input(id_payload).query(async ({ input: { id } }) => {
    const [material, details] = await Promise.all([
      material_repo.get_by_id_or_throw(id),
      detail_repo.filter_by_material_id(id),
    ])
    return {
      material,
      deficit: predict_deficit(material),
      detailCount: details.length,
      writeoff_stat: {
        monthly: materials_stat_container.writeoffs.monthly?.get(id)?.entries,
        quarterly:
          materials_stat_container.writeoffs.quarterly?.get(id)?.entries,
      },
    }
  }),
  //
  list: procedure.query(async () => {
    const materials = await material_repo.list_materials()
    return matrixEncoder(
      materials.map(m => ({
        ...m,
        deficit: predict_deficit(m),
      })),
    )
  }),
  //
  create: procedure
    .use(requireScope(Scope.pdo))
    .input(payload)
    .mutation(async ({ input }) => {
      try {
        return await material_repo.create({
          ...input,
          shortage_prediction_horizon_days:
            input.shortage_prediction_horizon_days ||
            DEFAULT_SHORTAGE_PREDICTION_HORIZON_DAYS,
          label: `${input.label} ${input.alloy ?? ''}`,
        })
      } catch (e: any) {
        if (isDuplicateKeyError(e)) {
          throw new RpcError(
            'CONFLICT',
            'Материал с таким названием уже существует',
          )
        }
        throw e
      }
    }),
  //
  delete: procedure
    .use(requireScope(Scope.pdo))
    .input(id_payload)
    .mutation(async ({ input: { id }, ctx: { user } }) => {
      await db.transaction().execute(async trx => {
        // Check if we have some relationships with details
        const details = await detail_repo.filter_by_material_id(id)
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
      return { success: true }
    }),
  update: procedure
    .use(requireScope(Scope.pdo))
    .input(update_payload)
    .mutation(async ({ input }) => {
      await material_repo.update({
        ...input,
        shortage_prediction_horizon_days:
          input.shortage_prediction_horizon_days ||
          DEFAULT_SHORTAGE_PREDICTION_HORIZON_DAYS,
      })
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
    material_repo.get_distinct_alloys(),
  ),
})

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
