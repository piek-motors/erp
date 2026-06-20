import { jsonObjectFrom } from 'kysely/helpers/postgres'
import {
  OperationSubject,
  OperationType,
  type SupplyReason,
  type Unit,
  type WriteoffReason,
} from 'shared'
import { logger } from '#root/ioc/log.js'
import { matrixEncoder } from '#root/lib/matrix_encoder.js'
import { router } from '#root/lib/trpc/trpc.js'
import { type DB, db, procedure, requireScope, Scope, z } from '#root/sdk.js'
import { DetailRepo } from './storage/detail_repo.js'
import { MaterialRepo } from './storage/material_repo.js'

const Limit = 100
const detail_repo = new DetailRepo(db)
const material_repo = new MaterialRepo(db)

export type OperationListItem = {
  id: number
  operation_type: OperationType
  timestamp: string
  qty: number
  manufacturing_order_id: number
  reason: SupplyReason | WriteoffReason
  unit: Unit
  detail_id: number
  detail_name: string
  detail_group_ids: number[]
  material_id: number | number
  material: DB.Pdo.Material | null
  manufacturing_order_qty: number
}

export const operations = router({
  list: procedure
    .input(
      z.object({
        materialId: z.number().optional(),
        detailId: z.number().optional(),
        subject: z.enum(OperationSubject),
      }),
    )
    .query(async ({ input }) => {
      const [operations, detail_group_associations] = await Promise.all([
        db
          .selectFrom('pdo.inventory_log as o')
          .$if(!!input.materialId, qb =>
            qb.where('o.material_id', '=', input.materialId as number),
          )
          .$if(!!input.detailId, qb =>
            qb.where('o.detail_id', '=', input.detailId as number),
          )
          .selectAll(['o'])
          .select(eb =>
            jsonObjectFrom(
              eb
                .selectFrom('pdo.materials as m')
                .selectAll('m')
                .whereRef('m.id', '=', 'o.material_id'),
            ).as('material'),
          )

          .leftJoin('pdo.details as d', 'o.detail_id', 'd.id')
          .select(['d.name as detail_name', 'd.unit as detail_unit'])

          .leftJoin('pdo.orders as ord', 'manufacturing_order_id', 'ord.id')
          .select('o.manufacturing_order_id as manufacturing_order_id')
          .select('ord.qty as manufacturing_order_qty')
          .where('subject', '=', input.subject)
          .orderBy('o.id', 'desc')
          .limit(Limit)
          .execute(),
        detail_repo.detail_group_associations(),
      ])
      const operations_with_groups = operations.map(
        ({ detail_unit, material, ...operation }) => ({
          ...operation,
          material,
          unit: material?.unit ?? detail_unit,
          detail_group_ids: operation.detail_id
            ? detail_group_associations.get(operation.detail_id) || []
            : [],
        }),
      )

      return matrixEncoder(operations_with_groups)
    }),
  //
  revert: procedure
    .use(requireScope(Scope.pdo))
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx: { user } }) => {
      const operation = await db
        .selectFrom('pdo.inventory_log')
        .where('id', '=', input.id)
        .selectAll()
        .executeTakeFirstOrThrow()

      interface StockUpdate {
        table: 'pdo.materials' | 'pdo.details'
        id: number
        qty: number
        is_supply: boolean
      }

      let update: StockUpdate
      const is_supply = operation.operation_type === OperationType.Supply

      // Add material stock update if operation affects materials
      if (operation.material_id) {
        update = {
          table: 'pdo.materials',
          id: operation.material_id,
          qty: operation.qty,
          is_supply: is_supply,
        }
      } else if (operation.detail_id) {
        // Add detail stock update if operation affects details
        update = {
          table: 'pdo.details',
          id: operation.detail_id,
          qty: operation.qty,
          is_supply: is_supply,
        }
      } else {
        throw Error('cant define stock update')
      }

      const balance_change = update.is_supply ? -update.qty : update.qty

      if (update.table === 'pdo.materials') {
        await material_repo.increment_balance(update.id, balance_change)
      } else {
        await detail_repo.increment_balance(update.id, balance_change)
      }

      await db
        .deleteFrom('pdo.inventory_log')
        .where('id', '=', input.id)
        .execute()
      logger.info(operation, `Balance operation reverted by ${user.full_name}`)
      return {
        message: `Операция изменения баланса отменена, баланс скорректирован на ${balance_change}`,
      }
    }),
})
