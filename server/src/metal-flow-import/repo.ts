import { plainToInstance } from 'class-transformer'
import { log } from 'node:console'
import { getShapeDataConstructor } from 'shared'
import { Detail, Material } from 'shared/domain'
import { db } from '../db/conn.ts'

export class Repo {
  async insertMaterials(materials: Material[]) {
    const lastId = await db
      .selectFrom('metal_pdo.materials')
      .select('id')
      .orderBy('id', 'desc')
      .limit(1)
      .executeTakeFirstOrThrow()

    await db
      .insertInto('metal_pdo.materials')
      .values(
        materials.map((m, idx) => ({
          id: lastId.id + idx + 1,
          unit: m.unitId,
          shape: m.shapeId,
          shape_data: m.shapeData
        }))
      )
      .execute()
  }

  async getAllMaterials(): Promise<Material[]> {
    const dbMaterials = await db
      .selectFrom('metal_pdo.materials')
      .selectAll()
      .execute()

    return dbMaterials.map(m => {
      const shapeDataConstructor = getShapeDataConstructor(m.shape)
      if (shapeDataConstructor == null) {
        throw new Error(`material mapper: unknown shape ${m.shape}`)
      }
      const shape = plainToInstance(shapeDataConstructor, m.shape_data) as any
      return new Material(m.id, m.unit, m.shape, shape)
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
        if (detail.materials?.size === 0) {
          return null
        }
        const relation = detail.materials[0]
        if (relation == null) {
          return null
        }
        return {
          detail_id: detail.id,
          material_id: material.id,
          data: {
            width: relation?.weight,
            length: relation?.length
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
