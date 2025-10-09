import { t } from 'domains/pdo/text'
import {
  Button,
  Inp,
  InputStack,
  Label,
  observer,
  Stack,
  ToggleButtonGroup
} from 'lib/index'
import { EnUnit, uiUnit } from 'models'
import { api } from '../api'

export const RoundBarInputBase = observer(() => {
  return (
    <InputStack>
      <Inp
        label={t.Diameter}
        value={api.s.round.diameter}
        onChange={v => {
          api.s.round.setDiameter(v)
        }}
        unit={uiUnit(EnUnit.MilliMeter)}
      />
      <MaterialCalibration
        value={api.s.round.calibrated}
        setValue={v => {
          api.s.round.setCalibrated(v)
        }}
      />
    </InputStack>
  )
})

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
