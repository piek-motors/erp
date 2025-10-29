/** @jsxImportSource @emotion/react */
import { SxProps } from '@mui/joy/styles/types'
import { ScrollableWindow, Search } from 'components/inputs'
import { Table } from 'components/table.impl'
import { MetalPageTitle } from 'domains/pdo/shared/basic'
import { Box, Inp, observer, Row, Stack, useNavigate } from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { MaterialShape } from 'models'
import { Material } from 'srv/rpc/pdo/material/list'
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
  highlight?: (material: Material) => boolean
  highlightColor?: string
  sx?: SxProps
}

export const MaterialList = observer((props: MaterialsTableProps) => {
  const navigate = useNavigate()
  return (
    <Table
      sx={props.sx}
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
      rowStyleCb={row => {
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

export const MaterialListPage = observer((props: MaterialsTableProps) => (
  <ScrollableWindow
    refreshTrigger={false}
    staticContent={<MetalPageTitle t={'Материалы'}></MetalPageTitle>}
    scrollableContent={
      <Box sx={{ p: 0.5 }}>
        <Stack p={0.5} gap={0.5}>
          <Row>
            <Inp
              size="sm"
              sx={{ width: '60px' }}
              placeholder="ID"
              value={materialListStore.searchId}
              onChange={v => {
                materialListStore.setSearchId(v)
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
          <MaterialShapeFilter />
        </Stack>
        <MaterialList {...props} />
      </Box>
    }
  />
))
