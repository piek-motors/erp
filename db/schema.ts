import type {
  Generated,
  GeneratedAlways,
  JSONColumnType,
  Kysely,
  Selectable as KyselySelectable,
  Updateable as KyselyUpdateable,
} from 'kysely'
import {
  AbsenceReason,
  Color,
  ManufacturingOrderStatus,
  MaterialShape,
  OperationType,
  OrderPriority,
  OrderStatus,
  SupplyReason,
  Unit,
  UserRole,
  WriteoffReason,
} from 'models'
import { BlankSchema } from 'validators'
import z from 'zod'

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

    ['attendance.events']: AttendanceEventsTable
    ['attendance.intervals']: AttendanceIntervalTable
    ['attendance.employees']: AttendanceEmployeeTable
    ['attendance.employee_absences']: AttendanceEmployeeAbsenceTable

    ['pdo.dict_operation_kinds']: Dict<string>
    ['pdo.materials']: MaterialTable
    ['pdo.details']: DetailTable
    ['pdo.detail_attachments']: DetailAttachmentTable
    ['pdo.operations']: OperationsTable
    ['pdo.orders']: ProductionOrderTable
    ['pdo.detail_group']: DetailGroupTable
    ['pdo.detail_group_details']: DetailGroupDetailsTable
    ['pdo.detail_group_color_annotations']: DetailGroupColorAnnotationsTable
  }

  export interface Dict<V> {
    id: GeneratedAlways<number>
    v: V
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
    roles: UserRole[]
    password: string
    is_deleted: boolean
  }

  export interface MaterialTable {
    id: Generated<number>
    unit: Unit
    label: string // unique
    shape: MaterialShape
    shape_data: JSONColumnType<any, any, any>
    on_hand_balance: number
    linear_mass: number // kg/m
    alloy: string | null
    /**
     * Number of days before a *predicted* stock deficit at which a warning should be triggered,
     * calculated from historical consumption rate and extrapolated into the future.
     */
    shortage_prediction_horizon_days: number
  }
  export type Material = KyselySelectable<MaterialTable>

  export type Blank = z.infer<typeof BlankSchema>

  export interface DetailTable {
    id: Generated<number>
    name: string
    unit: Unit // Defailt Unit.Countable
    description: string | null
    logical_group_id: number | null // Index - hash
    drawing_number: string | null
    drawing_name: string | null
    on_hand_balance: number
    stock_location: string | null
    updated_at: Date
    recommended_batch_size: number | null
    processing_route: JSONColumnType<
      ProcessingRoute,
      ProcessingRoute,
      ProcessingRoute
    > | null
    blank: JSONColumnType<Blank, Blank, Blank> | null
  }

  export interface ProcessingRoute {
    steps: number[] // ids in table pdo.dict_operation_kinds
  }

  interface MetarialWiteoffData {
    writeoffs: Array<{
      material_id: number
      total_cost: number
      writeoff_id: number
    }>
  }
  export interface ProductionOrderTable {
    id: GeneratedAlways<number>
    status: ManufacturingOrderStatus
    detail_id: number
    qty: number
    output_qty: number | null
    current_operation: number | null
    current_operation_start_at: string | null
    finished_at: Date | null
    started_at: Date | null
    created_at: GeneratedAlways<Date>
    material_writeoffs: JSONColumnType<
      MetarialWiteoffData,
      MetarialWiteoffData,
      MetarialWiteoffData
    >
    priority: OrderPriority
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
    material_unit: Unit | null
    detail_id: number | null
    // string on read
    qty: number // numeric in db
    data: JSONColumnType<any, any, any> | null
    timestamp: Generated<Date>
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

  export interface AttendanceEventsTable {
    id: number
    card: string
    timestamp: Date
  }

  export interface AttendanceIntervalTable {
    ent: Date
    ext: Date | null
    card: string
    database: string | null
    ent_event_id: number
    ext_event_id: number | null
    updated_manually: boolean | null
  }

  export interface AttendanceEmployeeTable {
    id: GeneratedAlways<number>
    firstname: string
    lastname: string
    card: string
    job_title: string | null
    created_at: GeneratedAlways<Date>
  }

  export interface AttendanceEmployeeAbsenceTable {
    user_id: number
    date: string
    reason: AbsenceReason
  }

  export interface OrderCommentsTable {
    id: GeneratedAlways<number>
    order_id: number
    user_id: number
    text: string
    created_at: GeneratedAlways<Date>
  }
}
