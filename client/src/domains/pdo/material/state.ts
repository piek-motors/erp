import type { Unit } from 'models'
import { makeAutoObservable } from '@/lib/deps'
import { LoadingController } from '@/lib/store/loading_controller'
import type { DeficitInfo } from '@/server/domains/pdo/materials_rpc'
import { MaterialWarehouseStore } from './warehouse/state'

export class MaterialSt {
  readonly loadingWall = new LoadingController()
  readonly warehouse = new MaterialWarehouseStore()
  constructor() {
    makeAutoObservable(this)
  }

  id: number | null = null
  unit: Unit | null = null

  set_unit(unit: Unit) {
    this.unit = unit
  }
  label: string = ''
  set_label(l: string) {
    this.label = l
  }

  alloy: string = ''
  set_alloy(alloy: string) {
    this.alloy = alloy
  }

  get stock() {
    return this.warehouse.on_hand_balance
  }

  details_count: number = 0
  details_made_from_this_material: {
    id: number
    name: string
    group_ids: number[]
  }[] = []

  shortage_prediction_horizon_days: number | null = null
  set_shortage_orediction_horizon_days(v: number | null) {
    this.shortage_prediction_horizon_days = v
  }

  writeoff_stat: {
    monthly?: [string, number][]
    quarterly?: [string, number][]
  } | null = null

  deficit_info: DeficitInfo | null = null
}
