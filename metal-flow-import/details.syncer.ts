import { CsvIO } from 'csv-io'
import { Detail, Material } from 'domain-model'
import { MaterialParser } from 'materials.syncer'
import { log } from 'node:console'
import path from 'node:path'
import { Repo } from 'repo'

const __dirname = path.resolve(import.meta.url)
const detailsCsvPath = path.resolve(path.join(__dirname, 'data', 'details.csv'))

// Types
type MaterialDetails = Map<Material, Array<Detail>>
type CsvLine = string[]

export class DetailSyncer {
  constructor(private readonly repo: Repo) {}

  async sync() {
    const table = await CsvIO.read(detailsCsvPath)
    const materialDetails = await this.parseTable(table)
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
    await this.processMaterialDetails(materialDetails, dbMaterials, this.repo)
  }

  private async parseTable(
    table: string[][]
  ): Promise<Map<Material, Array<Detail>>> {
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
      material = result.currentMaterial
      detailId = result.detailId
    }

    return this.filterMaterialsOnlyWithDetails(detailMaterials)
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
    dbMaterials: Material[],
    repo: Repo
  ): Promise<void> {
    for (const [material, details] of materialDetails.entries()) {
      const materialTextId = material.deriveLabel()
      const dbMaterial = dbMaterials.find(
        m => m.deriveLabel() === materialTextId
      )

      if (!dbMaterial) {
        throw new Error(`Material not found in database: ${materialTextId}`)
      }

      await repo.saveDetailsAndRelations(dbMaterial, details)
      log(`Processed material: ${materialTextId}`)
    }
  }

  private processCsvLine(
    line: CsvLine,
    materialDetails: MaterialDetails,
    currentMaterial: Material | undefined,
    detailId: number
  ): {
    materialDetails: MaterialDetails
    currentMaterial: Material | undefined
    detailId: number
  } {
    const id = line[0]
    if (id) {
      const name = line[1]
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
          return { materialDetails, currentMaterial: material, detailId }
        }
      }
      return { materialDetails, currentMaterial, detailId }
    }

    if (!currentMaterial) {
      console.log('Material is not set for detail', line)
      return { materialDetails, currentMaterial, detailId }
    }

    const detailName = line[1]
    const length = line[3]
    const weight = line[4]
    const details = materialDetails.get(currentMaterial) || []

    const detail = this.createDetail(
      detailId,
      detailName,
      currentMaterial,
      Number(weight),
      Number(length)
    )

    details.push(detail)
    materialDetails.set(currentMaterial, details)
    return { materialDetails, currentMaterial, detailId: detailId + 1 }
  }

  // Helper Functions
  createDetail(
    id: number,
    detailName: string,
    material: Material,
    weight: number,
    length: number
  ): Detail {
    const materialMap = new Map<Material, { weight: number; length: number }>()
    materialMap.set(material, {
      weight: Number(weight),
      length: Number(length)
    })
    return new Detail(id, detailName, materialMap)
  }

  filterMaterialsOnlyWithDetails(details: MaterialDetails): MaterialDetails {
    return new Map(
      Array.from(details.entries()).filter(([_, value]) => value.length > 0)
    )
  }
}
