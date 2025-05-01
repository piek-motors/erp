import { Stack } from '@mui/material'
import { useState } from 'react'
import { EnWriteoffType } from 'shared/enumerations'
import { Input, P } from '../../../shortcuts'
import { Detail } from '../domain/detail'
import { WriteoffTroughDetail } from '../domain/writeoff'
import { DetailSelect } from '../shared/detail-select'
import { t } from '../text'
import { useWriteOffStore } from './state'

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
      <Input
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

      {cost.map(each => (
        <P key={each.meterial.getIdentifier()}>
          {each.cost} {each.meterial.unitId} - {each.meterial.getIdentifier()}
        </P>
      ))}
    </Stack>
  )
}
