/** @jsxImportSource @emotion/react */
import { InputWithUnit, useState } from '@/lib/index'
import { css } from '@emotion/react'
import type { InputProps } from '@mui/joy'

interface Props {
  value?: number | null
  placeholder?: string
  width?: number
  unit?: string
  label?: string
  allowNegative?: boolean
  onChange: (v?: number) => void
}

export function NumberInput(
  props: Omit<InputProps, 'onChange' | 'value'> & Props,
) {
  const [error, setError] = useState<boolean>(false)
  return (
    <InputWithUnit
      sx={{ width: props.width ? `${props.width}px` : '100px' }}
      {...props}
      type="number"
      size={props.size ?? 'sm'}
      css={css`
				input::-webkit-outer-spin-button,
				input::-webkit-inner-spin-button {
				-webkit-appearance: none;
				margin: 0;
				}

				input[type=number] {
				-moz-appearance: textfield;
				}`}
      error={error}
      value={props.value == null ? '' : Number(props.value)}
      onChange={e => {
        const val = e.target.value.trim()

        if (val === '') {
          props.onChange(undefined)
          setError(true)
          return
        }

        const num = parseFloat(val)
        // If negative values are not allowed and number is negative → error
        if (!props.allowNegative && num < 0) {
          setError(true)
          props.onChange(undefined)
        } else {
          setError(false)
          props.onChange(num)
        }
      }}
      unit={props.unit}
    />
  )
}
