import type { InputProps } from '@mui/joy'
import { InputWithUnit, useState } from 'lib/index'

interface Props {
	value?: number | null
	placeholder?: string
	width?: number
	unit?: string
	label?: string
	allowNegative?: boolean
	onChange: (v?: number) => void
}

export function NumberInput(props: Omit<InputProps, 'onChange'> & Props) {
	const [error, setError] = useState<boolean>(false)
	return (
		<InputWithUnit
			sx={{ width: props.width ? `${props.width}px` : '120px' }}
			{...props}
			type="number"
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
