import { PageTitle } from 'components'
import { ScrollableWindow, Search } from 'components/inputs'
import { Table } from 'components/table.impl'
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
  useNavigate
} from 'lib/index'
import { t } from 'metalflow/text'
import { Column } from 'react-table'
import { AlphabetIndex } from '../alphabet_index'
import { Detail } from '../detail.store'
import { DetailName } from '../name'
import { detailListStore as state } from './state'

const columnList: Column<Detail>[] = [
  {
    Header: 'ID',
    accessor: 'id'
  },
  {
    Header: t.DetailName,
    id: 'name',
    accessor: r => (
      <DetailName
        detail={{
          id: r.id || 0,
          name: r.name,
          group_id: r.groupId || null
        }}
      />
    )
  },
  {
    Header: 'Масса гр.',
    accessor: r => {
      const m = r.usedMaterials[0]
      const weight = m?.weight?.toString()
      if (!weight) return '-'
      return weight
    }
  },
  {
    Header: 'Длина мм.',
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
      data={state.searchResult as unknown as readonly Detail[]}
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
      refreshTrigger={state.async.loading}
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

const DetailSearchArguments = observer(() => {
  return (
    <>
      <AlphabetIndex />
      <Row>
        <Inp
          sx={{ width: '80px' }}
          placeholder="По ID"
          value={state.searchId}
          onChange={v => {
            state.setSearchId(v)
          }}
        />
        <Search
          placeholder="По названию"
          onChange={e => {
            state.search(e.target.value)
          }}
          value={state.searchKeyword || ''}
        />
        <Search
          placeholder="По номеру"
          onChange={e => {
            state.setSearchPartCode(e.target.value)
          }}
          value={state.searchPartCode || ''}
        />
      </Row>
    </>
  )
})

const DetailsList = observer((props: DetailsTableProps) => {
  return (
    <Stack gap={1}>
      <ErrorHint e={state.async.error} />
      <LoadingHint show={state.async.loading} />
      <DetailList
        highlight={props.highlight}
        highlightColor={props.highlightColor}
        onRowClick={props.onRowClick}
      />
    </Stack>
  )
})
