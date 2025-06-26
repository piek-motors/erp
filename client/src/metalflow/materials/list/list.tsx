/** @jsxImportSource @emotion/react */
import { PageTitle } from 'components'
import { ScrollableWindow, Search } from 'components/inputs'
import { Table } from 'components/table.impl'
import { uiUnit } from 'domain-model'
import {
  AddResourceButton,
  ErrorHint,
  Inp,
  LoadingHint,
  observer,
  P,
  RowButColumsAtSm,
  Stack,
  useEffect,
  useNavigate
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { Column } from 'react-table'
import { t } from '../../text'
import { MaterialShapeFilter } from '../shape_filter'
import { MaterialLiseOutput, materialListStore } from './store'

const columnList: Column<MaterialLiseOutput>[] = [
  {
    Header: 'ID',
    accessor: 'id'
  },
  {
    Header: 'Наименование',
    id: 'name',
    accessor: m => {
      return <P>{m.label}</P>
    },
    width: '95%'
  },
  {
    Header: t.Remaining,
    accessor: m => (
      <>
        {m.stock} {uiUnit(m.unit)}
      </>
    )
  }
]

interface MaterialsTableProps {
  onRowClick?: (material: MaterialLiseOutput) => void
  highlight?: (material: MaterialLiseOutput) => boolean
  highlightColor?: string
}

export const MaterialList = observer((props: MaterialsTableProps) => {
  const navigate = useNavigate()
  useEffect(() => {
    materialListStore.init()
  }, [])
  return (
    <Table
      columns={columnList}
      data={materialListStore.getFilteredMaterials()}
      onRowClick={row => {
        if (props.onRowClick) {
          props.onRowClick(row)
          return
        } else {
          if (!row.id) throw Error('Material id is null')
          navigate(open(routeMap.metalflow.material.edit, row.id))
        }
      }}
      trStyleCallback={row => {
        if (props.highlight) {
          return props.highlight(row.original)
            ? { backgroundColor: props.highlightColor }
            : {}
        }
        return {}
      }}
    />
  )
})

export const MaterialListPage = observer((props: MaterialsTableProps) => {
  return (
    <ScrollableWindow
      refreshTrigger={materialListStore.async.loading}
      staticContent={
        <Stack gap={0}>
          <PageTitle subTitle={t.MaterialsList} hideIcon>
            <AddResourceButton
              navigateTo={open(routeMap.metalflow.material.new)}
            />
          </PageTitle>
          <RowButColumsAtSm gap={1}>
            <Inp
              sx={{ width: '80px' }}
              placeholder="ID"
              value={materialListStore.searchId}
              onChange={v => {
                materialListStore.setSearchId(v)
              }}
            />
            <Search
              onChange={e => {
                materialListStore.search(e.target.value)
              }}
              value={materialListStore.filterKeyword}
            />
            <MaterialShapeFilter />
          </RowButColumsAtSm>
        </Stack>
      }
      scrollableContent={
        <Stack>
          <LoadingHint show={materialListStore.async.loading} />
          <ErrorHint e={materialListStore.async.error} />
          <MaterialList {...props} />
        </Stack>
      }
    />
  )
})
