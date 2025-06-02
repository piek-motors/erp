import { Detail, Material } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import * as api from './detail.api'

type MaterialRelationData = {
  length: string
  weight: string
}

export class MaterialRelation {
  material!: Material
  weight!: string
  length!: string

  constructor(material: Material, data: MaterialRelationData) {
    this.material = material
    this.weight = data.weight
    this.length = data.length
    makeAutoObservable(this)
  }

  setWeight(weight: string) {
    this.weight = weight
  }
  setLength(length: string) {
    this.length = length
  }
}

export class DetailStore {
  id?: number
  name: string = ''
  materials: MaterialRelation[] = []

  recentlyAdded?: Detail
  recentlyUpdated?: Detail

  setRecentlyAdded(detail: Detail) {
    this.recentlyAdded = detail
  }
  setRecentlyUpdated(detail: Detail) {
    this.recentlyUpdated = detail
  }

  error?: Error

  constructor() {
    makeAutoObservable(this)
  }

  private getMaterialRelations(): {
    material_id: number
    data: MaterialRelationData
  }[] {
    return this.materials.map(({ material, weight, length }) => ({
      material_id: material.id,
      data: {
        length: length || '',
        weight: weight || ''
      }
    }))
  }

  clear() {
    this.id = undefined
    this.name = ''
    this.materials = []
    this.recentlyAdded = undefined
    this.recentlyUpdated = undefined
  }
  setId(id: number) {
    this.id = id
  }
  setName(name: string) {
    this.name = name
  }

  addMaterial(material: Material, data: MaterialRelationData) {
    this.materials.push(new MaterialRelation(material, data))
  }

  setMaterialRelations(materials: MaterialRelation[]) {
    this.materials = materials
  }

  async load(detailId: number) {
    const detail = await api.getDetail(detailId)
    if (!detail) {
      throw Error(`Detail with id ${detailId} not found`)
    }

    this.setId(detail.id)
    this.setName(detail.name)

    for (const { material, length, weight } of detail.materials) {
      this.addMaterial(material, {
        length: length.toString(),
        weight: weight.toString()
      })
    }
  }

  async insert() {
    const materialRelations = this.getMaterialRelations()
    const id = await api.insertDetail({
      object: {
        name: this.name,
        detail_materials: {
          data: materialRelations
        }
      }
    })
    const detail = await api.getDetail(id)
    if (detail) {
      this.setRecentlyAdded(detail)
    }
    return detail
  }

  async update() {
    if (!this.id) throw new Error('Detail id is not set')
    await api.updateDetail({
      id: this.id,
      _set: {
        name: this.name
      }
    })

    for (const { material, length, weight } of this.materials) {
      if (!material.id) throw Error('Material id is null')
      await api.updateDetailMaterialRelationData({
        material_id: material.id,
        detail_id: this.id,
        data: {
          length: length.toString(),
          weight: weight.toString()
        }
      })
    }

    const getDetailRes = await api.getDetail(this.id)
    if (getDetailRes) {
      this.setRecentlyUpdated(getDetailRes)
    }

    return this.recentlyUpdated
  }

  async delete() {
    if (!this.id) throw new Error('Detail id is not set')
    await api.deleteDetail(this.id)
    this.clear()
  }
}
