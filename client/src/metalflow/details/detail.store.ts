import { AttachmentsStore } from 'components/attachments/store'
import { Attachment } from 'domain-model'
import { AsyncStoreController } from 'lib/async-store.controller'
import { rpc } from 'lib/rpc.client'
import { notifierStore } from 'lib/store/notifier.store'
import { roundAndTrim } from 'lib/utils/formatting'
import { cache } from 'metalflow/cache/root'
import { makeAutoObservable } from 'mobx'
import { DetailWriteoffStore } from './writeoff/store'

type MaterialRelationData = {
  length: string
}

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
    groupId: number | null
    params?: Record<string, any> | null
  }) {
    if (init) {
      this.id = init.id
      this.name = init.name
      this.description = init.description ?? ''
      this.partCode = init.partCode
      this.usedMaterials = init.usedMaterials || []
      this.groupId = init.groupId ?? null
      this.technicalParameters = init.params ?? null
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

  deleteMaterialRelation(materialId: number) {}

  async load(detailId: number) {
    this.reset()
    this.async.start()
    const d = await rpc.metal.details.get.query({ id: detailId })
    if (!d.detail) {
      throw new Error('fdf')
    }
    this.setId(d.detail.id!)
    this.setName(d.detail.name!)
    this.setPartCode(d.detail.part_code ?? '')
    this.setGroupId(d.detail.logical_group_id ?? null)
    this.setTechnicalParameters(d.detail.params ?? null)
    this.setDescription(d.detail.description ?? '')

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

  async deleteDetailMaterial(detailId: number, materialId: number) {
    await rpc.metal.details.deleteMaterialRelation.mutate({
      detailId,
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

  async startMaterialPreparationPhase() {
    const r =
      await rpc.metal.manufacturing.startMaterialPreparationPhase.mutate({
        orderId: this.id!
      })

    return r
  }

  async startProductionPhase(qty: number) {
    const r = await rpc.metal.manufacturing.startProductionPhase.mutate({
      orderId: this.id!,
      qty
    })

    for (const m of r) {
      const msg = `
      Израсходовано ${roundAndTrim(m.totalCost)} материала ${
        m.material_name
      }, осталось ${roundAndTrim(m.stock)}
      `
      notifierStore.notify('info', msg)
    }
    return r
  }
}

export const detailStore = new Detail()
