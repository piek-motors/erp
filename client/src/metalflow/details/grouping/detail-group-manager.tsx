import { UilLink, UilPen } from '@iconscout/react-unicons'
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography
} from '@mui/joy'
import { DeleteConfirmDialog } from 'components/delete_confirm_dialog'
import {
  DeleteResourceButton,
  observer,
  open,
  P,
  routeMap,
  Row,
  Stack,
  UseIcon,
  useState
} from 'lib/index'
import { Link } from 'react-router-dom'
import { DetailName } from '../detail_shared'
import { DetailSelectionList } from './detail-selection-list'
import { EditGroupModal } from './edit-group-modal'
import { detailGroupStore } from './store'

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
        <Typography level="body-lg" color="neutral">
          Выберите группу для управления
        </Typography>
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
            {selectedGroup.details.length > 0 && (
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

          {selectedGroup.details.length === 0 ? (
            <P level="body-sm" color="neutral">
              В группе нет деталей
            </P>
          ) : (
            <Stack sx={{ flex: 1 }}>
              <List sx={{ flex: 1, overflow: 'auto' }}>
                {selectedGroup.details.map(detail => (
                  <ListItem
                    key={detail.id}
                    sx={{
                      p: 0,
                      mb: 0,
                      '&:hover .detail-arrow': {
                        opacity: 1
                      }
                    }}
                  >
                    <Checkbox
                      size="sm"
                      variant="outlined"
                      checked={selectedGroupDetailIds.includes(detail.id)}
                      onChange={() =>
                        handleToggleGroupDetailSelection(detail.id)
                      }
                      onClick={e => e.stopPropagation()}
                    />
                    <Row sx={{ flex: 1, ml: 1 }}>
                      <ListItemButton
                        sx={{ borderRadius: 1 }}
                        onClick={() =>
                          handleToggleGroupDetailSelection(detail.id)
                        }
                      >
                        <DetailName detail={detail} />
                      </ListItemButton>

                      <Box
                        className="detail-arrow"
                        sx={{
                          opacity: 0,
                          transition: 'opacity 0.2s ease-in-out'
                        }}
                      >
                        <Link
                          to={open(routeMap.metalflow.detail.edit, detail!.id)}
                        >
                          <IconButton variant="plain" color="neutral" size="sm">
                            <UseIcon icon={UilLink} small />
                          </IconButton>
                        </Link>
                      </Box>
                    </Row>
                  </ListItem>
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
