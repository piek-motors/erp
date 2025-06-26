import { uiUnit, uiWriteoffReason } from 'domain-model'
import { DeleteResourceButton, P } from 'lib/index'
import { formatOnlyDate } from 'lib/utils/formatting'
import { t } from 'metalflow/text'
import { Column } from 'react-table'
import { ListWriteoffDto } from './list/store'
import { writeoffStore } from './writeoff.store'

export function getColumns(props: {
  key: number
  setKey: (n: number) => void
  refetch: () => void
}): Column<ListWriteoffDto>[] {
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
            ({data.id}) {data.label}
          </P>
        )
      }
    },
    {
      Header: t.Qty,
      accessor: data => `${data.qty} ${uiUnit(data.unit)}`
    },
    {
      Header: t.Date,
      accessor: data => formatOnlyDate(data.timestamp!)
    },
    {
      Header: 'Причина',
      accessor: data => uiWriteoffReason(data.data.reason)
    },
    {
      Header: t.Action,
      accessor: data => (
        <DeleteResourceButton onClick={() => writeoffStore.delete(data.id)} />
      )
    }
  ]
}
