import { Detail, Material } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import * as gql from 'types/graphql-shema'
import { map } from '../mappers'
import * as api from './detail.api'

type MaterialRelationData = {
  length: string
  weight: string
}

export class DetailStore {
  id?: number
  name: string = ''
  materials: Map<number, MaterialRelationData | null> = new Map()

  recentlyAdded?: Detail
  recentlyUpdated?: Detail

  constructor() {
    makeAutoObservable(this)
  }

  private getMaterialRelations(): {
    material_id: number
    data: MaterialRelationData
  }[] {
    return Array.from(this.materials.entries()).map(([materialId, data]) => ({
      material_id: materialId,
      data: {
        length: data?.length || '',
        weight: data?.weight || ''
      }
    }))
  }

  private createDetailFromResponse(response: any): Detail {
    const detail = map.detail.fromDto(response)
    if (!detail)
      throw new Error('createDetailFromResponse: detail is not defined')
    return detail
  }

  clear() {
    this.id = undefined
    this.name = ''
    this.materials = new Map()
    this.recentlyAdded = undefined
    this.recentlyUpdated = undefined
  }

  setName(name: string) {
    this.name = name
  }

  setMaterials(materials: Material[]) {
    this.materials = new Map(materials.map(m => [m.id!, null]))
  }

  setMaterialRelationData(materialId: number, data: MaterialRelationData) {
    this.materials.set(materialId, data)
  }

  async loadDetailById(id: number) {
    const detail = await api.getDetail(id)
    if (!detail) return

    this.id = detail.id
    this.name = detail.name

    const materialsMap = new Map<number, MaterialRelationData>()
    for (const [material, relationData] of detail.materials.entries()) {
      if (material.id) {
        materialsMap.set(material.id, {
          weight: relationData?.weight?.toString() || '',
          length: relationData?.length?.toString() || ''
        })
      }
    }
    this.materials = materialsMap
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
      this.recentlyAdded = this.createDetailFromResponse(detail)
    }
    return detail
  }

  async update() {
    if (!this.id) throw new Error('Detail id is not set')
    const id = await api.updateDetail({
      id: this.id,
      _set: {
        name: this.name
      }
    })
    const detail = await api.getDetail(id)
    if (detail) {
      this.recentlyUpdated = this.createDetailFromResponse(detail)
    }
    return detail
  }

  syncState(detail: Detail) {
    const map = new Map<number, MaterialRelationData>()
    this.id = detail.id
    this.name = detail.name

    for (const [material, relationData] of detail.materials.entries()) {
      if (material.id) {
        map.set(material.id, {
          weight: relationData?.weight?.toString() || '',
          length: relationData?.length?.toString() || ''
        })
      }
    }
    this.materials = map
  }

  async handleUpdateDetail(detail: Detail) {
    await api.updateDetail({
      id: detail.id,
      _set: {
        name: detail.name
      }
    })

    for (const [material, relationData] of detail.materials.entries()) {
      if (!material.id) throw Error('Material id is null')
      await api.updateDetailMaterialRelationData({
        data: relationData,
        detail_id: detail.id,
        material_id: material.id
      })
    }
  }

  async handleInsertDetail(state: Detail) {
    const payload: gql.Metal_Flow_Detail_Materials_Insert_Input[] = []
    for (const [material, relationData] of state.materials.entries()) {
      payload.push({
        material_id: material.id,
        data: relationData
      })
    }
    const id = await api.insertDetail({
      object: {
        name: state.name,
        detail_materials: {
          data: payload
        }
      }
    })
    return id
  }
}
