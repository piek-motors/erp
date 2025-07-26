import { Card, Divider } from '@mui/joy'
import {
  Inp,
  Loading,
  observer,
  P,
  Row,
  RowButColumsAtSm,
  Stack,
  useEffect,
  useNavigate,
  useParams
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { roundAndTrim } from 'lib/utils/formatting'
import { MetalPageTitle } from 'metalflow/shared/basic'
import { AlloyAutocomplete, SaveAndDelete } from '../shared/basic'
import { tabList } from './add'
import { DetailsMadeOfMaterial } from './details_made_of_that_material'
import { material } from './material.store'
import { OperationsListModal } from './operations/list'
import { SupplyModal } from './operations/supply/supply'
import { WriteoffModal } from './operations/writeoff/writeoff'

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
      <MetalPageTitle t={`Материал #${materialId} - ${material.label}`} />
      <Row gap={2} alignItems={'center'}>
        <RowButColumsAtSm>
          <SupplyModal />
          <WriteoffModal />
          <DetailsMadeOfMaterial />
          <OperationsListModal materialId={materialId} />
        </RowButColumsAtSm>
        <Divider orientation="vertical" />
        <Stack>
          <P>Остаток: {roundAndTrim(material.stock)} м</P>
        </Stack>
      </Row>
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
    </Stack>
  )
})
