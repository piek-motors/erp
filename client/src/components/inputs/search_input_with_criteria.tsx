import { UilSearch } from '@iconscout/react-unicons'
import { Input, Option, Select } from '@mui/joy'
import { ColorPaletteProp, VariantProp } from '@mui/joy/styles/types'
import { Row, UseIcon } from 'lib'

interface SearchCriterionOption {
	value: string
}

type EnumLike = { [s: string]: string }

interface SearchWithCriteriaProps<E extends EnumLike> {
	criteria: E[keyof E]
	criteriaOptions: E
	onCriteriaChange: (value: E[keyof E]) => void

	query: string
	onQueryChange: (value: string) => void

	width?: number | string
	maxWidth?: number | string
	variant?: VariantProp
	color?: ColorPaletteProp
}

export function SearchWithCriteria<E extends EnumLike>(
	props: SearchWithCriteriaProps<E>,
) {
	const {
		criteria,
		criteriaOptions,
		onCriteriaChange,
		query,
		onQueryChange,
		width,
		maxWidth,
		color,
		variant,
	} = props

	return (
		<Row gap={0.5} alignItems="center" flexWrap={'nowrap'}>
			<Select
				color={color ?? 'neutral'}
				variant={variant ?? 'outlined'}
				size="sm"
				value={criteria}
				onChange={(_, v) => {
					if (v != null) onCriteriaChange(v)
				}}
				sx={{
					boxShadow: 'none',
				}}
			>
				{enumToCriteriaOptions(criteriaOptions).map(opt => (
					<Option key={opt.value} value={opt.value}>
						{opt.value}
					</Option>
				))}
			</Select>
			<Input
				color={color ?? 'neutral'}
				variant={variant ?? 'outlined'}
				size="sm"
				type="text"
				value={query}
				onChange={e => onQueryChange(e.target.value)}
				placeholder={criteria}
				startDecorator={<UseIcon icon={UilSearch} small />}
				sx={{
					width,
					maxWidth,
					boxShadow: 'none',
				}}
			/>
		</Row>
	)
}

function enumToCriteriaOptions<E extends Record<string, string>>(
	e: E,
): SearchCriterionOption[] {
	return Object.values(e).map(v => ({ value: v }))
}
