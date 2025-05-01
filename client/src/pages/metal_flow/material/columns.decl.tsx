import { Column } from 'react-table'
import { formatUnit } from 'shared'
import { MetalFlowSys } from 'src/lib/routes'
import { GetMaterialsQuery } from 'src/types/graphql-shema'
import { EditIconButton } from '../shared'
import { MaterialName } from '../shared/material-name'
import { goTo } from '../spa'
import { t } from '../text'
import { StockAmount } from './materials'

export type MaterialDto = GetMaterialsQuery['metal_pdo_materials'][0]

export const columnList: Column<MaterialDto>[] = [
  {
    Header: 'Id',
    accessor: 'id'
  },
  {
    Header: t.Material,
    id: 'name',
    accessor: data => (
      <MaterialName shape={data.shape} shapeData={data.shape_data} />
    )
  },
  {
    Header: t.Remaining,
    accessor: data => <StockAmount materialId={data.id} />
  },
  {
    Header: t.Unit,
    accessor: data => formatUnit(data.unit)
  },
  {
    Header: 'Действие',
    accessor: data => (
      <EditIconButton
        title={t.EditDetail}
        url={goTo(MetalFlowSys.material_update, data.id)}
      />
    )
  }
]
