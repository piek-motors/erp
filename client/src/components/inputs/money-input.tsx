import { InputLabled } from '@/lib/index'
import { fmt } from 'models'
import { useCallback, useMemo } from 'react'

interface Props {
  label?: string
  value: number | null
  onChange: (v: number) => void
  autoFocus?: boolean
  placeholder?: string
}

export function MoneyInput({
  label,
  value,
  onChange,
  placeholder,
  autoFocus,
}: Props) {
  const handleChange = useCallback(
    (v: string) => {
      // Remove all non-digit characters and convert to number
      const numeric = v.replace(/\D/g, '')
      if (!numeric) {
        onChange(0)
        return
      }
      const number = parseInt(numeric, 10)
      if (!Number.isNaN(number)) {
        onChange(number)
      }
    },
    [onChange],
  )

  const formattedValue = useMemo(() => {
    return value ? fmt.money(value) : ''
  }, [value])

  return (
    <InputLabled
      placeholder={placeholder}
      value={formattedValue}
      onChange={handleChange}
      label={label}
      autoFocus={autoFocus}
    />
  )
}
