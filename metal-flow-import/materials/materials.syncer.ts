import { assert } from 'console'
import { List, Material, Pipe, RoundBar, SquareBar } from 'domain-model'
import path from 'node:path'
import { CsvIO } from '../adapters/csv-io'
import { parseExcelNumber } from '../utils'
import { MaterialSequence } from './sequence'

const materialsCsvPath = path.resolve(path.join('data', 'materials.csv'))

// Material name parser of the details table
export class MaterialParser {
  static parseName(nameRaw: string): Material | undefined {
    const parser = new MaterialParser()
    const name = nameRaw.trim().toLowerCase()
    try {
      if (name.includes('круг')) {
        return parser.parseRoundBar(name)
      } else if (name.includes('s=')) {
        return parser.parseSircle(name)
      } else if (name.includes('труба')) {
        return parser.parsePipe(name)
      } else if (name.includes('лист')) {
        return parser.parseList(name)
      } else if (name.includes('квадрат')) {
        return parser.parseSquare(name)
      } else {
        console.log(`error: unrecognized material name: ${name}`)
        return undefined
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(`failed to parse material name: ${name}: ${e.message}`)
      }
      return undefined
    }
  }

  static parseRow(row: string[]): Material | undefined {
    const parser = new MaterialParser()
    const nameRaw = row[1]
    const density = parseExcelNumber(row[3])
    const linearMass = parseExcelNumber(row[5])
    if (Number.isNaN(density)) {
      console.log(`error: density is NaN, row: ${row}`)
    }
    if (Number.isNaN(linearMass)) {
      console.log(`error: linearMass is NaN, row: ${row}`)
    }
    const name = nameRaw.trim().toLowerCase()
    if (name.includes('круг')) {
      const b = parser.parseRoundBar(name)
      b.density = density
      b.linearMass = Number(linearMass)
      return b
    } else if (name.includes('s=')) {
      return parser.parseSircle(name)
    } else if (name.includes('труба')) {
      return parser.parsePipe(name)
    } else if (name.includes('лист')) {
      return parser.parseList(name)
    } else if (name.includes('квадрат')) {
      return parser.parseSquare(name)
    } else {
      console.log(`error: unrecognized material name: ${name}`)
      return undefined
    }
  }

  parseSquare(name: string) {
    const [_, size, alloy] = name.split(' ')
    const sideSize = Number(size.split(/[хx]/)[1])
    const square = new SquareBar(MaterialSequence.next())
    square.length = sideSize
    if (Number.isNaN(square.length) || square.length === 0) {
      throw new Error(`sideSize is NaN, name: ${name}`)
    }
    if (alloy) {
      square.alloy = alloy || ''
    }
    return square
  }

  parseList(name: string) {
    let thicknessMatch = name
      .split('g')[1]
      ?.split(' ')[0]
      .replace('=', '')
      .replace(',', '.')

    // if thickness match includes english x or russian х split by it and take the first part
    if (thicknessMatch.includes('x') || thicknessMatch.includes('х')) {
      const parts = thicknessMatch.split(/[xх]/)
      thicknessMatch = parts[0]
    }

    const thickness = Number(thicknessMatch)
    const list = new List(MaterialSequence.next())
    list.thickness = thickness

    // Extract alloy if present
    const alloyMatch = name.split('G')[1]?.split(' ').slice(1).join(' ').trim()
    if (alloyMatch) {
      list.alloy = alloyMatch
    }

    return list
  }

  parsePipe(name: string) {
    const res = name.split('ф')[1]
    const [diameter, thickness] = res
      .split(' ')
      .filter(Boolean)[0]
      .replace(/[хx]/g, 'x')
      .split('x')
      .map(num => {
        // Remove parentheses and replace comma with dot
        const cleanNum = num.replace(/[()]/g, '').replace(',', '.')
        return Number(cleanNum)
      })

    // труба ф 89х8 ст 20
    // труба ф 57х7
    const t = name.split('х')[1].split(' ')
    t.shift()
    const alloy = t.join(' ')

    const pipe = new Pipe(MaterialSequence.next())
    assert(!Number.isNaN(diameter), `diameter is NaN, name: ${name}`)
    assert(!Number.isNaN(thickness), `thickness is NaN, name: ${name}`)
    pipe.diameter = diameter
    pipe.thickness = thickness
    pipe.alloy = alloy
    return pipe
  }

  parseRoundBar(name: string) {
    const diameter = parseFloat(name.split('ф')[1])
    if (Number.isNaN(diameter)) {
      throw new Error(`diameter is NaN, name: ${name}`)
    }

    const rest = name.split('ф')[1].split(' ').filter(Boolean)
    rest.shift()
    const isCalibrated =
      rest.includes('калибровка') || rest.includes('колибровка')
    const alloy = rest
      .filter(Boolean)
      .filter(
        each => !each.includes('калибровка') && !each.includes('колибровка')
      )
      .join(' ')

    const res = new RoundBar(MaterialSequence.next())
    res.diameter = Number(diameter)
    res.alloy = alloy
    res.calibrated = isCalibrated
    res.label = res.deriveLabel()

    return res
  }

  parseSircle(name: string) {
    const [diameterRaw, alloy = ''] = name.split(' ')
    const diameter = parseInt(diameterRaw.replace('s=', ''))

    const circle = new RoundBar(MaterialSequence.next())
    circle.alloy = alloy
    circle.calibrated =
      name.includes('калибровка') || name.includes('колибровка')
    circle.diameter = Number(diameter)

    if (Number.isNaN(circle.diameter)) {
      throw new Error(`diameter is NaN`)
    }
    return circle
  }
}

interface IRepo {
  insertMaterials(materials: Material[]): Promise<void>
}

export class MaterialsSyncer {
  constructor(private readonly repo: IRepo) {}

  async sync() {
    const materials = await this.getMaterialsForSync()
    await this.repo.insertMaterials(materials)
  }

  async getMaterialsForSync() {
    const table = await CsvIO.read(materialsCsvPath, { stripHeading: true })
    const materials: Material[] = []
    for (const row of table) {
      const material = MaterialParser.parseRow(row)
      if (!material) {
        console.log(`unrecognized material`)
        continue
      }
      materials.push(material)
    }
    return materials
  }
}
