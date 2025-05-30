import { DB } from 'db'
import { Detail, EnMaterialShape, Material } from 'domain-model'
import type { Insertable, Kysely } from 'kysely'
import { log } from 'node:console'
import { MaterialFactory } from './adapters/materials/factory'
import { MaterialMapper } from './adapters/materials/mapper'

export class Repo {
  detailInsertErrCount = 0
  detailMaterialRelationInsertErrCount = 0
  materialInsertErrCount = 0

  dbMaterials: Material[] = []

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
        id: m.id,
        unit: m.unit,
        shape: m.shape,
        shape_data: shapeData,
        label: m.deriveLabel()
      })
    }

    for (const insertable of insertables) {
      try {
        await this.db
          .insertInto('metal_flow.materials')
          .values(insertable)
          .execute()
        console.log(`insert material - ${insertable.label} - ok`)
      } catch (e: any) {
        this.materialInsertErrCount++

        const isDuplicate = e.code === '23505'

        console.log(
          `insert material - ${insertable.label} - err ${
            isDuplicate ? 'duplicate' : e.message
          } ${e.code}`
        )
        continue
      }
    }
  }

  async insertDetails(details: Detail[]) {
    const res = await this.db
      .insertInto('metal_flow.details')
      .values(details)
      .onConflict(e => e.doNothing())
      .execute()

    const affectedRows = res.length
    if (affectedRows > 0) {
      this.detailInsertErrCount += details.length - affectedRows
    }
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

  async loadMaterials() {
    const dbMaterials = await this.getAllMaterials()
    this.dbMaterials = dbMaterials
    console.log(`dbMaterials loaded ${dbMaterials.length}`)
    console.log(dbMaterials.map(m => m.label))
  }

  async saveDetailsAndRelations(details: Detail[]): Promise<void> {
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
      .execute()

    const relations = details
      .filter(d => d.name)
      .map(d => {
        try {
          return this.buildDetailMaterialRelation(d)
        } catch (e) {
          this.detailMaterialRelationInsertErrCount++
          throw e
        }
      })

    if (relations.length > 0) {
      await this.db
        .insertInto('metal_flow.detail_materials')
        .values(relations)
        .execute()
    }
  }

  private getMaterialIdByLabel(label: string): number | null {
    if (this.dbMaterials.length === 0) {
      throw new Error('no materials loaded in the memory')
    }

    const material = this.dbMaterials.find(
      m => m.label.toLowerCase().trim() === label.toLowerCase().trim()
    )
    if (!material) return null
    return material.id
  }

  private buildDetailMaterialRelation(detail: Detail) {
    if (detail.materials?.size === 0) {
      throw new Error(`no materials for detail ${detail.id}`)
    }
    const relationData = Array.from(detail.materials.values())[0]
    if (relationData == null) {
      throw new Error(
        `no detail material relation data for detail ${detail.name}`
      )
    }

    const madeOf = detail.materials.entries().next().value
    if (madeOf == null) {
      throw new Error(`no made of for detail ${detail.id}`)
    }

    const materialId = this.getMaterialIdByLabel(madeOf[0].label)
    if (materialId == null) {
      throw new Error(
        `no material id for detail ${detail.id} ${detail.name} -${madeOf[0].label}-`
      )
    }

    return {
      detail_id: detail.id,
      material_id: materialId,
      data: {
        width: relationData?.weight,
        length: relationData?.length
      }
    }
  }
}
