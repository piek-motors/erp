import { EnMaterialShape } from 'shared/enumerations'
import { ShapeDependedTabs } from '../shared/shape-depended-tabs'
import { CircleShapeForm } from './shape/circle'
import { ListShapeForm } from './shape/list'
import { PipeShapeForm } from './shape/pipe'
import { SquareShapeForm } from './shape/square'
import { useMaterialStore } from './state'

const tabs = {
  Круг: <CircleShapeForm />,
  Квадрат: <SquareShapeForm />,
  Лист: <ListShapeForm />,
  Труба: <PipeShapeForm />
}

export function MaterialShapeSelectTabs() {
  const state = useMaterialStore()

  return (
    <ShapeDependedTabs
      data={tabs}
      handleChange={shape => {
        state.setShape(shape as any)
      }}
    />
  )
}

export function getInputFormByShapeValue(shape: EnMaterialShape) {
  switch (shape) {
    case EnMaterialShape.Circle:
      return <CircleShapeForm />
    case EnMaterialShape.Square:
      return <SquareShapeForm />
    case EnMaterialShape.List:
      return <ListShapeForm />
    case EnMaterialShape.Pipe:
      return <PipeShapeForm />
    default:
      throw new Error('Unknown shape')
  }
}
