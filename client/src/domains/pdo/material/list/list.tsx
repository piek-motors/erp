/** @jsxImportSource @emotion/react */
import { Search } from 'components/inputs'
import { Table } from 'components/table.impl'
import { HomeButton } from 'domains/pdo/metalflow_root'
import { observer, Row, Stack, useNavigate } from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { MaterialShape } from 'models'
import { Material } from 'srv/rpc/pdo/materials'
import { columns } from './columns'
import { MaterialShapeFilter } from './shape_filter'
import { materialListStore } from './store'

export const ShapeNameToIconMap = {
  [MaterialShape.SquareBar]: '/icons/square.svg',
  [MaterialShape.RoundBar]: '/icons/circle.svg',
  [MaterialShape.Pipe]: '/icons/pipe.svg',
  [MaterialShape.List]: '/icons/list.svg',
  [MaterialShape.HexagonBar]: '/icons/hexagon.svg'
}

interface MaterialsTableProps {
  onRowClick?: (material: Material) => void
}

export const MaterialList = observer((props: MaterialsTableProps) => {
  const navigate = useNavigate()
  return (
    <Table
      columns={columns}
      data={materialListStore.getFilteredMaterials()}
      onRowClick={row => {
        if (props.onRowClick) {
          props.onRowClick(row)
          return
        } else {
          if (!row.id) throw Error('Material id is null')
          navigate(openPage(routeMap.pdo.material.edit, row.id))
        }
      }}
    />
  )
})

export const MaterialListPage = observer((props: MaterialsTableProps) => (
  <>
    <Stack p={0.5} gap={0.5}>
      <HomeButton t={'Материалы'} />
      <MaterialShapeFilter />
      <Row>
        <Search
          width={100}
          placeholder="№"
          value={materialListStore.searchId}
          onChange={v => {
            materialListStore.setSearchId(v.target.value)
          }}
        />
        <Search
          placeholder="Название"
          onChange={e => {
            materialListStore.setSearchKeyword(e.target.value)
          }}
          value={materialListStore.filterKeyword}
        />
      </Row>
    </Stack>
    <MaterialList {...props} />
  </>
))
