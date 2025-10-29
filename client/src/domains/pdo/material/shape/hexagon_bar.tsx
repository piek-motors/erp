import { NumberInput } from 'components/inputs/number_input'
import { observer } from 'lib/deps'
import { InputStack } from 'lib/index'
import { Unit, uiUnit } from 'models'
import { MaterialState } from '../state'

export const HexagonBarMaterialInputBase = observer(
  ({ m }: { m: MaterialState }) => (
    <InputStack>
      <NumberInput
        label={'Диаметр'}
        unit={uiUnit(Unit.MilliMeter)}
        value={m.hexagon.diameter}
        onChange={v => {
          m.hexagon.setDiameter(v)
        }}
      />
    </InputStack>
  )
)
