import { apolloClient } from 'api'
import {
  EnMaterialShape,
  EnUnit,
  GenericShapeData,
  getMaterialConstructor,
  getShapeDataConstructor,
  Material,
  RoundBar,
  RoundBarShapeData
} from 'domain-model'
import { makeAutoObservable } from 'mobx'
import * as gql from 'types/graphql-shema'
import { map } from '../mappers'

export class MaterialStore {
  constructor() {
    makeAutoObservable(this)
  }

  id?: number
  unit: EnUnit = EnUnit.Kg
  shape: EnMaterialShape = EnMaterialShape.RoundBar
  shapeData: GenericShapeData = new RoundBarShapeData()

  loading = false
  error: Error | null = null
  material?: Material

  clear() {
    this.id = undefined
    this.unit = EnUnit.Kg
    this.shape = EnMaterialShape.RoundBar
    this.shapeData = new RoundBar(0)
  }

  insertedMaterialId?: number

  setShape(shape: EnMaterialShape) {
    this.shape = shape
    const Shape = getShapeDataConstructor(shape)
    this.shapeData = new Shape(0)
  }

  setUnit(unit: EnUnit) {
    this.unit = unit
  }

  syncState(material: Material) {
    this.id = material.id || undefined
    this.unit = material.unit
    this.setShape(material.shape)
    this.shapeData = material.shapeData()
  }

  setShapeData(shapeData: GenericShapeData) {
    this.shapeData = shapeData
  }

  async load(id: number) {
    this.loading = true
    this.error = null
    try {
      const res = await apolloClient.query<
        gql.GetMaterialByPkQuery,
        gql.GetMaterialByPkQueryVariables
      >({
        query: gql.GetMaterialByPkDocument,
        variables: { id }
      })
      const d = res.data?.metal_pdo_materials_by_pk
      if (!d) throw new Error('Material not found')

      const material = map.material.fromDto(d)
      this.syncState(material)
      return material
    } catch (e) {
      this.error = e as Error
      throw e
    } finally {
      this.loading = false
    }
  }

  async insert() {
    this.loading = true
    this.error = null
    try {
      const MaterialConstructor = getMaterialConstructor(this.shape)
      const m = new MaterialConstructor(0).load(null, this.shapeData as any)
      const res = await apolloClient.mutate<
        gql.InsertMaterialMutation,
        gql.InsertMaterialMutationVariables
      >({
        mutation: gql.InsertMaterialDocument,
        variables: {
          object: {
            unit: this.unit,
            shape: this.shape,
            label: m.deriveLabel(),
            shape_data: this.shapeData
          }
        }
      })
      const id = res.data?.insert_metal_pdo_materials_one?.id
      if (id) {
        this.insertedMaterialId = id
        this.clear()
      }
      return id
    } catch (e) {
      this.error = e as Error
      throw e
    } finally {
      this.loading = false
    }
  }

  async update() {
    if (!this.id) throw new Error('Material id is not set')

    this.loading = true
    this.error = null
    try {
      const res = await apolloClient.mutate<
        gql.UpdateMaterialMutation,
        gql.UpdateMaterialMutationVariables
      >({
        mutation: gql.UpdateMaterialDocument,
        variables: {
          id: this.id,
          _set: { shape: this.shape, shape_data: this.shapeData }
        }
      })
    } catch (e) {
      this.error = e as Error
      throw e
    } finally {
      this.loading = false
    }
  }
}
