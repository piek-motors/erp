import { Box, Stack } from '@mui/joy'
import {
  observer,
  open,
  P,
  routeMap,
  RowButColumsAtSm,
  useEffect,
  useNavigate,
  useParams
} from 'lib/index'
import { MetalPageTitle, SaveAndDelete } from 'metalflow/shared/basic'
import { DetailAttachmentList } from './attachments/detail_attachment_list'
import { CreateManufacturingOrder } from './create_manufacturing_order'
import { detailStore } from './detail.store'
import {
  DetailDescriptionInput,
  DetailGroupInput,
  DetailNameInput,
  DetailParamsInput,
  DetailPartCodeInput,
  MaterialCostInputs
} from './shared'

export const UpdateDetailPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const detailId = Number(id)
  const navigate = useNavigate()
  useEffect(() => {
    detailStore.loadFullInfo(detailId)
    return () => {
      detailStore.reset()
    }
  }, [])
  return (
    <Stack gap={1} p={1}>
      <MetalPageTitle
        title={`Деталь #${detailStore.id} - ${detailStore.name}`}
        hideIcon
      />

      <RowButColumsAtSm gap={1}>
        {/* Left Column - Detail Info */}
        <Stack gap={0.5} sx={{ flex: 1 }}>
          <P>
            <b>ID</b> {detailStore.id}
          </P>
          <P>
            <b>Остаток:</b> {detailStore.stock} шт
          </P>
          <CreateManufacturingOrder />
          <DetailNameInput />
          {/* <WarehouseOperationsLinks
            onSupplyClick={() => {
              // navigate(open(routeMap.metalflow.supply.new, detailId))
            }}
            onWriteoffClick={() => {
              // navigate(open(routeMap.metalflow.writeoff.new, detailId))
            }}
          /> */}
          <DetailGroupInput />
          <DetailPartCodeInput />
          <DetailParamsInput />
          <MaterialCostInputs />
          <DetailDescriptionInput />
          <Box width={'min-content'}>
            <SaveAndDelete
              itemName={`Деталь (${detailStore.id}) - ${detailStore.name}`}
              handleDelete={() =>
                detailStore.delete().then(() => {
                  navigate(open(routeMap.metalflow.details))
                })
              }
              handleSave={() => detailStore.update()}
            />
          </Box>
        </Stack>
        {/* Right Column - Documents */}
        <Stack gap={1} sx={{ flex: 1 }}>
          <DetailAttachmentList detailId={detailId} />
        </Stack>
      </RowButColumsAtSm>
    </Stack>
  )
})
