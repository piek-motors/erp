import type { DB } from 'db'
import type { Selectable } from 'kysely'
import {
  MaterialRequirement,
  OrderPriority,
  ProductionOrderStatus,
  WriteoffReason,
} from 'models'
import { logger } from '#root/ioc/log.js'
import type { ContextUser } from '#root/lib/trpc/context.js'
import { type IDB, TRPCError } from '#root/sdk.js'
import { Warehouse } from '../services/warehouse_service.js'

type MaterialWriteoff = {
  material_id: number
  material_name: string
  writeoff_id: number
  stock: number
  totalCost: number
} | null

/**
 * Calculates how much material should be deducted from the inventory.
 * @param requirement - The material specification logic
 * @param quantity_to_produce - How many finished parts/details are needed
 * @returns The total amount of raw material to decrease (in units of material accounting)
 */
export function calc_material_deduction(
  requirement: DB.DetailBlank['material'],
  quantity_to_produce: number,
): number {
  if (!requirement) return 0
  const { data } = requirement
  switch (data.type) {
    case MaterialRequirement.Single:
      if (!data.gross_length) return 0
      /**
       * Total length consumed.
       * We use gross_length because it includes the waste (saw kerf/scraps)
       * that is removed from the warehouse stock.
       */
      return data.gross_length * quantity_to_produce

    case MaterialRequirement.Batch: {
      if (!data.yield_per_stock || !data.stock_length) return 0
      /**
       * Number of full stock lengths (bars/sheets) required.
       * Since we can't cut from half a bar in the warehouse, we round UP
       * to the nearest whole stock unit.
       */
      const bars_needed = Math.ceil(quantity_to_produce / data.yield_per_stock)
      return bars_needed * data.stock_length
    }

    case MaterialRequirement.Countable:
      if (!data.count) return 0

      return data.count * quantity_to_produce

    default:
      throw new Error('Unknown material logic type')
  }
}

export class OrderService {
  private readonly warehouse: Warehouse

  constructor(
    private readonly trx: IDB,
    readonly user: ContextUser,
  ) {
    this.warehouse = new Warehouse(trx, user.id)
  }

