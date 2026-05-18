import type {
  GeneratedAlways,
  Kysely,
  Selectable as KyselySelectable,
  Updateable as KyselyUpdateable,
} from 'kysely'
import * as Hr from './hr.js'
import * as Order from './orders.js'
import * as Pdo from './pdo.js'
import * as Public from './public.js'

export type KDB = Kysely<Database>
export type Selectable<T> = KyselySelectable<T>
export type Updateable<T> = KyselyUpdateable<T>

export { Pdo, Hr, Order, Public }

export interface Database {
  users: Public.UserTable
  attachments: Public.AttachmentTable
  refresh_tokens: Public.RefreshTokenTable

  'orders.orders': Order.OrderTable
  'orders.comments': Order.OrderCommentsTable
  'orders.order_attachments': Order.OrderAttachmentTable
  'orders.order_payments': Order.OrderPaymentsTable
  'orders.order_items': Order.OrderItemsTable
  'orders.notifications': Order.NotificationTable

  'attendance.events': Hr.AttendanceEventsTable
  'attendance.intervals': Hr.AttendanceIntervalTable
  'attendance.employees': Hr.AttendanceEmployeeTable
  'attendance.employee_absences': Hr.AttendanceEmployeeAbsenceTable

  'pdo.dict_operation_kinds': Dict<string>
  'pdo.materials': Pdo.MaterialTable
  'pdo.details': Pdo.DetailTable
  'pdo.detail_attachments': Pdo.DetailAttachmentTable
  'pdo.operations': Pdo.OperationsTable
  'pdo.orders': Pdo.ProductionOrderTable
  'pdo.detail_group': Pdo.DetailGroupTable
  'pdo.detail_group_details': Pdo.DetailGroupDetailsTable
  'pdo.detail_group_color_annotations': Pdo.DetailGroupColorAnnotationsTable
}

export interface Dict<V> {
  id: GeneratedAlways<number>
  v: V
}
