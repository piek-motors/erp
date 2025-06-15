import {
  EnWriteoffType,
  uiWriteoffReason,
  Writeoff,
  WriteoffTroughDetail
} from 'domain-model'
import { DeleteResourceButton, P } from 'lib/shortcuts'
import { formatOnlyDate } from 'lib/utils/formatting'
import { Column } from 'react-table'
import { GetWrietOffsQuery } from 'types/graphql-shema'
import { t } from '../text'
export type SupplyDto = GetWrietOffsQuery['metal_flow_writeoffs'][number]

export function getColumns(props: {
  key: number
  setKey: (n: number) => void
  refetch: () => void
}): Column<Writeoff>[] {
  return [
    {
      Header: 'ID',
      accessor: 'id'
    },
    {
      id: 'name',
      Header: t.Material,
      accessor: data => {
        return <P>{data.material.label}</P>
      }
    },
    {
      Header: t.Qty,
      accessor: data => `${data.qty} ${data.material.unitUI}`
    },
    {
      Header: t.Date,
      accessor: data => formatOnlyDate(data.date.toISOString())
    },
    {
      Header: 'Причина',
      accessor: data => uiWriteoffReason(data.reason)
    },
    {
      Header: 'ID детали',
      accessor: data => {
        if (data.type == EnWriteoffType.ThroughDetail) {
          return (data.typeData as WriteoffTroughDetail).detailId
        }

        return ''
      }
    },
    {
      Header: t.Action,
      accessor: data => (
        <DeleteResourceButton
          onClick={() => {
            console.log('delete', data.id)
          }}
        />
      )
    }
  ]
}
