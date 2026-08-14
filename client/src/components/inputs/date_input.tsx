import { Stack } from '@mui/joy'
import { useCallback, useMemo } from 'react'
import { InputLabled, P } from '@/lib/index'
import { parseRussianDate } from '@/lib/utils/russian_date'

interface Props {
  label?: string
  value: string
  onChange: (v: string) => void
  size?: 'sm' | 'md' | 'lg'
  width?: string | number
}

const formatDate = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 6)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`
}

export function DateInput({ value = '', onChange, label, size, width }: Props) {
  const displayValue = useMemo(() => formatDate(value), [value])
  const isComplete = useMemo(() => displayValue.length === 8, [displayValue])
  const valid = useMemo(
    () => isComplete && Boolean(parseRussianDate(displayValue)),
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
        size={size}
        width={width}
      />
      {isComplete && !valid && (
        <P color="danger" level="body-xs">
          Неверный формат даты
        </P>
      )}
    </Stack>
  )
}
