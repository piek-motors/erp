/** @jsxImportSource @emotion/react */
import { Autocomplete, Stack } from '@mui/joy'
import {
  EnWriteoffReason,
  uiWriteoffReason,
  UiWriteoffReason
} from 'domain-model'
import { observer } from 'lib/deps'
import { Label } from 'lib/index'

export const WriteoffReasonSelect = observer(
  (props: {
    reason: EnWriteoffReason
    setReason: (reason: EnWriteoffReason) => void
  }) => {
    return (
      <Stack gap={1}>
        <Label label="Причина списания" />
        <Autocomplete
          options={Object.entries(UiWriteoffReason).map(([k, v]) => ({
            label: v,
            value: k
          }))}
          value={{
            label: uiWriteoffReason(props.reason),
            value: props.reason?.toString() || '0'
          }}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          getOptionLabel={option => option.label}
          onChange={(_, newValue) =>
            props.setReason(Number(newValue?.value || 0))
          }
        />
      </Stack>
    )
  }
)
