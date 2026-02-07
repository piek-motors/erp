/** @jsxImportSource @emotion/react */
import { ScrollableWindow, Search } from '@/components/inputs'
import { Table } from '@/components/table.impl'
import { MobileNavModal, MobilePadding } from '@/domains/pdo/root_layout'
import {
  Button,
  observer,
  Stack,
  ToggleButtonGroup,
  useNavigate,
} from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import { Material } from '@/server/domains/pdo/materials_rpc'
import { ToggleButtonGroupProps } from '@mui/joy'
import { UiMaterialShape } from 'models'
import { columns } from './columns'
import { materialListStore } from './store'

interface MaterialsTableProps {
  onRowClick?: (material: Material) => void
}

const MaterialList = observer((props: MaterialsTableProps) => {
  const navigate = useNavigate()
  return (
    <Table
      columns={columns}
      data={materialListStore.search_result}
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
  <ScrollableWindow
    static={
      <MobilePadding desktop_too>
        <Stack gap={0.5}>
          <MobileNavModal t={'Материалы'} />
          <ShapeFilter variant="soft" color="primary" />
          <Search
            variant="soft"
            color="primary"
            value={materialListStore.search_query}
            onChange={e => materialListStore.set_search_query(e.target.value)}
          />
        </Stack>
      </MobilePadding>
    }
    scroll={<MaterialList {...props} />}
  />
))

const ShapeFilter = observer((props?: ToggleButtonGroupProps) => {
  const shapes = Object.entries(UiMaterialShape)
  const value = materialListStore.shape_filter?.toString()
  return (
    <ToggleButtonGroup
      size="sm"
      value={value}
      {...props}
      sx={{ overflow: 'scroll' }}
      onChange={(_, value) => {
        if (value == null) {
          materialListStore.set_shape_filter()
        } else {
          materialListStore.set_shape_filter(Number(value))
        }
      }}
    >
      {shapes.map(([index, name]) => (
        <Button key={index} value={index}>
          {name}
        </Button>
      ))}
    </ToggleButtonGroup>
  )
})
