import { UilPen } from '@iconscout/react-unicons'
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  List,
  ListItemButton
} from '@mui/joy'
import { DeleteConfirmDialog } from 'components/delete_confirm_dialog'
import {
  DeleteResourceButton,
  observer,
  P,
  Row,
  Stack,
  UseIcon,
  useState
} from 'lib/index'
import { DetailName } from '../name'
import { DetailSelectionList } from './detail-selection-list'
import { EditGroupModal } from './edit-group-modal'
import { Detail, detailGroupStore } from './store'

export const DetailGroupManager = observer(() => {
  const { selectedGroup } = detailGroupStore
  const [selectedGroupDetailIds, setSelectedGroupDetailIds] = useState<
    number[]
  >([])
  const [isEditingGroup, setIsEditingGroup] = useState(false)

  if (!selectedGroup) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: '400px' }}
      >
        <P color="neutral">Выберите группу для управления</P>
      </Stack>
    )
  }

  const handleRemoveDetails = async (detailIds: number[]) => {
    await detailGroupStore.removeDetailsFromGroup(
      selectedGroup.group.id,
      detailIds
    )
    // Clear selection after removal
    setSelectedGroupDetailIds([])
  }

  const handleAddDetails = async (detailIds: number[]) => {
    await detailGroupStore.addDetailsToGroup(selectedGroup.group.id, detailIds)
  }

  const handleDeleteGroup = async () => {
    await detailGroupStore.deleteGroup(selectedGroup.group.id)
  }

  const handleToggleGroupDetailSelection = (detailId: number) => {
    if (selectedGroupDetailIds.includes(detailId)) {
      setSelectedGroupDetailIds(
        selectedGroupDetailIds.filter(id => id !== detailId)
      )
    } else {
      setSelectedGroupDetailIds([...selectedGroupDetailIds, detailId])
    }
  }

  const notEmpty = selectedGroup.details.length > 0
  return (
    <Stack gap={2} p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <P level="title-lg" fontWeight={600}>
            {selectedGroup.group.name}
          </P>
          <IconButton
            size="sm"
            variant="soft"
            color="neutral"
            onClick={() => setIsEditingGroup(true)}
          >
            <UseIcon icon={UilPen} small />
          </IconButton>
        </Stack>
        <DeleteConfirmDialog
          title={`Группа ${selectedGroup.group.name}`}
          handleDelete={handleDeleteGroup}
          button={<DeleteResourceButton />}
        />
      </Stack>

      <Stack direction="row" gap={2} sx={{ height: '100%' }}>
        {/* Left Panel - Details in Group */}
        <Stack sx={{ flex: 1, minWidth: '250px' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <P level="title-sm">
              Детали в группе ({selectedGroup.details.length})
            </P>
            {notEmpty && (
              <Button
                size="sm"
                variant="soft"
                color="danger"
                onClick={() => {
                  if (selectedGroupDetailIds.length > 0) {
                    handleRemoveDetails(selectedGroupDetailIds)
                  }
                }}
                disabled={selectedGroupDetailIds.length === 0}
              >
                Удалить ({selectedGroupDetailIds.length})
              </Button>
            )}
          </Stack>

          {!notEmpty ? (
            <P level="body-sm" color="neutral">
              В группе нет деталей
            </P>
          ) : (
            <Stack sx={{ flex: 1 }}>
              <List sx={{ flex: 1, overflow: 'auto' }}>
                {selectedGroup.details.map(detail => (
                  <Row
                    key={detail.id}
                    sx={{
                      p: 0,
                      mb: 0,
                      '&:hover .detail-arrow': {
                        opacity: 1
                      }
                    }}
                  >
                    <Box>
                      {detail.group_id == null ? (
                        <Checkbox
                          size="sm"
                          variant="outlined"
                          checked={selectedGroupDetailIds.includes(detail.id)}
                          onChange={() =>
                            handleToggleGroupDetailSelection(detail.id)
                          }
                          onClick={e => e.stopPropagation()}
                        />
                      ) : (
                        <Box sx={{ width: '17px' }} />
                      )}
                    </Box>
                    <DetailRow
                      detail={detail}
                      onToggle={handleToggleGroupDetailSelection}
                    />
                  </Row>
                ))}
              </List>
            </Stack>
          )}
        </Stack>

        {/* Right Panel - Available Details */}
        <Stack sx={{ flex: 1, minWidth: '250px' }}>
          <P level="title-sm" mb={1}>
            Доступные детали ({detailGroupStore.filteredAvailableDetails.length}
            )
          </P>
          <DetailSelectionList
            details={detailGroupStore.filteredAvailableDetails}
            selectedIds={detailGroupStore.selectedDetailIds}
            onSelectionChange={ids =>
              detailGroupStore.setSelectedDetailIds(ids)
            }
            onAdd={() => {
              if (detailGroupStore.selectedDetailIds.length > 0) {
                handleAddDetails(detailGroupStore.selectedDetailIds)
              }
            }}
          />
        </Stack>
      </Stack>

      {isEditingGroup && (
        <EditGroupModal
          group={selectedGroup.group}
          onClose={() => setIsEditingGroup(false)}
        />
      )}
    </Stack>
  )
})

function DetailRow(props: {
  detail: Detail
  onToggle: (detailId: number) => void
}) {
  return (
    <Row sx={{ flex: 1 }}>
      <ListItemButton
        onClick={() =>
          props.detail.group_id === null && props.onToggle(props.detail.id)
        }
      >
        <DetailName
          detail={{
            id: props.detail.id,
            name: props.detail.name,
            group_id: props.detail.group_id || null
          }}
          showLinkButton
          showParamsButton
          hideGroupLink
        />
      </ListItemButton>
    </Row>
  )
}
