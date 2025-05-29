import { Detail, Material } from 'domain-model'
import { log } from 'node:console'
import path from 'node:path'
import { CsvIO } from '../adapters/csv-io.ts'
import { MaterialParser } from '../materials/materials.syncer.ts'
import { parseExcelNumber } from '../utils.ts'
import { AnalysisContext } from './details.analysis-context.ts'
import { DetailSequence } from './sequence.ts'

const detailsCsvPath = path.resolve('data', 'details.csv')

interface IRepo {
  getAllMaterials(): Promise<Material[]>
  insertMaterials(materials: Material[]): Promise<void>
  saveDetailsAndRelations(material: Material, details: Detail[]): Promise<void>
}

export class DetailSyncer {
  constructor(private readonly repo: IRepo) {}

  async sync() {
    const analysisResult = await this.parseTable()
    const materialsToInsert = analysisResult.materialScopes.map(
      scope => scope.material
    )

    if (materialsToInsert.length > 0) {
      await this.repo.insertMaterials(materialsToInsert)
      log(
        `Inserted ${materialsToInsert.length} new materials into the database.`
      )
    } else {
      log('No new materials to insert into the database.')
    }

    // await this.processMaterialDetails(analysisResult, dbMaterials)
  }

  async parseTable(): Promise<AnalysisContext> {
    const table = await CsvIO.read(detailsCsvPath, { stripHeading: true })
    const ctx = new AnalysisContext()
    for (const row of table) {
      this.parseRow(row, ctx).catch(e => {
        console.error(e)
      })
    }
    return ctx
  }

  /**
   * The single csv line can be:
   * 1. material name
   * 2. detail name, length, and weight it costs in terms of the material
   * 3. just empty line
   */
  private async parseRow(row: string[], ctx: AnalysisContext) {
    const materialId = row[0]
    if (materialId) {
      const name = row[1]
      if (name) {
        const material = MaterialParser.parseName(name)
        if (!material) {
          throw Error(`failed to parse material name: ${name}`)
        }

        // validate that matirla derived labed dose not conitanse undefined word
        if (material.deriveLabel().includes('undefined')) {
          throw Error(
            `material derived label contains undefined word: ${material.deriveLabel()}, row: ${row}`
          )
        }

        ctx.openNewScope(material)
      }
    } else {
      const detailName = row[1]
      if (!detailName) return
      const length = parseNumberOrDefault(parseExcelNumber(row[3]))
      const weight = parseNumberOrDefault(parseExcelNumber(row[4]))
      const detail = new Detail(DetailSequence.next(), detailName).madeOf(
        ctx.getCurrentMaterial(),
        length,
        weight
      )
      ctx.addDetailToCurrentScope(detail)
    }
    return ctx
  }
}

const parseNumberOrDefault = (value: number) => {
  if (Number.isNaN(value)) {
    return 0
  }
  return value
}