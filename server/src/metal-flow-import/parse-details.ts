import { parse } from 'csv'
import { log } from 'node:console'
import fs from 'node:fs'
import path from 'node:path'
import { Detail, Material } from 'shared/domain'
import {
  filterMaterialsOnlyWithDetails,
  processCsvLine
} from './details-parser.utils.ts'
import { Repo } from './repo.ts'

const CSV_PATH = path.resolve('src/metal-flow-import', './data/details.csv')

async function processCsvData(
  csvData: any[]
): Promise<Map<Material, Array<Detail>>> {
  let detailId = 0
  let material: Material | undefined
  let detailMaterials = new Map<Material, Array<Detail>>()

  for (const line of csvData) {
    const result = processCsvLine(line, detailMaterials, material, detailId)
    detailMaterials = result.materialDetails
    material = result.currentMaterial
    detailId = result.detailId
  }

  return filterMaterialsOnlyWithDetails(detailMaterials)
}

function findMaterialsToInsert(
  materialDetails: Map<Material, Array<Detail>>,
  dbMaterials: Material[]
) {
  return Array.from(materialDetails.keys()).filter(
    material => !dbMaterials.some(dbMaterial => dbMaterial.id === material.id)
  )
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
      const materialsToInsert = findMaterialsToInsert(
        materialDetails,
        dbMaterials
      )
      if (materialsToInsert.length > 0) {
        await repo.insertMaterials(materialsToInsert)
        log(
          `Inserted ${materialsToInsert.length} new materials into the database.`
        )
      } else {
        log('No new materials to insert into the database.')
      }

      for (const [material, details] of materialDetails.entries()) {
        await repo.saveDetailsAndRelations(material, details)
        log(`${material.getTextId()}`)
      }
    })
  } catch (error) {
    console.error('Error processing file:', error)
  }
}

main()
