import { Button, Divider } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'
import { ScrollableWindow, Search } from 'components/inputs'
import { InModal } from 'components/modal'
import { SearchResults } from 'components/search-paginated'
import { Table } from 'components/table.impl'
import { MetalPageTitle } from 'domains/pdo/shared/basic'
import {
  Box,
  ErrorHint,
  Inp,
  Label,
  Loading,
  Row,
  RowButColumsAtSm,
  Stack,
  observer,
  openPage,
  routeMap,
  useNavigate,
  useState
} from 'lib/index'
import { Column } from 'react-table'
import { DetailState } from '../detail.state'
import { DetailName } from '../name'
import { AlphabetIndex } from './alphabet_index'
import { detailListStore as state } from './store'

const columnList: Column<DetailState>[] = [
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
        withLink
        withGroupLink
        withParamsButton
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
  onRowClick?: (row: DetailState) => void
  highlight?: (row: DetailState) => boolean
  highlightColor?: string
  sx?: SxProps
}

const DetailList = observer((props: DetailsTableProps) => {
  const navigate = useNavigate()
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

export const DetailsListPage = observer(() => (
  <Row alignItems={'start'}>
    <ScrollableWindow
      staticContent={<MetalPageTitle t={'Детали'} />}
      scrollableContent={
        <Stack p={0.5} gap={0.5}>
          <DetailSearchArguments />
          <Row alignItems="start" gap={0.5}>
            <AlphabetIndex sx={{ position: 'sticky', top: 0, zIndex: 1 }} />
            <Divider orientation="vertical" />
            <DetailList />
          </Row>
        </Stack>
      }
    />
  </Row>
))

interface DetailSelectModalProps {
  value?: DetailState
  onRowClick: (row: DetailState) => void
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

const DetailSearchArguments = observer(() => {
  return (
    <>
      <RowButColumsAtSm>
        <Inp
          size="sm"
          sx={{ width: '80px' }}
          placeholder="ID"
          value={state.searchId}
          onChange={v => state.setSearchId(v)}
        />
        <Search
          placeholder="Название"
          onChange={e => state.setSearchKeyword(e.target.value)}
          value={state.searchKeyword || ''}
        />
        <Search
          placeholder="Номер чертежа"
          onChange={e => state.setSearchPartCode(e.target.value)}
          value={state.searchPartCode || ''}
        />
      </RowButColumsAtSm>
    </>
  )
})

const DetailsList = observer((props: DetailsTableProps) => {
  return (
    <Stack gap={1} sx={props.sx}>
      <ErrorHint e={state.async.error} />
      {state.async.loading && <Loading />}
      <SearchResults store={state.searchStore} emptyMessage="Детали не найдены">
        <Row alignItems="start" gap={1}>
          <DetailList
            highlight={props.highlight}
            highlightColor={props.highlightColor}
            onRowClick={props.onRowClick}
          />
        </Row>
      </SearchResults>
    </Stack>
  )
})
