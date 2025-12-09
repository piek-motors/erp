import { MonthSelect } from 'components/inputs/month-select'
import { Button, Checkbox, InputWithUnit, observer, Row, Stack } from 'lib'
import { store } from './store'

const ReportConfigurator = observer(() => {
  return (
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
          checked={store.showFullInfo}
          onClick={() => {
            store.setShowFullInfo(!store.showFullInfo)
          }}
        />
      </Row>
      <Button
        variant="solid"
        color="primary"
        onClick={() => store.load()}
        disabled={store.loader.loading}
        sx={{ mt: 1 }}
      >
        {store.loader.loading ? 'Генерация...' : 'Сгенерировать'}
      </Button>
    </Stack>
  )
})

export default ReportConfigurator
