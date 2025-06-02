import {
  EnMaterialShape,
  EnUnit,
  EnWriteoffReason,
  EnWriteoffType
} from 'domain-model'
import type {
  Generated,
  GeneratedAlways,
  JSONColumnType,
  Kysely,
  Selectable as KyselySelectable,
  Updateable as KyselyUpdateable
} from 'kysely'

export type KDB = Kysely<DB.Schema>
export type Selectable<T> = KyselySelectable<T>
export type Updateable<T> = KyselyUpdateable<T>

export namespace DB {
  export interface Schema {
    ['users']: UserTable
    ['orders.orders']: OrderTable
    ['orders.order_payments']: OrderPaymentsTable
    ['metal_flow.materials']: MaterialTable
    ['metal_flow.details']: DetailTable
    ['metal_flow.detail_materials']: DetailMaterialsTable
    ['metal_flow.supplies']: SuppliesTable
    ['metal_flow.writeoffs']: WriteoffsTable
  }

  export interface UserTable {
    id: GeneratedAlways<number>
    first_name: string | null
    last_name: string | null
    email: string | null
    role: number | null
    password: string | null
  }

  export interface MaterialTable {
    id: Generated<number>
    unit: EnUnit
    label: string // unique
    shape: EnMaterialShape
    shape_data: JSONColumnType<any, any, any>
  }

  export type Material = KyselySelectable<MaterialTable>

  export interface DetailTable {
    id: Generated<number>
    name: string
  }

  export interface DetailMaterialJsonData {
    weight: number
    length: number
  }

  export interface DetailMaterialsTable {
    material_id: number
    detail_id: number
    data: JSONColumnType<
      DetailMaterialJsonData,
      DetailMaterialJsonData,
      DetailMaterialJsonData
    >
  }

  export interface SuppliesTable {
    id: GeneratedAlways<number>
    material_id: number
    qty: number
    supplied_at: Date
    supplier_name: string
  }

  export interface WriteoffsTable {
    id: GeneratedAlways<number>
    material_id: number
    date: Date
    qty: number
    reason: EnWriteoffReason
    type: EnWriteoffType
    type_data: JSONColumnType<any, any, any>
  }

  export interface OrderPaymentsTable {
    id: GeneratedAlways<number>
    order_id: number
    amount: number
    date: Date
    payment_method: string
    status: string
    transaction_id: string
  }

  export interface OrderTable {
    id: GeneratedAlways<number>
    total_amount: number
    created_at: Date
  }
}
