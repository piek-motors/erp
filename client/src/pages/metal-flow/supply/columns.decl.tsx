import { Column } from 'react-table'
import { GetSuppliesQuery } from 'types/graphql-shema'
import { formatDateWithTime } from 'utils/formatting'
import { map } from '../mappers'
import { ResourceName } from '../shared/material-name'
import { t } from '../text'
import { DeleteSupply } from './components'

export type SupplyDto = GetSuppliesQuery['metal_flow_supplies'][number]

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
        if (!data.material) return '-'
        const ma = map.material.fromDto(data.material)
        return <ResourceName resource={ma.getLabelProps()} />
      }
    },
    {
      Header: 'Кол-во'
      // accessor: data => `${data.qty} ${data.material.}`
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
        <DeleteSupply refetch={props.refetch} supplyId={data.id} />
      )
    }
  ]
}
