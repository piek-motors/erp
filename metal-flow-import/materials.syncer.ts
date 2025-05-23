import { assert } from 'console'
import { CsvIO } from 'csv-io'
import {
  EnMaterialShape,
  getMaterialConstructor,
  List,
  Material,
  Pipe,
  RoundBar,
  SquareBar
} from 'domain-model'
import path from 'node:path'
import { Repo } from 'repo'

const materialsCsvPath = path.resolve(
  path.join(__dirname, 'data', 'materials.csv')
)

// Material name parser of the details table
export class MaterialParser {
  static parse(name: string): Material | undefined {
    const parser = new MaterialParser()
    if (name.includes('круг')) {
      return parser.parseCircle(name)
    } else if (name.includes('S=')) {
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
    const [_, size, alloy, alloySecond] = name.split(' ')
    const sideSize = Number(size.split(/[хx]/)[1])
    const square = new SquareBar(0)
    square.length = sideSize
    if (Number.isNaN(square.length) || square.length === 0) {
      throw new Error(`sideSize is NaN, name: ${name}`)
    }
    if (alloy) {
      square.alloy = `${alloy}${alloySecond || ''}`
    }
    return square
  }

  parseList(name: string) {
    let thicknessMatch = name
      .split('G')[1]
      ?.split(' ')[0]
      .replace('=', '')
      .replace(',', '.')

    console.log('thicknessMatch', thicknessMatch)
    // if thickness match includes english x or russian х split by it and take the first part
    if (thicknessMatch.includes('x') || thicknessMatch.includes('х')) {
      const parts = thicknessMatch.split(/[xх]/)
      thicknessMatch = parts[0]
    }

    const thickness = Number(thicknessMatch)
    const list = new List(0)
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
    const alloy = name.split('ф')[1].split(' ')[1]?.trim() || ''
    const pipe = new Pipe(0)
    assert(!Number.isNaN(diameter), `diameter is NaN, name: ${name}`)
    assert(!Number.isNaN(thickness), `thickness is NaN, name: ${name}`)
    pipe.diameter = diameter
    pipe.thickness = thickness
    pipe.alloy = alloy
    return pipe
  }

  parseCircle(name: string) {
    const diameter = parseInt(name.split('ф')[1])
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
    const circle = new RoundBar(0)
    circle.alloy = alloy
    circle.calibrated = isCalibrated
    circle.diameter = Number(diameter)
    assert(!Number.isNaN(circle.diameter), `diameter is NaN, name: ${name}`)
    return circle
  }

  parseSircle(name: string) {
    const diameter = parseInt(name.split('S=')[1])
    const rest = name.split('S=')[1].split(' ').filter(Boolean)
    rest.shift()
    const isCalibrated =
      rest.includes('калибровка') || rest.includes('колибровка')
    const alloy = rest
      .filter(Boolean)
      .filter(
        each => !each.includes('калибровка') && !each.includes('колибровка')
      )
      .join(' ')
    const circle = new RoundBar(0)
    circle.alloy = alloy
    circle.calibrated = isCalibrated
    circle.diameter = Number(diameter)

    if (Number.isNaN(circle.diameter)) {
      throw new Error(`diameter is NaN, name: ${name}`)
    }
    return circle
  }
}

export class MaterialsSyncer {
  constructor(private readonly repo: Repo) {}

  async sync() {
    const materials = await this.getMaterialsForSync()
    await this.repo.insertMaterials(materials)
  }

  async getMaterialsForSync() {
    const table = CsvIO.read(materialsCsvPath)
    const materials: Material[] = []

    for (const row of table) {
      const id = parseInt(row[0])
      const name = row[1]
      const density = parseFloat(row[3])
      const linearMass = parseFloat(row[5].replace(',', '.'))

      const nameSplited = name.split('ф')
      if (nameSplited.length < 2) continue

      const namespl = nameSplited[1].split(' ').filter(Boolean)

      const diameter = parseFloat(namespl[0].split(',')[0])
      const alloy = `${namespl[1]} ${namespl[2]}`
      const isCalibrated = name.includes('калибровка')

      const MaterialConstructor = getMaterialConstructor(
        EnMaterialShape.RoundBar
      )
      const material = new MaterialConstructor(id)
      material.load(id, {
        diameter,
        alloy,
        calibrated: isCalibrated,
        density,
        linearMass
      })
      materials.push(material)
    }

    return materials
  }
}
