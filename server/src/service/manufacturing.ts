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
    detailId: number
  ): Promise<Selectable<DB.ManufacturingTable>> {
    const detail = await this.trx
      .insertInto('metal_flow.manufacturing')
      .values({
        detail_id: detailId,
        qty: 0,
        finished_at: null,
        material_writeoffs: {
          writeoffs: []
        },
        status: EnManufacturingOrderStatus.Waiting
      })
      .returningAll()
      .executeTakeFirst()

    if (!detail) {
      throw new ErrManufacturingOrderNotFound(
        `Manufacturing with id ${detailId} not found`
      )
    }

    return detail
  }

  async startMaterialPreparationPhase(
    orderId: number
  ): Promise<Selectable<DB.ManufacturingTable>> {
    const order = await this.trx
      .selectFrom('metal_flow.manufacturing')
      .where('id', '=', orderId)
      .selectAll()
      .executeTakeFirst()
    if (!order)
      throw new ErrManufacturingOrderNotFound(
        `Manufacturing with id ${orderId} not found`
      )
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
    detailId: number,
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
    const materials = await this.trx
      .selectFrom('metal_flow.detail_materials')
      .innerJoin('metal_flow.materials', 'material_id', 'id')
      .where('detail_id', '=', detailId)
      .select(['material_id as id', 'data', 'stock', 'label', 'unit'])
      .execute()

    const writeoffs = await Promise.all(
      materials.map(material => this.subtractMaterials(material, qty))
    )

    await this.trx
      .insertInto('metal_flow.manufacturing')
      .values({
        detail_id: detailId,
        status: EnManufacturingOrderStatus.Production,
        qty,
        finished_at: null,
        material_writeoffs: {
          writeoffs: writeoffs.map(m => ({
            material_id: m.material_id,
            total_cost: m.totalCost,
            writeoff_id: m.writeoff_id
          }))
        }
      })
      .execute()

    return writeoffs
  }

  async finishOrder(manufacturingId: number): Promise<{
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
      .where('id', '=', manufacturingId)
      .returningAll()
      .executeTakeFirst()

    if (!manufacturing) {
      throw new ErrManufacturingOrderNotFound(
        `Manufacturing with id ${manufacturingId} not found`
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

  private async subtractMaterials(
    material: {
      id: number
      data: { length: number }
      stock: number
      label: string
    },
    qty: number
  ) {
    const { id, label } = material
    const totalCost = (material.data.length * qty) / 1000

    if (material.stock < totalCost) {
      throw new ErrNotEnoughMaterial(
        `Недостаточно материала (id=${id}) ${label}, требуется ${totalCost.toFixed(
          1
        )} м, имеется ${material.stock.toFixed(1)} м`
      )
    }
    if (totalCost === 0) {
      throw new ErrZeroCost(`Не указан расход материала (id=${id}) ${label}`)
    }

    return await this.warehouse
      .subtractMaterial(
        material.id,
        totalCost,
        EnWriteoffReason.UsedInProduction
      )
      .then(res => ({
        material_id: material.id,
        material_name: material.label,
        writeoff_id: res.operation_id,
        stock: res.stock,
        totalCost
      }))
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
