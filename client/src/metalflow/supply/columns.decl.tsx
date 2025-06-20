import { DeleteResourceButton, P } from 'lib/index'
import { GetSuppliesQuery } from 'lib/types/graphql-shema'
import { formatDateWithTime } from 'lib/utils/formatting'
import { Column } from 'react-table'
import { map } from '../mappers'
import { t } from '../text'
import { supplyStore } from './supply.store'

export type SupplyDto = GetSuppliesQuery['metal_flow_supplies'][number]

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
        if (!data.material) return '-'
        const ma = map.material.fromDto(data.material)
        return <P>{ma.label}</P>
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
