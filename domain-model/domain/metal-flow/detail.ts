import { Material } from './material'

export class Detail {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly materials: Map<
      Material,
      { length: number; weight: number } | undefined
    >
  ) {}
}
