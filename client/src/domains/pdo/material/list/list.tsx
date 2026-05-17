/** @jsxImportSource @emotion/react */

import { ScrollableWindow, Search } from '@/components/inputs'
import { Table } from '@/components/table.impl'
import { MobileNavModal, MobilePadding } from '@/domains/pdo/root_layout'
import { observer, Stack, useNavigate } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import type { AppMaterial } from '../../cache/material_cache'
import { columns } from './columns'
import { materialListStore } from './store'

interface MaterialsTableProps {
  onRowClick?: (material: AppMaterial) => void
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
