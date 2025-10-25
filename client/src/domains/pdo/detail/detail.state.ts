import { AttachmentsStore } from 'components/attachments/store'
import { makeAutoObservable } from 'mobx'
import { RouterInput, RouterOutput } from 'srv/lib/trpc'
import { DetailAutomaticWriteoffStore } from './warehouse/auto_writeoff.store'
import { DetailWarehouseStore } from './warehouse/store'

type DetailResponse = RouterOutput['pdo']['details']['get']['detail']
type UpdateDetailRequest = RouterInput['pdo']['details']['update']

export class Operation {
  name!: string
  dur?: number | null
  constructor() {
    makeAutoObservable(this)
  }
  reset() {
    this.name = ''
    this.dur = 0
  }
}

export class ProcessingRoute {
  steps: Operation[] = []
  init(steps: Operation[]) {
    this.steps = steps
  }
  constructor() {
    makeAutoObservable(this)
  }
  reset() {
    this.steps = []
  }
}

export type BlankSpec = {
  arr: { key: string; value: any }[]
}

export class DetailState {
  readonly attachments = new AttachmentsStore()
  readonly warehouse = new DetailWarehouseStore()
  readonly autoWriteoff = new DetailAutomaticWriteoffStore()
  readonly processingRoute = new ProcessingRoute()

  id?: number
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
  groupId?: number | null
  setGroupId(groupId: number | null) {
    this.groupId = groupId
  }
  drawingName?: string
  setDrawingName(name: string) {
    this.drawingName = name
  }
  drawingNumber?: string
  setDrawingNumber(drawingNumber: string) {
    this.drawingNumber = drawingNumber
  }

  blankSpec?: BlankSpec | null = null
  setBlankSpec(params?: BlankSpec | null) {
    this.blankSpec = params
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
  recommendedBatchSize?: number | null
  setRecommendedBatchSize(size: number | null) {
    this.recommendedBatchSize = size
  }

  constructor() {
    makeAutoObservable(this)
  }

  init(d: DetailResponse) {
    this.setId(d.id!)
    this.setName(d.name!)
    this.setDrawingNumber(d.part_code!)
    this.setGroupId(d.logical_group_id)
    this.setBlankSpec(d.blank_spec)
    this.setDescription(d.description)
    this.warehouse.setStock(d.stock)
    this.setUpdatedAt(d.updated_at ? new Date(d.updated_at) : undefined)
    this.processingRoute.init(
      d.processing_route && d.processing_route.steps
        ? d.processing_route.steps.map(s => {
            const step = new Operation()
            step.name = s.name
            step.dur = s.dur
            return step
          })
        : []
    )
    this.setDrawingName(d.drawing_name ?? '')
    if (d.automatic_writeoff) {
      this.autoWriteoff.init(d.automatic_writeoff)
    }
    this.setRecommendedBatchSize(d.recommended_batch_size ?? null)
  }

  reset() {
    this.id = undefined
    this.name = ''
    this.description = ''
    this.recentlyAdded = undefined
    this.recentlyUpdated = undefined
    this.groupId = undefined
    this.drawingNumber = ''
    this.blankSpec = null
    this.updatedAt = undefined
    this.lastManufacturingDate = undefined
    this.lastManufacturingQty = undefined
    this.drawingName = ''
    this.processingRoute.reset()
    this.autoWriteoff.reset()
  }

  createPayload(): UpdateDetailRequest {
    const technicalParams =
      this.blankSpec?.arr?.map(({ key, value }) => ({
        key: key?.trim(),
        value: value?.trim()
      })) || []

    return {
      id: this.id ?? 0,
      description: this.description ?? '',
      name: this.name ?? '',
      partCode: this.drawingNumber ?? null,
      groupId: this.groupId ?? null,
      blankSpec: {
        arr: technicalParams ?? []
      },
      recommendedBatchSize: Number(this.recommendedBatchSize) ?? null,
      processingRoute: this.processingRoute
        ? {
            steps:
              this.processingRoute.steps?.map(s => ({
                name: s.name?.trim(),
                dur: s.dur ? +s.dur : null
              })) ?? null
          }
        : null,
      drawingName: this.drawingName ?? null,
      automaticWriteoff: this.autoWriteoff.payload
    }
  }
}
