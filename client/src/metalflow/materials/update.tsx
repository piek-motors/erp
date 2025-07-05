/** @jsxImportSource @emotion/react */
import { List } from '@mui/joy'
import { uiUnit } from 'domain-model'
import {
  Inp,
  InputStack,
  Link,
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
import { DetailName } from 'metalflow/details/name'
import { AlloyAutocomplete, SaveAndDelete } from '../shared/basic'
import { tabList } from './add'
import { material } from './material.state'
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
    <RowButColumsAtSm alignItems={'start'} p={1} gap={2}>
      <Stack gap={1}>
        <Row gap={2}>
          <P level="h4">{material.label}</P>
          <SupplyModal />
          <WriteoffModal />
        </Row>
        <P level="body-sm">ID: {materialId}</P>
        <P level="body-sm">
          Остаток: {material.stock.toFixed(3)} {uiUnit(material.unit)}
        </P>
        <InputStack>
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
        </InputStack>
        <SaveAndDelete
          itemName={`Материал (${material.id}) - ${material.label}`}
          handleDelete={() =>
            material.delete().then(() => {
              navigate(open(routeMap.metalflow.materials))
            })
          }
          handleSave={() => material.update()}
        />
      </Stack>
      <DetailsMadeOfMaterial />
    </RowButColumsAtSm>
  )
})

const DetailsMadeOfMaterial = observer(() => {
  if (material.detailsMadeFromThisMaterial.length === 0) {
    return null
  }
  return (
    <Stack gap={2} sx={{ overflowY: 'scroll', maxHeight: '100vh' }}>
      <P fontWeight={600}>Детали из этого материала</P>
      <List>
        {material.detailsMadeFromThisMaterial.map(each => (
          <Link to={open(routeMap.metalflow.detail.edit, each.id)}>
            <DetailName detail={each} />
          </Link>
        ))}
      </List>
    </Stack>
  )
})
