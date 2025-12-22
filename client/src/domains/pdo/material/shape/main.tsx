import { NumberInput } from 'components/inputs/number_input'
import {
  Button,
  Inp,
  InputStack,
  Label,
  observer,
  Stack,
  ToggleButtonGroup
} from 'lib/index'
import { MaterialShape, uiUnit, Unit } from 'models'
import { ReactNode } from 'react'
import { MaterialState } from '../state'

export interface ShapeProps {
  m: MaterialState
  disabled?: boolean
}

export const MaterialSpecificInput = observer(({ m, disabled }: ShapeProps) => {
  let res: ReactNode
  switch (m.shape) {
    case MaterialShape.Arbitrary:
      res = (
        <Inp
          label={'Название'}
          value={m.arbitrary.name}
          sx={{ minWidth: 400 }}
          onChange={v => {
            m.arbitrary.setName(v)
          }}
        />
      )
      break
    case MaterialShape.HexagonBar:
      res = (
        <NumberInput
          disabled={disabled}
          label={'Диаметр'}
          unit={uiUnit(Unit.MilliMeter)}
          value={m.hexagon.diameter}
          onChange={v => {
            m.hexagon.setDiameter(v)
          }}
        />
      )
      break
    case MaterialShape.List:
      res = (
        <NumberInput
          disabled={disabled}
          label={'Толщина'}
          value={m.list.thickness}
          onChange={v => {
            m.list.setThickness(v)
          }}
          unit={uiUnit(Unit.MilliMeter)}
        />
      )
      break
    case MaterialShape.Pipe:
      res = (
        <>
          <NumberInput
            disabled={disabled}
            label={'Диаметр'}
            value={m.pipe.diameter}
            onChange={v => {
              m.pipe.setDiameter(v)
            }}
            unit={uiUnit(Unit.MilliMeter)}
          />
          <NumberInput
            disabled={disabled}
            label={'Толщина стенки'}
            value={m.pipe.thickness}
            onChange={v => {
              m.pipe.setThickness(v)
            }}
            unit={uiUnit(Unit.MilliMeter)}
          />
        </>
      )
      break
    case MaterialShape.RoundBar:
      res = (
        <>
          <NumberInput
            disabled={disabled}
            label={'Диаметр'}
            value={m.round.diameter}
            onChange={v => {
              m.round.setDiameter(v)
            }}
            unit={uiUnit(Unit.MilliMeter)}
          />
          <MaterialCalibration
            disabled={disabled}
            value={m.round.calibrated}
            setValue={v => {
              m.round.setCalibrated(v)
            }}
          />
        </>
      )
      break
    case MaterialShape.SquareBar:
      res = (
        <NumberInput
          disabled={disabled}
          label="Ширина"
          value={m.square.length}
          onChange={v => {
            m.square.setLength(v)
          }}
          unit={uiUnit(Unit.MilliMeter)}
        />
      )
      break
  }

  return <InputStack>{res}</InputStack>
})

function MaterialCalibration(props: {
  value: boolean
  setValue: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <Stack>
      <Label>Калиброванный</Label>
      <ToggleButtonGroup
        disabled={props.disabled}
        variant="outlined"
        color="primary"
        value={props.value ? '1' : '0'}
        onChange={(e, v) => {
          props.setValue(v === '1')
        }}
      >
        <Button value={'1'}>Да</Button>
        <Button value={'0'}>Нет</Button>
      </ToggleButtonGroup>
    </Stack>
  )
}
