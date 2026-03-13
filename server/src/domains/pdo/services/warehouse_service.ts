import { OperationType, type SupplyReason, type WriteoffReason } from 'models'
import { type IDB, TRPCError } from '#root/sdk.js'
import { DetailRepo } from '../storage/detail_repo.js'
import { MaterialRepo } from '../storage/material_repo.js'

export class Warehouse {
  private readonly detail_repo: DetailRepo
  private readonly material_repo: MaterialRepo

  constructor(
    private readonly trx: IDB,
    private readonly userId: number,
  ) {
    this.detail_repo = new DetailRepo(trx)
    this.material_repo = new MaterialRepo(trx)
  }

  async supplyMaterial(material_id: number, qty: number, reason: SupplyReason) {
    const unit = await this.material_repo.unit(material_id)

    const [operation, on_hand_balance] = await Promise.all([
      this.trx
        .insertInto('pdo.operations')
        .values({
          operation_type: OperationType.Supply,
          user_id: this.userId,
          material_id,
          material_unit: unit,
          qty,
          reason,
        })
        .returning(['id'])
        .executeTakeFirstOrThrow(),
      this.material_repo.increment_balance(material_id, qty),
    ])

    return {
      operation_id: operation.id,
      on_hand_balance,
    }
  }

  async subtractMaterial(
    material_id: number,
    qty: number,
    reason: WriteoffReason,
    detail_id?: number,
    manufacturing_order_id?: number,
  ) {
    const material = await this.material_repo.on_hande_balance(material_id)
    if (material.on_hand_balance < qty) {
      throw new ErrNotEnoughStock(
        `Недостаточно материала id=${material_id} ${material.label}`,
      )
    }

    const [operation, on_hand_balance] = await Promise.all([
      this.trx
        .insertInto('pdo.operations')
        .values({
          operation_type: OperationType.Writeoff,
          user_id: this.userId,
          material_id,
          material_unit: material.unit,
          detail_id,
          qty,
          reason,
          manufacturing_order_id,
        })
        .returning(['id'])
        .executeTakeFirstOrThrow(),
      this.material_repo.decrement_balance(material_id, qty),
    ])

    return {
      operation_id: operation.id,
      on_hand_balance,
    }
  }

  async supplyDetails(id: number, qty: number, reason: SupplyReason) {
    const [operation, on_hand_balance] = await Promise.all([
      this.trx
        .insertInto('pdo.operations')
        .values({
          operation_type: OperationType.Supply,
          user_id: this.userId,
          detail_id: id,
          qty,
          reason,
        })
        .returning(['id'])
        .executeTakeFirstOrThrow(),
      this.detail_repo.increment_balance(id, qty),
    ])

    return {
      operation_id: operation.id,
      on_hand_balance,
    }
  }

  async writeoffDetails(id: number, qty: number, reason: WriteoffReason) {
    const on_hand_balance = await this.detail_repo.get_balance(id)

    if (on_hand_balance < qty) {
      throw new ErrNotEnoughStock(`Недостаточно деталей ${id}`)
    }

    const [new_balance, operation] = await Promise.all([
      this.detail_repo.decrement_balance(id, qty),
      this.trx
        .insertInto('pdo.operations')
        .values({
          operation_type: OperationType.Writeoff,
          user_id: this.userId,
          detail_id: id,
          qty,
          reason,
        })
        .returning('id')
        .executeTakeFirstOrThrow(),
    ])

    return {
      on_hand_balance: new_balance,
      operation_id: operation.id,
    }
  }
}

class ErrNotEnoughStock extends TRPCError {
  constructor(message: string) {
    super({
      code: 'BAD_REQUEST',
      message,
    })
  }
}
