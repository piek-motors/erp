import { Card } from '@mui/joy'
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
import { MetalPageTitle } from 'metalflow/shared/basic'
import { AlloyAutocomplete, SaveAndDelete } from '../shared/basic'
import { tabList } from './add'
import { DetailsMadeOfMaterialModal } from './details_made_of_that_material'
import { material } from './material.store'
import { MaterialWarehouse } from './warehouse/warehouse'

export const MaterialUpdatePage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('No id')
  const materialId = Number(id)
  const navigate = useNavigate()

  useEffect(() => {
    material.load(materialId)
    return () => {
      material.clear()
    }
  }, [])

  if (material.async.loading) {
    return <Loading />
  }

  return (
    <Stack alignItems={'start'} p={1} gap={0.5}>
      <MetalPageTitle t={`Материал #${materialId} ${material.label}`} />
      <RowButColumsAtSm>
        <Stack gap={1}>
          <MaterialWarehouse />
          <DetailsMadeOfMaterialModal />
        </Stack>
        <Card variant="outlined" size="sm">
          <Stack>
            {tabList.find(t => t.value === material.shape)?.component}
            <AlloyAutocomplete
              setAlloy={alloy => {
                material.setAlloy(alloy)
              }}
              alloy={material.alloy}
            />
            <Inp
              label={'Линейная масса'}
              value={material.linearMass}
              onChange={v => {
                material.setLinearMass(v)
              }}
              unit="кг/м"
            />
          </Stack>
          <SaveAndDelete
            itemName={`Материал (${material.id}) - ${material.label}`}
            handleDelete={() =>
              material.delete().then(() => {
                navigate(open(routeMap.metalflow.materials))
              })
            }
            handleSave={() => material.update()}
          />
        </Card>
      </RowButColumsAtSm>
    </Stack>
  )
})
