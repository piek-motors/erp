import { makeAutoObservable } from 'mobx'
import { MonthSelect, MonthSelectStore } from '@/components/inputs/month-select'
import { Button, Checkbox, InputWithUnit, observer, Row, Stack } from '@/lib'
import { LoadingController } from '@/lib/store/loading_controller'

export class СonfiguratorVM {
  loader = new LoadingController()
  monthSelect = new MonthSelectStore()

  timeRetention: number = 30
  setTimeRetention(timeRetention: string) {
    this.timeRetention = parseInt(timeRetention)
  }

  full_view: boolean = true
  setFullView(showFullInfo: boolean) {
    this.full_view = showFullInfo
  }

  constructor() {
    makeAutoObservable(this)
  }
}

const store = new СonfiguratorVM()

export const ReportConfigurator = observer(() => (
  <Stack gap={0.5}>
    <MonthSelect store={store.monthSelect} />
    <Row alignItems={'last baseline'}>
      <InputWithUnit
        size="sm"
        label="Дневная норма вычета"
        sx={{ width: 100 }}
        type="number"
        value={store.timeRetention ?? ''}
        onChange={e => {
          store.setTimeRetention(e.target.value)
        }}
        unit="мин"
      />
      <Checkbox
        size="sm"
        variant="outlined"
        label="Полный отчет"
        checked={store.full_view}
        onClick={() => {
          store.setFullView(!store.full_view)
        }}
      />
    </Row>

    <Button
      variant="solid"
      color="primary"
      onClick={() => {
        const params = new URLSearchParams({
          month: String(store.monthSelect.month),
          year: String(store.monthSelect.year),
          timeRetention: String(store.timeRetention),
          full_view: String(store.full_view),
        })
        window.open(`/hr/attendance/report?${params.toString()}`, '_blank')
      }}
      sx={{ mt: 1 }}
    >
      Открыть табель
    </Button>
  </Stack>
))
