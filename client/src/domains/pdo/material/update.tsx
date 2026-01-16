import { BarChart } from '@mui/x-charts'
import { capitalize, MetalPageTitle } from 'domains/pdo/shared/basic'
import {
  Box,
  Label,
  Loading,
  observer,
  P,
  RowButColumsAtSm,
  Stack,
  useEffect,
  useNavigate,
  useParams,
  useState
} from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { notifier } from 'lib/store/notifier.store'
import { uiUnit } from 'models'
import { SaveAndDelete } from '../shared/basic'
import { api } from './api'
import { DetailsMadeOfMaterialModal } from './details_made_of_that_material'
import { MaterialFormFields } from './form-fields'
import { MaterialState } from './state'
import { MaterialWarehouse } from './warehouse/ui'

export const MaterialUpdatePage = observer(() => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('Invalid page params: id is required')

  const navigate = useNavigate()
  const materialId = Number(id)
  const [m, setMaterial] = useState<MaterialState | null>(null)

  useEffect(() => {
    api.load(materialId).then(async m => {
      setMaterial(m)
      const details = await api.loadDetailsMadeFromThatMaterial(m.id!)
      m.setDetailsMadeFromThisMaterial(details)
    })
  }, [id])

  if (m?.loadingWall.loading) return <Loading />
  if (!m || !m.id || !m.label) return <Loading />
  return (
    <Stack alignItems={'start'} p={1} gap={0.5}>
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
      <RowButColumsAtSm>
        <Stack gap={1}>
          <MaterialWarehouse m={m} />
          <DetailsMadeOfMaterialModal m={m} />
        </Stack>
        <Stack gap={1}>
          <MaterialFormFields m={m} disabled />
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
                notifier.notify('info', `Материал обновлен`)
              })
            }
          />
        </Stack>
        <MaterialStatBarChart m={m} />
      </RowButColumsAtSm>
    </Stack>
  )
})

export const MaterialStatBarChart = observer(({ m }: { m: MaterialState }) => {
  if (!m.writeoffStat?.monthly || !m.writeoffStat?.quarterly) return null
  return (
    <Box>
      <Label textAlign={'center'}>Агрегированный расход</Label>
      <BarChart
        colors={['#308e74']}
        series={[
          {
            data: m.writeoffStat.quarterly?.map(([_, val]) => Math.round(val)),
            barLabel: 'value',
            barLabelPlacement: 'outside',
            valueFormatter: v => {
              if (typeof v == 'number') {
                return `${Math.round(v)} ${uiUnit(m.unit)}`
              }
              return ''
            }
          }
        ]}
        grid={{ horizontal: true }}
        xAxis={[
          {
            tickPlacement: 'middle',
            data: m.writeoffStat.quarterly?.map(([key]) =>
              key.slice(2).replace('-', '')
            )
          }
        ]}
        slotProps={{
          barLabel: {
            fontSize: '.8rem'
          },
          tooltip: {
            sx: {
              background: 'var(--joy-palette-neutral-50, #FBFCFE)',
              fontSize: '.8rem'
            }
          }
        }}
        height={200}
        width={400}
      />

      <BarChart
        series={[
          {
            data: m.writeoffStat?.monthly?.map(([_, val]) => val),
            valueFormatter: v => {
              if (typeof v == 'number') {
                return `${Math.round(v)} ${uiUnit(m.unit)}`
              }
              return ''
            }
          }
        ]}
        grid={{ horizontal: true }}
        xAxis={[
          {
            data: m.writeoffStat?.monthly?.map(([d]) => {
              const [year, month] = d.split('-')
              return new Date(+year, +month - 1)
            }),
            ordinalTimeTicks: ['years', 'quarterly', 'months'],
            valueFormatter: v =>
              Intl.DateTimeFormat('ru-RU', {
                month: 'short',
                year: '2-digit'
              }).format(v) ?? ''
          }
        ]}
        slotProps={{
          tooltip: {
            sx: {
              background: 'var(--joy-palette-neutral-50, #FBFCFE)',
              fontSize: '.8rem'
            }
          }
        }}
        height={200}
        width={400}
      />
    </Box>
  )
})
