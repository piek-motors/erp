/** @jsxImportSource @emotion/react */
import { Card } from '@mui/joy'
import {
  Inp,
  observer,
  P,
  Row,
  Stack,
  useEffect,
  useNavigate,
  useParams
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { roundAndTrim } from 'lib/utils/formatting'
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

  return (
    <Stack alignItems={'start'} p={1} gap={1}>
      <Row gap={1} alignItems={'start'}>
        <Stack alignItems={'start'}>
          <Row gap={2}>
            <P level="h4">{material.label}</P>
          </Row>
          <P level="body-sm">ID: {materialId}</P>
          <P level="body-sm">Остаток: {roundAndTrim(material.stock)} м</P>
        </Stack>
        <Stack gap={1} justifyContent={'flex-end'} alignItems={'flex-end'}>
          <SupplyModal />
          <WriteoffModal />
          <DetailsMadeOfMaterial />
          <OperationsListModal materialId={materialId} />
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
