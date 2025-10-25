import { NumberInput } from 'components/inputs/number_input'
import { InputStack, observer } from 'lib/index'
import { EnUnit, uiUnit } from 'models'
import { api } from '../api'

export const SquareMaterialInputBase = observer(() => (
  <InputStack>
    <NumberInput
      label="Ширина"
      value={api.s.square.length}
      onChange={v => {
        api.s.square.setLength(v)
      }}
      unit={uiUnit(EnUnit.MilliMeter)}
    />
  </InputStack>
))
