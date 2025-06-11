import { Box, Stack } from '@mui/joy'
import { PageTitle, Search } from 'components'
import { HighlightText } from 'components/highlight-text'
import { Table } from 'components/table.impl'
import { Detail } from 'domain-model'
import { open, routeMap } from 'lib/routes'
import { AddResourceButton, ErrorHint, LoadingHint } from 'lib/shortcuts'
import { observer } from 'mobx-react-lite'
import { AlphabetIndex } from 'pages/metal-flow/detail/alphabet-index'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import { detailListStore } from '../store'
import { t } from '../text'

const columnList: Column<Detail>[] = [
  {
    Header: 'Id',
    accessor: 'id'
  },
  {
    Header: t.DetailName,
    id: 'name',
    accessor: r => (
      <Stack>
        <HighlightText
          text={r.name}
          highlight={detailListStore.searchKeyword}
        />
      </Stack>
    )
  },
  {
    Header: 'Масса гр.',
    accessor: r => {
      const m = r.materials[0]
      const weight = m?.weight?.toString()
      if (!weight) return '-'
      return weight
    }
  },
  {
    Header: 'Длина мм.',
    accessor: r => {
      const m = r.materials[0]
      const length = m?.length?.toString()
      if (!length) return '-'
      return m.length
    }
  }
]

const DetailsTable = observer(() => {
  const navigate = useNavigate()
  return (
    <Box sx={{ overflow: 'scroll', flexGrow: 2, pb: 2 }}>
      <Table
        columns={columnList}
        data={detailListStore.searchResult}
        onRowClick={row =>
          navigate(open(routeMap.metalflow.detail.edit, row.id))
        }
      />
    </Box>
  )
})

export const DetailsListPage = observer(() => {
  useEffect(() => {
    detailListStore.init()
  }, [])

  return (
    <>
      <PageTitle title={t.DetailsList} hideIcon>
        <AddResourceButton navigateTo={open(routeMap.metalflow.detail.new)} />
      </PageTitle>
      <AlphabetIndex />
      <Search
        onChange={e => {
          detailListStore.search(e.target.value)
        }}
        value={detailListStore.searchKeyword || ''}
      />
      <ErrorHint e={detailListStore.async.error} />
      <LoadingHint show={detailListStore.async.loading} />
      <DetailsTable />
    </>
  )
})
