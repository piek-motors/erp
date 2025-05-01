/** @jsxImportSource @emotion/react */
import { Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Search } from 'src/components/search-input'
import { MetalFlowSys } from 'src/lib/routes'
import { useGetMaterialsQuery } from 'src/types/graphql-shema'
import { PaperL1 } from '../../../components/paper'
import { ListPageHeader } from '../shared'
import { Table } from '../shared/table.impl'
import { goTo } from '../spa'
import { useStockStore } from '../stock'
import { t } from '../text'
import { columnList } from './columns.decl'

export function MaterialsList() {
  const { data } = useGetMaterialsQuery({})
  return (
    <Stack>
      <ListPageHeader
        title={t.MaterialsList}
        btnText={t.AddMaterial}
        goto={MetalFlowSys.material_add}
      />
      <PaperL1 sx={{ gap: 2 }}>
        <Search placeholder={t.Material} onChange={() => {}} value="" />
        <TableWithStock data={data} />
      </PaperL1>
    </Stack>
  )
}

function TableWithStock(props: {
  data?: ReturnType<typeof useGetMaterialsQuery>['data']
}) {
  const { data } = props
  const navigate = useNavigate()

  return (
    <Table
      columns={columnList}
      data={data?.metal_pdo_materials || []}
      onDoubleRowClick={row => {
        navigate(goTo(MetalFlowSys.material_update, row.id))
      }}
    />
  )
}

export function StockAmount(props: { materialId: number }) {
  const stockStore = useStockStore()
  return stockStore.getByIdRounded(props.materialId)
}
