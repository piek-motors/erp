import { IDB, TRPCError } from '#root/deps.js'
import { DB } from 'db'
import { EnManufacturingOrderStatus, EnWriteoffReason } from 'domain-model'
import { Selectable } from 'kysely'
import { Warehouse } from './warehouse.js'

export class Manufacturing {
  private readonly warehouse: Warehouse

  constructor(private readonly trx: IDB, private readonly userId: number) {
    this.warehouse = new Warehouse(trx, userId)
  }

  async createOrder(
    detail_id: number
  ): Promise<Selectable<DB.ManufacturingTable>> {
    return await this.trx
      .insertInto('metal_flow.manufacturing')
      .values({
        detail_id,
        qty: 0,
        finished_at: null,
        material_writeoffs: {
          writeoffs: []
        },
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
      .updateTable('metal_flow.manufacturing')
      .set({ status: EnManufacturingOrderStatus.MaterialPreparation })
      .where('id', '=', orderId)
      .execute()

    order.status = EnManufacturingOrderStatus.MaterialPreparation
    return order
  }

  async startProductionPhase(
    orderId: number,
    qty: number
  ): Promise<
    Array<{
      material_id: number
      material_name: string
      writeoff_id: number
      stock: number
      totalCost: number
    }>
  > {
    const order = await this.getOrder(orderId)
    const materials = await this.trx
      .selectFrom('metal_flow.detail_materials')
      .innerJoin('metal_flow.materials', 'material_id', 'id')
      .where('detail_id', '=', order.detail_id)
      .select(['material_id', 'data', 'stock', 'label', 'unit'])
      .execute()

    const writeoffs = await Promise.all(
      materials.map(material => this.subtractMaterials(material, qty))
    )

    await this.trx
      .updateTable('metal_flow.manufacturing')
      .set({
        qty,
        status: EnManufacturingOrderStatus.Production
      })
      .where('id', '=', orderId)
      .execute()

    return writeoffs
  }

  async finishOrder(orderId: number): Promise<{
    id: number
    detail_id: number
    qty: number
    finished_at: Date | null
    material_writeoffs: any
  }> {
    const manufacturing = await this.trx
      .updateTable('metal_flow.manufacturing')
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
      .updateTable('metal_flow.details')
      .set(eb => ({
        stock: eb('stock', '+', manufacturing.qty)
      }))
      .where('id', '=', manufacturing.detail_id)
      .execute()

    return manufacturing
  }

  async deleteOrder(manufacturingId: number): Promise<void> {
    const manufacturing = await this.getOrder(manufacturingId)
    const allowedStatuses = [
      EnManufacturingOrderStatus.Waiting,
      EnManufacturingOrderStatus.MaterialPreparation
    ]

    if (!allowedStatuses.includes(manufacturing.status)) {
      throw new ErrCannotDeleteStartedOrder(
        `Cannot delete manufacturing order that has already started`
      )
    }

    await this.trx
      .deleteFrom('metal_flow.manufacturing')
      .where('id', '=', manufacturingId)
      .execute()
  }

  private async subtractMaterials(
    material: {
      material_id: number
      data: { length: number }
      stock: number
      label: string
    },
    qty: number
  ) {
    const { material_id, label } = material
    const totalCost = (material.data.length * qty) / 1000

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
        EnWriteoffReason.UsedInProduction
      )
      .then(res => ({
        material_id: material.material_id,
        material_name: material.label,
        writeoff_id: res.operation_id,
        stock: res.stock,
        totalCost
      }))
  }

  private async getOrder(orderId: number) {
    const order = await this.trx
      .selectFrom('metal_flow.manufacturing')
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

class ErrCannotDeleteStartedOrder extends TRPCError {
  constructor(message: string) {
    super({
      code: 'BAD_REQUEST',
      message
    })
  }
}
