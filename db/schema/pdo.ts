import type {
  Generated,
  GeneratedAlways,
  JSONColumnType,
  Selectable as KyselySelectable,
} from 'kysely'
import type {
  OperationSubject,
  OperationType,
  OrderPriority,
  ProductionOrderStatus,
  SupplyReason,
  Unit,
  WriteoffReason,
} from 'models'
import type { BlankSchema, DetailWorkFlowSchema } from 'validators/index.js'
import type z from 'zod'

export interface Dict<V> {
  id: GeneratedAlways<number>
  v: V
}

export interface DetailGroupTable {
  id: Generated<number>
  name: string
  parent_id: number | null
}

export interface DetailGroupDetailsTable {
  group_id: number
  detail_id: number
}

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
}
export type Material = KyselySelectable<MaterialTable>

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
  workflow: JSONColumnType<
    DetailWorkflow,
    DetailWorkflow,
    DetailWorkflow
  > | null
  blank: JSONColumnType<DetailBlank, DetailBlank, DetailBlank> | null
}

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

export interface DetailAttachmentTable {
  detail_id: number
  attachment_id: number
}
