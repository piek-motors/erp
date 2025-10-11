/** @jsxImportSource @emotion/react */
import { SxProps } from '@mui/joy/styles/types'
import { ScrollableWindow, Search } from 'components/inputs'
import { Table } from 'components/table.impl'
import { MetalPageTitle } from 'domains/pdo/shared/basic'
import { Box, Inp, observer, P, Row, Stack, useNavigate } from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { roundAndTrim } from 'lib/utils/formatting'
import { EnMaterialShape } from 'models'
import { Column } from 'react-table'
import { Material } from 'srv/rpc/pdo/material/list'
import { MaterialShapeFilter } from './shape_filter'
import { materialListStore } from './store'

const ShapeNameToIconMap = {
  [EnMaterialShape.SquareBar]: '/icons/square.svg',
  [EnMaterialShape.RoundBar]: '/icons/circle.svg',
  [EnMaterialShape.Pipe]: '/icons/pipe.svg',
  [EnMaterialShape.List]: '/icons/list.svg',
  [EnMaterialShape.HexagonBar]: '/icons/hexagon.svg'
}

const columnList: Column<Material>[] = [
  {
    Header: '№',
    accessor: 'id'
  },
  {
    Header: 'Наименование',
    id: 'name',
    accessor: m => {
      const label = <P whiteSpace={'nowrap'}>{m.label}</P>
      if (ShapeNameToIconMap[m.shape]) {
        const iconUrl = ShapeNameToIconMap[m.shape]
        return (
          <Row>
            <img
              src={iconUrl}
              width={16}
              height={16}
              style={{ opacity: 0.65 }}
            />
            {label}
          </Row>
        )
      }
      return label
    },
    width: '95%'
  },
  {
    Header: 'Остаток, м',
    accessor: m => <>{roundAndTrim(m.stock)}</>
  },
  {
    Header: 'Безопасный остаток, м',
    accessor: m => <>{roundAndTrim(m.safety_stock)}</>
  }
]

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
      columns={columnList}
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

export const MaterialListPage = observer((props: MaterialsTableProps) => {
  return (
    <ScrollableWindow
      refreshTrigger={false}
      staticContent={
        <Stack p={0.5} gap={0.5}>
          <MetalPageTitle t={'Материалы'}>
            {/* <AddResourceButton
              navigateTo={openPage(routeMap.metalflow.material.new)}
            /> */}
          </MetalPageTitle>
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
      }
      scrollableContent={
        <Box sx={{ p: 0.5 }}>
          <MaterialList {...props} />
        </Box>
      }
    />
  )
})