  async createOrder(
    detail_id: number,
  ): Promise<Selectable<DB.ProductionOrderTable>> {
    // deduplication check:  if order created some already
    const existingOrder = await this.trx
      .selectFrom('pdo.orders')
      .where('detail_id', '=', detail_id)
      .where('status', 'in', [
        ProductionOrderStatus.Waiting,
        ProductionOrderStatus.Preparation,
      ])
      .select('id')
      .executeTakeFirst()
    if (existingOrder) {
      throw new ErrManufacturingOrderAlreadyExists(
        `Order for detail=${detail_id} already exists: order_id=${existingOrder.id}`,
      )
    }

    return await this.trx
      .insertInto('pdo.orders')
      .values({
        detail_id,
        qty: 0,
        finished_at: null,
        material_writeoffs: {
          writeoffs: [],
        },
        status: ProductionOrderStatus.Waiting,
        priority: OrderPriority.Normal,
      })
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async startMaterialPreparationPhase(
    orderId: number,
  ): Promise<Selectable<DB.ProductionOrderTable>> {
    const order = await this.getOrder(orderId)
    if (order.status !== ProductionOrderStatus.Waiting) {
      throw new ErrForbiddenStatusTransition(
        `Manufacturing with id ${orderId} not waiting`,
      )
    }

    await this.trx
      .updateTable('pdo.orders')
      .set({ status: ProductionOrderStatus.Preparation })
      .where('id', '=', orderId)
      .execute()

    order.status = ProductionOrderStatus.Preparation
    return order
  }

  async startProductionPhase(
    order_id: number,
    qty: number,
    force?: boolean,
  ): Promise<MaterialWriteoff> {
    const order = await this.getOrder(order_id)
    const detail = await this.trx
      .selectFrom('pdo.details')
      .where('id', '=', order.detail_id)
      .select('blank')
      .executeTakeFirstOrThrow()

    if (!force) {
      await this.deduplicate_production_list(order.detail_id)
    }

    const material_cost = detail.blank?.material
    let writeoff: MaterialWriteoff = null

    if (material_cost) {
      const { material_id } = material_cost
      const material_deduction = calc_material_deduction(
        detail.blank?.material,
        qty,
      )
      const material = await this.trx
        .selectFrom('pdo.materials')
        .where('id', '=', material_id)
        .selectAll()
        .executeTakeFirstOrThrow()

      writeoff = await this.subtractMaterials(
        {
          material_id,
          material_deduction: material_deduction,
          label: material.label,
          stock: material.on_hand_balance,
        },
        order,
      )
    }

    await this.trx
      .updateTable('pdo.orders')
      .set({
        qty,
        started_at: new Date(),
        status: ProductionOrderStatus.Production,
      })
      .where('id', '=', order_id)
      .execute()
    return writeoff
  }

  /** deduplication check:  if order already started production */
  private async deduplicate_production_list(detail_id: number) {
    const order = await this.trx
      .selectFrom('pdo.orders')
      .where('detail_id', '=', detail_id)
      .where('status', '=', ProductionOrderStatus.Production)
      .select(['id', 'qty'])
      .executeTakeFirst()

    if (order) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: `Order already in production order_id=${order.id}, detail_id=${detail_id}, qty=${order.qty}`,
      })
    }
  }

  async finishOrder(orderId: number): Promise<void> {
    const manufacturing = await this.trx
      .updateTable('pdo.orders')
      .set({
        finished_at: new Date(),
        status: ProductionOrderStatus.Archived,
      })
      .where('id', '=', orderId)
      .returningAll()
      .executeTakeFirst()
    if (!manufacturing) {
      throw new ErrManufacturingOrderNotFound(
        `Manufacturing with id ${orderId} not found`,
      )
    }

    await this.trx
      .updateTable('pdo.details')
      .set(eb => ({
        on_hand_balance: eb('on_hand_balance', '+', manufacturing.qty),
      }))
      .where('id', '=', manufacturing.detail_id)
      .execute()
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.getOrder(id)
    if (order.status === ProductionOrderStatus.Archived) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Cannot delete completed order',
      })
    }

    await this.trx.deleteFrom('pdo.orders').where('id', '=', id).execute()
    logger.info(order, `Production order deleted by ${this.user.full_name}`)
  }

  private async subtractMaterials(
    material: {
      material_id: number
      material_deduction: number
      stock: number
      label: string
    },
    order: Selectable<DB.ProductionOrderTable>,
  ): Promise<MaterialWriteoff> {
    const { material_id, label, material_deduction } = material

    if (material.stock < material_deduction) {
      throw new ErrNotEnoughMaterial(
        `Недостаточно материала (id=${material_id}) ${label}, требуется ${material_deduction}, имеется ${material.stock}`,
      )
    }
    if (material_deduction === 0) {
      throw new ErrZeroCost(
        `Не указан расход материала (id=${material_id}) ${label}`,
      )
    }

    return await this.warehouse
      .subtractMaterial(
        material.material_id,
        material_deduction,
        WriteoffReason.ProductionUse,
        order.detail_id,
        order.id,
      )
      .then(res => ({
        material_id: material.material_id,
        material_name: material.label,
        writeoff_id: res.operation_id,
        stock: res.on_hand_balance,
        totalCost: material_deduction,
      }))
  }

  private async getOrder(
    orderId: number,
  ): Promise<Selectable<DB.ProductionOrderTable>> {
    const order = await this.trx
      .selectFrom('pdo.orders')
      .where('id', '=', orderId)
      .selectAll()
      .executeTakeFirst()

    if (!order) {
      throw new ErrManufacturingOrderNotFound(
        `Manufacturing with id ${orderId} not found`,
      )
    }

    return order
  }
}

class ErrNotEnoughMaterial extends TRPCError {
  constructor(message: string) {
    super({
      code: 'BAD_REQUEST',
      message,
    })
  }
}

class ErrZeroCost extends TRPCError {
  constructor(message: string) {
    super({
      code: 'BAD_REQUEST',
      message,
    })
  }
}

class ErrManufacturingOrderNotFound extends TRPCError {
  constructor(message: string) {
    super({
      code: 'NOT_FOUND',
      message,
    })
  }
}

class ErrForbiddenStatusTransition extends TRPCError {
  constructor(message: string) {
    super({
      code: 'BAD_REQUEST',
      message,
    })
  }
}

class ErrManufacturingOrderAlreadyExists extends TRPCError {
  constructor(message: string) {
    super({
      code: 'BAD_REQUEST',
      message,
    })
  }
}
