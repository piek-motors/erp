import { Detail, Material } from 'domain-model'
import { log } from 'node:console'
import path from 'node:path'
import { CsvIO } from './adapters/csv-io'
import { MaterialParser } from './materials/materials.syncer'
import { parseExcelNumber } from './utils'

const detailsCsvPath = path.resolve('data', 'details.csv')

type MaterialDetails = Map<Material, Array<Detail>>
type CsvLine = string[]

interface IRepo {
  getAllMaterials(): Promise<Material[]>
  insertMaterials(materials: Material[]): Promise<void>
  saveDetailsAndRelations(material: Material, details: Detail[]): Promise<void>
}

export class DetailSyncer {
  constructor(private readonly repo: IRepo) {}

  async sync() {
    const materialDetails = await this.parseTable()
    const dbMaterials = await this.repo.getAllMaterials()

    const materialsToInsert = this.findMaterialsToInsert(
      materialDetails,
      dbMaterials
    )
    if (materialsToInsert.length > 0) {
      await this.repo.insertMaterials(materialsToInsert)
      log(
        `Inserted ${materialsToInsert.length} new materials into the database.`
      )
    } else {
      log('No new materials to insert into the database.')
    }

    // Process existing materials and their details
    await this.processMaterialDetails(materialDetails, dbMaterials)
  }

  async parseTable(): Promise<Map<Material, Array<Detail>>> {
    const table = await CsvIO.read(detailsCsvPath)
    let detailId = 0
    let material: Material | undefined
    let detailMaterials = new Map<Material, Array<Detail>>()

    for (const line of table) {
      const result = this.processCsvLine(
        line,
        detailMaterials,
        material,
        detailId
      )
      detailMaterials = result.materialDetails
      material = result.material
      detailId = result.detailId
    }

    // return this.filterMaterialsOnlyWithDetails(detailMaterials)
    return detailMaterials
  }

  private findMaterialsToInsert(
    materialDetails: Map<Material, Array<Detail>>,
    dbMaterials: Material[]
  ): Material[] {
    const materialTextIds = new Set(dbMaterials.map(m => m.deriveLabel()))

    return Array.from(materialDetails.keys()).filter(material => {
      const materialTextId = material.deriveLabel()
      return !materialTextIds.has(materialTextId)
    })
  }

  private async processMaterialDetails(
    materialDetails: Map<Material, Array<Detail>>,
    dbMaterials: Material[]
  ): Promise<void> {
    for (const [material, details] of materialDetails.entries()) {
      const materialTextId = material.deriveLabel()
      const dbMaterial = dbMaterials.find(
        m => m.deriveLabel() === materialTextId
      )

      if (!dbMaterial) {
        throw new Error(`Material not found in database: ${materialTextId}`)
      }

      await this.repo.saveDetailsAndRelations(dbMaterial, details)
      log(`Processed material: ${materialTextId}`)
    }
  }

  /**
   * The single csv line can be:
   * 1. material name
   * 2. detail name, length, and weight it costs in terms of the material
   * 3. just empty line
   */
  private processCsvLine(
    row: CsvLine,
    materialDetails: MaterialDetails,
    material: Material | undefined,
    detailId: number
  ): {
    materialDetails: MaterialDetails
    material: Material | undefined
    detailId: number
  } {
    const id = row[0]
    if (id) {
      const name = row[1]
      if (name) {
        const material = MaterialParser.parseName(name)
        if (material) {
          materialDetails.set(material, [])

          try {
            // check if material is valid
            material.deriveLabel()
          } catch (e) {
            console.error(`\n\nfailed to parse material ${name}\n\n`, material)
            throw new Error(`failed to parse material ${name}`)
          }
          return { materialDetails, material: material, detailId }
        }
      }
      return { materialDetails, material, detailId }
    }

    if (!material) {
      console.log('Material is not set for detail', row)
      return { materialDetails, material, detailId }
    }

    const detailName = row[1]
    const length = parseExcelNumber(row[3])
    const weight = parseExcelNumber(row[4])

    if (Number.isNaN(Number(weight))) {
      console.warn('Weight is not a number', row)
    }
    if (Number.isNaN(Number(length))) {
      console.warn('Length is not a number', row)
    }

    const details = materialDetails.get(material) || []
    const detail = new Detail(detailId, detailName).madeOf(
      material,
      length,
      weight
    )

    details.push(detail)
    materialDetails.set(material, details)
    return { materialDetails, material, detailId: detailId + 1 }
  }

  filterMaterialsOnlyWithDetails(details: MaterialDetails): MaterialDetails {
    return new Map(
      Array.from(details.entries()).filter(([_, value]) => value.length > 0)
    )
  }
}
