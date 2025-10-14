import { DetailName } from 'domains/pdo/detail/name'
import { P } from 'lib/index'
import { EnManufacturingOrderStatus as Status } from 'models'
import { Column } from 'react-table'
import { formatDate } from './list'
import { ManufactoringListOutput } from './store'

const commonColumns: Column<ManufactoringListOutput>[] = [
  {
    Header: '№',
    accessor: 'id'
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
    accessor: m => {
      return <P>{formatDate(new Date(m.created_at))}</P>
    }
  }
])

const productionColumns = commonColumns.concat([
  {
    Header: 'Старт',
    accessor: m => {
      if (!m.started_at) return ''
      return <P>{formatDate(new Date(m.started_at))}</P>
    }
  }
])

const finishColumns = commonColumns.concat([
  {
    Header: 'Создан',
    accessor: m => {
      return <P>{formatDate(new Date(m.created_at))}</P>
    }
  },
  {
    Header: 'Финиш',
    accessor: m => {
      if (!m.finished_at) return ''
      return <P>{formatDate(new Date(m.finished_at!))}</P>
    }
  },
  {
    Header: 'Дельта',
    accessor: m => {
      if (!m.started_at || !m.finished_at) return ''
      const ms =
        new Date(m.finished_at).getTime() - new Date(m.started_at).getTime()
      if (ms <= 0) return ''
      const totalMinutes = Math.floor(ms / 60000)
      const days = Math.floor(totalMinutes / 1440)
      return <P>{days} д.</P>
    }
  }
])

export function getColumns(status: Status) {
  switch (status) {
    case Status.Waiting:
    case Status.MaterialPreparation:
      return preparationColumns
    case Status.Production:
      return productionColumns
    case Status.Collected:
      return finishColumns
    default:
      return commonColumns
  }
}
