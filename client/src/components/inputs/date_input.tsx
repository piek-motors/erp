import { InputLabled, P } from '@/lib/index'
import { Stack } from '@mui/joy'
import { useCallback, useMemo } from 'react'

interface Props {
  label?: string
  value: string
  onChange: (v: string) => void
}

const formatDate = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 6)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`
}

const isValidDateStr = (str: string): boolean => {
  const [d, m, y] = str.split('.').map(s => parseInt(s, 10))
  if (![d, m, y].every(n => Number.isInteger(n))) return false
  return d >= 1 && d <= 31 && m >= 1 && m <= 12
}

export function DateInput({ value = '', onChange, label }: Props) {
  const displayValue = useMemo(() => formatDate(value), [value])
  const isComplete = useMemo(() => displayValue.length === 8, [displayValue])
  const valid = useMemo(
    () => isComplete && isValidDateStr(displayValue),
    [isComplete, displayValue],
  )

  const handleChange = useCallback(
    (newValue: string) => {
      onChange(newValue)
    },
    [onChange],
  )

  return (
    <Stack spacing={0.5}>
      <InputLabled
        value={displayValue}
        onChange={handleChange}
        placeholder="дд.мм.гг"
        label={label}
      />
      {isComplete && !valid && (
        <P color="danger" level="body-xs">
          Неверный формат даты
        </P>
      )}
    </Stack>
  )
}
