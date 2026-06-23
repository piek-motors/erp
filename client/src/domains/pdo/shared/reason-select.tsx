import { Button, Stack, ToggleButtonGroup } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import {
  type SupplyReason,
  uiSupplyReason,
  uiWriteoffReason,
  type WriteoffReason,
} from 'shared'
import { Label } from '@/lib/index'

interface Props<T> {
  reasons: T[]
  reason: T | null
  setReason: (reason: T) => void
}
export const WriteoffReasonSelect = observer((props: Props<WriteoffReason>) => {
  useEffect(() => {
    if (props.reason == null) props.setReason(props.reasons[0])
  }, [])

  const effective = props.reason ?? props.reasons[0]
  return (
    <ReasonSelect
      label={'Основание'}
      options={props.reasons.map(r => ({
        label: uiWriteoffReason(r),
        value: r.toString(),
      }))}
      value={{
        label: uiWriteoffReason(effective),
        value: effective.toString(),
      }}
      onChange={newValue => props.setReason(Number(newValue))}
    />
  )
})

export const SupplyReasonSelect = observer((props: Props<SupplyReason>) => {
  useEffect(() => {
    if (props.reason == null) props.setReason(props.reasons[0])
  }, [])

  const effective = props.reason ?? props.reasons[0]
  return (
    <ReasonSelect
      label={'Основание'}
      options={props.reasons.map(r => ({
        label: uiSupplyReason(r),
        value: r.toString(),
      }))}
      value={{ label: uiSupplyReason(effective), value: effective.toString() }}
      onChange={newValue => props.setReason(Number(newValue))}
    />
  )
})

interface ReasonOption {
  label: string
  value: string
}

export interface ReasonSelectProps {
  label: string
  options: ReasonOption[]
  value: ReasonOption
  onChange: (value: string | null) => void
}

const ReasonSelect = observer((props: ReasonSelectProps) => (
  <Stack py={0.5}>
    <Label label={props.label} />
    <ToggleButtonGroup
      size="sm"
      color="primary"
      variant="soft"
      value={props.value.value}
      onChange={(_, v) => props.onChange(v)}
      sx={{ flexWrap: 'wrap', rowGap: 0.5 }}
    >
      {props.options.map(option => (
        <Button key={option.value} value={option.value}>
          {option.label}
        </Button>
      ))}
    </ToggleButtonGroup>
  </Stack>
))
