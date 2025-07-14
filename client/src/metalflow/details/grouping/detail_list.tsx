import { UilPen } from '@iconscout/react-unicons'
import { Button, Checkbox, IconButton, List } from '@mui/joy'
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

// Types
interface DetailRowProps {
  detail: Detail
  onToggle: (detailId: number) => void
}

interface GroupHeaderProps {
  groupName: string
  onEdit: () => void
  onDelete: () => Promise<unknown>
}

interface GroupDetailsPanelProps {
  details: Detail[]
  selectedDetailIds: number[]
  onToggleSelection: (detailId: number) => void
  onRemoveDetails: (detailIds: number[]) => void
}

interface AvailableDetailsPanelProps {
  availableDetails: Detail[]
  selectedIds: number[]
  onSelectionChange: (ids: number[]) => void
  onAdd: () => void
}

// Helper functions
const useGroupSelection = () => {
  const [selectedGroupDetailIds, setSelectedGroupDetailIds] = useState<
    number[]
  >([])

  const toggleSelection = (detailId: number) => {
    if (selectedGroupDetailIds.includes(detailId)) {
      setSelectedGroupDetailIds(
        selectedGroupDetailIds.filter(id => id !== detailId)
      )
    } else {
      setSelectedGroupDetailIds([...selectedGroupDetailIds, detailId])
    }
  }

  const clearSelection = () => setSelectedGroupDetailIds([])

  return {
    selectedGroupDetailIds,
    toggleSelection,
    clearSelection
  }
}

// Component functions
function GroupHeader({ groupName, onEdit, onDelete }: GroupHeaderProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" spacing={1} alignItems="center">
        <P level="title-lg" fontWeight={600}>
          {groupName}
        </P>
        <IconButton size="sm" variant="soft" color="neutral" onClick={onEdit}>
          <UseIcon icon={UilPen} small />
        </IconButton>
      </Stack>
      <DeleteConfirmDialog
        title={`Группа ${groupName}`}
        handleDelete={onDelete}
        button={<DeleteResourceButton />}
      />
    </Stack>
  )
}

function GroupDetailsPanel({
  details,
  selectedDetailIds,
  onToggleSelection,
  onRemoveDetails
}: GroupDetailsPanelProps) {
  const notEmpty = details.length > 0

  return (
    <Stack sx={{ flex: 1, minWidth: '250px' }}>
      <Stack direction="row" alignItems="center" mb={1} gap={3}>
        <P level="title-sm">Детали в группе [{details.length}]</P>
        {notEmpty && (
          <Button
            size="sm"
            variant="soft"
            color="danger"
            onClick={() => {
              if (selectedDetailIds.length > 0) {
                onRemoveDetails(selectedDetailIds)
              }
            }}
            disabled={selectedDetailIds.length === 0}
          >
            Исключить [{selectedDetailIds.length}]
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
            {details.map(detail => (
              <DetailRow
                key={detail.id}
                detail={detail}
                onToggle={onToggleSelection}
                isSelected={selectedDetailIds.includes(detail.id)}
              />
            ))}
          </List>
        </Stack>
      )}
    </Stack>
  )
}

function AvailableDetailsPanel({
  availableDetails,
  selectedIds,
  onSelectionChange,
  onAdd
}: AvailableDetailsPanelProps) {
  return (
    <Stack sx={{ flex: 1, minWidth: '250px' }}>
      <P level="title-sm" mb={1}>
        Доступные детали [{availableDetails.length}]
      </P>
      <DetailSelectionList
        details={availableDetails}
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
        onAdd={onAdd}
      />
    </Stack>
  )
}

function DetailRow({
  detail,
  onToggle,
  isSelected
}: DetailRowProps & { isSelected: boolean }) {
  return (
    <Row
      sx={{
        alignItems: 'center',
        display: 'flex',
        p: 0,
        mb: 0,
        '&:hover .detail-arrow': {
          opacity: 1
        }
      }}
    >
      {detail.group_id == null ? (
        <Checkbox
          size="sm"
          variant="outlined"
          checked={isSelected}
          onChange={() => onToggle(detail.id)}
          onClick={e => e.stopPropagation()}
        />
      ) : null}
      <Row
        sx={{ cursor: detail.group_id === null ? 'pointer' : 'default' }}
        alignItems="center"
        onClick={() => detail.group_id === null && onToggle(detail.id)}
      >
        <DetailName
          detail={{
            id: detail.id,
            name: detail.name,
            group_id: detail.group_id || null
          }}
          showLinkButton
          showParamsButton
          hideGroupLink
        />
      </Row>
    </Row>
  )
}

function EmptyState() {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: '400px' }}>
      <P color="neutral">Выберите группу для управления</P>
    </Stack>
  )
}

// Main component
export const DetailGroupManager = observer(() => {
  const { selectedGroup: group } = detailGroupStore
  const { selectedGroupDetailIds, toggleSelection, clearSelection } =
    useGroupSelection()
  const [isEditingGroup, setIsEditingGroup] = useState(false)

  if (!group) {
    return <EmptyState />
  }

  const handleRemoveDetails = async (detailIds: number[]) => {
    await detailGroupStore.removeDetailsFromGroup(group.group.id, detailIds)
    clearSelection()
  }

  const handleAddDetails = async (detailIds: number[]) => {
    await detailGroupStore.addDetailsToGroup(group.group.id, detailIds)
  }

  const handleDeleteGroup = async () => {
    await detailGroupStore.deleteGroup(group.group.id)
  }

  const handleEditGroup = () => setIsEditingGroup(true)
  const handleCloseEditGroup = () => setIsEditingGroup(false)

  return (
    <Stack gap={2} p={2}>
      <GroupHeader
        groupName={group.group.name}
        onEdit={handleEditGroup}
        onDelete={handleDeleteGroup}
      />

      <Stack direction="row" gap={3} sx={{ height: '100%' }}>
        <GroupDetailsPanel
          details={group.details}
          selectedDetailIds={selectedGroupDetailIds}
          onToggleSelection={toggleSelection}
          onRemoveDetails={handleRemoveDetails}
        />

        <AvailableDetailsPanel
          availableDetails={detailGroupStore.filteredAvailableDetails}
          selectedIds={detailGroupStore.selectedDetailIds}
          onSelectionChange={ids => detailGroupStore.setSelectedDetailIds(ids)}
          onAdd={() => {
            if (detailGroupStore.selectedDetailIds.length > 0) {
              handleAddDetails(detailGroupStore.selectedDetailIds)
            }
          }}
        />
      </Stack>

      {isEditingGroup && (
        <EditGroupModal group={group.group} onClose={handleCloseEditGroup} />
      )}
    </Stack>
  )
})
