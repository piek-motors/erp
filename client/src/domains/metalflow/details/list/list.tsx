import { Divider } from '@mui/joy'
import { ScrollableWindow, Search } from 'components/inputs'
import { SearchResults } from 'components/search-paginated'
import { Table } from 'components/table.impl'
import { MetalPageTitle } from 'domains/metalflow/shared/basic'
import { t } from 'domains/metalflow/text'
import {
  AddResourceButton,
  Box,
  ErrorHint,
  Inp,
  Link,
  LoadingHint,
  P,
  RowButColumsAtSm,
  Stack,
  observer,
  open,
  routeMap,
  useNavigate
} from 'lib/index'
import { Column } from 'react-table'
import { Detail } from '../detail.store'
import { DetailName } from '../name'
import { AlphabetIndex } from './alphabet_index'
import { detailListStore as state } from './store'

const columnList: Column<Detail>[] = [
  {
    Header: 'ID',
    accessor: 'id'
  },
  {
    Header: 'Наименование',
    id: 'name',
    accessor: r => (
      <DetailName
        detail={{
          id: r.id || 0,
          name: r.name,
          group_id: r.groupId || null
        }}
        withLink
        withGroupLink
        withParamsButton
      />
    )
  },
  {
    Header: 'Остаток',
    accessor: r => r.stock
  },
  {
    Header: 'Длина заготовки, мм',
    accessor: r => {
      const m = r.usedMaterials[0]
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
      data={state.displayedResults}
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
  return (
    <ScrollableWindow
      refreshTrigger={false}
      staticContent={
        <Stack gap={1} p={0.5}>
          <MetalPageTitle t={t.DetailsList}>
            <AddResourceButton
              navigateTo={open(routeMap.metalflow.detail.new)}
            />
          </MetalPageTitle>
        </Stack>
      }
      scrollableContent={
        <Box p={1}>
          <DetailSearchArguments />
          <Divider sx={{ mt: 1 }} />
          <DetailsList />
        </Box>
      }
    />
  )
})

const DetailSearchArguments = observer(() => {
  return (
    <>
      <AlphabetIndex />
      <Divider sx={{ my: 1 }} />
      <RowButColumsAtSm>
        <Inp
          size="sm"
          sx={{ width: '80px' }}
          placeholder="По ID"
          value={state.searchId}
          onChange={v => state.setSearchId(v)}
        />
        <Search
          placeholder="По названию"
          onChange={e => state.setSearchKeyword(e.target.value)}
          value={state.searchKeyword || ''}
        />
        <Search
          placeholder="По артикулу"
          onChange={e => state.setSearchPartCode(e.target.value)}
          value={state.searchPartCode || ''}
        />
      </RowButColumsAtSm>

      <Link to="https://planner.piek.ru/f6980fc4-c15b-4eb3-9dab-ad70125f65e6/details_register_help">
        <P level="body-sm" color="primary" p={1}>
          Инструкция по ведению реестра
        </P>
      </Link>
    </>
  )
})

const DetailsList = observer((props: DetailsTableProps) => {
  return (
    <Stack gap={1}>
      <ErrorHint e={state.async.error} />
      <LoadingHint show={state.async.loading} />
      <SearchResults store={state.searchStore} emptyMessage="Детали не найдены">
        <DetailList
          highlight={props.highlight}
          highlightColor={props.highlightColor}
          onRowClick={props.onRowClick}
        />
      </SearchResults>
    </Stack>
  )
})
