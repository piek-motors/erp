/** Group list with hierarchical tree view. */
import { UilBars } from '@iconscout/react-unicons'
import { Button, Divider, Stack } from '@mui/joy'
import { InModal } from '@/components/modal'
import { observer, P, UseIcon, useState } from '@/lib/index'
import { store } from './api'
import { CreateGroupModal } from './group_name.modal'
import { TreeNode } from './tree_node'

interface GroupListProps {
  onLinkClick?: (open: boolean) => void
}

/** Main group list component displaying hierarchical tree structure. */
export const GroupList = observer(({ onLinkClick }: GroupListProps) => {
  const tree = store.group_tree

  if (tree.length === 0) {
    return (
      <P level="body-sm" color="neutral">
        Нет созданных групп
      </P>
    )
  }

  return (
    <Stack p={0.5} gap={0}>
      {tree.map(node => (
        <TreeNode node={node} depth={0} onLinkClick={onLinkClick} />
      ))}
      <Divider />
      <CreateGroupModal />
    </Stack>
  )
})

/** Modal wrapper for group list with navigation button. */
export const GroupSelectModal = observer(() => {
  const [open, setOpen] = useState(false)

  return (
    <InModal
      openButton={
        <Button
          variant="solid"
          color="neutral"
          size="sm"
          startDecorator={<UseIcon icon={UilBars} invert />}
        >
          Группы
        </Button>
      }
      open={open}
      setOpen={setOpen}
    >
      <GroupList onLinkClick={setOpen} />
    </InModal>
  )
})
