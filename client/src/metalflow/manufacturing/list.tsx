import { UilCheck } from '@iconscout/react-unicons'
import { IconButton } from '@mui/joy'
import { ScrollableWindow } from 'components/inputs'
import { PageTitle } from 'components/page-title'
import { Table } from 'components/table.impl'
import { observer } from 'lib/deps'
import { Label, P, Stack, useEffect, UseIcon } from 'lib/index'
import { DetailName } from 'metalflow/details/name'
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
    accessor: m => {
      if (m.finished_at) return ''

      return (
        <IconButton
          size="sm"
          variant="soft"
          color="success"
          onClick={() => {
            state.finishManufacturing(m.id)
          }}
        >
          <UseIcon icon={UilCheck} />
        </IconButton>
      )
    }
  }
]

export const ManufacturingList = observer(() => {
  useEffect(() => {
    state.load()
  }, [])
  return (
    <ScrollableWindow
      refreshTrigger={false}
      staticContent={
        <Stack py={1}>
          <PageTitle title={'Детали в производстве'} />
        </Stack>
      }
      scrollableContent={
        <Stack gap={1} p={1}>
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
