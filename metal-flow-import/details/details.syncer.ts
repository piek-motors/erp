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
    const materialsToInsert = analysisResult.scopes.map(scope => scope.material)

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
    const table = await CsvIO.read(detailsCsvPath)
    const ctx = new AnalysisContext()
    for (const row of table) {
    }
    return ctx
  }

  private async parseRow(row: string[], ctx: AnalysisContext) {
    /**
     * The single csv line can be:
     * 1. material name
     * 2. detail name, length, and weight it costs in terms of the material
     * 3. just empty line
     */
    const materialId = row[0]
    if (materialId) {
      const name = row[1]
      if (name) {
        const material = MaterialParser.parseName(name)
        if (!material) {
          throw Error(`failed to parse material name`)
        }
        ctx.openNewScope(material)
      }
    } else {
      const detailName = row[1]
      const length = parseExcelNumber(row[3])
      const weight = parseExcelNumber(row[4])

      if (Number.isNaN(Number(weight))) {
        console.warn('Weight is not a number', row)
      }
      if (Number.isNaN(Number(length))) {
        console.warn('Length is not a number', row)
      }

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
