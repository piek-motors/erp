/** @jsxImportSource @emotion/react */
import { PageTitle } from 'components'
import { ScrollableWindow, Search } from 'components/inputs'
import { Table } from 'components/table.impl'
import { EnMaterialShape, uiUnit } from 'domain-model'
import {
  AddResourceButton,
  Inp,
  observer,
  P,
  Row,
  RowButColumsAtSm,
  Stack,
  useNavigate
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { Column } from 'react-table'
import { t } from '../../text'
import { MaterialShapeFilter } from './shape_filter'
import { MaterialListOutput, materialListStore } from './store'

const ShapeNameToIconMap = {
  [EnMaterialShape.SquareBar]: '/icons/square.svg',
  [EnMaterialShape.RoundBar]: '/icons/circle.svg',
  [EnMaterialShape.Pipe]: '/icons/pipe.svg',
  [EnMaterialShape.List]: '/icons/list.svg'
}

const columnList: Column<MaterialListOutput>[] = [
  {
    Header: 'ID',
    accessor: 'id'
  },
  {
    Header: 'Наименование',
    id: 'name',
    accessor: m => {
      if (ShapeNameToIconMap[m.shape]) {
        const iconUrl = ShapeNameToIconMap[m.shape]
        return (
          <Row>
            <img
              src={iconUrl}
              width={16}
              height={16}
              style={{ opacity: 0.6 }}
            />
            <P>{m.label}</P>
          </Row>
        )
      }
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
  onRowClick?: (material: MaterialListOutput) => void
  highlight?: (material: MaterialListOutput) => boolean
  highlightColor?: string
}

export const MaterialList = observer((props: MaterialsTableProps) => {
  const navigate = useNavigate()
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
        <Stack>
          <PageTitle title={t.MaterialsList}>
            <AddResourceButton
              navigateTo={open(routeMap.metalflow.material.new)}
            />
          </PageTitle>
          <RowButColumsAtSm>
            <Inp
              size="sm"
              sx={{ width: '60px' }}
              placeholder="По ID"
              value={materialListStore.searchId}
              onChange={v => {
                materialListStore.setSearchId(v)
              }}
            />
            <Search
              placeholder="По названию"
              onChange={e => {
                materialListStore.setSearchKeyword(e.target.value)
              }}
              value={materialListStore.filterKeyword}
            />
            <MaterialShapeFilter />
          </RowButColumsAtSm>
        </Stack>
      }
      scrollableContent={<MaterialList {...props} />}
    />
  )
})
