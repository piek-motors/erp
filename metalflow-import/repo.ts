import type { Insertable } from 'kysely'
import { log } from 'node:console'
import { Detail, EnMaterialShape, Material } from 'domain-model'
import { MaterialFactory } from '../adapters/materials/factory.ts'
import { MaterialMapper } from '../adapters/materials/mapper.ts'
import { db } from '../db/conn.ts'
import type { DB } from '../db/schema.ts'

export class Repo {
  private materialMapper = new MaterialMapper()

  async insertMaterials(materials: Material[]) {
    const lastId = await db
      .selectFrom('metal_pdo.materials')
      .select('id')
      .orderBy('id', 'desc')
      .limit(1)
      .executeTakeFirstOrThrow()

    const insertables: Insertable<DB.MaterialTable>[] = []

    for (const [idx, m] of materials.entries()) {
      const shapeData = this.materialMapper.toPersistence(m).shape_data
      insertables.push({
        id: m.id ?? lastId.id + idx + 1,
        unit: m.unit,
        shape: m.shape,
        shape_data: shapeData
      })
    }

    await db.insertInto('metal_pdo.materials').values(insertables).execute()
  }

  async getAllMaterials(): Promise<Material[]> {
    const dbMaterials = await db
      .selectFrom('metal_pdo.materials')
      .selectAll()
      .execute()

    return dbMaterials.map(m => {
      const factory = MaterialFactory.create(m.shape as EnMaterialShape)
      return factory.createFromDB({
        id: m.id,
        unit: m.unit,
        shape: m.shape as EnMaterialShape,
        shape_data: m.shape_data
      })
    })
  }

  async dropDetailsTable() {
    await db.deleteFrom('metal_pdo.detail_materials').execute()
    await db.deleteFrom('metal_pdo.details').execute()
    log('details dropped')
  }

  async saveDetailsAndRelations(
    material: Material,
    details: Detail[]
  ): Promise<void> {
    const filteredDetails = details.filter(detail => detail.name)
    if (!filteredDetails.length) return
    await db
      .insertInto('metal_pdo.details')
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
        const relationData = detail.materials[0]
        if (relationData == null) {
          // throw new Error(
          //   `no detail material relation data for detail ${detail.name}`
          // )
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
      .filter(Boolean)

    if (relations.length > 0) {
      await db
        .insertInto('metal_pdo.detail_materials')
        .values(relations)
        .execute()
    }
  }
}
