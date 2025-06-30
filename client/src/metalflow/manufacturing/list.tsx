import { ScrollableWindow } from 'components/inputs'
import { PageTitle } from 'components/page-title'
import { Table } from 'components/table.impl'
import { observer } from 'lib/deps'
import { P, Stack, useEffect } from 'lib/index'
import { Column } from 'react-table'
import { ManufactoringListOutput, ManufacturingStore } from './store'

const state = new ManufacturingStore()

const columnList: Column<ManufactoringListOutput>[] = [
  {
    Header: 'ID',
    accessor: 'id'
  },
  {
    Header: 'Деталь',
    accessor: 'detail_id'
  },
  {
    Header: 'Количество',
    accessor: 'qty'
  },
  {
    Header: 'Старт',
    accessor: m => {
      return <P>{formatDate(new Date(m.started_at))}</P>
    }
  },
  {
    Header: 'Финиш',
    accessor: m => {
      if (!m.started_at) return '-'
      return <P>{formatDate(new Date(m.finished_at!))}</P>
    }
  }
]

export const ManufacturingList = observer(() => {
  useEffect(() => {
    state.init()
  }, [])
  return (
    <ScrollableWindow
      refreshTrigger={false}
      staticContent={
        <Stack py={1}>
          <PageTitle subTitle={'Изготавливаемые детали'} hideIcon />
        </Stack>
      }
      scrollableContent={
        <Stack>
          <PageTitle subTitle={'В производстве'} hideIcon />
          <Table data={state.detailsInProduction} columns={columnList} />

          <PageTitle subTitle={'Готовые детали'} hideIcon />
          <Table data={state.detailsFinished} columns={columnList} />
        </Stack>
      }
    />
  )
})

function formatDate(date: Date) {
  return Intl.DateTimeFormat('ru-RU', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
