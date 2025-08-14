import { AttachmentsStore } from 'components/attachments/store'
import { cache } from 'domains/metalflow/cache/root'
import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { Attachment } from 'models'
import { RouterInput, RouterOutput } from 'srv/lib/trpc'
import { DetailCost, MaterialCost } from './cost.store'
import { DetailWarehouseStore } from './warehouse/store'

type MaterialRelationData = {
  length: string
}

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

export class Detail {
  readonly async = new AsyncStoreController()
  readonly warehouse = new DetailWarehouseStore()

  id?: number
  setId(id: number) {
    this.id = id
  }
  name: string = ''
  setName(name: string) {
    this.name = name
  }
  description: string = ''
  setDescription(description: string) {
    this.description = description
  }
  groupId?: number | null
  setGroupId(groupId: number | null) {
    this.groupId = groupId
  }
  drawingName: string = ''
  setDrawingName(name: string) {
    this.drawingName = name
  }
  drawingNumber: string = ''
  setDrawingNumber(drawingNumber: string) {
    this.drawingNumber = drawingNumber
  }
  processingRoute: ProcessingRoute | null = null
  setProcessingRoute(route: ProcessingRoute | null) {
    this.processingRoute = route
  }
  technicalParameters: TechicalParameters | null = null
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
  detailsCost: DetailCost[] = []
  setDetailCost(details?: DetailCost[]) {
    this.detailsCost = details || []
  }
  materialsCost: MaterialCost[] = []
  setMaterialCost(materials: MaterialCost[]) {
    this.materialsCost = materials
  }
  recentlyAdded?: number
  setRecentlyAdded(id: number) {
    this.recentlyAdded = id
  }
  recentlyUpdated?: number
  setRecentlyUpdated(id: number) {
    this.recentlyUpdated = id
  }
  attachments = new AttachmentsStore()

  constructor(init?: {
    id?: number
    name?: string
    description?: string | null
    partCode?: string | null
    usedMaterials?: MaterialCost[]
    usedDetails?: DetailCost[]
    stock?: number
    groupId?: number | null
    technicalParameters?: TechicalParameters | null
    updatedAt?: Date
    lastManufacturingDate?: Date
    lastManufacturingQty?: number
    processingRoute?: ProcessingRoute | null
    drawingName?: string | null
  }) {
    if (init) {
      this.id = init.id
      this.name = init.name ?? ''
      this.description = init.description ?? ''
      this.drawingNumber = init.partCode ?? ''
      this.materialsCost = init.usedMaterials || []
      this.detailsCost = init.usedDetails || []
      this.groupId = init.groupId ?? null
      this.technicalParameters = init.technicalParameters ?? null
      this.updatedAt = init.updatedAt
      this.lastManufacturingDate = init.lastManufacturingDate
      this.lastManufacturingQty = init.lastManufacturingQty
      this.processingRoute = init.processingRoute ?? null
      this.drawingName = init.drawingName ?? ''
    }
    makeAutoObservable(this)
  }

  private setDetailData(d: DetailResponse) {
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
    this.setDetailCost(
      d.automatic_writeoff?.details.map(d => new DetailCost(d))
    )
  }

  reset() {
    this.id = undefined
    this.name = ''
    this.description = ''
    this.materialsCost = []
    this.detailsCost = []
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
  }

  newMaterialCost() {
    this.materialsCost.push(new MaterialCost())
  }

  newDetailCost() {
    this.detailsCost.push(new DetailCost())
  }

  updateMaterialRelation(
    index: number,
    material: { id: number },
    data: MaterialRelationData
  ) {
    const m = this.materialsCost[index]
    if (!m) {
      this.newMaterialCost()
      return
    }
    m.setMaterialId(material.id)
    m.setLength(data.length)
  }

  async loadFullInfo(detailId: number) {
    this.reset()
    this.async.start()
    const d = await rpc.metal.details.get.query({ id: detailId })
    this.setDetailData(d.detail)
    this.setLastManufacturingDate(
      d.last_manufacturing?.date
        ? new Date(d.last_manufacturing.date)
        : undefined
    )
    this.setLastManufacturingQty(d.last_manufacturing?.qty)

    this.attachments.setFiles(
      d.attachments.map(
        a =>
          new Attachment(a.id ?? 0, a.filename ?? '', a.size ?? 0, a.key ?? '')
      )
    )
    this.async.end()
  }

  async loadShortInfo(detailId: number) {
    this.setDetailData(await rpc.metal.details.getShort.query({ id: detailId }))
  }

  async insert() {
    const payload = this.createPayload()
    const res = await rpc.metal.details.create.mutate(payload)
    await cache.details.load()
    return res
  }

  async update() {
    const payload = this.createPayload()
    const res = await rpc.metal.details.update.mutate(payload)
    await cache.details.load()
    return res
  }

  private createPayload(): UpdateDetailRequest {
    const technicalParams =
      this.technicalParameters?.arr?.map(({ key, value }) => ({
        key: key.trim(),
        value: value.trim()
      })) || []

    return {
      id: this.id ?? 0,
      description: this.description,
      name: this.name,
      partCode: this.drawingNumber,
      groupId: this.groupId ?? null,
      technicalParams: {
        arr: technicalParams ?? []
      },
      processingRoute: this.serializeProcessingRoute(this.processingRoute),
      drawingName: this.drawingName,
      automaticWriteoff: {
        details: this.detailsCost.map(d => ({
          detail_id: d.detailId,
          qty: +d.qty
        })),
        materials: this.materialsCost.map(m => ({
          material_id: m.materialId,
          length: +m.length
        }))
      }
    }
  }

  private serializeProcessingRoute(route: ProcessingRoute | null) {
    if (!route?.steps || route.steps.length === 0) {
      return null
    }
    return route
      ? {
          steps: route.steps.map(s => ({
            name: s.name?.trim(),
            dur: +s.dur
          }))
        }
      : null
  }

  async delete() {
    if (!this.id) {
      throw new Error('Detail id is not set')
    }
    await rpc.metal.details.delete.mutate({ id: this.id })
    cache.details.removeDetail(this.id)
    this.reset()
  }

  async deleteMaterialCost(materialId: number) {
    if (!this.id) {
      throw new Error('Detail id is not set')
    }
    await rpc.metal.details.deleteMaterialRelation.mutate({
      detailId: this.id,
      materialId
    })
    const newMaterials = this.materialsCost.filter(
      m => m.materialId !== materialId
    )
    this.setMaterialCost(newMaterials)
  }

  async deleteDetailCost(detailId: number) {
    if (!this.id) {
      throw new Error('Detail id is not set')
    }
    // TODO: Implement server-side deletion
    // await rpc.metal.details.deleteDetailRelation.mutate({
    //   detailId: this.id,
    //   usedDetailId: detailId
    // })
    const newDetails = this.detailsCost.filter(d => d.detailId !== detailId)
    this.setDetailCost(newDetails)
  }

  async createManufacturingOrder() {
    return rpc.metal.manufacturing.create.mutate({
      detailId: this.id!
    })
  }
}

export const detailStore = new Detail()
