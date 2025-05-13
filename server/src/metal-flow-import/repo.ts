//@ts-nocheck
import { plainToInstance } from 'class-transformer'
import { log } from 'node:console'
import { getShapeDataConstructor } from 'shared'
import { Detail, Material } from 'shared/domain'
import { db } from '../db/conn.ts'

export class Repo {
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

  async dropDetails() {
    await db.deleteFrom('metal_pdo.detail_materials').execute()
    await db.deleteFrom('metal_pdo.details').execute()
    log('details dropped')
  }

  async saveDetailsAndRelations(
    material: Material,
    details: Detail[],
    dbMaterials: Material[]
  ): Promise<{ associated: number; failed: number }> {
    const filteredDetails = details.filter(detail => detail.name)
    if (!filteredDetails.length) {
      return { associated: 0, failed: 0 }
    }

    // Save details
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

    // Save relations
    let associated = 0
    let failed = 0

    const relations = details
      .map(detail => {
        const relatedMaterial = dbMaterials.find(
          m => m.getTextId() === material.getTextId()
        )

        const relationData = detail.materials.get(relatedMaterial)
        if (relationData == null) {
          log('material not in db', material.getTextId())
          failed++
          return null
        }

        associated++

        return {
          detail_id: detail.id,
          material_id: relatedMaterial.id,
          data: {
            width: relationData.weight,
            length: relationData.length
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

    return { associated, failed }
  }
}
