/** Group tree selector for parent selection in modals. */

import { UilBars } from '@iconscout/react-unicons'
import { InModal } from '@/components/modal'
import { ScrollableWindow } from '@/components/scrollable_window'
import {
  Box,
  Button,
  IconButtonXxs,
  observer,
  P,
  Stack,
  useState,
} from '@/lib/index'
import { store } from './api'
import { TreeNode } from './tree_node'

interface GroupTreeSelectorProps {
  value: number | null
  onChange: (value: number | null) => void
}

/** Tree selector modal for parent group selection. */
const GroupTreeSelectorContent = observer(
  ({ value, onChange }: GroupTreeSelectorProps) => {
    const tree = store.group_tree

    const handleSelect = (id: number) => {
      onChange(id)
    }

    const handleClear = () => {
      onChange(null)
    }

    return (
      <Stack gap={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <P level="body-sm">Выберите родительскую группу</P>
          <Button
            size="sm"
            variant="plain"
            color="neutral"
            onClick={handleClear}
          >
            Без родителя
          </Button>
        </Stack>
        <Box
          sx={{
            border: '1px solid var(--joy-palette-divider)',
            borderRadius: 'md',
            maxHeight: 300,
            overflow: 'auto',
          }}
        >
          {tree.length === 0 ? (
            <P level="body-sm" color="neutral" p={2}>
              Нет созданных групп
            </P>
          ) : (
            tree.map(node => <TreeNode key={node.id} node={node} depth={0} />)
          )}
        </Box>
      </Stack>
    )
  },
)

export const GroupTreeSelectorModal = observer(
  (props: GroupTreeSelectorProps) => (
    <InModal openButton={null as any} open={true} setOpen={() => {}}>
      <GroupTreeSelectorContent {...props} />
    </InModal>
  ),
)

interface GroupTreeModalProps {
  selected_ids: number[]
  on_change: (ids: number[]) => void
}

/** Tree modal for selecting multiple groups. */
export const GroupTreeModal = observer(
  ({ selected_ids, on_change: onChange }: GroupTreeModalProps) => {
    const [open, setOpen] = useState(false)

    const on_selection_change = (id: number) => {
      if (selected_ids.includes(id)) {
        onChange(selected_ids.filter(gid => gid !== id))
      } else {
        onChange([...selected_ids, id])
      }
    }

    return (
      <>
        <IconButtonXxs
          size="sm"
          variant="outlined"
          onClick={() => setOpen(true)}
          sx={{ width: 'fit-content', my: 0.5 }}
          icon={UilBars}
        />
        {open && (
          <InModal open={open} setOpen={setOpen} layout="fullscreen" size="sm">
            <ScrollableWindow
              scrollSx={{ width: 'max-content', alignSelf: 'center' }}
              scroll={store.group_tree.map(node => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  multiselect={{
                    selected_ids,
                    on_selection_change,
                  }}
                />
              ))}
            />
          </InModal>
        )}
      </>
    )
  },
)
