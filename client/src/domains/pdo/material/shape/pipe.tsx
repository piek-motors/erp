import { NumberInput } from 'components/inputs/number_input'
import { InputStack, observer } from 'lib/index'
import { Unit, uiUnit } from 'models'
import { MaterialState } from '../state'

export const PipeMaterialInputBase = observer(({ m }: { m: MaterialState }) => (
  <InputStack>
    <NumberInput
      label={'Диаметр'}
      value={m.pipe.diameter}
      onChange={v => {
        m.pipe.setDiameter(v)
      }}
      unit={uiUnit(Unit.MilliMeter)}
    />
    <NumberInput
      label={'Толщина стенки'}
      value={m.pipe.thickness}
      onChange={v => {
        m.pipe.setThickness(v)
      }}
      unit={uiUnit(Unit.MilliMeter)}
    />
  </InputStack>
))
