import { Column } from 'react-table'
import { formatUnit } from 'shared'
import { MetalFlowSys } from 'src/lib/routes'
import { GetMaterialsQuery } from 'src/types/graphql-shema'
import { map } from '../domain-adapter'
import { EditIconButton } from '../shared'
import { ResourceName } from '../shared/material-name'
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
    accessor: data => {
      const ma = map.material.fromDto(data)
      return <ResourceName {...ma.shapeData.getResourceNameProps()} />
    }
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
