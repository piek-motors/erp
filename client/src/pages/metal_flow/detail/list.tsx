import { useNavigate } from 'react-router-dom'
import { PaperL1 } from '../../../components/paper'
import { Search } from '../../../components/search-input'
import { MetalFlowSys } from '../../../lib/routes'
import { useGetDetailsQuery } from '../../../types/graphql-shema'
import { ListPageHeader } from '../shared'
import { Table } from '../shared/table.impl'
import { goTo } from '../spa'
import { t } from '../text'
import { columnList } from './columns.decl'

export function DetailsList() {
  const navigate = useNavigate()
  const { data } = useGetDetailsQuery({ fetchPolicy: 'network-only' })

  return (
    <>
      <ListPageHeader
        title={t.DetailsList}
        btnText={t.AddDetail}
        goto={MetalFlowSys.detail_add}
      />
      <PaperL1>
        <Search
          placeholder="Деталь"
          onChange={() => {}}
          value=""
          children={<></>}
        />
        <Table
          columns={columnList}
          data={data?.metal_pdo_details || []}
          onDoubleRowClick={row =>
            navigate(goTo(MetalFlowSys.detail_update, row.id))
          }
        />
      </PaperL1>
    </>
  )
}
