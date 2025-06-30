import { DeleteResourceButton, P } from 'lib/index'
import { formatDateWithTime } from 'lib/utils/formatting'
import { Column } from 'react-table'
import { t } from '../text'
// @ts-ignore
import { EnSupplyReason, uiSupplyReason } from 'domain-model'
import { RouterOutput } from '../../../../server/src/lib/trpc'
import { supplyStore } from './list/store'

export type SupplyDto = RouterOutput['material']['listSupply'][number]
export function getColumns(props: {
  key: number
  setKey: (n: number) => void
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
        return <P>{data.label}</P>
      }
    },
    {
      Header: 'Кол-во',
      accessor: data => `${data.qty}`
    },
    {
      Header: 'Дата поставки',
      accessor: data => formatDateWithTime(data.timestamp!)
    },
    {
      Header: 'Причина',
      accessor: data => uiSupplyReason(data?.reason as EnSupplyReason)
    },
    {
      Header: 'Действие',
      accessor: data => (
        <DeleteResourceButton
          onClick={() => {
            supplyStore.deleteSupply(data.id)
          }}
        />
      )
    }
  ]
}
