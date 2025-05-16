import { parse } from 'csv'
import { connect } from 'db'
import { Detail, Material } from 'domain-model'
import { log } from 'node:console'
import fs from 'node:fs'
import path from 'node:path'
import {
  filterMaterialsOnlyWithDetails,
  processCsvLine
} from './details-parser.utils'
import { Repo } from './repo'

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

function getMaterialTextId(material: Material): string {
  try {
    return material.deriveLabel()
  } catch (error) {
    throw new Error(
      `Failed to get text ID for material ${material.shape}: ${error}`
    )
  }
}

function findMaterialsToInsert(
  materialDetails: Map<Material, Array<Detail>>,
  dbMaterials: Material[]
): Material[] {
  const materialTextIds = new Set(dbMaterials.map(getMaterialTextId))

  return Array.from(materialDetails.keys()).filter(material => {
    const materialTextId = getMaterialTextId(material)
    return !materialTextIds.has(materialTextId)
  })
}

async function processMaterialDetails(
  materialDetails: Map<Material, Array<Detail>>,
  dbMaterials: Material[],
  repo: Repo
): Promise<void> {
  for (const [material, details] of materialDetails.entries()) {
    const materialTextId = getMaterialTextId(material)
    const dbMaterial = dbMaterials.find(
      m => getMaterialTextId(m) === materialTextId
    )

    if (!dbMaterial) {
      throw new Error(`Material not found in database: ${materialTextId}`)
    }

    await repo.saveDetailsAndRelations(dbMaterial, details)
    log(`Processed material: ${materialTextId}`)
  }
}

async function main() {
  try {
    const csv = fs.readFileSync(CSV_PATH)
    const connStr = process.env.PG_CONN_STR
    if (!connStr) {
      throw new Error('PG_CONN_STR is not set')
    }

    const db = connect(connStr)
    parse(csv, { delimiter: ',' }, async (err, csvData) => {
      if (err) {
        throw new Error(`Error parsing CSV: ${err}`)
      }

      const repo = new Repo(db)
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

      // Process existing materials and their details
      await processMaterialDetails(materialDetails, dbMaterials, repo)
    })
  } catch (error) {
    console.error('Error processing file:', error)
    process.exit(1)
  }
}

main()
