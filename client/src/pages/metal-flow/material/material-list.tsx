/** @jsxImportSource @emotion/react */
import { Box } from '@mui/joy'
import { PageTitle } from 'components'
import { Search } from 'components/search-input'
import { Table } from 'components/table.impl'
import { Material } from 'domain-model'
import { MetalFlowRoutes, openMetalFlowPage } from 'lib/routes'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import { AddResourceButton, ErrorHint, LoadingHint } from 'shortcuts'
import { ResourceName } from '../shared/material-name'
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
    Header: t.Material,
    id: 'name',
    accessor: m => {
      return <ResourceName resource={m.getLabelProps()} />
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

const MaterialsTable = observer(() => {
  const navigate = useNavigate()
  return (
    <Box sx={{ overflow: 'scroll', flexGrow: 2 }}>
      <Table
        sx={{
          '& td, th': {
            padding: '0 10px'
          }
        }}
        small
        columns={columnList}
        data={materialListStore.getFilteredMaterials()}
        onRowClick={row => {
          if (!row.id) throw Error('Material id is null')
          navigate(openMetalFlowPage(MetalFlowRoutes.material_update, row.id))
        }}
      />
    </Box>
  )
})

export const MaterialsListPage = observer(() => {
  useEffect(() => {
    materialListStore.fetchAll()
  }, [])

  return (
    <>
      <PageTitle title={t.MaterialsList} hideIcon>
        <AddResourceButton
          navigateTo={openMetalFlowPage(MetalFlowRoutes.material_add)}
        />
      </PageTitle>

      <Search
        onChange={e => {
          materialListStore.search(e.target.value)
        }}
        value={materialListStore.filterKeyword}
      />
      <MaterialShapeFilter />
      <LoadingHint show={materialListStore.loading} />
      <ErrorHint e={materialListStore.error} />
      <MaterialsTable />
    </>
  )
})
