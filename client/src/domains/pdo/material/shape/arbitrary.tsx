import { Inp, InputStack, observer } from 'lib/index'
import { MaterialState } from '../state'

export const ArbitraryInputBase = observer(({ m }: { m: MaterialState }) => (
  <InputStack>
    <Inp
      label={'Название'}
      value={m.arbitrary.name}
      onChange={v => {
        m.arbitrary.setName(v)
      }}
    />
  </InputStack>
))
