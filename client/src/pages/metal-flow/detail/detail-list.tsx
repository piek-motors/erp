import { Stack } from '@mui/joy'
import { PageTitle, Search } from 'components'
import { HighlightText } from 'components/highlight-text'
import { ScrollPreserv } from 'components/scroll-preserve'
import { Table } from 'components/table.impl'
import { ScrollableWindow } from 'components/window'
import { Detail } from 'domain-model'
import { open, routeMap } from 'lib/routes'
import {
  AddResourceButton,
  ErrorHint,
  Inp,
  LoadingHint,
  Row
} from 'lib/shortcuts'
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

interface DetailsTableProps {
  onRowClick?: (row: Detail) => void
  highlight?: (row: Detail) => boolean
  highlightColor?: string
}

const DetailsTable = observer((props: DetailsTableProps) => {
  const navigate = useNavigate()
  return (
    <Table
      columns={columnList}
      data={detailListStore.searchResult}
      trStyleCallback={row => {
        if (props.highlight) {
          return props.highlight(row.original)
            ? { backgroundColor: props.highlightColor }
            : {}
        }
        return {}
      }}
      onRowClick={row => {
        if (props.onRowClick) {
          props.onRowClick(row)
        } else {
          navigate(open(routeMap.metalflow.detail.edit, row.id))
        }
      }}
    />
  )
})

export const DetailsListPage = observer(() => {
  useEffect(() => {
    detailListStore.init()
  }, [])

  return (
    <Stack py={1}>
      <PageTitle subTitle={t.DetailsList} hideIcon>
        <AddResourceButton navigateTo={open(routeMap.metalflow.detail.new)} />
      </PageTitle>
      <DetailsList />
    </Stack>
  )
})

export const DetailSearchArguments = observer(() => {
  return (
    <>
      <AlphabetIndex />
      <Row>
        <Inp
          sx={{ width: '80px' }}
          placeholder="ID"
          value={detailListStore.searchId}
          onChange={v => {
            detailListStore.setSearchId(v)
          }}
        />
        <Search
          placeholder="Найти по названию"
          onChange={e => {
            detailListStore.search(e.target.value)
          }}
          value={detailListStore.searchKeyword || ''}
        />
      </Row>
    </>
  )
})

export const DetailsList = observer((props: DetailsTableProps) => {
  useEffect(() => {
    detailListStore.init()
  }, [])

  return (
    <Stack gap={1}>
      <ErrorHint e={detailListStore.async.error} />
      <LoadingHint show={detailListStore.async.loading} />
      <ScrollPreserv refreshTrigger={detailListStore.async.loading}>
        <DetailsTable
          highlight={props.highlight}
          highlightColor={props.highlightColor}
          onRowClick={props.onRowClick}
        />
      </ScrollPreserv>
    </Stack>
  )
})

export const DetailSelectWindow = observer(
  (props: { refreshTrigger?: any; detailProps?: DetailsTableProps }) => {
    return (
      <ScrollableWindow
        refreshTrigger={props.refreshTrigger}
        staticContent={<DetailSearchArguments />}
        scrollableContent={<DetailsList {...props.detailProps} />}
      />
    )
  }
)
