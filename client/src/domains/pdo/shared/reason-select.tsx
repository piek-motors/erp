import { Button, Stack, ToggleButtonGroup } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import type { SupplyReason, WriteoffReason } from 'shared'
import { Label } from '@/lib/index'

type Reason = SupplyReason | WriteoffReason

export interface ReasonSelectProps<T extends Reason> {
  reasons: T[]
  reason: T | null
  setReason: (reason: T) => void
  getReasonLabel: (reason: T) => string
}

export const ReasonSelect = observer(
  <T extends Reason>(props: ReasonSelectProps<T>) => {
    const { getReasonLabel, reason, reasons, setReason } = props
    return (
      <Stack py={0.5}>
        <Label label={'Основание'} />
        <ToggleButtonGroup
          size="sm"
          color="primary"
          variant="soft"
          value={reason?.toString()}
          onChange={(_, value) => setReason(Number(value) as T)}
          sx={{ flexWrap: 'wrap', rowGap: 0.5 }}
        >
          {reasons.map(reason => (
            <Button key={reason} value={reason.toString()}>
              {getReasonLabel(reason)}
            </Button>
          ))}
        </ToggleButtonGroup>
      </Stack>
    )
  },
)
