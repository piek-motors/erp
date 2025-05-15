import { Button, ToggleButtonGroup } from '@mui/joy'
import {
  EnUnit,
  ListShapeData,
  PipeShapeData,
  RoundBarShapeData,
  SquareBarShapeData,
  uiUnit
} from 'domain-model'
import { InputStack, MyInput } from '../../../shortcuts'
import { AlloyAutocomplete } from '../shared/alloy-autocomplete'
import { useMaterialStore } from '../stores'
import { t } from '../text'

export function SquareMaterialInput() {
  const store = useMaterialStore()
  const d = store.shapeData as SquareBarShapeData
  return (
    <InputStack>
      <MyInput
        label={t.Width}
        value={d.length}
        onChange={e => {
          d.length = Number(e.target.value)
          store.setShapeData(d)
        }}
      />
      <AlloyAutocomplete
        setAlloy={alloy => {
          d.alloy = alloy
          store.setShapeData(d)
        }}
        alloy={d.alloy}
      />
    </InputStack>
  )
}

export function ListMaterialInput() {
  const store = useMaterialStore()
  const d = store.shapeData as ListShapeData
  return (
    <InputStack>
      <MyInput
        label={t.Thickness}
        value={d.thickness}
        onChange={e => {
          d.thickness = Number(e.target.value)
          store.setShapeData(d)
        }}
      />
    </InputStack>
  )
}

export function PipeMaterialInput() {
  const store = useMaterialStore()
  const d = store.shapeData as PipeShapeData
  return (
    <InputStack>
      <MyInput
        label={t.Diameter}
        type="number"
        value={d.diameter}
        onChange={e => {
          d.diameter = Number(e.target.value)
          store.setShapeData(d)
        }}
      />
      <AlloyAutocomplete
        setAlloy={alloy => {
          d.alloy = alloy
          store.setShapeData(d)
        }}
        alloy={d.alloy}
      />
      <MyInput
        label={t.Thickness}
        value={d.thickness}
        type="number"
        onChange={e => {
          d.thickness = Number(e.target.value)
          store.setShapeData(d)
        }}
      />
    </InputStack>
  )
}

export function RoundBarInput() {
  const store = useMaterialStore()
  const circle = store.shapeData as RoundBarShapeData
  return (
    <InputStack>
      <MyInput
        label={t.Diameter}
        type="number"
        value={circle.diameter}
        onChange={e => {
          circle.diameter = Number(e.target.value)
          store.setShapeData(circle)
        }}
        unit={uiUnit(EnUnit.MilliMeter)}
      />
      <AlloyAutocomplete
        setAlloy={alloy => {
          circle.alloy = alloy
          store.setShapeData(circle)
        }}
        alloy={circle.alloy}
      />
      <MyInput
        label={t.LinearMass}
        value={circle.linearMass}
        type="number"
        onChange={e => {
          circle.linearMass = Number(e.target.value)
          store.setShapeData(circle)
        }}
        unit="кг/м"
      />
      <MyInput
        label={t.Density}
        value={circle.density}
        type="number"
        onChange={e => {
          circle.density = Number(e.target.value)
          store.setShapeData(circle)
        }}
        unit="кг/м3"
      />
      <ToggleButtonGroup
        sx={{ pt: 1 }}
        value={circle.calibrated ? 'true' : 'false'}
        onChange={(e, v) => {
          circle.calibrated = v == 'true'
          store.setShapeData(circle)
        }}
      >
        <Button value={'false'}>{t.NotCalibrated}</Button>
        <Button value={'true'}>{t.Calibrated}</Button>
      </ToggleButtonGroup>
    </InputStack>
  )
}
