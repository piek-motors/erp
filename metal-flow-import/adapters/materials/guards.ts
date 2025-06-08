import { plainToInstance } from 'class-transformer'
import * as dm from 'domain-model'

export function isRoundBar(material: dm.Material): material is dm.RoundBar {
  return material.shape === dm.EnMaterialShape.RoundBar
}

export function isList(material: dm.Material): material is dm.List {
  return material.shape === dm.EnMaterialShape.List
}

export function isPipe(material: dm.Material): material is dm.Pipe {
  return material.shape === dm.EnMaterialShape.Pipe
}

export function isSquareBar(material: dm.Material): material is dm.SquareBar {
  return material.shape === dm.EnMaterialShape.SquareBar
}

export function extractShapeData(material: dm.Material): dm.GenericShapeData {
  if (isRoundBar(material)) {
    return plainToInstance(dm.RoundBarShapeData, {
      diameter: material.diameter,
      alloy: material.alloy,
      calibrated: material.calibrated,
      density: material.density,
      linearMass: material.linearMass
    })
  }
  if (isList(material)) {
    return plainToInstance(dm.ListShapeData, {
      thickness: material.thickness,
      alloy: material.alloy,
      width: material.width
    })
  }
  if (isPipe(material)) {
    return plainToInstance(dm.PipeShapeData, {
      diameter: material.diameter,
      alloy: material.alloy,
      thickness: material.thickness
    })
  }
  if (isSquareBar(material)) {
    return plainToInstance(dm.SquareBarShapeData, {
      length: material.length,
      alloy: material.alloy
    })
  }

  throw new Error(`Unsupported material shape: ${material.shape}`)
}
