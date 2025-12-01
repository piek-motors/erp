import { IDB, TRPCError } from '#root/deps.js'
import { OperationType, SupplyReason, WriteoffReason } from 'models'

export class Warehouse {
  constructor(private readonly trx: IDB, private readonly userId: number) {}

  supplyMaterial(id: number, qty: number, reason: SupplyReason) {
    return Promise.all([
      this.trx
        .insertInto('pdo.operations')
        .values({
          operation_type: OperationType.Supply,
          user_id: this.userId,
          material_id: id,
          qty,
          reason
        })
        .returning(['id'])
        .executeTakeFirstOrThrow(),
      //
      this.trx
        .updateTable('pdo.materials')
        .set(eb => ({
          stock: eb('stock', '+', qty)
        }))
        .where('id', '=', id)
        .returning(['stock'])
        .executeTakeFirstOrThrow()
    ]).then(([operation, { stock }]) => ({
      operation_id: operation.id,
      stock
    }))
  }

  async subtractMaterial(
    id: number,
    qty: number,
    reason: WriteoffReason,
    detail_id?: number,
    manufacturing_order_id?: number
  ) {
    const current_stock = await this.trx
      .selectFrom('pdo.materials')
      .select(['stock', 'label'])
      .where('id', '=', id)
      .executeTakeFirstOrThrow()
    if (current_stock.stock < qty) {
      throw new ErrNotEnoughStock(
        `Недостаточно материала id=${id} ${current_stock.label}`
      )
    }

    const operation = await this.trx
      .insertInto('pdo.operations')
      .values({
        operation_type: OperationType.Writeoff,
        user_id: this.userId,
        material_id: id,
        detail_id,
        qty,
        reason,
        manufacturing_order_id
      })
      .returning(['id'])
      .executeTakeFirstOrThrow()

    const res = await this.trx
      .updateTable('pdo.materials')
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

  async supplyDetails(id: number, qty: number, reason: SupplyReason) {
    const operation = await this.trx
      .insertInto('pdo.operations')
      .values({
        operation_type: OperationType.Supply,
        user_id: this.userId,
        detail_id: id,
        qty,
        reason
      })
      .returning(['id'])
      .executeTakeFirstOrThrow()
    const detail = await this.trx
      .updateTable('pdo.details')
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

  async writeoffDetails(id: number, qty: number, reason: WriteoffReason) {
    const { stock } = await this.trx
      .selectFrom('pdo.details')
      .select(['stock'])
      .where('id', '=', id)
      .executeTakeFirstOrThrow()
    if (stock < qty) {
      throw new ErrNotEnoughStock(`Недостаточно деталей ${id}`)
    }

    const detail = await this.trx
      .updateTable('pdo.details')
      .set(eb => ({
        stock: eb('stock', '-', qty)
      }))
      .where('id', '=', id)
      .returning(['stock'])
      .executeTakeFirstOrThrow()

    const operation = await this.trx
      .insertInto('pdo.operations')
      .values({
        operation_type: OperationType.Writeoff,
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

class ErrNotEnoughStock extends TRPCError {
  constructor(message: string) {
    super({
      code: 'BAD_REQUEST',
      message
    })
  }
}
