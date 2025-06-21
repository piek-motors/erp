/** @jsxImportSource @emotion/react */
import { Autocomplete, Button, Stack, ToggleButtonGroup } from '@mui/joy'
import { PageTitle } from 'components'
import {
  EnWriteoffType,
  uiWriteoffReason,
  UiWriteoffReason
} from 'domain-model'
import { observer } from 'lib/deps'
import { Label, P, SendMutation } from 'lib/index'
import React from 'react'
import { t } from '../text'
import { WriteoffThroughDetail } from './through_detail/ui'
import { WriteOffThroughMaterial } from './through_material/ui'
import { writeoffStore } from './writeoff.store'

export const WriteoffCreatePage = observer(() => {
  const creationForrbidden = writeoffStore.validate() !== undefined
  const error = () => {
    if (creationForrbidden) {
      return (
        <P color="danger" level="body-sm">
          {writeoffStore.validate()?.message}
        </P>
      )
    }
  }
  return (
    <Stack p={0} px={2}>
      <Stack gap={2} py={2}>
        <PageTitle subTitle={t.WriteOffAdd} hideIcon />
        <WriteoffInputStrategySelect />
        {React.createElement(writeoffTypeToComponent[writeoffStore.type].left)}
        <WriteoffReasonSelect />
        <SendMutation
          disabled={creationForrbidden}
          onClick={async () => {
            return await writeoffStore.insert()
          }}
        />
        {error()}
      </Stack>
    </Stack>
  )
})

const writeoffTypeToComponent = {
  [EnWriteoffType.ThroughDetail]: {
    left: WriteoffThroughDetail
  },
  [EnWriteoffType.DirectUnit]: {
    left: WriteOffThroughMaterial
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
