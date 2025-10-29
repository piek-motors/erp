import { NumberInput } from 'components/inputs/number_input'
import {
  Button,
  InputStack,
  Label,
  observer,
  Stack,
  ToggleButtonGroup
} from 'lib/index'
import { uiUnit, Unit } from 'models'
import { MaterialState } from '../state'

export const RoundBarInputBase = observer(({ m }: { m: MaterialState }) => (
  <InputStack>
    <NumberInput
      label={'Диаметр'}
      value={m.round.diameter}
      onChange={v => {
        m.round.setDiameter(v)
      }}
      unit={uiUnit(Unit.MilliMeter)}
    />
    <MaterialCalibration
      value={m.round.calibrated}
      setValue={v => {
        m.round.setCalibrated(v)
      }}
    />
  </InputStack>
))

function MaterialCalibration(props: {
  value: boolean
  setValue: (v: boolean) => void
}) {
  return (
    <Stack>
      <Label>Калиброванный</Label>
      <ToggleButtonGroup
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
