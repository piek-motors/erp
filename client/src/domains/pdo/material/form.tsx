import { MaterialShape, UiMaterialShape } from 'models'
import { NumberInput } from '@/components/inputs/number_input'
import { Tabs } from '@/components/tabs'
import {
  AlloyAutocomplete,
  MaterialUnitSelect,
} from '@/domains/pdo/shared/basic'
import { Box, Label, observer, Stack } from '@/lib/index'
import { MaterialSpecificInput } from './shape/main'
import type { MaterialSt } from './state'

export const MaterialForm = observer(
  ({
    showTabs,
    m,
    disabled,
  }: {
    showTabs?: boolean
    m: MaterialSt
    disabled?: boolean
  }) => (
    <Stack gap={0.5}>
      {showTabs ? (
        <Tabs
          variant="plain"
          sx={{ width: 'fit-content' }}
          p={0}
          tabs={Object.values(MaterialShape)
            .filter(e => typeof e !== 'string')
            .map(value => ({
              label: UiMaterialShape[value],
              value,
              component: <MaterialSpecificInput m={m} disabled={disabled} />,
            }))}
          handleChange={value => {
            m.set_shape(value as unknown as MaterialShape)
          }}
        />
      ) : (
        <MaterialSpecificInput m={m} disabled={disabled} />
      )}
      <MaterialUnitSelect value={m.unit} onChange={v => m.set_unit(v)} />
      <AlloyAutocomplete
        on_change={alloy => {
          m.set_alloy(alloy)
        }}
        value={m.alloy}
      />
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
