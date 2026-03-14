/** Group tree selector for parent selection in modals. */

import type { ReactNode } from 'react'
import { InModal } from '@/components/modal'
import { ScrollableWindow } from '@/components/scrollable_window'
import { Box, observer, useState } from '@/lib/index'
import { app_cache } from '../cache'
import type { GroupAssigment } from '../detail/detail.state'
import { TreeNode } from './tree_node'

interface GroupTreeModalProps {
  group_assigment: GroupAssigment
  open_button: ReactNode
}

/** Tree modal for selecting multiple groups. */
export const GroupTreeModal = observer(
  ({ group_assigment, open_button }: GroupTreeModalProps) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Box onClick={() => setOpen(true)}>{open_button}</Box>
        {open && (
          <InModal open={open} setOpen={setOpen} layout="fullscreen" size="sm">
            <ScrollableWindow
              scrollSx={{ width: 'max-content', alignSelf: 'center' }}
              scroll={app_cache.groups.tree.nodes.map(node => (
                <TreeNode
                  strategy="btn"
                  key={node.id}
                  node={node}
                  depth={0}
                  group_assigment={group_assigment}
                />
              ))}
            />
          </InModal>
        )}
      </>
    )
  },
)
