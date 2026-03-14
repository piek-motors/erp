/** Group list with hierarchical tree view. */
import { Stack } from '@mui/joy'
import type { ReactNode } from 'react'
import { InModal } from '@/components/modal'
import { observer, P, useState } from '@/lib/index'
import { app_cache } from '../cache'
import { CreateGroupModal } from './group_name.modal'
import { TreeNode, type TreeNodeProps } from './tree_node'

/** Modal wrapper for group list with navigation button. */
export const MobileGroupSelectModal = observer(
  (props: { open_button: ReactNode }) => {
    const [open, setOpen] = useState(false)

    return (
      <InModal openButton={props.open_button} open={open} setOpen={setOpen}>
        <GroupList onLinkClick={() => setOpen(false)} />
      </InModal>
    )
  },
)

interface GroupListProps {
  onLinkClick?: (id: number) => void
  group_assigment?: TreeNodeProps['group_assigment']
}

/** Main group list component displaying hierarchical tree structure. */
export const GroupList = observer(
  ({ onLinkClick, group_assigment }: GroupListProps) => {
    return (
      <Stack p={0.5} gap={0}>
        {app_cache.groups.tree.nodes.map(node => (
          <TreeNode
            strategy="link"
            node={node}
            depth={0}
            onClick={onLinkClick}
            group_assigment={group_assigment}
          />
        ))}

        {app_cache.groups.tree.nodes.length === 0 && (
          <P level="body-sm" color="neutral">
            Нет созданных групп
          </P>
        )}

        <CreateGroupModal />
      </Stack>
    )
  },
)
