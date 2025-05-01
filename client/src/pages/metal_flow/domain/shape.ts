export abstract class ShapeData {}

export class CircleShapeData extends ShapeData {
  constructor(
    readonly diameter: string,
    readonly alloy: string,
    readonly specificWeight: string
  ) {
    super()
  }
}

export class ListShapeData extends ShapeData {
  constructor(
    readonly length: string,
    readonly width: string,
    readonly thickness: string
  ) {
    super()
  }
}
