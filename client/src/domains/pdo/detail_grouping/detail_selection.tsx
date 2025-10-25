import { UilBackspace, UilMinus } from '@iconscout/react-unicons'
import { Box, Button, IconButton, Stack } from '@mui/joy'
import { BaseAutocomplete, BaseOption } from 'components/base-autocomplete'
import { InModal } from 'components/modal'
import { observer, P, Row, UseIcon, useState } from 'lib/index'
import { cache } from '../cache/root'
import { DetailName } from '../detail/name'
import { crud } from './api'

const UniversalDetailSelection = observer(() => {
  const universalDetails = cache.details.getUniversalDetails()

  if (!universalDetails.length) {
    return null
  }

  // Convert details to BaseOption format, excluding already selected ones
  const availableOptions: BaseOption[] = universalDetails
    .filter(detail => !crud.store.selectedDetailIds.includes(detail.id!))
    .map(detail => {
      const baseLabel = `${detail.id} - ${detail.name}`
      return {
        label: detail.drawingNumber
          ? `${baseLabel} (${detail.drawingNumber})`
          : baseLabel,
        value: detail.id
      }
    })

  // Get selected detail options for display
  const selectedOptions = crud.store.selectedDetailIds.filter(id =>
    crud.store.selectedDetailIds.includes(id)
  )

  const handleSelectionChange = (selectedOption: BaseOption | null) => {
    if (!selectedOption) return

    const detailId = selectedOption.value
    if (!crud.store.selectedDetailIds.includes(detailId)) {
      crud.store.setSelectedDetailIds([
        ...crud.store.selectedDetailIds,
        detailId
      ])
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
              const detail = cache.details.get(id)
              if (!detail) return null
              return (
                <Stack
                  key={id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <DetailName
                    detail={{
                      id: detail.id!,
                      name: detail.name,
                      group_id: detail.groupId ?? null
                    }}
                    withLink
                  />
                  <IconButton
                    variant="soft"
                    color="danger"
                    size="sm"
                    onClick={() => {
                      crud.store.setSelectedDetailIds(
                        crud.store.selectedDetailIds.filter(
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
    if (
      crud.store.targetGroup == null ||
      crud.store.selectedDetailIds.length === 0
    )
      return
    await crud.addDetailsToGroup(
      crud.store.targetGroup.group.id,
      crud.store.selectedDetailIds
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
        crud.store.setSelectedDetailIds([])
      }}
    >
      <Stack sx={{ flex: 1 }} gap={1}>
        <P>
          Доступные универсальные детали [
          {cache.details.getUniversalDetails().length}]
        </P>
        <UniversalDetailSelection />
        <Box>
          <Button
            sx={{ mt: 2 }}
            size="sm"
            variant="soft"
            onClick={handleAddDetails}
            disabled={crud.store.selectedDetailIds.length === 0}
          >
            Расширить [{crud.store.selectedDetailIds.length}]
          </Button>
        </Box>
      </Stack>
    </InModal>
  )
})
