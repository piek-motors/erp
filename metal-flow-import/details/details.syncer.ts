import { Detail, Material } from 'domain-model'
import { log } from 'node:console'
import path from 'node:path'
import { CsvIO } from '../adapters/csv-io'
import { MaterialParser } from '../materials/materials.syncer'
import { parseExcelNumber } from '../utils'
import { AnalysisContext } from './details.analysis-context'
import { DetailSequence } from './sequence'

const detailsCsvPath = path.resolve('data', 'details.csv')

interface IRepo {
  getAllMaterials(): Promise<Material[]>
  insertMaterials(materials: Material[]): Promise<void>
  saveDetailsAndRelations(details: Detail[]): Promise<void>
  loadMaterials(): Promise<void>
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

    await this.repo.loadMaterials()

    const added = new Set<string>()

    for (const [, scope] of analysisResult.materialScopes.entries()) {
      const detailsToAdd: Detail[] = []

      for (const detail of scope.details) {
        if (added.has(detail.name)) {
          continue
        }
        detailsToAdd.push(detail)
        added.add(detail.name)
      }

      await this.repo.saveDetailsAndRelations(detailsToAdd).catch(e => {
        console.error(e.message)
      })
    }
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