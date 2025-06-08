/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { UilTrash } from '@iconscout/react-unicons'
import { Autocomplete, Box, IconButton, Sheet, Stack } from '@mui/joy'
import { PageTitle } from 'components'
import { Table } from 'components/table.impl'
import { TabConfig, Tabs } from 'components/tabs'
import {
  Detail,
  EnWriteoffType,
  uiWriteoffReason,
  UiWriteoffReason,
  WriteoffTroughDetail
} from 'domain-model'
import { open, routeMap } from 'lib/routes'
import { AddResourceButton, Inp, SendMutation } from 'lib/shortcuts'
import { useEffect, useState } from 'react'
import { useNotifier } from 'store/notifier.store'
import {
  useDeleteWriteOffMutation,
  useGetWrietOffsQuery
} from 'types/graphql-shema'
import { QtyInputWithUnit, SmallInputForm } from '../shared'
import { DetailSelect } from '../shared/basic'
import { MaterialSelect } from '../shared/material-select'
import { t } from '../text'
import { getColumns } from './columns.decl'
import { useWriteOffStore } from './state'
import { handleSubmit } from './submit'

const tabs: TabConfig = [
  {
    value: EnWriteoffType.ThroughDetail,
    label: t.WriteoffThroughDetail,
    component: <WriteoffThroughDetail />
  },
  {
    value: EnWriteoffType.DirectUnit,
    label: t.WriteoffThroughMaterial,
    component: <WriteOffThroughMaterial />
  }
]

export function AddWriteOff() {
  const state = useWriteOffStore()
  const { reason, setReason } = state
  return (
    <SmallInputForm header={t.WriteOffAdd}>
      <Tabs tabs={tabs} />
      <Autocomplete
        options={Object.entries(UiWriteoffReason).map(([k, v]) => ({
          label: v,
          value: k
        }))}
        value={{
          label: uiWriteoffReason(reason),
          value: reason?.toString() || '0'
        }}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        getOptionLabel={option => option.label}
        onChange={(_, newValue) => setReason(Number(newValue?.value || 0))}
      />
      <SendMutation
        onClick={() =>
          handleSubmit(state).then(res => {
            state.reset()
            return res
          })
        }
      />
    </SmallInputForm>
  )
}

export function DeleteWrireOff(props: {
  supplyId: number
  refetch: () => void
}) {
  const notifier = useNotifier()
  const [mut, { data }] = useDeleteWriteOffMutation({
    variables: { id: props.supplyId }
  })

  useEffect(() => {
    if (data) {
      notifier.notify('info', 'Событие поставки удалено')
    }
  }, [data])

  return (
    <Stack direction="row-reverse" gap={1} className="delete-btn">
      <IconButton
        sx={{
          opacity: 0.8
        }}
        onClick={async () => {
          await mut()
          props.refetch()
        }}
      >
        <UilTrash width={16} height={16} />
      </IconButton>
    </Stack>
  )
}

export function WriteoffThroughDetail() {
  const [detail, setDetail] = useState<Detail>()
  const state = useWriteOffStore()
  const typeData = state.typeData as WriteoffTroughDetail

  return (
    <>
      <DetailSelect
        onChange={v => {
          setDetail(v)
          state.setType(EnWriteoffType.ThroughDetail)
          state.addTypeDataProprty({
            detailId: v.id
          })
        }}
        value={detail}
      />
      <Inp
        label={t.Qty}
        type="number"
        value={typeData.qty || ''}
        onChange={v => {
          const isNumber = Number.isFinite(Number(v))
          state.addTypeDataProprty({
            qty: isNumber ? Number(v) : 0
          })
        }}
      />
      {detail && <TotalCost detail={detail} qty={typeData.qty} />}
    </>
  )
}

function TotalCost(props: { detail: Detail; qty: number }) {
  // const cost = props.detail.calcCost(Number(props.qty) || 0)
  return (
    <Stack p={1}>
      {t.InResultWillBeSubtracted}

      {/* {cost.map(each => (
        <P key={each.meterial.getIdentifier()}>
          {each.cost} {each.meterial.unitId} - {each.meterial.getIdentifier()}
        </P>
      ))} */}
    </Stack>
  )
}

export function WriteOffThroughMaterial() {
  const state = useWriteOffStore()
  const { material } = state
  return (
    <>
      <MaterialSelect
        setMaterial={m => {
          state.setType(EnWriteoffType.DirectUnit)
          state.setMaterial(m)
        }}
        material={material}
      />
      <QtyInputWithUnit
        label={t.Qty}
        setValue={v => state.setQty(Number(v))}
        unitId={material?.unit}
        value={state.qty.toString()}
      />
    </>
  )
}

export function ListWriteoffs() {
  const { data, refetch } = useGetWrietOffsQuery()
  const [key, setKey] = useState(0)

  return (
    <>
      <PageTitle title={t.WriteoffsList} hideIcon>
        <AddResourceButton navigateTo={open(routeMap.metalflow.writeoff.new)} />
      </PageTitle>

      <Sheet sx={{ gap: 2 }}>
        <Box
          css={css`
            .delete-btn {
              opacity: 0;
              visibility: hidden;
            }

            tr:hover {
              .delete-btn {
                opacity: 1;
                visibility: visible;
              }
            }
          `}
        >
          <Table
            columns={getColumns({ key, setKey, refetch })}
            data={data?.metal_flow_writeoffs || []}
          />
        </Box>
      </Sheet>
    </>
  )
}
