import { UilBackspace, UilMinus } from '@iconscout/react-unicons'
import { Box, Button, IconButton, Stack } from '@mui/joy'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { InModal } from 'components/modal'
import { observer, P, Row, UseIcon, useState } from 'lib/index'
import { DetailName } from '../../name'
import { store } from '../store'

const UniversalDetailSelection = observer(() => {
  if (store.availableDetails.length === 0) {
    throw new Error('No available details')
  }

  // Convert details to BaseOption format, excluding already selected ones
  const availableOptions: BaseOption[] = store.availableDetails
    .filter(detail => !store.selectedDetailIds.includes(detail.id))
    .map(detail => ({
      label: detail.part_code
        ? `${detail.name} (${detail.part_code})`
        : detail.name,
      value: detail.id
    }))

  // Get selected detail options for display
  const selectedOptions = store.selectedDetailIds.filter(id =>
    store.selectedDetailIds.includes(id)
  )

  const handleSelectionChange = (selectedOption: BaseOption | null) => {
    if (!selectedOption) return

    const detailId = selectedOption.value
    if (!store.selectedDetailIds.includes(detailId)) {
      store.setSelectedDetailIds([...store.selectedDetailIds, detailId])
    }
  }

  return (
    <Stack sx={{ flex: 1 }}>
      <Stack py={2}>
        {selectedOptions.length > 0 && (
          <Stack gap={0.5}>
            <P level="body-sm" fontWeight="bold" color="primary">
              Детали к добавлению:
            </P>
            {selectedOptions.map(id => {
              const detail = store.availableDetails.find(d => d.id === id)
              if (!detail) return null
              return (
                <Stack
                  key={id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <DetailName detail={detail} showLinkButton />
                  <IconButton
                    variant="soft"
                    color="danger"
                    size="sm"
                    onClick={() => {
                      store.setSelectedDetailIds(
                        store.selectedDetailIds.filter(
                          selectedId => selectedId !== id
                        )
                      )
                    }}
                  >
                    <UseIcon icon={UilMinus} />
                  </IconButton>
                </Stack>
              )
            })}
          </Stack>
        )}
      </Stack>
      <Stack gap={1}>
        <Row>
          <BaseAutocomplete
            placeholder="Выберите детали"
            options={availableOptions}
            value={null}
            onChange={handleSelectionChange}
            width="100%"
          />
          <IconButton variant="solid" color="success" onClick={() => {}}>
            <UseIcon icon={UilBackspace} />
          </IconButton>
        </Row>
      </Stack>
    </Stack>
  )
})

export const UniversalDetailsModalSelect = observer(() => {
  const [open, setOpen] = useState(false)

  const handleAddDetails = async () => {
    if (store.targetGroup == null || store.selectedDetailIds.length === 0)
      return
    await store.addDetailsToGroup(
      store.targetGroup.group.id,
      store.selectedDetailIds
    )
    setOpen(false)
  }

  const openButton = (
    <Button
      variant="soft"
      color="neutral"
      size="sm"
      sx={{ whiteSpace: 'pre-wrap' }}
    >
      Добавить
    </Button>
  )

  return (
    <InModal
      openButton={openButton}
      open={open}
      setOpen={v => {
        setOpen(v)
      }}
    >
      <Stack sx={{ flex: 1 }} gap={1}>
        <P>
          Доступные универсальные детали [
          {store.filteredAvailableDetails.length}]
        </P>
        <UniversalDetailSelection />
        <Box>
          <Button
            sx={{ mt: 2 }}
            size="sm"
            onClick={handleAddDetails}
            disabled={store.selectedDetailIds.length === 0}
          >
            Добавить [{store.selectedDetailIds.length}]
          </Button>
        </Box>
      </Stack>
    </InModal>
  )
})
