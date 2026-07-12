import type {
  Generated,
  GeneratedAlways,
  JSONColumnType,
  Selectable,
} from 'kysely'
import type {
  OperationSubject,
  OperationType,
  OrderPriority,
  ProductionOrderStatus,
  SupplyReason,
  Unit,
  WriteoffReason,
} from 'shared'
import type z from 'zod'
import type { BlankSchema, DetailWorkFlowSchema } from '../validators/index.js'

export interface Dict<V> {
  id: GeneratedAlways<number>
  v: V
}

export interface DetailGroupTable {
  id: Generated<number>
  name: string
  parent_id: number | null
}
export type DetailGroup = Selectable<DetailGroupTable>

export interface DetailGroupDetailsTable {
  group_id: number
  detail_id: number
}
export type DetailGroupDetails = Selectable<DetailGroupDetailsTable>

export interface MaterialTable {
  id: Generated<number>
  unit: Unit
  label: string // unique
  // shape: MaterialShape
  // shape_data: JSONColumnType<any, any, any>
  on_hand_balance: number
  linear_mass: number // kg/m
  alloy: string | null
  /**
   * Number of days before a *predicted* stock deficit at which a warning should be triggered,
   * calculated from historical consumption rate and extrapolated into the future.
   */
  shortage_prediction_horizon_days: number
  safe_stock_leftover: number | null
}
export type Material = Selectable<MaterialTable>

export type DetailBlank = z.infer<typeof BlankSchema>
export type DetailWorkflow = z.infer<typeof DetailWorkFlowSchema>

export interface DetailTable {
  id: Generated<number>
  name: string
  unit: Unit // Defailt Unit.Countable
  description: string | null
  drawing_number: string | null
  drawing_name: string | null
  on_hand_balance: number
  stock_location: string | null
  updated_at: Date
  recommended_batch_size: number | null
  safe_stock_leftover: number | null
  workflow: JSONColumnType<
    DetailWorkflow,
    DetailWorkflow,
    DetailWorkflow
  > | null
  blank: JSONColumnType<DetailBlank, DetailBlank, DetailBlank> | null
}
export type Detail = Selectable<DetailTable>

interface MetarialWiteoffData {
  writeoffs: Array<{
    material_id: number
    total_cost: number
    writeoff_id: number
  }>
}

export interface OrderTable {
  id: GeneratedAlways<number>
  status: ProductionOrderStatus
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
export type Order = Selectable<OrderTable>

export interface ManufacturingData {
  processing_route: DetailWorkflow
}

export interface InventoryLogTable {
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
export type InventoryLog = Selectable<InventoryLogTable>

export interface DetailAttachmentTable {
  detail_id: number
  attachment_id: number
}

export interface DetailClaimRequestTable {
  id: Generated<number>
  order_id: string
  product_name: string
  product_qty: number
  created_at: Generated<Date>
  fulfilled_at: Date | null
}
export type DetailClaimRequest = Selectable<DetailClaimRequestTable>

export interface DetailClaimRequestDetailTable {
  request_id: number
  detail_id: number
  qty: number
}
export type DetailClaimRequestDetail = Selectable<DetailClaimRequestDetailTable>
