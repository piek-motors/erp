import { Button, Stack } from '@mui/joy'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { DeleteResourceButton, observer, P, useState } from 'lib/index'
import { DetailName } from '../name'

interface DetailSelectionListProps {
  details: Array<{
    id: number
    name: string
    part_code: string | null
    group_id: number | null
  }>
  selectedIds: number[]
  onSelectionChange: (ids: number[]) => void
  onAdd: () => void
}

export const DetailSelectionList = observer(
  ({
    details,
    selectedIds,
    onSelectionChange,
    onAdd
  }: DetailSelectionListProps) => {
    const [autocompleteValue, setAutocompleteValue] =
      useState<BaseOption | null>(null)

    // Convert details to BaseOption format, excluding already selected ones
    const availableOptions: BaseOption[] = details
      .filter(detail => !selectedIds.includes(detail.id))
      .map(detail => ({
        label: detail.part_code
          ? `${detail.name} (${detail.part_code})`
          : detail.name,
        value: detail.id
      }))

    // Get selected detail options for display
    const selectedOptions = details.filter(detail =>
      selectedIds.includes(detail.id)
    )

    const handleSelectionChange = (selectedOption: BaseOption | null) => {
      if (!selectedOption) return

      const detailId = selectedOption.value
      if (!selectedIds.includes(detailId)) {
        onSelectionChange([...selectedIds, detailId])
        // Clear the autocomplete input after selection
        setAutocompleteValue(null)
      }
    }

    if (details.length === 0) {
      return (
        <P level="body-sm" color="neutral">
          Нет доступных деталей
        </P>
      )
    }

    return (
      <Stack sx={{ flex: 1 }} gap={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            size="sm"
            variant="soft"
            color="primary"
            onClick={onAdd}
            disabled={selectedIds.length === 0}
          >
            Добавить ({selectedIds.length})
          </Button>
        </Stack>

        <BaseAutocomplete
          label="Выберите деталь для добавления"
          options={availableOptions}
          value={autocompleteValue}
          onChange={handleSelectionChange}
          width="100%"
        />

        {selectedOptions.length > 0 && (
          <Stack gap={0.5}>
            <P level="body-sm" fontWeight="bold">
              Выбранные детали:
            </P>
            {selectedOptions.map(detail => (
              <Stack
                key={detail.id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <DetailName detail={detail} showLinkButton />
                <DeleteResourceButton
                  small
                  onClick={() => {
                    onSelectionChange(
                      selectedIds.filter(id => id !== detail.id)
                    )
                  }}
                />
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    )
  }
)
