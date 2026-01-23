import { BaseAutocomplete, type BaseOption } from 'components/base-autocomplete'
import { app_cache } from '../cache'
import type { MaterialCost } from '../detail/warehouse/cost.store'

export function MaterialAutocomplete(props: {
	data?: MaterialCost[]
	value?: MaterialCost | null
	onChange: (m: MaterialCost) => void
}) {
	const { data, value, onChange } = props
	const options: BaseOption[] =
		data?.map(material => ({
			label: app_cache.materials.get(material.materialId)?.label || '',
			value: material,
		})) || []
	return (
		<BaseAutocomplete
			size={'sm'}
			options={options}
			placeholder="Выберите материал"
			value={
				value
					? {
							label: app_cache.materials.getLabel(value.materialId) || '',
							value,
						}
					: null
			}
			onChange={newValue => {
				if (newValue && !Array.isArray(newValue)) {
					onChange(newValue.value)
				}
			}}
			getOptionLabel={option =>
				typeof option === 'string' ? option : option.label
			}
			isOptionEqualToValue={(option, value) =>
				option.value.id === value.value.id
			}
		/>
	)
}
