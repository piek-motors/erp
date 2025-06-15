/** @jsxImportSource @emotion/react */
import { Autocomplete, Button, Grid, Stack, ToggleButtonGroup } from '@mui/joy'
import { PageTitle } from 'components'
import {
  EnWriteoffType,
  uiWriteoffReason,
  UiWriteoffReason
} from 'domain-model'
import { observer } from 'lib/deps'
import { Label, SendMutation } from 'lib/shortcuts'
import React from 'react'
import { t } from '../text'
import {
  WriteoffThroughDetail,
  WriteoffThroughDetailSidePanel
} from './through-detail/ui'
import {
  WriteOffThroughMaterial,
  WriteOffThroughMaterialSidePanel
} from './through-material/ui'
import { writeoffStore } from './writeoff.store'

export const WriteoffCreatePage = observer(() => {
  return (
    <Grid container spacing={0} p={0}>
      <Grid xs={12} md={4} p={0} px={2}>
        <Stack gap={2}>
          <PageTitle title={t.WriteOffAdd} hideIcon />
          <WriteoffInputStrategySelect />
          <WriteoffReasonSelect />
          {React.createElement(
            writeoffTypeToComponent[writeoffStore.type].left
          )}
          <SendMutation
            disabled={!writeoffStore.validate()}
            onClick={async () => {
              return await writeoffStore.insert()
            }}
          />
        </Stack>
      </Grid>
      <Grid xs={12} md={8} sx={{ overflow: 'hidden', p: 0, px: 2 }}>
        {React.createElement(writeoffTypeToComponent[writeoffStore.type].right)}
      </Grid>
    </Grid>
  )
})

const writeoffTypeToComponent = {
  [EnWriteoffType.ThroughDetail]: {
    left: WriteoffThroughDetail,
    right: WriteoffThroughDetailSidePanel
  },
  [EnWriteoffType.DirectUnit]: {
    left: WriteOffThroughMaterial,
    right: WriteOffThroughMaterialSidePanel
  }
}

const WriteoffInputStrategySelect = observer(() => {
  const varians = [
    {
      label: 'Через деталь',
      value: EnWriteoffType.ThroughDetail
    },
    {
      label: 'Через материал',
      value: EnWriteoffType.DirectUnit
    }
  ]

  return (
    <Stack gap={1}>
      <Label>Тип списания: </Label>
      <ToggleButtonGroup
        variant="outlined"
        color="primary"
        onChange={(e, v) => {
          writeoffStore.setType(v as unknown as EnWriteoffType)
        }}
      >
        {varians.map(v => (
          <Button
            key={v.value}
            value={v.value}
            variant={v.value === writeoffStore.type ? 'solid' : 'plain'}
          >
            {v.label}
          </Button>
        ))}
      </ToggleButtonGroup>
    </Stack>
  )
})

const WriteoffReasonSelect = observer(() => {
  return (
    <Stack gap={1}>
      <Label label="Причина списания" />
      <Autocomplete
        options={Object.entries(UiWriteoffReason).map(([k, v]) => ({
          label: v,
          value: k
        }))}
        value={{
          label: uiWriteoffReason(writeoffStore.reason),
          value: writeoffStore.reason?.toString() || '0'
        }}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        getOptionLabel={option => option.label}
        onChange={(_, newValue) =>
          writeoffStore.setReason(Number(newValue?.value || 0))
        }
      />
    </Stack>
  )
})
