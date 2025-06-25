import { DeleteResourceButton, P } from 'lib/index'
import { formatDateWithTime } from 'lib/utils/formatting'
import { Column } from 'react-table'
import { t } from '../text'
import { supplyStore } from './supply.store'

// @ts-ignore
import { RouterOutput } from '../../../../server/src/lib/trpc'

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
      accessor: data => formatDateWithTime(data.supplied_at)
    },
    {
      Header: 'Поставщик',
      accessor: 'supplier_name'
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
