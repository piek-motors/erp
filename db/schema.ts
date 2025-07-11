import {
  EnMaterialShape,
  EnOperationType,
  EnSupplyReason,
  EnUnit,
  EnWriteoffReason,
  OrderStatus,
  UserRole
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
    ['refresh_tokens']: RefreshTokenTable

    ['orders.orders']: OrderTable
    ['orders.order_attachments']: OrderAttachmentTable
    ['orders.order_payments']: OrderPaymentsTable
    ['orders.order_items']: OrderItemsTable

    ['metal_flow.materials']: MaterialTable
    ['metal_flow.details']: DetailTable
    ['metal_flow.detail_attachments']: DetailAttachmentTable
    ['metal_flow.detail_materials']: DetailMaterialsTable
    ['metal_flow.operations']: OperationsTable
    ['metal_flow.manufacturing']: ManufacturingTable
    ['metal_flow.detail_group']: DetailGroupTable
    ['metal_flow.detail_group_details']: DetailGroupDetailsTable
  }

  export interface RefreshTokenTable {
    id: Generated<number>
    token: string
    user_id: number
    created_at: Generated<Date>
  }

  export interface DetailGroupTable {
    id: Generated<number>
    name: string
  }

  export interface DetailGroupDetailsTable {
    group_id: number
    detail_id: number
  }

  export interface UserTable {
    id: GeneratedAlways<number>
    first_name: string | null
    last_name: string | null
    email: string | null
    role: UserRole
    password: string | null
    is_deleted: boolean
  }

  export interface MaterialTable {
    id: Generated<number>
    unit: EnUnit
    label: string // unique
    shape: EnMaterialShape
    shape_data: JSONColumnType<any, any, any>
    stock: number
    linear_mass: number // kg/m
    alloy: string | null
  }

  export type Material = KyselySelectable<MaterialTable>

  export interface DetailTable {
    id: Generated<number>
    name: string
    description: string | null
    logical_group_id: number | null
    part_code: string
    stock: number
    params: JSONColumnType<any, any, any>
  }

  export interface ManufacturingTable {
    id: GeneratedAlways<number>
    detail_id: number
    qty: number
    finished_at: Date | null
    started_at: GeneratedAlways<Date>
  }

  export interface DetailMaterialJsonData {
    weight: number // grams
    length: number // mm
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
    status: OrderStatus
    manager_id: number | null
    created_at: Date
    contractor: string | null
    city: string | null
    total_amount: number | null
    comment: string | null
    invoice_number: string | null
    shipping_date: Date | null
    awaiting_dispatch: boolean
    acceptance_date: Date | null
    actual_shipping_date: Date | null
    order_number: string | null
    is_reclamation: boolean
    need_attention: string | null
  }

  export interface OrderItemsTable {
    id: GeneratedAlways<number>
    order_id: number
    name: string
    quantity: number
    assembler_name: string | null
    description: string | null
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
