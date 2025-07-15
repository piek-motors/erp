import { ScrollableWindow } from 'components/inputs'
import { PageTitle } from 'components/page-title'
import { Table } from 'components/table.impl'
import { observer } from 'lib/deps'
import { Label, LoadingHint, P, Stack, useEffect } from 'lib/index'
import { DetailName } from 'metalflow/details/name'
import { Column } from 'react-table'
import { FinishModal } from './finish_modal'
import { ManufactoringListOutput, ManufacturingListStore } from './list_store'

const state = new ManufacturingListStore()

const columnList: Column<ManufactoringListOutput>[] = [
  {
    Header: 'ID',
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
        showLinkButton
      />
    )
  },
  {
    Header: 'Количество',
    accessor: 'qty'
  },
  {
    Header: 'Старт',
    accessor: m => {
      if (!m.started_at) return '-'
      return <P>{formatDate(new Date(m.started_at))}</P>
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
    Header: 'Завершить',
    accessor: m => <FinishModal detail={m} />
  }
]

export const ManufacturingList = observer(() => {
  useEffect(() => {
    state.load()
  }, [])
  return (
    <ScrollableWindow
      refreshTrigger={false}
      staticContent={<PageTitle title={'Детали в производстве'} />}
      scrollableContent={
        <Stack gap={1} p={1}>
          <LoadingHint show={state.async.loading} />
          <Label label={'В производстве'} />
          <Table data={state.detailsInProduction} columns={columnList} />

          <Label label={'Готовые детали'} />
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
