import { EnUnit, uiUnit } from 'domain-model'
import { Inp, InputStack, observer } from 'lib/index'
import { material } from '../material.state'

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
