import type { DB } from 'db'
import type { Selectable } from 'kysely'
import type { Unit } from 'models'
import { type IDB, RpcError } from '#root/sdk.js'

export type SelectableMaterial = Selectable<DB.MaterialTable>

export interface MaterialWithDeficit extends SelectableMaterial {
  deficit: DeficitInfo
}

export interface DeficitInfo {
  deficit: boolean
  days_until_stockout: number
}

export interface CreateMaterialInput {
  unit: Unit
  label: string
  alloy: string | null
  shortage_prediction_horizon_days: number | null
}

export interface UpdateMaterialInput extends CreateMaterialInput {
  id: number
}

export class MaterialRepo {
  constructor(private readonly db: IDB) {}

  async get_by_id(id: number): Promise<SelectableMaterial | undefined> {
    return await this.db
      .selectFrom('pdo.materials')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
  }

  async get_by_id_or_throw(id: number): Promise<SelectableMaterial> {
    return await this.db
      .selectFrom('pdo.materials')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow()
  }

  async unit(material_id: number): Promise<Unit> {
    const result = await this.db
      .selectFrom('pdo.materials')
      .select(['id', 'unit'])
      .where('id', '=', material_id)
      .executeTakeFirst()
    if (result == null) {
      throw new RpcError('NOT_FOUND', `material ${material_id} not found`)
    }
    return result?.unit
  }

  /**
   * Get material with balance info for warehouse operations
   */
  async on_hande_balance(material_id: number): Promise<{
    id: number
    on_hand_balance: number
    label: string
    unit: Unit
  }> {
    const result = await this.db
      .selectFrom('pdo.materials')
      .select(['id', 'label', 'on_hand_balance', 'unit'])
      .where('id', '=', material_id)
      .executeTakeFirst()
    if (result == null) {
      throw new RpcError('NOT_FOUND', `material ${material_id} not found`)
    }
    return result
  }

  async list_materials(): Promise<SelectableMaterial[]> {
    return await this.db
      .selectFrom('pdo.materials as m')
      .selectAll()
      .orderBy('m.label')
      .execute()
  }

  async create(input: CreateMaterialInput): Promise<SelectableMaterial> {
    return await this.db
      .insertInto('pdo.materials')
      .values({
        unit: input.unit,
        label: input.label,
        alloy: input.alloy,
        shortage_prediction_horizon_days:
          input.shortage_prediction_horizon_days ?? 60,
        on_hand_balance: 0,
        linear_mass: 0,
      })
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async update(input: UpdateMaterialInput): Promise<SelectableMaterial> {
    return await this.db
      .updateTable('pdo.materials')
      .set({
        unit: input.unit,
        label: input.label,
        alloy: input.alloy,
        shortage_prediction_horizon_days:
          input.shortage_prediction_horizon_days ?? 60,
      })
      .where('id', '=', input.id)
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async delete(id: number): Promise<void> {
    await this.db.deleteFrom('pdo.materials').where('id', '=', id).execute()
  }

  async get_distinct_alloys(): Promise<(string | null)[]> {
    const result = await this.db
      .selectFrom('pdo.materials')
      .select('alloy')
      .distinct()
      .execute()
    return result.map(e => e.alloy)
  }

  async increment_balance(id: number, qty: number): Promise<number> {
    const result = await this.db
      .updateTable('pdo.materials')
      .set(eb => ({
        on_hand_balance: eb('on_hand_balance', '+', qty),
      }))
      .where('id', '=', id)
      .returning(['on_hand_balance'])
      .executeTakeFirstOrThrow()
    return result.on_hand_balance
  }

  async decrement_balance(id: number, qty: number): Promise<number> {
    const material = await this.on_hande_balance(id)
    if (!material) {
      throw new Error(`Material with id=${id} not found`)
    }
    if (material.on_hand_balance < qty) {
      throw new Error(
        `Insufficient stock: material_id=${id}, available=${material.on_hand_balance}, requested=${qty}`,
      )
    }
    const result = await this.db
      .updateTable('pdo.materials')
      .set(eb => ({
        on_hand_balance: eb('on_hand_balance', '-', qty),
      }))
      .where('id', '=', id)
      .returning(['on_hand_balance'])
      .executeTakeFirstOrThrow()
    return result.on_hand_balance
  }
}
