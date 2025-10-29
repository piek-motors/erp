import { NumberInput } from 'components/inputs/number_input'
import { InputStack, observer } from 'lib/index'
import { Unit, uiUnit } from 'models'
import { MaterialState } from '../state'

export const ListMaterialInputBase = observer(({ m }: { m: MaterialState }) => (
  <InputStack>
    <NumberInput
      label={'Толщина'}
      value={m.list.thickness}
      onChange={v => {
        m.list.setThickness(v)
      }}
      unit={uiUnit(Unit.MilliMeter)}
    />
  </InputStack>
))
