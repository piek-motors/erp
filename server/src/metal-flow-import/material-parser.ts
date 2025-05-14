import { assert } from 'console'
import {
  CircleShapeData,
  EnMaterialShape,
  EnUnit,
  ListShapeData,
  PipeShapeData,
  SquareShapeData
} from 'shared'
import { Material } from 'shared/domain'

// Material namae parser of the details table
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
    const square = new SquareShapeData()
    square.length = sideSize
    if (Number.isNaN(square.length) || square.length === 0) {
      throw new Error(`sideSize is NaN, name: ${name}`)
    }
    if (alloy) {
      square.alloy = `${alloy}${alloySecond || ''}`
    }
    return new Material(0, EnUnit.Kg, EnMaterialShape.Square, square)
  }

  parseList(name: string) {
    const thicknessMatch = name
      .split('G')[1]
      ?.split(' ')[0]
      .replace('=', '')
      .replace(',', '.')
    const thickness = Number(thicknessMatch)
    const list = new ListShapeData()
    list.g = thickness
    return new Material(0, EnUnit.Kg, EnMaterialShape.List, list)
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
    const pipe = new PipeShapeData()
    assert(!Number.isNaN(diameter), `diameter is NaN, name: ${name}`)
    assert(!Number.isNaN(thickness), `thickness is NaN, name: ${name}`)
    pipe.diameter = diameter
    pipe.thickness = thickness
    pipe.alloy = alloy
    return new Material(0, EnUnit.Kg, EnMaterialShape.Pipe, pipe)
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
    const circle = new CircleShapeData()
    circle.alloy = alloy
    circle.calibrated = isCalibrated
    circle.diameter = Number(diameter)
    assert(!Number.isNaN(circle.diameter), `diameter is NaN, name: ${name}`)
    return new Material(0, EnUnit.Kg, EnMaterialShape.Circle, circle)
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
    const circle = new CircleShapeData()
    circle.alloy = alloy
    circle.calibrated = isCalibrated
    circle.diameter = Number(diameter)

    if (Number.isNaN(circle.diameter)) {
      throw new Error(`diameter is NaN, name: ${name}`)
    }
    return new Material(0, EnUnit.Kg, EnMaterialShape.Circle, circle)
  }
}
