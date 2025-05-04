import { Column } from 'react-table'
import { GetDetailsQuery } from 'src/types/graphql-shema'
import { MetalFlowSys } from '../../../lib/routes'
import { EditIconButton } from '../shared'
import { goTo } from '../spa'
import { t } from '../text'

export type DetailDto = GetDetailsQuery['metal_pdo_details'][0]

export const columnList: Column<DetailDto>[] = [
  {
    Header: 'Id',
    accessor: 'id'
  },
  {
    Header: t.DetailName,
    id: 'name',
    accessor: 'name'
  },
  {
    Header: t.Action,
    accessor: data => (
      <EditIconButton
        url={goTo(MetalFlowSys.detail_update, data.id)}
        title={t.EditDetail}
      />
    )
  }
]
