/** Tree node components for hierarchical group display. */
import { UilFolder, UilFolderOpen, UilListUl } from '@iconscout/react-unicons'
import { Box, Button, Sheet } from '@mui/joy'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { observer, Row, UseIcon, useState } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import { store } from './api'
import type { GroupTreeNode } from './group.store'

interface TreeNodeProps {
  node: GroupTreeNode
  depth: number
  onLinkClick?: (open: boolean) => void
  multiselect?: {
    /** Selected IDs for selection modes */
    selected_ids?: number[]
    /** Callback when selection changes */
    on_selection_change?: (id: number) => void
  }
}

/** Tree node with indentation and expand/collapse. */
export const TreeNode = observer(
  ({ node, depth, onLinkClick, multiselect }: TreeNodeProps) => {
    const selected_ids = multiselect?.selected_ids ?? []
    const on_selection_change = multiselect?.on_selection_change

    const [expanded, setExpanded] = useState(false)
    const isSelected = store.opened_group?.group.id === node.id
    const has_children = node.children.length > 0
    const is_selected = selected_ids.includes(node.id)
    const handle_expand_toggle = () => setExpanded(!expanded)

    const handleSelection = () => {
      on_selection_change?.(node.id)
    }

    const SelectionControl = multiselect ? (
      <input
        type={'checkbox'}
        checked={is_selected}
        onChange={handleSelection}
        onClick={e => e.stopPropagation()}
      />
    ) : null

    const group_props = {
      node,
      isSelected,
      startDecorator: (
        <ExpandButton hasChildren={has_children} expanded={expanded} />
      ),
      onClick: () => {
        handle_expand_toggle()
      },
    }

    return (
      <>
        <Row
          noWrap
          gap={0.5}
          pl={0.5}
          justifyContent={'center'}
          sx={{
            width: 'min-content',
          }}
        >
          {SelectionControl ? (
            <>
              {SelectionControl}
              <Group {...group_props} />
            </>
          ) : (
            <GroupLink {...group_props} />
          )}
        </Row>

        {expanded && has_children && (
          <Sheet sx={{ ml: 2, position: 'relative' }}>
            <VerticalLevelIndicator />
            {node.children.map(child => (
              <TreeNode
                node={child}
                depth={depth + 1}
                onLinkClick={onLinkClick}
                multiselect={multiselect}
              />
            ))}
          </Sheet>
        )}
      </>
    )
  },
)

/** Expand/collapse button or empty spacer. */
const ExpandButton = observer(
  ({ hasChildren, expanded }: { hasChildren: boolean; expanded: boolean }) => {
    const size = 20

    let icon = UilListUl
    let opacity = 0.1
    if (hasChildren) {
      opacity = 1
      icon = expanded ? UilFolderOpen : UilFolder
    }

    return (
      <UseIcon
        small
        icon={icon}
        settings={{ opacity, width: size, fill: 'black' }}
      />
    )
  },
)

interface GroupLinkProps {
  node: GroupTreeNode
  isSelected: boolean
  onClick?: () => void
  startDecorator?: ReactNode
}

const GroupLink = observer(
  ({ node, isSelected, onClick, startDecorator }: GroupLinkProps) => (
    <Link
      onClick={e => onClick?.()}
      key={node.id}
      to={openPage(routeMap.pdo.detailGroup, node.id)}
      style={{ textDecoration: 'none' }}
    >
      <Group
        startDecorator={startDecorator}
        isSelected={isSelected}
        node={node}
      />
    </Link>
  ),
)

export const Group = observer(
  ({ node, isSelected, startDecorator, onClick }: GroupLinkProps) => (
    <Button
      onClick={e => onClick?.()}
      startDecorator={startDecorator}
      variant={isSelected ? 'soft' : 'plain'}
      color={isSelected ? 'primary' : 'neutral'}
      sx={{
        width: 'max-content',
        justifyContent: 'start',
        fontWeight: 500,
        textAlign: 'left',
        fontSize: '.9rem',
        flex: 1,
        minHeight: 15,
        pl: 0.5,
        pr: 0.5,
        '&:hover': {},
      }}
    >
      {node.name}
    </Button>
  ),
)

const VerticalLevelIndicator = observer(() => (
  <Box
    sx={{
      position: 'absolute',
      width: 2,
      borderRadius: 10,
      height: 1,
      backgroundColor: '#9f9fba',
    }}
  />
))
