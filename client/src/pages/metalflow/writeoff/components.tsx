/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { UilTrash } from '@iconscout/react-unicons'
import { Autocomplete, Box, IconButton, Sheet, Stack } from '@mui/joy'
import { useEffect, useState } from 'react'
import { formatWriteoffReason, UiWriteoffReason } from 'shared'
import { Detail } from 'shared/domain/detail'
import { WriteoffTroughDetail } from 'shared/domain/writeoff'
import { EnWriteoffType } from 'shared/enumerations'
import { MetalFlowSys } from 'src/lib/routes'
import {
  useDeleteWriteOffMutation,
  useGetWrietOffsQuery
} from '../../../types/graphql-shema'
import { notif } from '../../../utils/notification'
import { ListPageHeader, SmallInputForm } from '../shared'
import { SendMutation } from '../shared/basic'
import { DetailSelect } from '../shared/detail-select'
import { MyTabs } from '../shared/shape-depended-tabs'
import { Table } from '../shared/table.impl'
import { t } from '../text'
import { getColumns } from './columns.decl'
import { useWriteOffStore } from './state'
import { handleSubmit } from './submit'

export function AddWriteOff() {
  const state = useWriteOffStore()
  const { reason, setReason } = state
  return (
    <SmallInputForm header={t.WriteOffAdd} goBackUrl={MetalFlowSys.materials}>
      {
        <MyTabs
          data={{
            [t.WriteoffThroughDetail]: <WriteoffThroughDetail />,
            [t.WriteoffThroughMaterial]: <WriteOffThroughMaterial />
          }}
          handleChange={val => {}}
        />
      }
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

        // renderInput={params => <Input {...params} label={t.WriteOffReason} />}
      />
      <SendMutation
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

export function DeleteWrireOff(props: {
  supplyId: number
  refetch: () => void
}) {
  const [mut, { data }] = useDeleteWriteOffMutation({
    variables: { id: props.supplyId }
  })

  useEffect(() => {
    if (data) {
      notif('success', 'Событие поставки удалено')
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
      <MyInput
        label={t.Qty}
        type="number"
        value={typeData.qty || ''}
        onChange={e => {
          const isNumber = Number.isFinite(Number(e.target.value))
          state.addTypeDataProprty({
            qty: isNumber ? Number(e.target.value) : 0
          })
        }}
      />
      {detail && <TotalCost detail={detail} qty={typeData.qty} />}
    </>
  )
}

function TotalCost(props: { detail: Detail; qty: number }) {
  const cost = props.detail.calcCost(Number(props.qty) || 0)
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

import { MyInput } from '../../../shortcuts'
import { QtyInputWithUnit } from '../shared'
import { MaterialSelect } from '../shared/material-select'

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
        unitId={material?.unitId}
        value={state.qty.toString()}
      />
    </>
  )
}

export function WriteoffsList() {
  const { data, refetch } = useGetWrietOffsQuery()
  const [key, setKey] = useState(0)

  return (
    <>
      <ListPageHeader
        title={t.WriteoffsList}
        btnText={t.WriteOffAdd}
        goto={MetalFlowSys.writeoff_add}
      />
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
            data={data?.metal_pdo_writeoffs || []}
          />
        </Box>
      </Sheet>
    </>
  )
}
