import { parse, } from 'csv';
import fs from 'node:fs';
import path from 'node:path';
import { Detail, Material } from 'shared/domain';
import { EnMaterialShape, EnUnit } from 'shared/enumerations';
import { CircleShapeData, PipeShapeData } from '../shared/dist/json.types';

const csv = fs.readFileSync(path.resolve(process.cwd(), './data/details.csv'));
const log = console.log

let i = 2
parse(csv, { delimiter: ',' }, ((err, res) => {
  let materialDetails = new Map<Material, Array<Detail>>()
  let material: Material | undefined

  for (const line of res) {
    if (i > 0) {
      i--;
      continue
    }

    const id = line[0]

    if (id) {
      // this line denotes material
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
        log(`Material is not set for detail`, line)
        continue
      }
      // this branch defined details mad of material that we cath aboveconst name = line[1]
      const name = line[1]
      const alloy = line[2]
      const length = line[3]
      const weight = line[4]
      const details = materialDetails.get(material) || []
      const detail = new Detail(0, name, [material])

      // details.push({
      //   name,
      //   alloy,
      //   length,
      //   weight
      // })
      details.push(detail)
      materialDetails.set(material, details)
    }
  }

  const filtred = filterMaterialsWithNoDetails(materialDetails)

  // log(filtred)
}));

function parseMaterialName(name: string): Material | undefined {
  if (name.includes('круг')) {
    const diameter = parseInt(name.split('ф')[1])
    const alloy = name.split('ф')[1].split(' ')[1].trim()

    const circle = new CircleShapeData()
    circle.alloy = alloy
    circle.diameter = diameter

    return new Material(0, EnUnit.Kg, EnMaterialShape.Circle, circle)
  } else if (name.includes('труба')) {
    const diameterMeta = (name.split('ф')[1])
    const d = diameterMeta.split('x')
    const diameter = parseInt(d[0])
    const thickness = parseInt(d[1])
    const alloy = name.split('ф')[1].split(' ')[1].trim()

    const pipe = new PipeShapeData()
    pipe.diameter = diameter
    pipe.thickness = thickness
    pipe.alloy = alloy

    return new Material(0, EnUnit.Kg, EnMaterialShape.Pipe, pipe)
  } else {
    log(`Unrecognized material ${name}`)
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

