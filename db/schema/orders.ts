import type { Generated, GeneratedAlways, JSONColumnType } from 'kysely'
import type {
  OperationSubject,
  OperationType,
  OrderStatus,
  SupplyReason,
  Unit,
  WriteoffReason,
} from 'models'

export interface OperationsTable {
  id: GeneratedAlways<number>
  operation_type: OperationType
  reason: SupplyReason | WriteoffReason
  subject: OperationSubject
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

export interface OrderAttachmentTable {
  order_id: number
  attachment_id: number
}

export interface OrderCommentsTable {
  id: GeneratedAlways<number>
  order_id: number
  user_id: number
  text: string
  created_at: GeneratedAlways<Date>
}
