import { Autocomplete } from '@mui/material'
import { UiWriteoffReason, formatWriteoffReason } from 'shared'
import { MetalFlowSys } from 'src/lib/routes'
import { Input } from 'src/shortcuts'
import { SmallInputForm } from '../shared'
import { MutationWithStatus } from '../shared/basic'
import { ShapeDependedTabs } from '../shared/shape-depended-tabs'
import { t } from '../text'
import { useWriteOffStore } from './state'
import { handleSubmit } from './submit'
import { WriteoffThroughDetail } from './through-detail'
import { WriteOffThroughMaterial } from './through-material'

export function AddWriteOff() {
  const state = useWriteOffStore()
  const { reason, setReason } = state
  return (
    <SmallInputForm header={t.WriteOffAdd} goBackUrl={MetalFlowSys.materials}>
      {<MainForm />}
      <Autocomplete
        options={Object.entries(UiWriteoffReason).map(([k, v]) => ({
          label: v,
          value: k
        }))}
        value={{
          label: formatWriteoffReason(reason),
          value: reason?.toString() || '0'
        }}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        getOptionLabel={option => option.label}
        onChange={(_, newValue) => setReason(Number(newValue?.value || 0))}
        renderInput={params => <Input {...params} label={t.WriteOffReason} />}
      />
      <MutationWithStatus
        mutation={() =>
          handleSubmit(state).then(res => {
            state.reset()
            return res
          })
        }
      />
    </SmallInputForm>
  )
}

function MainForm() {
  return (
    <ShapeDependedTabs
      data={{
        [t.WriteoffThroughDetail]: <WriteoffThroughDetail />,
        [t.WriteoffThroughMaterial]: <WriteOffThroughMaterial />
      }}
      handleChange={val => {}}
    />
  )
}
