import { NumberInput } from '@/components/inputs/number_input'
import { AlloyAutocomplete, UnitSelect } from '@/domains/pdo/shared/basic'
import { Box, Label, MultilineInput, observer, Stack } from '@/lib/index'
import type { MaterialSt } from './state'

export const MaterialForm = observer(
  ({ m, disabled }: { m: MaterialSt; disabled?: boolean }) => (
    <Stack gap={0.5}>
      <MultilineInput
        label="Название"
        value={m.label}
        onChange={e => {
          m.set_label(e.target.value)
        }}
        width={'fit-content'}
        disabled={disabled}
      />
      <AlloyAutocomplete
        disabled={disabled}
        on_change={alloy => {
          m.set_alloy(alloy)
        }}
        value={m.alloy}
      />
      <UnitSelect value={m.unit ?? undefined} onChange={v => m.set_unit(v)} />
      <Box>
        <Stack>
          <Label>Сигнал о дефиците за N дней</Label>
          <Label xs color="warning">
            Сколько дней в прошлом требовалось чтобы восполнить запас
          </Label>
        </Stack>
        <NumberInput
          value={m.shortage_prediction_horizon_days}
          onChange={v => {
            m.set_shortage_orediction_horizon_days(v)
          }}
        />
      </Box>
    </Stack>
  ),
)
