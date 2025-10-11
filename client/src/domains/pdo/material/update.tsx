import { ComplexTitle, MetalPageTitle } from 'domains/pdo/shared/basic'
import {
  Loading,
  observer,
  RowButColumsAtSm,
  Stack,
  useEffect,
  useNavigate,
  useParams
} from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { SaveAndDelete } from '../shared/basic'
import { api } from './api'
import { DetailsMadeOfMaterialModal } from './details_made_of_that_material'
import { MaterialFormFields } from './form-fields'
import { MaterialWarehouse } from './warehouse/ui'

export const MaterialUpdatePage = observer(() => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) throw new Error('No id')
  const materialId = Number(id)

  useEffect(() => {
    api.reset()
    api.load(materialId)
    api.loadDetailsMadeFromThatMaterial(materialId)
  }, [id])

  if (api.s.loadingWall.loading) return <Loading />
  if (!api.s || !api.s.id || !api.s.label) return <Loading />
  return (
    <Stack alignItems={'start'} p={1} gap={0.5}>
      <MetalPageTitle
        t={
          <ComplexTitle
            subtitle="Материал"
            title={api.s.label}
            index={api.s.id}
          />
        }
      />
      <RowButColumsAtSm>
        <Stack gap={1}>
          <MaterialWarehouse />
          <DetailsMadeOfMaterialModal />
        </Stack>
        <Stack gap={1}>
          <MaterialFormFields />
          <SaveAndDelete
            sx={{ width: 'fit-content' }}
            itemName={`Материал (${api.s.id}) - ${api.s.label}`}
            handleDelete={() =>
              api.delete().then(() => {
                navigate(openPage(routeMap.pdo.materials))
              })
            }
            handleSave={() => api.update()}
          />
        </Stack>
      </RowButColumsAtSm>
    </Stack>
  )
})
