import { EnUnit, uiUnit } from 'domain-model'
import { t } from 'domains/metalflow/text'
import {
  Button,
  Inp,
  InputStack,
  observer,
  P,
  Row,
  ToggleButtonGroup
} from 'lib/index'
import { material } from '../material.store'

export const RoundBarInputBase = observer(() => {
  return (
    <InputStack>
      <Inp
        label={t.Diameter}
        value={material.round.diameter}
        onChange={v => {
          material.round.setDiameter(v)
        }}
        unit={uiUnit(EnUnit.MilliMeter)}
      />
      <MaterialCalibration
        value={material.round.calibrated}
        setValue={v => {
          material.round.setCalibrated(v)
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
    <Row gap={2}>
      <P>(К) - Калиброванный</P>
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
    </Row>
  )
}
