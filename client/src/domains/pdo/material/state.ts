import { makeAutoObservable } from 'lib/deps'
import { LoadingController } from 'lib/store/loading_controller'
import { Material, MaterialShape, Unit } from 'models'
import { ArbitraryState } from './shape/arbitrary.state'
import { HexagonBarState } from './shape/hexagon_bar.state'
import { ListState } from './shape/list_state'
import { PipeState } from './shape/pipe_state'
import { RoundBarState } from './shape/rounde_bar.state'
import { SquareState } from './shape/square_state'
import { IMaterialShapeState } from './shape_state.interface'
import { MaterialWarehouseStore } from './warehouse/store'

export class MaterialState {
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
    [MaterialShape.Arbitrary]: this.arbitrary
  } as const

  getShapeState(shape: MaterialShape): IMaterialShapeState {
    return this.shapeState[shape]
  }

  id?: number
  setId(id: number) {
    this.id = id
  }
  label?: string
  setLabel(label: string) {
    this.label = label
  }
  unit?: Unit
  setUnit(unit: Unit) {
    this.unit = unit
  }
  shape: MaterialShape = MaterialShape.RoundBar
  setShape(shape: MaterialShape) {
    this.shape = shape
  }
  linearMass = ''
  setLinearMass(linearMass: string) {
    this.linearMass = linearMass
  }
  alloy?: string
  setAlloy(alloy: string) {
    this.alloy = alloy
  }
  material?: Material

  detailCount: number = 0
  setDetailCount(detailCount: number) {
    this.detailCount = detailCount
  }
  detailsMadeFromThisMaterial: {
    id: number
    name: string
    group_id: number | null
  }[] = []
  setDetailsMadeFromThisMaterial(
    details: { id: number; name: string; group_id: number | null }[]
  ) {
    this.detailsMadeFromThisMaterial = details
  }
  resetDetails() {
    this.detailsMadeFromThisMaterial = []
  }

  safetyStock?: number
  setSafetyStock(safetyStock?: number) {
    this.safetyStock = safetyStock
  }
  syncState(material: Material) {
    this.id = material.id
    this.label = material.label
    this.shape = material.shape
    this.material = material
    this.getShapeState(this.shape).sync(material)
    this.warehouse.setStock(material.stock)
  }
}
