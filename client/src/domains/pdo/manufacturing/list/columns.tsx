import { DetailName } from 'domains/pdo/detail/name'
import { Label, P } from 'lib/index'
import { EnManufacturingOrderStatus as Status } from 'models'
import { Column } from 'react-table'
import { ManufactoringListOutput } from './store'

const commonColumns: Column<ManufactoringListOutput>[] = [
  {
    Header: '№',
    accessor: m => <Label xs>{m.id}</Label>
  },
  {
    Header: 'Деталь',
    accessor: d => (
      <DetailName
        detail={{
          id: d.detail_id,
          name: d.detail_name,
          group_id: d.group_id
        }}
        withLink
        withGroupLink
        withParamsButton
      />
    )
  },
  {
    Header: 'Кол-во',
    accessor: m => {
      if (!m.qty) return ''
      return <P>{m.qty}</P>
    }
  }
]

const preparationColumns = commonColumns.concat([
  {
    Header: 'Создан',
    accessor: 'created_at'
  }
])

const productionColumns = commonColumns.concat([
  {
    Header: 'Старт',
    accessor: 'started_at'
  }
])

const finishColumns = commonColumns.concat([
  {
    Header: 'Старт',
    accessor: 'started_at'
  },
  {
    Header: 'Финиш',
    accessor: 'finished_at'
  },
  {
    Header: 'Дельта',
    accessor: m => {
      if (!m.time_delta) return ''
      const totalDays = Math.round(m.time_delta / (3600 * 24))
      return <P>{totalDays} д.</P>
    }
  }
])

export function getColumns(status: Status) {
  switch (status) {
    case Status.Waiting:
    case Status.Preparation:
      return preparationColumns
    case Status.Production:
      return productionColumns
    case Status.Collected:
      return finishColumns
    default:
      return commonColumns
  }
}
