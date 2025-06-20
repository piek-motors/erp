import { AttachmentsStore } from 'components/attachments/store'
import { Attachment } from 'domain-model'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'

type MaterialRelationData = {
  length: string
  weight: string
}

export class MaterialCost {
  materialId!: number
  materialLabel!: string

  weight!: string
  length!: string

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
  setMaterialId(materialId: number) {
    this.materialId = materialId
  }
  setWeight(weight: string) {
    this.weight = weight
  }
  setLength(length: string) {
    this.length = length
  }
}

export class Detail {
  id?: number
  name: string = ''
  partCode: string = ''
  usedMaterials: MaterialCost[] = []

  recentlyAdded?: number
  recentlyUpdated?: number
  materialsSuggestions: MaterialCost[] = []

  attachments = new AttachmentsStore()
  constructor(init?: {
    id?: number
    name: string
    partCode: string
    usedMaterials?: MaterialCost[]
  }) {
    if (init) {
      this.id = init.id
      this.name = init.name
      this.partCode = init.partCode
      this.usedMaterials = init.usedMaterials || []
    }
    makeAutoObservable(this)
  }

  setRecentlyAdded(id: number) {
    this.recentlyAdded = id
  }
  setRecentlyUpdated(id: number) {
    this.recentlyUpdated = id
  }

  clear() {
    this.id = undefined
    this.name = ''
    this.usedMaterials = []
    this.recentlyAdded = undefined
    this.recentlyUpdated = undefined
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

  addMaterial(
    materialId: number,
    label: string | null,
    data: MaterialRelationData
  ) {
    const m = new MaterialCost({
      materialId,
      label: label || '',
      weight: data.weight,
      length: data.length
    })
    this.usedMaterials.push(m)
  }

  setMaterialRelations(materials: MaterialCost[]) {
    this.usedMaterials = materials
  }

  async load(detailId: number) {
    this.clear()
    const d = await rpc.details.get.query({ id: detailId })
    this.setId(d.detail.id)
    this.setName(d.detail.name)
    this.setPartCode(d.detail.part_code ?? '')

    for (const dm of d.detail_materials) {
      if (!dm.material_id) {
        throw new Error('Material id is null')
      }
      this.addMaterial(dm.material_id, dm.label, {
        length: dm.data.length.toString(),
        weight: dm.data.weight.toString()
      })
    }
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

    return await rpc.details.create.mutate({
      name: this.name,
      partCode: this.partCode,
      materialRelations
    })
  }

  async update() {
    if (!this.id) {
      throw new Error('Detail id is not set')
    }
    return await rpc.details.update.mutate({
      id: this.id,
      name: this.name,
      partCode: this.partCode,
      materialRelations: this.usedMaterials
    })
  }

  async delete() {
    if (!this.id) {
      throw new Error('Detail id is not set')
    }
    await rpc.details.delete.mutate({ id: this.id })
    this.clear()
  }

  async loadMaterials() {
    const materials = await rpc.material.list.query()
    this.setMaterialsSuggestions(
      materials.map(m => {
        return new MaterialCost({
          materialId: m.id,
          label: m.label
        })
      })
    )
  }

  setMaterialsSuggestions(suggestions: MaterialCost[]) {
    this.materialsSuggestions = suggestions
  }
}
