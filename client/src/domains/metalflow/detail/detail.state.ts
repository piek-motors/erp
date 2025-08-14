import { AttachmentsStore } from 'components/attachments/store'
import { makeAutoObservable } from 'mobx'
import { RouterInput, RouterOutput } from 'srv/lib/trpc'
import { DetailAutomaticWriteoffStore } from './warehouse/auto_writeoff.store'
import { DetailWarehouseStore } from './warehouse/store'

type DetailResponse = RouterOutput['metal']['details']['get']['detail']
type UpdateDetailRequest = RouterInput['metal']['details']['update']

interface ProcessingRoute {
  steps: {
    name: string
    dur: number
  }[]
}

type TechicalParameters = {
  arr: { key: string; value: any }[]
}

export class DetailState {
  readonly attachments = new AttachmentsStore()
  readonly warehouse = new DetailWarehouseStore()
  readonly autoWriteoff = new DetailAutomaticWriteoffStore()

  id?: number
  setId(id: number) {
    this.id = id
  }
  name: string = ''
  setName(name: string) {
    this.name = name
  }
  description?: string
  setDescription(description: string) {
    this.description = description
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
  processingRoute?: ProcessingRoute | null = null
  setProcessingRoute(route: ProcessingRoute | null) {
    this.processingRoute = route
  }
  technicalParameters?: TechicalParameters | null = null
  setTechnicalParameters(params: TechicalParameters | null) {
    this.technicalParameters = params
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

  constructor() {
    makeAutoObservable(this)
  }

  init(d: DetailResponse) {
    this.setId(d.id!)
    this.setName(d.name!)
    this.setDrawingNumber(d.part_code!)
    this.setGroupId(d.logical_group_id ?? null)
    this.setTechnicalParameters(d.params ?? null)
    this.setDescription(d.description ?? '')
    this.warehouse.setStock(d.stock)
    this.setUpdatedAt(d.updated_at ? new Date(d.updated_at) : undefined)
    this.setProcessingRoute(d.processing_route ?? null)
    this.setDrawingName(d.drawing_name ?? '')
    if (d.automatic_writeoff) {
      this.autoWriteoff.init(d.automatic_writeoff)
    }
  }

  reset() {
    this.id = undefined
    this.name = ''
    this.description = ''
    this.recentlyAdded = undefined
    this.recentlyUpdated = undefined
    this.groupId = undefined
    this.drawingNumber = ''
    this.technicalParameters = null
    this.updatedAt = undefined
    this.lastManufacturingDate = undefined
    this.lastManufacturingQty = undefined
    this.processingRoute = null
    this.drawingName = ''
    this.autoWriteoff.reset()
  }

  createPayload(): UpdateDetailRequest {
    const technicalParams =
      this.technicalParameters?.arr?.map(({ key, value }) => ({
        key: key?.trim(),
        value: value?.trim()
      })) || []

    return {
      id: this.id ?? 0,
      description: this.description ?? '',
      name: this.name ?? '',
      partCode: this.drawingNumber ?? null,
      groupId: this.groupId ?? null,
      technicalParams: {
        arr: technicalParams ?? []
      },
      processingRoute: this.processingRoute
        ? {
            steps:
              this.processingRoute?.steps?.map(s => ({
                name: s.name?.trim(),
                dur: +s.dur
              })) ?? null
          }
        : null,
      drawingName: this.drawingName ?? null,
      automaticWriteoff: this.autoWriteoff.payload
    }
  }
}
