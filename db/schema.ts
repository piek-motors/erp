import {
  type Generated,
  type GeneratedAlways,
  type JSONColumnType,
  type Kysely,
  type Selectable as KyselySelectable,
  type Updateable as KyselyUpdateable
} from 'kysely'
import {
  Color,
  ManufacturingOrderStatus,
  MaterialShape,
  OperationType,
  OrderStatus,
  SupplyReason,
  Unit,
  UserRole,
  WriteoffReason
} from 'models'

export type KDB = Kysely<DB.Schema>
export type Selectable<T> = KyselySelectable<T>
export type Updateable<T> = KyselyUpdateable<T>

export namespace DB {
  export interface Schema {
    ['users']: UserTable
    ['attachments']: AttachmentTable
    ['refresh_tokens']: RefreshTokenTable

    ['orders.orders']: OrderTable
    ['orders.comments']: OrderCommentsTable
    ['orders.order_attachments']: OrderAttachmentTable
    ['orders.order_payments']: OrderPaymentsTable
    ['orders.order_items']: OrderItemsTable
    ['orders.notifications']: NotificationTable

    ['attendance.intervals']: AttendanceIntervalTable
    ['attendance.users']: AttendanceUserTable

    ['pdo.materials']: MaterialTable
    ['pdo.details']: DetailTable
    ['pdo.detail_attachments']: DetailAttachmentTable
    ['pdo.operations']: OperationsTable
    ['pdo.manufacturing']: ManufacturingTable
    ['pdo.detail_group']: DetailGroupTable
    ['pdo.detail_group_details']: DetailGroupDetailsTable
    ['pdo.detail_group_color_annotations']: DetailGroupColorAnnotationsTable
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

  export interface DetailGroupColorAnnotationsTable {
    group_id: number
    detail_id: number
    colors: Color[]
  }

  export interface UserTable {
    id: GeneratedAlways<number>
    first_name: string
    last_name: string
    email: string
    role: UserRole
    password: string
    is_deleted: boolean
  }

  export interface MaterialTable {
    id: Generated<number>
    unit: Unit
    label: string // unique
    shape: MaterialShape
    shape_data: JSONColumnType<any, any, any>
    stock: number
    safety_stock: number
    linear_mass: number // kg/m
    alloy: string | null
  }

  export type Material = KyselySelectable<MaterialTable>

  export interface DetailTable {
    id: Generated<number>
    name: string
    unit: Unit // defailt Countable
    description: string | null
    logical_group_id: number | null // hash index
    part_code: string | null
    stock: number
    blank_spec: JSONColumnType<any, any, any>
    updated_at: Date
    processing_route: JSONColumnType<
      ProcessingRoute,
      ProcessingRoute,
      ProcessingRoute
    > | null
    drawing_name: string | null
    automatic_writeoff: JSONColumnType<
      DetailAutomaticWriteoffData,
      DetailAutomaticWriteoffData,
      DetailAutomaticWriteoffData
    > | null
    recommended_batch_size: number | null
  }

  export interface DetailAutomaticWriteoffData {
    material: {
      material_id: number
      length: number // meters
    } | null
    details: Array<{
      detail_id: number
      qty: number
    }>
  }

  export interface ProcessingRoute {
    steps: {
      name: string
      dur?: number | null
    }[]
  }

  interface MetarialWiteoffData {
    writeoffs: Array<{
      material_id: number
      total_cost: number
      writeoff_id: number
    }>
  }
  export interface ManufacturingTable {
    id: GeneratedAlways<number>
    status: ManufacturingOrderStatus
    detail_id: number
    qty: number
    finished_at: Date | null
    started_at: Date | null
    created_at: GeneratedAlways<Date>
    material_writeoffs: JSONColumnType<
      MetarialWiteoffData,
      MetarialWiteoffData,
      MetarialWiteoffData
    >
  }

  export interface ManufacturingData {
    processing_route: ProcessingRoute
  }

  export interface OperationsTable {
    id: GeneratedAlways<number>
    operation_type: OperationType
    reason: SupplyReason | WriteoffReason
    user_id: number
    material_id: number | null
    qty: number | null
    detail_id: number | null
    data: JSONColumnType<any, any, any> | null
    timestamp?: Generated<Date>
    manufacturing_order_id: number | null
  }

  export interface OrderPaymentsTable {
    id: GeneratedAlways<number>
    amount: number
    order_id: number
    date: Date
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

  export interface NotificationTable {
    id: GeneratedAlways<number>
    order_id: number
    comment_id: number
    user_id: number
    seen: boolean
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

  export interface AttendanceIntervalTable {
    ent: Date
    ext: Date | null
    card: string
    database: string | null
    ent_event_id: number
    ext_event_id: number | null
  }

  export interface AttendanceUserTable {
    id: GeneratedAlways<number>
    firstname: string
    lastname: string
    card: string
    created_at: GeneratedAlways<Date>
  }

  export interface OrderCommentsTable {
    id: GeneratedAlways<number>
    order_id: number
    user_id: number
    text: string
    created_at: GeneratedAlways<Date>
  }
}
