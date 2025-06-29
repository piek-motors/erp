import {
  EnMaterialShape,
  EnOperationType,
  EnSupplyReason,
  EnUnit,
  EnWriteoffReason
} from 'domain-model'
import {
  type Generated,
  type GeneratedAlways,
  type JSONColumnType,
  type Kysely,
  type Selectable as KyselySelectable,
  type Updateable as KyselyUpdateable
} from 'kysely'

export type KDB = Kysely<DB.Schema>
export type Selectable<T> = KyselySelectable<T>
export type Updateable<T> = KyselyUpdateable<T>

export namespace DB {
  export interface Schema {
    ['users']: UserTable
    ['attachments']: AttachmentTable

    ['orders.orders']: OrderTable
    ['orders.order_attachments']: OrderAttachmentTable
    ['orders.order_payments']: OrderPaymentsTable

    ['metal_flow.materials']: MaterialTable
    ['metal_flow.details']: DetailTable
    ['metal_flow.detail_attachments']: DetailAttachmentTable
    ['metal_flow.detail_materials']: DetailMaterialsTable
    ['metal_flow.operations']: OperationsTable
    ['metal_flow.manufacturing']: ManufacturingTable
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
    stock: number
  }

  export type Material = KyselySelectable<MaterialTable>

  export interface DetailTable {
    id: Generated<number>
    name: string
    part_code: string
    stock: number
  }

  export interface ManufacturingTable {
    id: GeneratedAlways<number>
    detail_id: number
    qty: number
    finished_at: Date | null
    started_at: GeneratedAlways<Date>
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

  export interface OperationsTable {
    id: GeneratedAlways<number>
    operation_type: EnOperationType
    reason: EnSupplyReason | EnWriteoffReason
    user_id: number
    material_id: number | null
    qty: number | null
    detail_id: number | null
    data: JSONColumnType<any, any, any> | null
    timestamp?: Generated<Date>
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

  export interface AttachmentTable {
    id: Generated<number>
    key: string
    filename: string
    size: number
    uploaded_at: Date
  }

  export interface OrderAttachmentTable {
    order_id: number
    attachment_id: number
  }

  export interface DetailAttachmentTable {
    detail_id: number
    attachment_id: number
  }
}
