import { EnWriteoffType, uiUnit, uiWriteoffReason } from 'domain-model'
import { P } from 'lib/shortcuts'
import { formatDateWithTime } from 'lib/utils/formatting'
import { Column } from 'react-table'
import { GetWrietOffsQuery } from 'types/graphql-shema'
import { map } from '../mappers'
import { t } from '../text'
import { DeleteWrireOff } from './components'
export type SupplyDto = GetWrietOffsQuery['metal_flow_writeoffs'][number]

export function getColumns(props: {
  key: number
  setKey: (n: number) => void
  refetch: () => void
}): Column<SupplyDto>[] {
  return [
    {
      Header: 'Id',
      accessor: 'id'
    },
    {
      Header: t.Material,
      id: 'name',
      accessor: data => {
        const ma = map.material.fromDto(data.material)
        return <P>{ma.label}</P>
      }
    },
    {
      Header: t.Qty,
      accessor: data => `${data.qty} ${uiUnit(data.material?.unit)}`
    },
    {
      Header: t.Date,
      accessor: data => formatDateWithTime(data.date)
    },
    {
      Header: t.WriteOffReason,
      accessor: data => uiWriteoffReason(data.reason)
    },
    {
      Header: 'ID детали',
      accessor: data => {
        if (data.type == EnWriteoffType.ThroughDetail) {
          return data.type_data.detailId
        }

        return ''
      }
    },
    {
      Header: t.Action,
      accessor: data => (
        <DeleteWrireOff refetch={props.refetch} supplyId={data.id} />
      )
    }
  ]
}
