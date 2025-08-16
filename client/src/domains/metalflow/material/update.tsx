import { Card } from '@mui/joy'
import { MetalPageTitle } from 'domains/metalflow/shared/basic'
import {
  Inp,
  Loading,
  observer,
  RowButColumsAtSm,
  Stack,
  useEffect,
  useNavigate,
  useParams
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { AlloyAutocomplete, SaveAndDelete } from '../shared/basic'
import { api } from './api'
import { DetailsMadeOfMaterialModal } from './details_made_of_that_material'
import { tabList } from './insert'
import { MaterialWarehouse } from './warehouse/ui'

export const MaterialUpdatePage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const materialId = Number(id)
  const navigate = useNavigate()

  useEffect(() => {
    api.reset()
    api.load(materialId)
  }, [id])

  if (api.s.loadingWall.loading) return <Loading />
  return (
    <Stack alignItems={'start'} p={1} gap={0.5}>
      <MetalPageTitle t={`Материал #${materialId} ${api.s.label}`} />
      <RowButColumsAtSm>
        <Stack gap={1}>
          <MaterialWarehouse />
          <DetailsMadeOfMaterialModal />
        </Stack>
        <Card variant="outlined" size="sm">
          <Stack>
            {tabList.find(t => t.value === api.s.shape)?.component}
            <AlloyAutocomplete
              setAlloy={alloy => {
                api.s.setAlloy(alloy)
              }}
              alloy={api.s.alloy}
            />
            <Inp
              label={'Линейная масса'}
              value={api.s.linearMass}
              onChange={v => {
                api.s.setLinearMass(v)
              }}
              unit="кг/м"
            />
            <Inp
              label={'Безопасный остаток'}
              value={api.s.safetyStock}
              onChange={v => {
                api.s.setSafetyStock(v)
              }}
            />
          </Stack>
          <SaveAndDelete
            itemName={`Материал (${api.s.id}) - ${api.s.label}`}
            handleDelete={() =>
              api.delete().then(() => {
                navigate(open(routeMap.metalflow.materials))
              })
            }
            handleSave={() => api.update()}
          />
        </Card>
      </RowButColumsAtSm>
    </Stack>
  )
})
