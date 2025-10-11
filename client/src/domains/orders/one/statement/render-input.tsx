import { BaseAutocomplete } from 'components/base-autocomplete'
import { DateInput } from 'components/inputs/date_input'
import { MoneyInput } from 'components/inputs/money-input'
import { Select } from 'components/select'
import { Inp, MultilineInput, observer } from 'lib/index'
import { orderStore } from '../order.store'
import { suggestionsStore } from '../suggestions.store'
import { ColumnDefinition, InputTypes } from './store'

export const RenderInput = observer(
  (props: { column: ColumnDefinition; idx: number }) => {
    const { column, idx } = props
    const { value, label, inputType, placeholder } = column
    if (!inputType) return

    const onChange = column.onChange ?? (() => {})
    const key = `${label}-${idx}`

    const handleMyInputChange = (v: string) => {
      onChange(v)
    }

    const citySuggestions = suggestionsStore.cities.map(cityName => ({
      label: cityName,
      value: cityName
    }))
    const contractorSuggestions = suggestionsStore.contractors.map(
      contractorName => ({
        label: contractorName,
        value: contractorName
      })
    )
    const managerSuggestions = suggestionsStore.managers.map(each => ({
      name: `${each.firstName} ${each.lastName}`,
      value: each.id
    }))

    switch (column.inputType) {
      case InputTypes.Date:
        return (
          <DateInput
            key={key}
            label={label}
            value={value ?? ''}
            onChange={handleMyInputChange}
          />
        )
      case InputTypes.Text:
        return (
          <Inp
            key={key}
            type="text"
            label={label}
            placeholder={placeholder}
            value={value ?? ''}
            onChange={handleMyInputChange}
          />
        )
      case InputTypes.Number:
        return (
          <Inp
            key={key}
            type="number"
            label={label}
            placeholder={placeholder}
            value={value ?? ''}
            onChange={handleMyInputChange}
          />
        )
      case InputTypes.Money:
        return (
          <MoneyInput
            key={key}
            label={label}
            placeholder={placeholder}
            value={value ? parseInt(value) : null}
            onChange={v => {
              onChange(v.toString())
            }}
          />
        )
      case InputTypes.Multiline:
        return (
          <MultilineInput
            key={key}
            label={label}
            placeholder={placeholder}
            value={value ?? ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onChange(e.target.value)
            }
          />
        )
      case InputTypes.Manager:
        return (
          <Select
            key={key}
            label={label}
            selectElements={managerSuggestions}
            value={value}
            onChange={newValue => {
              orderStore.statment.setManagerId(newValue)
            }}
          />
        )
      case InputTypes.Contractor:
        return (
          <BaseAutocomplete
            key={key}
            options={contractorSuggestions}
            label={label}
            value={value ? { label: value, value } : null}
            freeSolo
            onChange={newValue => {
              orderStore.statment.setContractor(newValue?.value)
            }}
          />
        )
      case InputTypes.City:
        return (
          <BaseAutocomplete
            key={key}
            label={label}
            options={citySuggestions}
            value={value ? { label: value, value } : null}
            freeSolo
            onChange={newValue => {
              orderStore.statment.setCity(newValue?.value)
            }}
          />
        )
      default:
        console.warn('Unknown input type', column.inputType)
        return (
          <Inp
            key={key}
            label={label}
            value={value ?? ''}
            onChange={handleMyInputChange}
          />
        )
    }
  }
)
