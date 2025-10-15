import { IDB, TRPCError } from '#root/deps.js'
import { DB } from 'db'
import { Selectable } from 'kysely'
import { EnManufacturingOrderStatus, EnWriteoffReason } from 'models'
import { Warehouse } from './warehouse.service.js'

type MaterialWriteoff = {
  material_id: number
  material_name: string
  writeoff_id: number
  stock: number
  totalCost: number
} | null

export class Manufacturing {
  private readonly warehouse: Warehouse

  constructor(private readonly trx: IDB, private readonly userId: number) {
    this.warehouse = new Warehouse(trx, userId)
  }

  async createOrder(
    detail_id: number
  ): Promise<Selectable<DB.ManufacturingTable>> {
    const detail = await this.trx
      .selectFrom('pdo.details')
      .where('id', '=', detail_id)
      .select('processing_route')
      .executeTakeFirstOrThrow()
    const data: DB.ManufacturingData = {
      processing_route: {
        steps: []
      }
    }
    if (detail.processing_route) {
      data.processing_route.steps = detail.processing_route.steps
    }

    // deduplication check:  if order created some already
    const existingOrder = await this.trx
      .selectFrom('pdo.manufacturing')
      .where('detail_id', '=', detail_id)
      .where('status', 'in', [
        EnManufacturingOrderStatus.Waiting,
        EnManufacturingOrderStatus.MaterialPreparation
      ])
      .select('id')
      .executeTakeFirst()
    if (existingOrder) {
      throw new ErrManufacturingOrderAlreadyExists(
        `Order for detail=${detail_id} already exists: order_id=${existingOrder.id}`
      )
    }

    return await this.trx
      .insertInto('pdo.manufacturing')
      .values({
        detail_id,
        qty: 0,
        finished_at: null,
        material_writeoffs: {
          writeoffs: []
        },
        data,
        status: EnManufacturingOrderStatus.Waiting
      })
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async startMaterialPreparationPhase(
    orderId: number
  ): Promise<Selectable<DB.ManufacturingTable>> {
    const order = await this.getOrder(orderId)
    if (order.status !== EnManufacturingOrderStatus.Waiting) {
      throw new ErrManufacturingOrderInvalidStatusTransition(
        `Manufacturing with id ${orderId} not waiting`
      )
    }

    await this.trx
      .updateTable('pdo.manufacturing')
      .set({ status: EnManufacturingOrderStatus.MaterialPreparation })
      .where('id', '=', orderId)
      .execute()

    order.status = EnManufacturingOrderStatus.MaterialPreparation
    return order
  }

  async startProductionPhase(
    orderId: number,
    qty: number
  ): Promise<MaterialWriteoff> {
    const order = await this.getOrder(orderId)
    const detail = await this.trx
      .selectFrom('pdo.details')
      .where('id', '=', order.detail_id)
      .select('automatic_writeoff')
      .executeTakeFirstOrThrow()

    const materialCost = detail.automatic_writeoff?.material
    let writeoff: MaterialWriteoff = null

    if (materialCost) {
      const material = await this.trx
        .selectFrom('pdo.materials')
        .where('id', '=', materialCost.material_id)
        .selectAll()
        .executeTakeFirstOrThrow()
      writeoff = await this.subtractMaterials(
        {
          material_id: material.id,
          data: {
            materialCostLength: materialCost.length
          },
          label: material.label,
          stock: material.stock
        },
        qty,
        order
      )
    }

    await this.trx
      .updateTable('pdo.manufacturing')
      .set({
        qty,
        started_at: new Date(),
        status: EnManufacturingOrderStatus.Production
      })
      .where('id', '=', orderId)
      .execute()
    return writeoff
  }

  async finishOrder(orderId: number): Promise<{
    id: number
    detail_id: number
    qty: number
    finished_at: Date | null
    material_writeoffs: any
  }> {
    const manufacturing = await this.trx
      .updateTable('pdo.manufacturing')
      .set({
        finished_at: new Date(),
        status: EnManufacturingOrderStatus.Collected
      })
      .where('id', '=', orderId)
      .returningAll()
      .executeTakeFirst()

    if (!manufacturing) {
      throw new ErrManufacturingOrderNotFound(
        `Manufacturing with id ${orderId} not found`
      )
    }

    await this.trx
      .updateTable('pdo.details')
      .set(eb => ({
        stock: eb('stock', '+', manufacturing.qty)
      }))
      .where('id', '=', manufacturing.detail_id)
      .execute()

    return manufacturing
  }

  async deleteOrder(manufacturingId: number): Promise<void> {
    const manufacturing = await this.getOrder(manufacturingId)

    if (manufacturing.status === EnManufacturingOrderStatus.Collected) {
      throw Error(
        `Cannot delete manufacturing order that has already been collected`
      )
    }

    // ON DELETE SET NULL constraint will automatically set operations.manufacturing_order_id to null
    await this.trx
      .deleteFrom('pdo.manufacturing')
      .where('id', '=', manufacturingId)
      .execute()
  }

  private async subtractMaterials(
    material: {
      material_id: number
      data: { materialCostLength: number }
      stock: number
      label: string
    },
    qty: number,
    order: Selectable<DB.ManufacturingTable>
  ) {
    const { material_id, label } = material
    const totalCost = (material.data.materialCostLength * qty) / 1000

    if (material.stock < totalCost) {
      throw new ErrNotEnoughMaterial(
        `Недостаточно материала (id=${material_id}) ${label}, требуется ${totalCost.toFixed(
          1
        )} м, имеется ${material.stock.toFixed(1)} м`
      )
    }
    if (totalCost === 0) {
      throw new ErrZeroCost(
        `Не указан расход материала (id=${material_id}) ${label}`
      )
    }

    return await this.warehouse
      .subtractMaterial(
        material.material_id,
        totalCost,
        EnWriteoffReason.UsedInProduction,
        order.detail_id,
        order.id
      )
      .then(res => ({
        material_id: material.material_id,
        material_name: material.label,
        writeoff_id: res.operation_id,
        stock: res.stock,
        totalCost
      }))
  }

  private async getOrder(
    orderId: number
  ): Promise<Selectable<DB.ManufacturingTable>> {
    const order = await this.trx
      .selectFrom('pdo.manufacturing')
      .where('id', '=', orderId)
      .selectAll()
      .executeTakeFirst()

    if (!order) {
      throw new ErrManufacturingOrderNotFound(
        `Manufacturing with id ${orderId} not found`
      )
    }

    return order
  }
}

class ErrNotEnoughMaterial extends TRPCError {
  constructor(message: string) {
    super({
      code: 'BAD_REQUEST',
      message
    })
  }
}

class ErrZeroCost extends TRPCError {
  constructor(message: string) {
    super({
      code: 'BAD_REQUEST',
      message
    })
  }
}

class ErrManufacturingOrderNotFound extends TRPCError {
  constructor(message: string) {
    super({
      code: 'NOT_FOUND',
      message
    })
  }
}

class ErrManufacturingOrderInvalidStatusTransition extends TRPCError {
  constructor(message: string) {
    super({
      code: 'BAD_REQUEST',
      message
    })
  }
}

class ErrManufacturingOrderAlreadyExists extends TRPCError {
  constructor(message: string) {
    super({
      code: 'BAD_REQUEST',
      message
    })
  }
}
