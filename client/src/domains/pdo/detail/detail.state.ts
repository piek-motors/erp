import { AttachmentsStore } from '@/components/attachments/store'
import { makeAutoObservable } from 'mobx'
import { Unit } from 'models'
import type { SelectableDetail } from 'srv/domains/pdo/details_rpc'
import type { RouterInput, RouterOutput } from 'srv/lib/trpc'
import { app_cache } from '../cache'
import { DetailBlankSt } from './detail_blank.store'
import { DetailWarehouseStore } from './warehouse/store'

type DetailResponse = RouterOutput['pdo']['details']['get']['detail']
type UpdateDetailRequest = RouterInput['pdo']['details']['update']

export class Operation {
  id: number | null
  setId(id: number | null) {
    this.id = id
  }
  constructor(id: number | null) {
    makeAutoObservable(this)
    this.id = id
  }
  get name(): string {
    if (!this.id) return ''
    const name = app_cache.details.dict_processing_operaions.find(
      each => each.id === this.id,
    )?.v
    return name ?? 'No value in the dict'
  }
}

class ProcessingRoute {
  steps: Operation[] = []
  init(steps: Operation[]) {
    this.steps = steps
  }
  constructor() {
    makeAutoObservable(this)
  }
  addEmpty() {
    this.steps = [...this.steps, new Operation(null)]
  }
  remove(idx: number) {
    if (idx < 0 || idx >= this.steps.length) return
    this.steps = [...this.steps.slice(0, idx), ...this.steps.slice(idx + 1)]
  }
  reset() {
    this.steps = []
  }
}

export type BlankSpec = {
  arr: { key: string; value: any }[]
}

export type DetailStProp = { detail: DetailSt }

export class DetailSt {
  readonly attachments = new AttachmentsStore()
  readonly warehouse = new DetailWarehouseStore()
  /** metal blank */
  readonly blank = new DetailBlankSt()
  readonly processingRoute = new ProcessingRoute()

  static fromDto(detail: Partial<SelectableDetail>): DetailSt {
    return new DetailSt().init({
      id: detail.id ?? 0,
      name: detail.name ?? '',
      drawing_number: detail.drawing_number ?? null,
      logical_group_id: detail.logical_group_id ?? null,
      on_hand_balance: detail.on_hand_balance || 0,
      description: detail.description || '',
      drawing_name: detail.drawing_name ?? '',
      updated_at: detail.updated_at?.toString() ?? '',
      recommended_batch_size: detail.recommended_batch_size ?? null,
      processing_route: detail.processing_route ?? null,
      blank: detail.blank ?? null,
      unit: detail.unit ?? Unit.Countable,
      stock_location: detail.stock_location ?? null,
    })
  }

  id: number = 0
  setId(id: number) {
    this.id = id
  }
  name: string = ''
  setName(name: string) {
    this.name = name
  }
  description?: string
  setDescription(description?: string | null) {
    this.description = description ?? ''
  }
  group_id?: number | null
  setGroupId(groupId: number | null) {
    this.group_id = groupId
  }
  drawingName?: string
  setDrawingName(name: string) {
    this.drawingName = name
  }
  drawingNumber?: string
  setDrawingNumber(drawingNumber: string) {
    this.drawingNumber = drawingNumber
  }
  stockLocation?: string | null
  setStockLocation(v: string) {
    this.stockLocation = v
  }
  updatedAt?: Date
  setUpdatedAt(date: Date | undefined) {
    this.updatedAt = date
  }
  lastManufacturingDate?: Date
  setLastManufacturingDate(date: Date | undefined) {
    this.lastManufacturingDate = date
  }
  lastManufacturingQty?: number
  setLastManufacturingQty(qty: number | undefined) {
    this.lastManufacturingQty = qty
  }
  recentlyAdded?: number
  setRecentlyAdded(id: number) {
    this.recentlyAdded = id
  }
  recentlyUpdated?: number
  setRecentlyUpdated(id: number) {
    this.recentlyUpdated = id
  }
  recommendedBatchSize?: number
  setRecommendedBatchSize(size?: number) {
    this.recommendedBatchSize = size
  }

  constructor() {
    makeAutoObservable(this)
  }

  init(d: DetailResponse) {
    this.setId(d.id!)
    this.setName(d.name!)
    this.setDrawingNumber(d.drawing_number!)
    this.setGroupId(d.logical_group_id)
    this.setDescription(d.description)
    this.warehouse.setStock(d.on_hand_balance)
    this.setUpdatedAt(d.updated_at ? new Date(d.updated_at) : undefined)
    this.processingRoute.init(
      d.processing_route && d.processing_route.steps
        ? d.processing_route.steps.map(
            operation_id => new Operation(operation_id),
          )
        : [],
    )
    this.setDrawingName(d.drawing_name ?? '')
    if (d.blank) {
      this.blank.init(d.blank)
    }
    this.setRecommendedBatchSize(d.recommended_batch_size ?? undefined)
    this.stockLocation = d.stock_location
    return this
  }

  reset() {
    this.id = 0
    this.name = ''
    this.description = ''
    this.recentlyAdded = undefined
    this.recentlyUpdated = undefined
    this.group_id = undefined
    this.drawingNumber = ''
    this.updatedAt = undefined
    this.lastManufacturingDate = undefined
    this.lastManufacturingQty = undefined
    this.drawingName = ''
    this.processingRoute.reset()
    this.blank.reset()
  }

  get payload(): UpdateDetailRequest {
    return {
      id: this.id ?? 0,
      description: this.description ?? '',
      name: this.name ?? '',
      drawing_number: this.drawingNumber ?? null,
      logical_group_id: this.group_id ?? null,
      recommended_batch_size: Number(this.recommendedBatchSize) ?? null,
      processing_route: this.processingRoute
        ? {
            steps: this.processingRoute.steps.map(s => s.id!) ?? null,
          }
        : null,
      drawing_name: this.drawingName ?? null,
      blank: this.blank.payload,
      stock_location: this.stockLocation || null,
    }
  }
}
