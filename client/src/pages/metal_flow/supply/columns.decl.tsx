import { Column } from 'react-table'
import { formatUnit } from 'shared'
import { formatDateWithTime } from '../../../lib/date'
import { GetSuppliesQuery } from '../../../types/graphql-shema'
import { MaterialName } from '../shared/material-name'
import { t } from '../text'
import { DeleteSupply } from './supply.delete'

export type SupplyDto = GetSuppliesQuery['metal_pdo_supplies'][number]

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

        return (
          <MaterialName
            shape={data.material?.shape}
            shapeData={data.material?.shape_data}
          />
        )
      }
    },
    {
      Header: 'Кол-во',
      accessor: data => `${data.qty} ${formatUnit(data?.material?.unit as any)}`
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
