import { Inp, InputStack, observer } from 'lib/index'
import { EnUnit, uiUnit } from 'models'
import { material } from '../material.store'

export const SquareMaterialInputBase = observer(() => {
  return (
    <InputStack>
      <Inp
        label={'Ширина'}
        value={material.square.length}
        onChange={v => {
          material.square.setLength(v)
        }}
        unit={uiUnit(EnUnit.MilliMeter)}
      />
    </InputStack>
  )
})
