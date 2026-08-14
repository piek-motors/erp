import { DateInput } from '@/components/inputs/date_input'
import { P, Row } from '@/lib/index'
import { parseRussianDate } from '@/lib/utils/russian_date'

export type DateRangeValue = {
  from: string
  to: string
}

type Props = {
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  fromLabel?: string
  toLabel?: string
}

export function DateRangeInput({
  value,
  onChange,
  fromLabel = 'Период с',
  toLabel = 'по',
}: Props) {
  const from = parseRussianDate(value.from)
  const to = parseRussianDate(value.to, true)
  const isReversed = Boolean(from && to && from > to)

  return (
    <>
      <Row alignItems="end">
        <DateInput
          label={fromLabel}
          value={value.from}
          size="sm"
          width={105}
          onChange={from => onChange({ ...value, from })}
        />
        <DateInput
          label={toLabel}
          value={value.to}
          size="sm"
          width={105}
          onChange={to => onChange({ ...value, to })}
        />
      </Row>
      {isReversed && <P color="danger">Дата начала позже даты окончания</P>}
    </>
  )
}
