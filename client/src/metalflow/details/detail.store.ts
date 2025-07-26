import { AttachmentsStore } from 'components/attachments/store'
import { Attachment } from 'domain-model'
import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { cache } from 'metalflow/cache/root'
import { makeAutoObservable } from 'mobx'
import { RouterOutput } from 'srv/lib/trpc'
import { DetailWriteoffStore } from './writeoff/store'

type MaterialRelationData = {
  length: string
}

type DetailResponse = RouterOutput['metal']['details']['get']['detail']
export class MaterialCost {
  materialId!: number
  setMaterialId(materialId: number) {
    this.materialId = materialId
  }
  materialLabel!: string
  setMaterialLabel(materialLabel: string) {
    this.materialLabel = materialLabel
  }
  length!: string
  setLength(length: string) {
    this.length = length
  }
  constructor(init: {
    materialId: number
    label: string
    weight?: string
    length?: string
  }) {
    this.materialId = init.materialId
    this.materialLabel = init.label
    this.length = init.length ?? ''
    makeAutoObservable(this)
  }
}

export class Detail {
  readonly async = new AsyncStoreController()

  id?: number
  setId(id: number) {
    this.id = id
  }
  name: string = ''
  setName(name: string) {
    this.name = name
  }
  stock!: number
  setStock(stock: number) {
    this.stock = stock
  }
  description: string = ''
  setDescription(description: string) {
    this.description = description
  }
  groupId?: number | null
  setGroupId(groupId: number | null) {
    this.groupId = groupId
  }
  partCode: string = ''
  setPartCode(partCode: string) {
    this.partCode = partCode
  }
  technicalParameters: Record<string, any> | null = null
  setTechnicalParameters(params: Record<string, any> | null) {
    this.technicalParameters = params
  }
  updatedAt?: Date
  setUpdatedAt(date: Date | undefined) {
    this.updatedAt = date
  }
  usedMaterials: MaterialCost[] = []
  setUsedMaterials(materials: MaterialCost[]) {
    this.usedMaterials = materials
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
  writeoff = new DetailWriteoffStore()

  constructor(init?: {
    id?: number
    name: string
    description?: string
    partCode: string
    usedMaterials?: MaterialCost[]
    stock: number
    groupId: number | null
    params?: Record<string, any> | null
    updatedAt?: Date
  }) {
    if (init) {
      this.id = init.id
      this.name = init.name
      this.description = init.description ?? ''
      this.partCode = init.partCode
      this.usedMaterials = init.usedMaterials || []
      this.groupId = init.groupId ?? null
      this.stock = init.stock
      this.technicalParameters = init.params ?? null
      this.updatedAt = init.updatedAt
    }
    makeAutoObservable(this)
  }

  reset() {
    this.id = undefined
    this.name = ''
    this.description = ''
    this.usedMaterials = []
    this.recentlyAdded = undefined
    this.recentlyUpdated = undefined
    this.groupId = undefined
    this.partCode = ''
    this.technicalParameters = null
    this.updatedAt = undefined
  }

  addMaterial(
    material: { id: number; label: string },
    data: MaterialRelationData
  ) {
    const m = new MaterialCost({
      materialId: material.id,
      label: material.label,
      length: data.length
    })
    this.usedMaterials.push(m)
  }

  updateMaterialRelation(
    index: number,
    material: { id: number; label: string },
    data: MaterialRelationData
  ) {
    const m = this.usedMaterials[index]
    if (!m) {
      this.addMaterial(material, data)
      return
    }
    m.setMaterialLabel(material.label)
    m.setMaterialId(material.id)
    m.setLength(data.length)
  }

  async loadFullInfo(detailId: number) {
    this.reset()
    this.async.start()
    const d = await rpc.metal.details.get.query({ id: detailId })
    this.setDetailData(d.detail)

    d.detail_materials.forEach((dm, index) => {
      this.addMaterial(
        { id: dm.material_id, label: dm.label ?? '' },
        {
          length: dm.data.length.toString()
        }
      )
    })

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

  private setDetailData(d: DetailResponse) {
    this.setId(d.id!)
    this.setName(d.name!)
    this.setPartCode(d.part_code!)
    this.setGroupId(d.logical_group_id ?? null)
    this.setTechnicalParameters(d.params ?? null)
    this.setDescription(d.description ?? '')
    this.setStock(d.stock)
    this.setUpdatedAt(d.updated_at ? new Date(d.updated_at) : undefined)
  }

  async insert() {
    const materialRelations = this.usedMaterials.map(m => ({
      materialId: m.materialId,
      length: m.length
    }))
    const res = await rpc.metal.details.create.mutate({
      name: this.name.trim(),
      description: this.description,
      partCode: this.partCode.trim(),
      materialRelations,
      groupId: this.groupId ?? null,
      params: this.technicalParameters
    })
    await cache.details.load()
    return res
  }

  async update() {
    if (!this.id) {
      throw new Error('Detail id is not set')
    }
    const materialRelations = this.usedMaterials.map(m => ({
      materialId: m.materialId,
      length: m.length
    }))
    const res = await rpc.metal.details.update.mutate({
      id: this.id,
      description: this.description,
      name: this.name,
      partCode: this.partCode,
      groupId: this.groupId ?? null,
      materialRelations,
      params: this.technicalParameters
    })
    await cache.details.load()
    return res
  }

  async delete() {
    if (!this.id) {
      throw new Error('Detail id is not set')
    }
    await rpc.metal.details.delete.mutate({ id: this.id })
    cache.details.removeDetail(this.id)
    this.reset()
  }

  async deleteDetailMaterial(materialId: number) {
    if (!this.id) {
      throw new Error('Detail id is not set')
    }
    await rpc.metal.details.deleteMaterialRelation.mutate({
      detailId: this.id,
      materialId
    })
    const newMaterials = this.usedMaterials.filter(
      m => m.materialId !== materialId
    )
    this.setUsedMaterials(newMaterials)
  }

  async createManufacturingOrder() {
    const r = await rpc.metal.manufacturing.create.mutate({
      detailId: this.id!
    })
    return r
  }
}

export const detailStore = new Detail()
