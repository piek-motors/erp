import { parse, } from 'csv';
import fs from 'node:fs';
import path from 'node:path';
import { CircleShapeData, ListShapeData, PipeShapeData, SquareShapeData } from 'shared';
import { Detail, Material } from 'shared/domain';
import { EnMaterialShape, EnUnit } from 'shared/enumerations';
import YAML from 'yaml';


const csv = fs.readFileSync(path.resolve(process.cwd(), './data/details.csv'));
const log = console.log

parse(csv, { delimiter: ',' }, (err, res) => {
  let materialDetails = new Map<Material, Array<Detail>>()
  let material: Material | undefined

  for (const line of res) {
    const id = line[0]
    if (id) {
      const name = line[1]
      if (name) {
        material = parseMaterialName(name)
        if (material) {
          materialDetails.set(material, [])
        }
      }
      continue
    } else {
      if (!material) {
        // log(`Material is not set for detail`, line)
        continue
      }
      // this branch defined details mad of material that we cath aboveconst name = line[1]
      const name = line[1]
      const alloy = line[2]
      const length = line[3]
      const weight = line[4]
      const details = materialDetails.get(material) || []

      const materialMap = new Map<
        Material,
        { weight: number; length: number }
      >()
      materialMap.set(material, {
        weight: Number(weight),
        length: Number(length)
      })

      const detail = new Detail(0, name, materialMap)
      details.push(detail)
      materialDetails.set(material, details)
    }
  }

  const MaterialDetails = filterMaterialsWithNoDetails(materialDetails)
  const data = YAML.stringify(MaterialDetails)
  fs.writeFileSync('./details-parsed.yaml', data)
})

function parseMaterialName(name: string): Material | undefined {
  const parsers = new Parser()
  if (name.includes('круг')) {
    return parsers.parseCircle(name)
  } else if (name.includes('S=')) {
    parsers.parseSircle(name)
  } else if (name.includes('труба')) {
    return parsers.parsePipe(name)
  } else if (name.includes('лист')) {
    return parsers.parseList(name)
  } else if (name.includes('квадрат')) {
    return parsers.parseSquare(name)
  } else {
    log(`error: unrecognized material name: ${name}`)
  }
}

function filterMaterialsWithNoDetails(details: Map<Material, Array<Detail>>) {
  const res = new Map<Material, Array<Detail>>()
  for (const [key, value] of details) {
    if (value.length > 0) {
      res.set(key, value)
    }
  }
  return res
}

export class Parser {
  parseSquare(name: string) {
    const [_, size, alloy, allsoySecond] = name.split(' ')
    const sideSize = Number(size.split('x')[1])
    const square = new SquareShapeData()
    square.length = sideSize
    if (alloy) {
      square.alloy = `${alloy}${allsoySecond || ''}`
    }
    return new Material(0, EnUnit.Kg, EnMaterialShape.Square, square)
  }
  parseList(name: string) {
    const geee = name
      .split('G')[1]
      ?.split(' ')[0]
      .replace('=', '')
      .replace(',', '.')
    const g = Number(geee)
    // console.log(g, name.split('G')[1])
    const list = new ListShapeData()
    list.g = g
    return new Material(0, EnUnit.Kg, EnMaterialShape.List, list)
  }
  parsePipe(name: string) {
    const diameterMeta = name.split('ф')[1]
    const d = diameterMeta.split('x')
    const diameter = parseInt(d[0])
    const thickness = parseInt(d[1])
    const alloy = name.split('ф')[1].split(' ')[1].trim()

    const pipe = new PipeShapeData()
    pipe.diameter = diameter
    pipe.thickness = thickness
    pipe.alloy = alloy

    return new Material(0, EnUnit.Kg, EnMaterialShape.Pipe, pipe)
  }
  parseCircle(name: string) {
    const diameter = parseInt(name.split('ф')[1])
    const alloy = name.split('ф')[1].split(' ')[1].trim()

    const circle = new CircleShapeData()
    circle.alloy = alloy
    circle.diameter = Number(diameter)

    return new Material(0, EnUnit.Kg, EnMaterialShape.Circle, circle)
  }
  parseSircle(name: string) {
    const diameter = parseInt(name.split('S=')[1])
    const alloyRaw = name.split('S=')[1].split(' ')
    alloyRaw.shift()
    const alloy = alloyRaw.filter(Boolean).join(' ')

    const circle = new CircleShapeData()
    circle.alloy = alloy
    circle.diameter = Number(diameter)

    return new Material(0, EnUnit.Kg, EnMaterialShape.Circle, circle)
  }
}