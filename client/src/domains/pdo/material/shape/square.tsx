import { NumberInput } from 'components/inputs/number_input'
import { InputStack, observer } from 'lib/index'
import { Unit, uiUnit } from 'models'
import { MaterialState } from '../state'

export const SquareMaterialInputBase = observer(
  ({ m }: { m: MaterialState }) => (
    <InputStack>
      <NumberInput
        label="Ширина"
        value={m.square.length}
        onChange={v => {
          m.square.setLength(v)
        }}
        unit={uiUnit(Unit.MilliMeter)}
      />
    </InputStack>
  )
)
