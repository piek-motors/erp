import { Card } from '@mui/joy'
import { fmt, uiUnit } from 'shared'
import { AdaptiveNumberFormatter } from '@/domains/pdo/shared/adaptive_number_formatter'
import { MetalPageTitle } from '@/domains/pdo/shared/basic'
import {
  ActionButton,
  Box,
  Label,
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
import type { DeficitInfo } from '@/server/domains/pdo/materials_rpc'
import { MobilePadding } from '../root_layout'
import { SaveAndDelete } from '../shared/basic'
import { api } from './api'
import { DetailsMadeOfMaterialModal } from './details_made_of_that_material'
import { MaterialForm } from './form'
import { MaterialQuntifiedExpenses } from './quantified_expenses'
import { MaterialSt } from './state'
import { MaterialWarehouseCard } from './warehouse'

export const CreateMaterialPage = observer(() => {
  const [material] = useState(() => new MaterialSt())
  const navigate = useNavigate()
  return (
    <Stack gap={1} p={1}>
      <MetalPageTitle t={'Добавить материал'} />
      <Stack gap={1}>
        <MaterialForm m={material} />
        <ActionButton
          onClick={() =>
            api
              .insert(material)
              .then(id => {
                navigate(openPage(routeMap.pdo.material.edit, id))
              })
              .catch(e => {
                notifier.err(e.message)
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
              {fmt.capitalize(m.label)}
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
          {m.deficit_info && (
            <>
              <DeficitLabel deficitInfo={m.deficit_info} />
              <AverageDailyConsumption m={m} deficitInfo={m.deficit_info} />
            </>
          )}
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

function DeficitLabel({ deficitInfo }: { deficitInfo: DeficitInfo }) {
  const { deficit, days_until_stockout } = deficitInfo

  const getText = () => {
    if (deficit) return `Дефицит`
    if (Math.floor(days_until_stockout) == 0) return
    return `Запас на ${fmt.day_count(days_until_stockout)}`
  }

  return <Label color={deficit ? 'danger' : 'success'}>{getText()}</Label>
}

const dailyConsumptionFormatter = new AdaptiveNumberFormatter(2, 5)

function AverageDailyConsumption({
  m,
  deficitInfo,
}: {
  m: MaterialSt
  deficitInfo: DeficitInfo
}) {
  return (
    <Card size="sm" variant="soft" sx={{ width: 'fit-content' }}>
      <Stack gap={0.5}>
        <Label>Среднесуточное потребление</Label>
        <Row gap={0.5} alignItems="baseline">
          <P fontWeight={700}>
            {dailyConsumptionFormatter.format(
              deficitInfo.daily_consumption_rate,
            ) ?? '0'}
          </P>
          <P level="body-sm">{uiUnit(m.unit)} / день</P>
        </Row>
        <P level="body-xs" color="neutral">
          Средний расход по истории списаний, используется для прогноза
          дефицита.
        </P>
      </Stack>
    </Card>
  )
}
