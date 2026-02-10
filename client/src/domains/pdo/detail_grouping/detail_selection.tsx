import { UilBackspace, UilMinus } from '@iconscout/react-unicons'
import { Box, Button, IconButton, Stack } from '@mui/joy'
import {
  BaseAutocomplete,
  type BaseOption,
} from '@/components/base-autocomplete'
import { InModal } from '@/components/modal'
import { observer, P, Row, UseIcon, useState } from '@/lib/index'
import { app_cache } from '../cache'
import { DetailName } from '../detail/detail_name'
import { api } from './api'

const UniversalDetailSelection = observer(() => {
  const universalDetails = app_cache.details.universal_details

  if (!universalDetails.length) {
    return null
  }

  // Convert details to BaseOption format, excluding already selected ones
  const availableOptions: BaseOption[] = universalDetails
    .filter(detail => !api.store.selectedDetailIds.includes(detail.id))
    .map(detail => {
      const baseLabel = `${detail.id} - ${detail.name}`
      return {
        label: detail.drawing_number
          ? `${baseLabel} (${detail.drawing_number})`
          : baseLabel,
        value: detail.id,
      }
    })

  // Get selected detail options for display
  const selectedOptions = api.store.selectedDetailIds.filter(id =>
    api.store.selectedDetailIds.includes(id),
  )

  const handleSelectionChange = (selectedOption: BaseOption | null) => {
    if (!selectedOption) return

    const detailId = selectedOption.value
    if (!api.store.selectedDetailIds.includes(detailId)) {
      api.store.setSelectedDetailIds([...api.store.selectedDetailIds, detailId])
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
              const detail = app_cache.details.get(id)
              if (!detail) return null
              return (
                <Row
                  key={id}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <DetailName detail={detail} />
                  <IconButton
                    variant="soft"
                    color="danger"
                    size="sm"
                    onClick={() => {
                      api.store.setSelectedDetailIds(
                        api.store.selectedDetailIds.filter(
                          selectedId => selectedId !== id,
                        ),
                      )
                    }}
                  >
                    <UseIcon icon={UilMinus} />
                  </IconButton>
                </Row>
              )
            })}
          </Stack>
        )}
      </Stack>
      <Stack gap={1}>
        <Row noWrap>
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
    if (
      api.store.openedGroup == null ||
      api.store.selectedDetailIds.length === 0
    )
      return
    await api.addDetailsToGroup(
      api.store.openedGroup.group.id,
      api.store.selectedDetailIds,
    )
    setOpen(false)
  }

  const openButton = (
    <Button size="sm" sx={{ whiteSpace: 'pre-wrap' }}>
      Расширить
    </Button>
  )

  return (
    <InModal
      width={'700px'}
      openButton={openButton}
      open={open}
      setOpen={v => {
        setOpen(v)
      }}
      onClose={() => {
        api.store.setSelectedDetailIds([])
      }}
    >
      <Stack sx={{ flex: 1 }} gap={1}>
        <P>
          Доступные универсальные детали [
          {app_cache.details.universal_details.length}]
        </P>
        <UniversalDetailSelection />
        <Box>
          <Button
            sx={{ mt: 2 }}
            size="sm"
            variant="soft"
            onClick={handleAddDetails}
            disabled={api.store.selectedDetailIds.length === 0}
          >
            Расширить [{api.store.selectedDetailIds.length}]
          </Button>
        </Box>
      </Stack>
    </InModal>
  )
})
