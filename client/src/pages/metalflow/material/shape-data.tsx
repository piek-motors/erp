import { Button, Stack, ToggleButtonGroup } from '@mui/joy'
import { PipeShapeData } from 'shared'
import {
  CircleShapeData,
  ListShapeData,
  SquareShapeData
} from 'shared/shape-data'
import { MyInput } from '../../../shortcuts'
import { AlloyAutocomplete } from '../shared/alloy-autocomplete'
import { t } from '../text'
import { useMaterialStore } from './state'

export function SquareMaterialInput() {
  const [shapeData, setShapeData] = useMaterialStore(state => [
    state.shapeData,
    state.setShapeData
  ])
  const d = shapeData as SquareShapeData
  return (
    <Stack>
      <MyInput
        label={t.Width}
        value={d.length}
        onChange={e => {
          d.length = Number(e.target.value)
          setShapeData(d)
        }}
      />
      <AlloyAutocomplete
        setAlloy={alloy => {
          d.alloy = alloy
          setShapeData(d)
        }}
        alloy={d.alloy}
      />
    </Stack>
  )
}

export function ListMaterialInput() {
  const [shapeData, setShapeData] = useMaterialStore(state => [
    state.shapeData,
    state.setShapeData
  ])

  const d = shapeData as ListShapeData
  return (
    <Stack>
      <MyInput
        label={'G'}
        value={d.g}
        onChange={e => {
          d.g = Number(e.target.value)
          setShapeData(d)
        }}
      />
    </Stack>
  )
}

export function PipeMaterialInput() {
  const [shapeData, setShapeData] = useMaterialStore(state => [
    state.shapeData,
    state.setShapeData
  ])

  const d = shapeData as PipeShapeData
  return (
    <Stack>
      <MyInput
        label={t.Diameter}
        type="number"
        value={d.diameter}
        onChange={e => {
          d.diameter = Number(e.target.value)
          setShapeData(d)
        }}
      />
      <AlloyAutocomplete
        setAlloy={alloy => {
          d.alloy = alloy
          setShapeData(d)
        }}
        alloy={d.alloy}
      />
      <MyInput
        label={t.Thickness}
        value={d.thickness}
        type="number"
        onChange={e => {
          d.thickness = Number(e.target.value)
          setShapeData(d)
        }}
      />
    </Stack>
  )
}

export function CircleMaterialInput() {
  const [shapeData, setShapeData] = useMaterialStore(state => [
    state.shapeData,
    state.setShapeData
  ])

  if (!shapeData) return <>Shape data is not specified</>
  const circle = shapeData as CircleShapeData

  return (
    <Stack>
      <MyInput
        label={t.Diameter}
        type="number"
        value={circle.diameter}
        onChange={e => {
          circle.diameter = Number(e.target.value)
          setShapeData(circle)
        }}
      />
      <AlloyAutocomplete
        setAlloy={alloy => {
          circle.alloy = alloy
          setShapeData(circle)
        }}
        alloy={circle.alloy}
      />
      <MyInput
        label={t.LinearMass}
        value={circle.linearMass}
        type="number"
        onChange={e => {
          circle.linearMass = Number(e.target.value)
          setShapeData(circle)
        }}
      />
      <MyInput
        label={t.Density}
        value={circle.density}
        type="number"
        onChange={e => {
          circle.density = Number(e.target.value)
          setShapeData(circle)
        }}
      />
      <ToggleButtonGroup
        // exclusive
        onChange={(e, v) => {
          // circle.calibrated = v
          // setShapeData(circle)
          console.log(v)
        }}
      >
        <Button>{t.NotCalibrated}</Button>
        <Button>{t.Calibrated}</Button>
      </ToggleButtonGroup>
    </Stack>
  )
}
