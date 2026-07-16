import { observer } from 'mobx-react-lite'
import { Table } from '@/components/table.impl'
import { MobileNavModal, MobilePadding } from '@/domains/pdo/root_layout'
import { Label, Loading, P, Row, Stack, useNavigate } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import { detail_request_api } from './api'
import { detailRequestColumns } from './columns'
import type { DetailRequestListStore } from './list.store'

export const DetailRequestListHeader = observer(() => (
  <MobilePadding desktop_too>
    <Stack gap={0.5}>
      <MobileNavModal t="Требования" />
      <Row>
        <P level="title-md" fontWeight={600}>
          Требования деталей
        </P>
        <Label color="neutral">последние 30 дней</Label>
      </Row>
    </Stack>
  </MobilePadding>
))

export const DetailRequestList = observer(
  ({ store }: { store: DetailRequestListStore }) => {
    const navigate = useNavigate()

    return (
      <Stack sx={{ p: 1 }}>
        {detail_request_api.loader.loading && <Loading />}
        {store.requests.length === 0 && !detail_request_api.loader.loading && (
          <P level="body-sm" color="neutral">
            Требований нет
          </P>
        )}
        <Table
          columns={detailRequestColumns}
          data={store.requests}
          onRowClick={request =>
            navigate(openPage(routeMap.pdo.detailRequest, request.id))
          }
        />
      </Stack>
    )
  },
)
