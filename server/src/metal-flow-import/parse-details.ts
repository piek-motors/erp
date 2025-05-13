import { parse } from 'csv'
import fs from 'node:fs'
import path from 'node:path'
import { Detail, Material } from 'shared/domain'
import { log } from 'node:console'
import {
  filterMaterialsOnlyWithDetails,
  processCsvLine
} from './details-parser.utils.ts'
import { Repo } from './repo.ts'

const CSV_PATH = path.resolve('src/metal-flow-import', './data/details.csv')

async function processCsvData(
  csvData: any[]
): Promise<Map<Material, Array<Detail>>> {
  let materialDetails = new Map<Material, Array<Detail>>()
  let currentMaterial: Material | undefined
  let detailId = 0

  for (const line of csvData) {
    const result = processCsvLine(
      line,
      materialDetails,
      currentMaterial,
      detailId
    )
    materialDetails = result.materialDetails
    currentMaterial = result.currentMaterial
    detailId = result.detailId
  }

  return filterMaterialsOnlyWithDetails(materialDetails)
}

async function main() {
  try {
    const csv = fs.readFileSync(CSV_PATH)
    parse(csv, { delimiter: ',' }, async (err, csvData) => {
      if (err) {
        console.error('Error parsing CSV:', err)
        return
      }

      const repo = new Repo()
      const materialDetails = await processCsvData(csvData)
      const dbMaterials = await repo.getAllMaterials()

      for (const [material, details] of materialDetails.entries()) {
        const { associated, failed } = await repo.saveDetailsAndRelations(
          material,
          details,
          dbMaterials
        )

        log(`associated: ${associated}`)
        log(`failed: ${failed}`)
      }
    })
  } catch (error) {
    console.error('Error processing file:', error)
  }
}

main()
