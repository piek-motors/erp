import { Column } from 'react-table'
import { Material } from 'shared/domain'
import { MetalFlowSys } from 'src/lib/routes'
import { EditIconButton } from '../shared'
import { ResourceName } from '../shared/material-name'
import { goTo } from '../spa'
import { t } from '../text'
import { StockAmount } from './components'

export const columnList: Column<Material>[] = [
  {
    Header: 'Id',
    accessor: 'id'
  },
  {
    Header: t.Material,
    id: 'name',
    accessor: data => {
      return <ResourceName resource={Material.create(data).resourceName()} />
    },
    width: '60%'
  },
  {
    Header: t.Remaining,
    accessor: data => <StockAmount materialId={data.id} />
  },
  {
    Header: t.Unit,
    accessor: data => data.unit()
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
