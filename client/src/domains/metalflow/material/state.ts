import { AsyncStoreController } from 'lib/async-store.controller'
import { makeAutoObservable } from 'lib/deps'
import { EnMaterialShape, EnUnit, Material } from 'models'
import { HexagonBarState } from './shape/hexagon_bar.state'
import { ListState } from './shape/list_state'
import { PipeState } from './shape/pipe_state'
import { RoundBarState } from './shape/rounde_bar.state'
import { SquareState } from './shape/square_state'
import { IMaterialShapeState } from './shape_state.interface'
import { MaterialWarehouseStore } from './warehouse/store'

export class MaterialState {
  readonly loadingWall = new AsyncStoreController()
  readonly warehouse = new MaterialWarehouseStore()
  constructor(
    init: {
      id?: number
      label?: string
      stock?: number
      safety_stock?: number
    } = {}
  ) {
    makeAutoObservable(this)
    this.id = init.id
    this.label = init.label
    this.warehouse.setStock(init.stock || 0)
    this.safetyStock = init.safety_stock?.toString() || ''
  }

  list = new ListState()
  round = new RoundBarState()
  square = new SquareState()
  pipe = new PipeState()
  hexagon = new HexagonBarState()

  shapeState = {
    [EnMaterialShape.RoundBar]: this.round,
    [EnMaterialShape.SquareBar]: this.square,
    [EnMaterialShape.Pipe]: this.pipe,
    [EnMaterialShape.List]: this.list,
    [EnMaterialShape.HexagonBar]: this.hexagon
  } as const

  getShapeState(shape: EnMaterialShape): IMaterialShapeState {
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
  unit: EnUnit = EnUnit.Kg
  setUnit(unit: EnUnit) {
    this.unit = unit
  }
  shape: EnMaterialShape = EnMaterialShape.RoundBar
  setShape(shape: EnMaterialShape) {
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
  safetyStock = ''
  setSafetyStock(safetyStock: string) {
    this.safetyStock = safetyStock
  }
  insertedMaterialId?: number
  syncState(material: Material) {
    this.id = material.id
    this.label = material.label
    this.unit = material.unit
    this.shape = material.shape
    this.material = material
    this.getShapeState(this.shape).sync(material)
    this.warehouse.setStock(material.stock)
  }
}
