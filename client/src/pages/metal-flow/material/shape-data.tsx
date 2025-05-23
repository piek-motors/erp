import { Button, ToggleButtonGroup } from '@mui/joy'
import { plainToInstance } from 'class-transformer'
import {
  EnUnit,
  ListShapeData,
  PipeShapeData,
  RoundBarShapeData,
  SquareBarShapeData,
  uiUnit
} from 'domain-model'
import { Observer } from 'mobx-react-lite'
import { InputStack, MyInput } from '../../../shortcuts'
import { AlloyAutocomplete } from '../shared/alloy-autocomplete'
import { materialStore } from '../store'
import { t } from '../text'

type ShapeDataComponent<T> = React.ComponentType<{ shapeData: T }>

function withShapeData<T>(Component: ShapeDataComponent<T>) {
  return function WrappedComponent() {
    return (
      <Observer>
        {() => {
          const store = materialStore
          return <Component shapeData={store.shapeData as T} />
        }}
      </Observer>
    )
  }
}

function SquareMaterialInputBase({
  shapeData
}: {
  shapeData: SquareBarShapeData
}) {
  return (
    <InputStack>
      <MyInput
        label={t.Width}
        value={shapeData.width}
        onChange={e => {
          const newData = { ...shapeData, width: Number(e.target.value) }
          materialStore.setShapeData(
            plainToInstance(SquareBarShapeData, newData)
          )
        }}
      />
      <AlloyAutocomplete
        setAlloy={alloy => {
          const newData = { ...shapeData, alloy }
          materialStore.setShapeData(
            plainToInstance(SquareBarShapeData, newData)
          )
        }}
        alloy={shapeData.alloy}
      />
    </InputStack>
  )
}

function ListMaterialInputBase({ shapeData }: { shapeData: ListShapeData }) {
  return (
    <InputStack>
      <MyInput
        label={t.Thickness}
        value={shapeData.thickness}
        onChange={e => {
          const newData = { ...shapeData, thickness: Number(e.target.value) }
          materialStore.setShapeData(plainToInstance(ListShapeData, newData))
        }}
      />
    </InputStack>
  )
}

function PipeMaterialInputBase({ shapeData }: { shapeData: PipeShapeData }) {
  return (
    <InputStack>
      <MyInput
        label={t.Diameter}
        type="number"
        value={shapeData.diameter}
        onChange={e => {
          const newData = { ...shapeData, diameter: Number(e.target.value) }
          materialStore.setShapeData(plainToInstance(PipeShapeData, newData))
        }}
      />
      <AlloyAutocomplete
        setAlloy={alloy => {
          const newData = { ...shapeData, alloy }
          materialStore.setShapeData(plainToInstance(PipeShapeData, newData))
        }}
        alloy={shapeData.alloy}
      />
      <MyInput
        label={t.Thickness}
        value={shapeData.thickness}
        type="number"
        onChange={e => {
          const newData = { ...shapeData, thickness: Number(e.target.value) }
          materialStore.setShapeData(plainToInstance(PipeShapeData, newData))
        }}
      />
    </InputStack>
  )
}

function RoundBarInputBase({ shapeData }: { shapeData: RoundBarShapeData }) {
  return (
    <InputStack>
      <MyInput
        label={t.Diameter}
        type="number"
        value={shapeData.diameter}
        onChange={e => {
          const newData = { ...shapeData, diameter: Number(e.target.value) }
          materialStore.setShapeData(
            plainToInstance(RoundBarShapeData, newData)
          )
        }}
        unit={uiUnit(EnUnit.MilliMeter)}
      />
      <AlloyAutocomplete
        setAlloy={alloy => {
          const newData = { ...shapeData, alloy }
          materialStore.setShapeData(
            plainToInstance(RoundBarShapeData, newData)
          )
        }}
        alloy={shapeData.alloy}
      />
      <MyInput
        label={t.LinearMass}
        value={shapeData.linearMass}
        type="number"
        onChange={e => {
          const newData = { ...shapeData, linearMass: Number(e.target.value) }
          materialStore.setShapeData(
            plainToInstance(RoundBarShapeData, newData)
          )
        }}
        unit="кг/м"
      />
      <MyInput
        label={t.Density}
        value={shapeData.density}
        type="number"
        onChange={e => {
          const newData = { ...shapeData, density: Number(e.target.value) }
          materialStore.setShapeData(
            plainToInstance(RoundBarShapeData, newData)
          )
        }}
        unit="кг/м3"
      />
      <ToggleButtonGroup
        sx={{ pt: 1 }}
        value={shapeData.calibrated ? 'true' : 'false'}
        onChange={(e, v) => {
          const newData = { ...shapeData, calibrated: v === 'true' }
          materialStore.setShapeData(
            plainToInstance(RoundBarShapeData, newData)
          )
        }}
      >
        <Button value={'false'}>{t.NotCalibrated}</Button>
        <Button value={'true'}>{t.Calibrated}</Button>
      </ToggleButtonGroup>
    </InputStack>
  )
}

export const SquareMaterialInput = withShapeData(SquareMaterialInputBase)
export const ListMaterialInput = withShapeData(ListMaterialInputBase)
export const PipeMaterialInput = withShapeData(PipeMaterialInputBase)
export const RoundBarInput = withShapeData(RoundBarInputBase)
