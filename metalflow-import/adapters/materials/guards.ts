import {
  EnMaterialShape,
  List,
  ListShapeData,
  Material,
  Pipe,
  PipeShapeData,
  RoundBar,
  RoundBarShapeData,
  SquareBar,
  SquareBarShapeData,
  type ShapeDataUnion
} from 'domain-model'
import { plainToInstance } from 'class-transformer'

export function isRoundBar(material: Material): material is RoundBar {
  return material.shape === EnMaterialShape.RoundBar
}

export function isList(material: Material): material is List {
  return material.shape === EnMaterialShape.List
}

export function isPipe(material: Material): material is Pipe {
  return material.shape === EnMaterialShape.Pipe
}

export function isSquareBar(material: Material): material is SquareBar {
  return material.shape === EnMaterialShape.SquareBar
}

export function extractShapeData(material: Material): ShapeDataUnion {
  if (isRoundBar(material)) {
    return plainToInstance(RoundBarShapeData, {
      diameter: material.diameter,
      alloy: material.alloy,
      calibrated: material.calibrated,
      density: material.density,
      linearMass: material.linearMass
    })
  }
  if (isList(material)) {
    return plainToInstance(ListShapeData, {
      thickness: material.thickness,
      alloy: material.alloy,
      width: material.width
    })
  }
  if (isPipe(material)) {
    return plainToInstance(PipeShapeData, {
      diameter: material.diameter,
      alloy: material.alloy,
      thickness: material.thickness
    })
  }
  if (isSquareBar(material)) {
    return plainToInstance(SquareBarShapeData, {
      length: material.length,
      alloy: material.alloy
    })
  }

  throw new Error(`Unsupported material shape: ${material.shape}`)
}
