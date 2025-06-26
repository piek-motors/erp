/** @jsxImportSource @emotion/react */
import {
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
import { SaveAndDelete } from '../shared/basic'
import { material } from './material.state'
import { tabList } from './material_add'
import { SupplyModal } from './supply/supply'
import { WriteoffModal } from './writeoff/writeoff'

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
        <InputStack>
          {tabList.find(t => t.value === material.shape)?.component}
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
  if (material.detailsMadeOfMaterial.length === 0) {
    return null
  }
  return (
    <Stack gap={2} sx={{ overflowY: 'scroll', maxHeight: '100vh' }}>
      <P fontWeight={600}>Детали из этого материала</P>
      <Stack gap={0.5}>
        {material.detailsMadeOfMaterial.map(each => (
          <Link to={open(routeMap.metalflow.detail.edit, each.id)}>
            <P key={each.id} level="body-sm">
              {each.name}
            </P>
          </Link>
        ))}
      </Stack>
    </Stack>
  )
})
