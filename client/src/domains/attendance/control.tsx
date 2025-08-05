import { MonthSelect } from 'components/month-select'
import { Button, Checkbox, Input, Label, observer, P, Row, Stack } from 'lib'
import { store } from './store'

const ReportConfigurator = observer(() => {
  return (
    <Stack gap={1}>
      <MonthSelect store={store.monthSelect} />
      <Row alignItems={'center'} gap={1}>
        <Label sx={{ whiteSpace: 'nowrap' }}>Норма вычета времени</Label>
        <Row gap={1}>
          <Input
            size="sm"
            sx={{ width: 60 }}
            type="number"
            value={store.timeRetention ?? ''}
            onChange={e => {
              store.setTimeRetention(e.target.value)
            }}
          />
          <P>мин</P>
        </Row>
      </Row>
      <Checkbox
        variant="soft"
        label="Показывать время прихода и ухода"
        checked={store.showFullInfo}
        onClick={() => {
          store.setShowFullInfo(!store.showFullInfo)
        }}
      />

      {/* Generate Report Button */}
      <Button
        variant="solid"
        color="primary"
        onClick={() => {
          store.load(store.monthSelect.month, store.monthSelect.year)
        }}
        disabled={store.async.loading}
        sx={{ mt: 1 }}
      >
        {store.async.loading ? 'Генерация...' : 'Сгенерировать отчет'}
      </Button>
    </Stack>
  )
})

export default ReportConfigurator
