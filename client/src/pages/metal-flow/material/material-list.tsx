/** @jsxImportSource @emotion/react */
import { Stack } from '@mui/joy'
import { PageTitle } from 'components'
import { ScrollPreserv } from 'components/scroll-preserve'
import { Search } from 'components/search-input'
import { Table } from 'components/table.impl'
import { Material } from 'domain-model'
import { open, routeMap } from 'lib/routes'
import { AddResourceButton, ErrorHint, LoadingHint, P } from 'lib/shortcuts'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import { useStockStore } from '../stock'
import { materialListStore } from '../store'
import { t } from '../text'
import { MaterialShapeFilter } from './shape-filter'

function StockAmount(props: { materialId: number | null }) {
  const stockStore = useStockStore()
  if (!props.materialId) return '-'
  return stockStore.getByIdRounded(props.materialId)
}

const columnList: Column<Material>[] = [
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
    accessor: m => <StockAmount materialId={m.id} />
  },
  {
    Header: t.Unit,
    accessor: m => m.unitUI
  }
]

interface MaterialsTableProps {
  onRowClick?: (material: Material) => void
  highlight?: (material: Material) => boolean
  highlightColor?: string
}

export const MaterialList = observer((props: MaterialsTableProps) => {
  const navigate = useNavigate()
  useEffect(() => {
    materialListStore.init()
  }, [])
  return (
    <Stack gap={1} sx={{ maxHeight: '100vh', p: 0 }}>
      <Search
        onChange={e => {
          materialListStore.search(e.target.value)
        }}
        value={materialListStore.filterKeyword}
      />
      <MaterialShapeFilter />
      <ScrollPreserv refreshTrigger={materialListStore.async.loading}>
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
      </ScrollPreserv>
    </Stack>
  )
})

export const MaterialsListPage = observer(() => {
  return (
    <>
      <PageTitle title={t.MaterialsList} hideIcon>
        <AddResourceButton navigateTo={open(routeMap.metalflow.material.new)} />
      </PageTitle>

      <LoadingHint show={materialListStore.async.loading} />
      <ErrorHint e={materialListStore.async.error} />
      <MaterialList />
    </>
  )
})
