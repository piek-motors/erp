/** Group list with hierarchical tree view. */
import { Divider, Stack } from '@mui/joy'
import type { ReactNode } from 'react'
import { InModal } from '@/components/modal'
import { observer, P, useState } from '@/lib/index'
import { store } from './api'
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
  multiselect?: TreeNodeProps['multiselect']
}

/** Main group list component displaying hierarchical tree structure. */
export const GroupList = observer(
  ({ onLinkClick, multiselect }: GroupListProps) => {
    return (
      <Stack p={0.5} gap={0}>
        {store.group_tree.map(node => (
          <TreeNode
            node={node}
            depth={0}
            onLinkClick={onLinkClick}
            multiselect={multiselect}
          />
        ))}

        {store.group_tree.length === 0 && (
          <P level="body-sm" color="neutral">
            Нет созданных групп
          </P>
        )}
        <Divider />
        <CreateGroupModal />
      </Stack>
    )
  },
)
