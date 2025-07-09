import { PageTitle } from 'components'
import { ScrollableWindow, Search } from 'components/inputs'
import { Table } from 'components/table.impl'
import {
  AddResourceButton,
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
import { t } from 'metalflow/text'
import { Column } from 'react-table'
import { Detail } from '../detail.store'
import { DetailName } from '../name'
import { AlphabetIndex } from './alphabet_index'
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
        showParamsButton={true}
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
        <>
          <PageTitle title={t.DetailsList}>
            <AddResourceButton
              navigateTo={open(routeMap.metalflow.detail.new)}
            />
          </PageTitle>
          <DetailSearchArguments />
        </>
      }
      scrollableContent={<DetailsList />}
    />
  )
})

const DetailSearchArguments = observer(() => {
  return (
    <>
      <AlphabetIndex />
      <RowButColumsAtSm>
        <Inp
          size="sm"
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
            state.setSearchKeyword(e.target.value)
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
      <DetailList
        highlight={props.highlight}
        highlightColor={props.highlightColor}
        onRowClick={props.onRowClick}
      />
    </Stack>
  )
})
