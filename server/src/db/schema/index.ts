import type {
  GeneratedAlways,
  Insertable,
  Kysely,
  Selectable,
  Updateable,
} from 'kysely'
export type { Selectable, Updateable, Insertable }

import * as Hr from './hr.js'
import * as Order from './orders.js'
import * as Pdo from './pdo.js'
import * as Public from './public.js'

export type KDB = Kysely<Database>
export { Pdo, Hr, Order, Public }

export interface Database {
  users: Public.UserTable
  attachments: Public.AttachmentTable
  refresh_tokens: Public.RefreshTokenTable

  'orders.orders': Order.OrderTable
  'orders.comments': Order.CommentTable
  'orders.order_attachments': Order.AttachmentTable
  'orders.order_payments': Order.PaymentTable
  'orders.order_items': Order.OrderItemTable
  'orders.notifications': Order.NotificationTable

  'hr.events': Hr.AccessControlLogTable
  'hr.intervals': Hr.WorkIntervalTable
  'hr.employees': Hr.EmployeeTable
  'hr.employee_absences': Hr.EmployeeAbsenceTable

  'pdo.dict_operation_kinds': Dict<string>
  'pdo.materials': Pdo.MaterialTable
  'pdo.details': Pdo.DetailTable
  'pdo.detail_attachments': Pdo.DetailAttachmentTable
  'pdo.inventory_log': Pdo.InventoryLogTable
  'pdo.orders': Pdo.OrderTable
  'pdo.detail_group': Pdo.DetailGroupTable
  'pdo.detail_group_details': Pdo.DetailGroupDetailsTable
}

export interface Dict<V> {
  id: GeneratedAlways<number>
  v: V
}

export * as DB from './index.js'
