import { Inp, InputStack, observer } from 'lib/index'
import { EnUnit, uiUnit } from 'models'
import { api } from '../api'

export const ListMaterialInputBase = observer(() => {
  return (
    <InputStack>
      <Inp
        label={'Толщина'}
        value={api.s.list.thickness}
        onChange={v => {
          api.s.list.setThickness(v)
        }}
        unit={uiUnit(EnUnit.MilliMeter)}
      />
    </InputStack>
  )
})
