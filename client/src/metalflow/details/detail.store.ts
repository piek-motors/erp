import { AttachmentsStore } from 'components/attachments/store'
import { Attachment } from 'domain-model'
import { rpc } from 'lib/rpc.client'
import { cache } from 'metalflow/metal_flow_cache'
import { makeAutoObservable } from 'mobx'
import { DetailWriteoffStore } from './writeoff/store'

type MaterialRelationData = {
  length: string
  weight: string
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
  weight!: string
  setWeight(weight: string) {
    this.weight = weight
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
    this.weight = init.weight ?? ''
    this.length = init.length ?? ''
    makeAutoObservable(this)
  }
}

export class Detail {
  id?: number
  name: string = ''
  partCode: string = ''

  usedMaterials: MaterialCost[] = []
  setUsedMaterials(materials: MaterialCost[]) {
    this.usedMaterials = materials
  }

  recentlyAdded?: number
  recentlyUpdated?: number

  materialsSuggestions: MaterialCost[] = []
  setMaterialsSuggestions(suggestions: MaterialCost[]) {
    this.materialsSuggestions = suggestions
  }

  attachments = new AttachmentsStore()
  writeoff = new DetailWriteoffStore()
  constructor(init?: {
    id?: number
    name: string
    partCode: string
    usedMaterials?: MaterialCost[]
    groupId: number | null
  }) {
    if (init) {
      this.id = init.id
      this.name = init.name
      this.partCode = init.partCode
      this.usedMaterials = init.usedMaterials || []
      this.groupId = init.groupId ?? null
    }
    makeAutoObservable(this)
  }

  setRecentlyAdded(id: number) {
    this.recentlyAdded = id
  }
  setRecentlyUpdated(id: number) {
    this.recentlyUpdated = id
  }

  reset() {
    this.id = undefined
    this.name = ''
    this.usedMaterials = []
    this.recentlyAdded = undefined
    this.recentlyUpdated = undefined
    this.groupId = undefined
    this.partCode = ''
  }
  setId(id: number) {
    this.id = id
  }
  setName(name: string) {
    this.name = name
  }
  setPartCode(partCode: string) {
    this.partCode = partCode
  }
  groupId?: number | null
  setGroupId(groupId: number | null) {
    this.groupId = groupId
  }

  addMaterial(
    index: number,
    material: { id: number; label: string },
    data: MaterialRelationData
  ) {
    const m = new MaterialCost({
      materialId: material.id,
      label: material.label,
      weight: data.weight,
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
      this.addMaterial(index, material, data)
      return
    }
    m.setMaterialLabel(material.label)
    m.setMaterialId(material.id)
    m.setWeight(data.weight)
    m.setLength(data.length)
  }

  deleteMaterialRelation(materialId: number) {}

  async load(detailId: number) {
    this.reset()
    const d = await rpc.metal.details.get.query({ id: detailId })

    if (!d.detail) {
      throw new Error('fdf')
    }
    this.setId(d.detail.id!)
    this.setName(d.detail.name!)
    this.setPartCode(d.detail.part_code ?? '')
    this.setGroupId(d.detail.logical_group_id ?? null)

    d.detail_materials.forEach((dm, index) => {
      this.addMaterial(
        index,
        { id: dm.material_id, label: dm.label ?? '' },
        {
          length: dm.data.length.toString(),
          weight: dm.data.weight.toString()
        }
      )
    })

    this.attachments.setFiles(
      d.attachments.map(
        a =>
          new Attachment(a.id ?? 0, a.filename ?? '', a.size ?? 0, a.key ?? '')
      )
    )
  }

  async insert() {
    const materialRelations = this.usedMaterials.map(m => ({
      materialId: m.materialId,
      length: m.length,
      weight: m.weight
    }))
    const res = await rpc.metal.details.create.mutate({
      name: this.name.trim(),
      partCode: this.partCode.trim(),
      materialRelations,
      groupId: this.groupId ?? null
    })
    await cache.details.load()
    return res
  }

  async update() {
    if (!this.id) {
      throw new Error('Detail id is not set')
    }
    const res = await rpc.metal.details.update.mutate({
      id: this.id,
      name: this.name,
      partCode: this.partCode,
      groupId: this.groupId ?? null,
      materialRelations: this.usedMaterials
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
    await rpc.metal.details.deleteDetailMaterial.mutate({
      detailId,
      materialId
    })
    const newMaterials = this.usedMaterials.filter(
      m => m.materialId !== materialId
    )
    this.setUsedMaterials(newMaterials)
  }
}

export const detailStore = new Detail()
