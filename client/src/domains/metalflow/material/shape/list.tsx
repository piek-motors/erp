import { t } from 'domains/metalflow/text'
import { Inp, InputStack, observer } from 'lib/index'
import { EnUnit, uiUnit } from 'models'
import { api } from '../api'

export const ListMaterialInputBase = observer(() => {
  return (
    <InputStack>
      <Inp
        label={t.Thickness}
        value={api.s.list.thickness}
        onChange={v => {
          api.s.list.setThickness(v)
        }}
        unit={uiUnit(EnUnit.MilliMeter)}
      />
    </InputStack>
  )
})
