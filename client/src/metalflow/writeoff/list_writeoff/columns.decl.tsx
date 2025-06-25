import {
  EnWriteoffType,
  uiUnit,
  uiWriteoffReason,
  Writeoff,
  WriteoffTroughDetail
} from 'domain-model'
import { DeleteResourceButton, P } from 'lib/index'
import { GetWrietOffsQuery } from 'lib/types/graphql-shema'
import { formatOnlyDate } from 'lib/utils/formatting'
import { Column } from 'react-table'
import { t } from '../../text'
import { writeoffStore } from '../writeoff.store'
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
        return (
          <P>
            ({data.material.id}) {data.material.label}
          </P>
        )
      }
    },
    {
      Header: t.Qty,
      accessor: data => `${data.qty} ${uiUnit(data.material.unit)}`
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
        <DeleteResourceButton onClick={() => writeoffStore.delete(data.id)} />
      )
    }
  ]
}
