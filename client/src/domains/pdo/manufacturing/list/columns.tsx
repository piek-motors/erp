import { DetailName } from 'domains/pdo/detail/name'
import { Label, P } from 'lib/index'
import { ManufacturingOrderStatus as Status } from 'models'
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
    accessor: m => (
      <P noWrap level="body-xs">
        {m.created_at}
      </P>
    )
  }
])

const productionColumns = commonColumns.concat([
  {
    Header: 'Запуск',
    accessor: m => (
      <P noWrap level="body-xs">
        {m.started_at}
      </P>
    )
  },
  {
    Header: 'Этап',
    accessor: m => <P level="body-xs">{m.current_operation}</P>
  }
])

const finishColumns = commonColumns.concat([
  {
    Header: 'Запуск',
    accessor: m => (
      <P noWrap level="body-xs">
        {m.started_at}
      </P>
    )
  },
  {
    Header: 'Финиш',
    accessor: m => (
      <P noWrap level="body-xs">
        {m.finished_at}
      </P>
    )
  },
  {
    Header: 'Дельта',
    accessor: m => {
      if (!m.time_delta) return ''
      const totalDays = Math.round(m.time_delta / (3600 * 24))
      return (
        <P noWrap level="body-xs">
          {totalDays} д.
        </P>
      )
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
