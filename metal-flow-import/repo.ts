import { DB } from 'db'
import { Detail, EnMaterialShape, Material } from 'domain-model'
import type { Insertable, Kysely } from 'kysely'
import { log } from 'node:console'
import { MaterialFactory } from './adapters/materials/factory'
import { MaterialMapper } from './adapters/materials/mapper'

export class Repo {
  private materialMapper = new MaterialMapper()
  db: Kysely<DB.Schema>
  constructor(db: Kysely<DB.Schema>) {
    this.db = db
  }

  async insertMaterials(materials: Material[]) {
    const insertables: Insertable<DB.MaterialTable>[] = []

    for (const [_, m] of materials.entries()) {
      const shapeData = this.materialMapper.toPersistence(m).shape_data
      insertables.push({
        unit: m.unit,
        shape: m.shape,
        shape_data: shapeData,
        label: m.label
      })
    }

    await this.db
      .insertInto('metal_flow.materials')
      .values(insertables)
      .onConflict(e => e.doNothing())
      .execute()
  }

  async insertDetails(details: Detail[]) {
    await this.db
      .insertInto('metal_flow.details')
      .values(details)
      .onConflict(e => e.doNothing())
      .execute()
  }

  async getAllMaterials(): Promise<Material[]> {
    const dbMaterials = await this.db
      .selectFrom('metal_flow.materials')
      .selectAll()
      .execute()

    return dbMaterials.map(m => {
      const factory = MaterialFactory.create(m.shape as EnMaterialShape)
      return factory.createFromDB({
        id: m.id,
        unit: m.unit,
        shape: m.shape as EnMaterialShape,
        shape_data: m.shape_data,
        label: m.label
      })
    })
  }

  async drop() {
    await this.db.deleteFrom('metal_flow.detail_materials').execute()
    await this.db.deleteFrom('metal_flow.details').execute()
    await this.db.deleteFrom('metal_flow.materials').execute()
    log('details dropped')
  }

  async saveDetailsAndRelations(
    material: Material,
    details: Detail[]
  ): Promise<void> {
    const filteredDetails = details.filter(detail => detail.name)
    if (!filteredDetails.length) return
    await this.db
      .insertInto('metal_flow.details')
      .values(
        filteredDetails.map(detail => ({
          id: detail.id,
          name: detail.name
        }))
      )
      .onConflict(e => e.doNothing())
      .execute()

    const relations = details
      .map(detail => {
        if (!material.shape) {
          throw new Error(`material id not set`)
        }

        if (detail.materials?.size === 0) {
          throw new Error(
            `material mapper: no materials for detail ${detail.id}`
          )
        }

        const relationData = Array.from(detail.materials.values())[0]

        if (relationData == null) {
          // throw new Error(
          //   `no detail material relation data for detail ${detail.name}`
          // )
          // TODO: fix me
          return
        }
        return {
          detail_id: detail.id,
          material_id: material.shape,
          data: {
            width: relationData?.weight,
            length: relationData?.length
          }
        }
      })
      .filter(each => each != null)

    if (relations.length > 0) {
      await this.db
        .insertInto('metal_flow.detail_materials')
        .values(relations)
        .execute()
    }
  }
}
