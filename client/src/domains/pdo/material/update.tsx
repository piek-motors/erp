import { BarChart } from '@mui/x-charts'
import { capitalize, MetalPageTitle } from 'domains/pdo/shared/basic'
import {
  Box,
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
import { fmtDate } from 'lib/utils/date_fmt'
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
  if (!m.writeoffStat) return null
  return (
    <Box>
      <BarChart
        borderRadius={2}
        series={[
          {
            data: m.writeoffStat?.map(([_, val]) => val),
            label: 'Совокупный расход'
          }
        ]}
        xAxis={[
          {
            data: m.writeoffStat?.map(([d]) => {
              const [year, month] = d.split('-')
              return new Date(+year, +month)
            }),
            ordinalTimeTicks: ['years', 'quarterly', 'months'],
            valueFormatter: v => fmtDate(v) ?? ''
          }
        ]}
        yAxis={[
          {
            label: uiUnit(m.unit)
          }
        ]}
        slotProps={{
          tooltip: {
            sx: { background: 'var(--joy-palette-neutral-50, #FBFCFE)' }
          }
        }}
        margin={0}
        height={200}
        width={400}
      />
    </Box>
  )
})
