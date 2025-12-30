import { Button, Divider } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'
import { ScrollableWindow, Search } from 'components/inputs'
import { InModal } from 'components/modal'
import { SearchResults } from 'components/search-paginated'
import { Table } from 'components/table.impl'
import { HomeButton } from 'domains/pdo/metalflow_root'
import {
  Box,
  Label,
  Loading,
  Row,
  RowButColumsAtSm,
  Stack,
  observer,
  openPage,
  routeMap,
  useEffect,
  useNavigate,
  useState
} from 'lib/index'
import { Column } from 'react-table'
import { DetailSt } from '../detail.state'
import { DetailName } from '../name'
import { AlphabetIndex } from './alphabet_index'
import { detailListStore as state } from './store'

const columnList: Column<DetailSt>[] = [
  {
    Header: '№',
    accessor: d => <Label xs>{d.id}</Label>
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
        disableLink
        withGroupName
      />
    )
  },
  {
    Header: 'Остаток',
    accessor: r => {
      if (!r.warehouse.stock) return ''
      return r.warehouse.stock
    }
  }
]

interface DetailsTableProps {
  onRowClick?: (row: DetailSt) => void
  highlight?: (row: DetailSt) => boolean
  highlightColor?: string
  sx?: SxProps
}

const DetailList = observer((props: DetailsTableProps) => {
  const navigate = useNavigate()
  useEffect(() => {
    state.index()
  }, [])
  return (
    <Table
      sx={props.sx}
      columns={columnList}
      data={state.displayedResults}
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

export const DetailsListPage = () => (
  <Stack p={0.5} gap={0.5}>
    <HomeButton t={'Детали'} />
    <DetailSearchArguments />
    <Row alignItems="start" gap={0.5}>
      <AlphabetIndex sx={{ position: 'sticky', top: 0, zIndex: 1 }} />
      <Divider orientation="vertical" />
      <DetailsList sx={{ width: '100%' }} />
    </Row>
  </Stack>
)

interface DetailSelectModalProps {
  value?: DetailSt
  onRowClick: (row: DetailSt) => void
}

export const DetailSelectModal = observer((props: DetailSelectModalProps) => {
  const [opnen, setOpen] = useState(false)
  return (
    <InModal
      layout="fullscreen"
      open={opnen}
      setOpen={() => setOpen(!opnen)}
      openButton={
        <Button variant="soft" size="sm">
          Выбрать
        </Button>
      }
    >
      <ScrollableWindow
        refreshTrigger={false}
        scrollableContent={
          <Box p={1} mb={3}>
            <DetailSearchArguments />
            <DetailsList
              onRowClick={v => {
                props.onRowClick(v)
                setOpen(false)
              }}
            />
          </Box>
        }
      />
    </InModal>
  )
})

const DetailSearchArguments = observer(() => (
  <RowButColumsAtSm>
    <Search
      size="sm"
      variant="soft"
      color="primary"
      width={100}
      placeholder="№"
      value={state.searchId}
      onChange={v => state.setId(v.target.value)}
    />
    <Search
      size="sm"
      placeholder="Название"
      variant="soft"
      color="primary"
      onChange={e => state.setKeyword(e.target.value)}
      value={state.searchKeyword}
    />
    <Search
      size="sm"
      placeholder="Номер чертежа"
      variant="soft"
      color="primary"
      onChange={e => state.setDrawingNumber(e.target.value)}
      value={state.drawingNumber}
    />
  </RowButColumsAtSm>
))

const DetailsList = observer((props: DetailsTableProps) => (
  <ScrollableWindow
    scrollableContent={
      <Stack gap={1} sx={props.sx}>
        {state.loader.loading && <Loading />}
        <SearchResults
          store={state.searchStore}
          emptyMessage="Детали не найдены"
        >
          <DetailList
            highlight={props.highlight}
            highlightColor={props.highlightColor}
            onRowClick={props.onRowClick}
          />
        </SearchResults>
      </Stack>
    }
  />
))
