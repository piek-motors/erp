import { Divider } from '@mui/joy'
import type { SxProps } from '@mui/joy/styles/types'
import type { Column } from 'react-table'
import { ScrollableWindow } from '@/components/inputs'
import { SearchWithCriteria } from '@/components/inputs/search_input_with_criteria'
import { InModal } from '@/components/modal'
import { SearchResults } from '@/components/search-paginated'
import { Table } from '@/components/table.impl'
import { MobileNavModal, MobilePadding } from '@/domains/pdo/root_layout'
import {
  Box,
  Label,
  Loading,
  observer,
  openPage,
  Row,
  routeMap,
  Stack,
  useNavigate,
} from '@/lib/index'
import type { AppDetail } from '../../cache/detail_cache'
import type { DetailSt } from '../detail.state'
import { DetailName } from '../detail_name'
import { AlphabetIndex } from './alphabet_index'
import { SearchCriteria, detailListStore as state } from './store'

export const DetailsListPage = () => (
  <ScrollableWindow
    static={
      <MobilePadding desktop_too>
        <Stack gap={0.5}>
          <MobileNavModal t={'Детали'} />
          <Search />
        </Stack>
      </MobilePadding>
    }
    scroll={
      <Row alignItems="start" gap={0} mb={2} flexWrap={'nowrap'}>
        <AlphabetIndex sx={{ position: 'sticky', top: 0, zIndex: 1 }} />
        <Divider orientation="vertical" />
        <DetailsList sx={{ width: '100%' }} />
      </Row>
    }
  />
)

const Search = observer(() => (
  <SearchWithCriteria
    variant="soft"
    color="primary"
    criteriaOptions={SearchCriteria}
    criteria={state.search_criteria}
    onCriteriaChange={c => state.set_search_criteria(c)}
    query={state.query ?? ''}
    onQueryChange={v => state.set_query(v)}
  />
))

const columnList: Column<AppDetail>[] = [
  {
    Header: '№',
    accessor: d => <Label xs>{d.id}</Label>,
  },
  {
    Header: 'Наименование',
    id: 'name',
    accessor: r => (
      <DetailName
        detail={{
          id: r.id || 0,
          name: r.name,
          group_id: r.group_id || null,
        }}
        disable_link
        with_group_name
      />
    ),
  },
  {
    Header: 'Остаток',
    accessor: r => {
      if (!r.on_hand_balance) return ''
      return r.on_hand_balance
    },
  },
]

interface DetailsTableProps {
  onRowClick?: (row: AppDetail) => void
  highlight?: (row: AppDetail) => boolean
  highlightColor?: string
  sx?: SxProps
  excludeDetailById?: number
}

const DetailList = observer((props: DetailsTableProps) => {
  const navigate = useNavigate()
  return (
    <Table
      sx={props.sx}
      columns={columnList}
      data={state.displayed_results.filter(
        e => e.id != props.excludeDetailById,
      )}
      rowStyleCb={row => {
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
          navigate(openPage(routeMap.pdo.detail.edit, row.id))
        }
      }}
    />
  )
})

interface DetailSelectModalProps {
  value?: DetailSt
  onRowClick: (row: AppDetail) => void
  open: boolean
  setOpen: (v: boolean) => void
  excludeDetailById?: number
}

export const DetailSelectModal = observer((props: DetailSelectModalProps) => (
  <InModal layout="fullscreen" open={props.open} setOpen={props.setOpen}>
    <ScrollableWindow
      refreshTrigger={false}
      scroll={
        <Box p={1} mb={3}>
          <Search />
          <DetailsList
            excludeDetailById={props.excludeDetailById}
            onRowClick={v => {
              props.onRowClick(v)
              props.setOpen(false)
            }}
          />
        </Box>
      }
    />
  </InModal>
))

const DetailsList = observer((props: DetailsTableProps) => (
  <Stack gap={1} sx={props.sx}>
    {state.loader.loading && <Loading />}
    <SearchResults store={state.searchStore} emptyMessage="Детали не найдены">
      <DetailList {...props} />
    </SearchResults>
  </Stack>
))
