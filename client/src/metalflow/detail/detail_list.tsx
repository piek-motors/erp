import { PageTitle } from 'components'
import { HighlightText } from 'components/highlight-text'
import { ScrollableWindow, Search } from 'components/inputs'
import { Table } from 'components/table.impl'
import { Detail } from 'domain-model'
import {
  AddResourceButton,
  ErrorHint,
  Inp,
  LoadingHint,
  Row,
  Stack,
  observer,
  open,
  routeMap,
  useEffect,
  useNavigate
} from 'lib/index'
import { Column } from 'react-table'
import { detailListStore } from '../store'
import { t } from '../text'
import { AlphabetIndex } from './alphabet_index'

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

const DetailList = observer((props: DetailsTableProps) => {
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
    <ScrollableWindow
      refreshTrigger={detailListStore.async.loading}
      staticContent={
        <Stack>
          <PageTitle subTitle={t.DetailsList} hideIcon>
            <AddResourceButton
              navigateTo={open(routeMap.metalflow.detail.new)}
            />
          </PageTitle>
          <DetailSearchArguments />
        </Stack>
      }
      scrollableContent={<DetailsList />}
    />
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
      <DetailList
        highlight={props.highlight}
        highlightColor={props.highlightColor}
        onRowClick={props.onRowClick}
      />
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
