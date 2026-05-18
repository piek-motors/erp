import type { GeneratedAlways } from 'kysely'
import type { OrderStatus } from 'models'

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
  order_id: number
  attachment_id: number
}

export interface CommentsTable {
  id: GeneratedAlways<number>
  order_id: number
  user_id: number
  text: string
  created_at: GeneratedAlways<Date>
}

export interface PaymentTable {
  id: GeneratedAlways<number>
  amount: number
  order_id: number
  date: Date
}
