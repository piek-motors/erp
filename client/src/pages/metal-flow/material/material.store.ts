import { makeAutoObservable } from 'mobx'
import {
  EnMaterialShape,
  EnUnit,
  GenericShapeData,
  getShapeDataConstructor,
  Material,
  ResourceNameProps,
  RoundBar,
  RoundBarShapeData
} from 'domain-model'
import { apolloClient } from 'api'
import {
  InsertMaterialDocument,
  InsertMaterialMutation,
  InsertMaterialMutationVariables
} from 'types/graphql-shema'

export class MaterialStore {
  constructor() {
    makeAutoObservable(this)
  }

  id?: number
  unit: EnUnit = EnUnit.Kg
  shape: EnMaterialShape = EnMaterialShape.RoundBar
  shapeData: GenericShapeData = new RoundBarShapeData()

  getIdentifier(): string {
    throw new Error('Method not implemented.')
  }
  getResourceNameProps(): ResourceNameProps {
    throw new Error('Method not implemented.')
  }
  clear() {
    this.id = undefined
    this.unit = EnUnit.Kg
    this.shape = EnMaterialShape.RoundBar
    this.shapeData = new RoundBar(0)
  }

  insertedMaterialId?: number
  async insert() {
    const res = await apolloClient.mutate<
      InsertMaterialMutation,
      InsertMaterialMutationVariables
    >({
      mutation: InsertMaterialDocument,
      variables: {
        object: {
          unit: this.unit,
          shape: this.shape,
          shape_data: this.shapeData
        }
      }
    })
    this.clear()
    const id = res.data?.insert_metal_pdo_materials_one?.id
    if (id) {
      this.insertedMaterialId = id
    }
    return id
  }

  setShape(shape: EnMaterialShape) {
    this.shape = shape
    const Shape = getShapeDataConstructor(shape)
    this.shapeData = new Shape()
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
}
