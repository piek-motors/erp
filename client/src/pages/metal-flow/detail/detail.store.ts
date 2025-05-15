import { apolloClient } from 'api'
import { Detail, Material } from 'domain-model'
import { makeAutoObservable } from 'mobx'
import * as gql from 'types/graphql-shema'

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
    return {
      id: response.id,
      name: response.name,
      materials: new Map()
    }
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

  addMaterial(material: Material) {
    if (material.id) {
      this.materials = new Map([...this.materials, [material.id, null]])
    }
  }

  updateMaterialRelationData(materialId: number, data: MaterialRelationData) {
    const newMaterials = new Map(this.materials)
    newMaterials.set(materialId, {
      length: data.length || '',
      weight: data.weight || ''
    })
    this.materials = newMaterials
  }

  async insert() {
    const materialRelations = this.getMaterialRelations()
    const res = await apolloClient.mutate<
      gql.InsertDetailMutation,
      gql.InsertDetailMutationVariables
    >({
      mutation: gql.InsertDetailDocument,
      variables: {
        object: {
          name: this.name,
          detail_materials: {
            data: materialRelations
          }
        }
      }
    })
    const detail = res.data?.insert_metal_pdo_details_one
    if (detail) {
      this.recentlyAdded = this.createDetailFromResponse(detail)
    }
    return detail
  }

  async update() {
    if (!this.id) throw new Error('Detail id is not set')
    const res = await apolloClient.mutate<
      gql.UpdateDetailMutation,
      gql.UpdateDetailMutationVariables
    >({
      mutation: gql.UpdateDetailDocument,
      variables: {
        id: this.id,
        _set: {
          name: this.name
        }
      }
    })
    const detail = res.data?.update_metal_pdo_details_by_pk
    if (detail) {
      this.recentlyUpdated = this.createDetailFromResponse(detail)
    }
    return detail
  }

  syncState(detail: Detail) {
    this.id = detail.id
    this.name = detail.name
    const map = new Map<number, MaterialRelationData>()
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
}
