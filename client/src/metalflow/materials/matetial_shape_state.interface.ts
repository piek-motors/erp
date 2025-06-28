import { EnMaterialShape, GenericShapeData, Material } from 'domain-model'
import { ListState } from './shape/list_state'
import { PipeState } from './shape/pipe_state'
import { RoundBarState } from './shape/rounde_bar.state'
import { SquareState } from './shape/square_state'

export interface IMaterialShapeState {
  export(): GenericShapeData
  sync(material: Material): void
  reset(): void
}

export function createMaterialShapeState(
  shape: EnMaterialShape
): IMaterialShapeState {
  switch (shape) {
    case EnMaterialShape.RoundBar:
      return new RoundBarState()
    case EnMaterialShape.SquareBar:
      return new SquareState()
    case EnMaterialShape.Pipe:
      return new PipeState()
    case EnMaterialShape.List:
      return new ListState()
    default:
      return new RoundBarState()
  }
}
