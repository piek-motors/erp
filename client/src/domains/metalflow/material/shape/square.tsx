import { Inp, InputStack, observer } from 'lib/index'
import { EnUnit, uiUnit } from 'models'
import { api } from '../api'

export const SquareMaterialInputBase = observer(() => {
  return (
    <InputStack>
      <Inp
        label={'Ширина'}
        value={api.s.square.length}
        onChange={v => {
          api.s.square.setLength(v)
        }}
        unit={uiUnit(EnUnit.MilliMeter)}
      />
    </InputStack>
  )
})
