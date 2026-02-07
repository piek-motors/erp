import { capitalize, MetalPageTitle } from '@/domains/pdo/shared/basic'
import {
  Box,
  Loading,
  observer,
  P,
  Row,
  Stack,
  useEffect,
  useNavigate,
  useParams,
  useState,
} from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import { notifier } from '@/lib/store/notifier.store'
import { Card } from '@mui/joy'
import { MobilePadding } from '../root_layout'
import { SaveAndDelete } from '../shared/basic'
import { api } from './api'
import { DetailsMadeOfMaterialModal } from './details_made_of_that_material'
import { MaterialForm } from './form'
import { MaterialQuntifiedExpenses } from './quantified_expenses'
import { MaterialSt } from './state'
import { MaterialWarehouseCard } from './warehouse'

import { ActionButton } from '@/lib/index'

export const CreateMaterialPage = observer(() => {
  const [material] = useState(() => new MaterialSt())
  const navigate = useNavigate()
  return (
    <Stack gap={1} p={1}>
      <MetalPageTitle t={'Добавить материал'} />
      <Stack gap={1}>
        <MaterialForm showTabs m={material} />
        <ActionButton
          onClick={() =>
            api.insert(material).then(id => {
              navigate(openPage(routeMap.pdo.material.edit, id))
            })
          }
        />
      </Stack>
    </Stack>
  )
})

export const MaterialUpdatePage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('Invalid page params: id is required')

  const navigate = useNavigate()
  const materialId = Number(id)
  const [m, setMaterial] = useState<MaterialSt | null>(null)

  useEffect(() => {
    api.load(materialId).then(async m => {
      setMaterial(m)
    })
  }, [id])

  if (m?.loadingWall.loading) return <Loading />
  if (!m || !m.id || !m.label) return <Loading />
  return (
    <Stack alignItems={'start'}>
      <MetalPageTitle
        t={
          <Box>
            <P level="body-sm" whiteSpace={'nowrap'}>
              Материал №{m.id}
            </P>
            <P
              whiteSpace={'nowrap'}
              color="primary"
              fontWeight={700}
              level="body-lg"
            >
              {capitalize(m.label)}
            </P>
          </Box>
        }
      />
      <MobilePadding>
        <Stack gap={1}>
          <Row flexWrap={'wrap'}>
            <MaterialWarehouseCard m={m} />
            <DetailsMadeOfMaterialModal m={m} />
          </Row>

          <Row flexWrap={'wrap'} alignItems={'start'}>
            <MaterialQuntifiedExpenses m={m} />
            <Card size="md">
              <Stack gap={3}>
                <MaterialForm m={m} disabled />
                <SaveAndDelete
                  sx={{ width: 'fit-content' }}
                  itemName={`Материал (${m.id}) - ${m.label}`}
                  handleDelete={() =>
                    api.delete(m.id!).then(() => {
                      navigate(openPage(routeMap.pdo.materials))
                    })
                  }
                  handleSave={() =>
                    api.update(m).then(m => {
                      setMaterial(m)
                      notifier.ok(`Материал обновлен`)
                    })
                  }
                />
              </Stack>
            </Card>
          </Row>
        </Stack>
      </MobilePadding>
    </Stack>
  )
})
