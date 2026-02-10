import { type Material, MaterialShape, type Unit } from 'models'
import { makeAutoObservable } from '@/lib/deps'
import { LoadingController } from '@/lib/store/loading_controller'
import { ArbitraryState } from './shape/arbitrary.state'
import { HexagonBarState } from './shape/hexagon_bar.state'
import { ListState } from './shape/list_state'
import { PipeState } from './shape/pipe_state'
import { RoundBarState } from './shape/rounde_bar.state'
import { SquareState } from './shape/square_state'
import type { IMaterialShapeState } from './shape_state.interface'
import { MaterialWarehouseStore } from './warehouse/state'

export class MaterialSt {
  readonly loadingWall = new LoadingController()
  readonly warehouse = new MaterialWarehouseStore()
  constructor() {
    makeAutoObservable(this)
  }

  list = new ListState()
  round = new RoundBarState()
  square = new SquareState()
  pipe = new PipeState()
  hexagon = new HexagonBarState()
  arbitrary = new ArbitraryState()

  shapeState = {
    [MaterialShape.RoundBar]: this.round,
    [MaterialShape.SquareBar]: this.square,
    [MaterialShape.Pipe]: this.pipe,
    [MaterialShape.List]: this.list,
    [MaterialShape.HexagonBar]: this.hexagon,
    [MaterialShape.Arbitrary]: this.arbitrary,
  } as const

  get_shape_state(shape: MaterialShape): IMaterialShapeState {
    return this.shapeState[shape]
  }

  id: number | null = null
  label: string = ''
  unit: Unit | null = null
  set_unit(unit: Unit) {
    this.unit = unit
  }
  shape: MaterialShape = MaterialShape.RoundBar
  set_shape(shape: MaterialShape) {
    this.shape = shape
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
    group_id: number | null
  }[] = []

  shortage_prediction_horizon_days: number | null = null
  set_shortage_orediction_horizon_days(v: number | null) {
    this.shortage_prediction_horizon_days = v
  }

  writeoff_stat: {
    monthly?: [string, number][]
    quarterly?: [string, number][]
  } | null = null

  sync_state(material: Material) {
    this.shape = material.shape
    this.get_shape_state(this.shape).sync(material)
  }
}
