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
import { Inp, InputStack, P, Row } from 'lib/shortcuts'
import { Observer } from 'mobx-react-lite'
import { AlloyAutocomplete } from '../shared/basic'
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
      <Inp
        label={t.Length}
        value={shapeData.length}
        onChange={v => {
          const newData: SquareBarShapeData = {
            ...shapeData,
            length: Number(v)
          }
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
      <Inp
        label={t.Thickness}
        value={shapeData.thickness}
        onChange={v => {
          const newData = { ...shapeData, thickness: Number(v) }
          materialStore.setShapeData(plainToInstance(ListShapeData, newData))
        }}
      />
    </InputStack>
  )
}

function PipeMaterialInputBase({ shapeData }: { shapeData: PipeShapeData }) {
  return (
    <InputStack>
      <Inp
        label={t.Diameter}
        type="number"
        value={shapeData.diameter}
        onChange={v => {
          const newData = { ...shapeData, diameter: Number(v) }
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
      <Inp
        label={t.Thickness}
        value={shapeData.thickness}
        type="number"
        onChange={v => {
          const newData = { ...shapeData, thickness: Number(v) }
          materialStore.setShapeData(plainToInstance(PipeShapeData, newData))
        }}
      />
    </InputStack>
  )
}

function RoundBarInputBase({ shapeData }: { shapeData: RoundBarShapeData }) {
  return (
    <InputStack>
      <Inp
        label={t.Diameter}
        type="number"
        value={shapeData.diameter}
        onChange={v => {
          const newData = { ...shapeData, diameter: Number(v) }
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
      <Inp
        label={t.LinearMass}
        value={shapeData.linearMass}
        type="number"
        onChange={v => {
          const newData = { ...shapeData, linearMass: Number(v) }
          materialStore.setShapeData(
            plainToInstance(RoundBarShapeData, newData)
          )
        }}
        unit="кг/м"
      />
      <Inp
        label={t.Density}
        value={shapeData.density}
        type="number"
        onChange={v => {
          const newData = { ...shapeData, density: Number(v) }
          materialStore.setShapeData(
            plainToInstance(RoundBarShapeData, newData)
          )
        }}
        unit="кг/м3"
      />
      <MaterialCalibration
        value={shapeData.calibrated}
        setValue={v => {
          const newData = { ...shapeData, calibrated: v }
          materialStore.setShapeData(
            plainToInstance(RoundBarShapeData, newData)
          )
        }}
      />
    </InputStack>
  )
}

function MaterialCalibration(props: {
  value: boolean
  setValue: (v: boolean) => void
}) {
  return (
    <Row gap={2}>
      <P>(К) - Калиброванный</P>
      <ToggleButtonGroup
        variant="plain"
        color="primary"
        value={props.value ? '1' : '0'}
        onChange={(e, v) => {
          props.setValue(v === '1')
        }}
      >
        <Button value={'1'}>Да</Button>
        <Button value={'0'}>Нет</Button>
      </ToggleButtonGroup>
    </Row>
  )
}

export const SquareMaterialInput = withShapeData(SquareMaterialInputBase)
export const ListMaterialInput = withShapeData(ListMaterialInputBase)
export const PipeMaterialInput = withShapeData(PipeMaterialInputBase)
export const RoundBarInput = withShapeData(RoundBarInputBase)
