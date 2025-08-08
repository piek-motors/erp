import { IDB, TRPCError } from '#root/deps.js'
import { EnOperationType, EnSupplyReason, EnWriteoffReason } from 'models'

export class Warehouse {
  constructor(private readonly trx: IDB, private readonly userId: number) {}

  async addMaterial(id: number, qty: number, reason: EnSupplyReason) {
    const operation = await this.trx
      .insertInto('metal_flow.operations')
      .values({
        operation_type: EnOperationType.Supply,
        user_id: this.userId,
        material_id: id,
        qty,
        reason
      })
      .returning(['id'])
      .executeTakeFirstOrThrow()
    const res = await this.trx
      .updateTable('metal_flow.materials')
      .set(eb => ({
        stock: eb('stock', '+', qty)
      }))
      .where('id', '=', id)
      .returning(['stock'])
      .executeTakeFirstOrThrow()
    return {
      operation_id: operation.id,
      stock: res.stock
    }
  }

  async subtractMaterial(
    id: number,
    qty: number,
    reason: EnWriteoffReason,
    detail_id?: number
  ) {
    const current_stock = await this.trx
      .selectFrom('metal_flow.materials')
      .select(['stock', 'label'])
      .where('id', '=', id)
      .executeTakeFirstOrThrow()

    if (current_stock.stock < qty) {
      throw new ErrNotEnoughStock(
        `Недостаточно материала id=${id} ${current_stock.label}`
      )
    }

    const operation = await this.trx
      .insertInto('metal_flow.operations')
      .values({
        operation_type: EnOperationType.Writeoff,
        user_id: this.userId,
        material_id: id,
        detail_id,
        qty,
        reason
      })
      .returning(['id'])
      .executeTakeFirstOrThrow()

    const res = await this.trx
      .updateTable('metal_flow.materials')
      .set(eb => ({
        stock: eb('stock', '-', qty)
      }))
      .where('id', '=', id)
      .returning(['stock'])
      .executeTakeFirstOrThrow()

    return {
      operation_id: operation.id,
      stock: res.stock
    }
  }

  async addDetail(id: number, qty: number, reason: EnSupplyReason) {
    const operation = await this.trx
      .insertInto('metal_flow.operations')
      .values({
        operation_type: EnOperationType.Supply,
        user_id: this.userId,
        detail_id: id,
        qty,
        reason
      })
      .returning(['id'])
      .executeTakeFirstOrThrow()
    const detail = await this.trx
      .updateTable('metal_flow.details')
      .set(eb => ({
        stock: eb('stock', '+', qty)
      }))
      .where('id', '=', id)
      .returning(['stock'])
      .executeTakeFirstOrThrow()

    return {
      operation_id: operation.id,
      stock: detail.stock
    }
  }

  async subtractDetail(id: number, qty: number, reason: EnWriteoffReason) {
    const current_stock = await this.trx
      .selectFrom('metal_flow.details')
      .select(['stock'])
      .where('id', '=', id)
      .executeTakeFirstOrThrow()

    if (current_stock.stock < qty) {
      throw new ErrNotEnoughStock(`Недостаточно деталей ${id}`)
    }

    const detail = await this.trx
      .updateTable('metal_flow.details')
      .set(eb => ({
        stock: eb('stock', '-', qty)
      }))
      .where('id', '=', id)
      .returning(['stock'])
      .executeTakeFirstOrThrow()

    const operation = await this.trx
      .insertInto('metal_flow.operations')
      .values({
        operation_type: EnOperationType.Writeoff,
        user_id: this.userId,
        detail_id: id,
        qty,
        reason
      })
      .returning('id')
      .executeTakeFirstOrThrow()

    return {
      stock: detail.stock,
      operation_id: operation.id
    }
  }
}

export class ErrNotEnoughStock extends TRPCError {
  constructor(message: string) {
    super({
      code: 'BAD_REQUEST',
      message
    })
  }
}
