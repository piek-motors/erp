import { AttachmentsStore } from 'components/attachments/store'
import { Attachment, Material } from 'domain-model'
import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import * as materialApi from '../../material/store/material.api'
import * as api from './detail.api'

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
    weight: string
    length: string
  }) {
    this.materialId = init.materialId
    this.materialLabel = init.label
    this.weight = init.weight
    this.length = init.length
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
  materialsSuggestions: Material[] = []

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

  error?: Error

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
    const materialRelations = this.usedMaterials.map(
      ({ materialId, weight, length }) => ({
        material_id: materialId,
        data: {
          length: length || '',
          weight: weight || ''
        }
      })
    )

    const id = await api.insertDetail({
      object: {
        name: this.name,
        part_code: this.partCode,
        detail_materials: {
          data: materialRelations
        }
      }
    })
    const detail = await api.getDetail(id)
    if (detail) {
      this.setRecentlyAdded(id)
    }
    return detail
  }

  async update() {
    if (!this.id) throw new Error('Detail id is not set')
    await api.updateDetail({
      id: this.id,
      _set: {
        name: this.name,
        part_code: this.partCode
      }
    })

    for (const { materialId, length, weight } of this.usedMaterials) {
      if (!materialId) throw Error('Material id is null')

      await api.updateDetailMaterialRelationData({
        material_id: materialId,
        detail_id: this.id,
        data: {
          length: length.toString(),
          weight: weight.toString()
        }
      })
    }

    const getDetailRes = await api.getDetail(this.id)
    if (getDetailRes) {
      this.setRecentlyUpdated(getDetailRes.id)
    }

    return this.recentlyUpdated
  }

  async delete() {
    if (!this.id) throw new Error('Detail id is not set')
    await api.deleteDetail(this.id)
    this.clear()
  }

  async loadMaterials() {
    // TODO: optimize this
    const materials = await materialApi.getMaterials()
    this.setMaterilsSuggestions(materials)
  }

  setMaterilsSuggestions(suggestions: Material[]) {
    this.materialsSuggestions = suggestions
  }
}
