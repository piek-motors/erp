import { UilSearch } from '@iconscout/react-unicons'
import { IconButton } from '@mui/joy'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { ICON_OPACITY, ICON_WIDTH, Row } from 'shortcuts'
import { Select } from '../pages/metal-flow/shared/select'

const months = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек'
]

const startYear = 2022

const years = Array.from(
  { length: new Date().getFullYear() - startYear + 1 },
  (_, i) => startYear + i
)

export class MonthSelectStore {
  month = new Date().getMonth()
  year = new Date().getFullYear()
  isLoading = false
  constructor() {
    makeAutoObservable(this)
  }
  setMonth(month: number) {
    this.month = month
  }
  setYear(year: number) {
    this.year = year
  }
  getMonthLabel() {
    return `${months[this.month]} ${this.year}`
  }
  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading
  }
}

interface IReportConfiguratorProps {
  store: MonthSelectStore
  onSearch: (month: number, year: number) => void
}

function _MonthSelect({ onSearch, store }: IReportConfiguratorProps) {
  return (
    <Row gap={1} my={2}>
      <Select
        placeholder="Месяц"
        selectElements={months.map((e, i) => ({
          name: e,
          value: i
        }))}
        value={store.month}
        onChange={v => {
          store.setMonth(v)
        }}
      />
      <Select
        placeholder="Год"
        selectElements={years.map(e => ({
          name: e.toString(),
          value: e
        }))}
        value={store.year}
        onChange={v => {
          store.setYear(v)
        }}
      />
      <IconButton
        loading={store.isLoading}
        variant="soft"
        color="success"
        onClick={() => {
          onSearch(store.month, store.year)
        }}
      >
        <UilSearch width={ICON_WIDTH} opacity={ICON_OPACITY} />
      </IconButton>
    </Row>
  )
}

export const MonthSelect = observer(_MonthSelect)
