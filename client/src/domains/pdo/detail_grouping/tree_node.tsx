/** Tree node components for hierarchical group display. */
import { UilFolder, UilFolderOpen, UilListUl } from '@iconscout/react-unicons'
import { Box, Button, Sheet } from '@mui/joy'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { observer, Row, UseIcon, useEffect, useState } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import type { GroupAssigment } from '../detail/detail.state'
import { store } from './api'
import type { GroupTreeNode } from './group.store'

export interface TreeNodeProps {
  node: GroupTreeNode
  depth: number
  onLinkClick?: (id: number) => void
  multiselect?: GroupAssigment
}

export const TreeNode = observer(
  ({ node, depth, onLinkClick, multiselect }: TreeNodeProps) => {
    const selected_ids = multiselect?.group_ids ?? []

    const [expanded, setExpanded] = useState(false)
    const is_currently_opened = store.group?.id === node.id
    const has_children = node.children.length > 0
    const handle_expand_toggle = () => setExpanded(!expanded)

    const check_if_children_selected = (nodes: GroupTreeNode[]) =>
      nodes.some(
        node =>
          selected_ids.includes(node.id) ||
          check_if_children_selected(node.children),
      )

    useEffect(() => {
      if (check_if_children_selected(node.children)) {
        setExpanded(true)
      }
    }, [])

    const SelectionControl = multiselect ? (
      <input
        type={'checkbox'}
        checked={selected_ids.includes(node.id)}
        onChange={() => {
          multiselect?.on_selection_change?.(node.id)
        }}
        onClick={e => e.stopPropagation()}
      />
    ) : null

    const group_props: GroupLinkProps = {
      node,
      is_active: is_currently_opened,
      startDecorator: (
        <ExpandButton hasChildren={has_children} expanded={expanded} />
      ),
      onClick: (id: number) => {
        handle_expand_toggle()
        onLinkClick?.(id)
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
            <LevelIndicator />
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
  is_active: boolean
  onClick?: (id: number) => void
  startDecorator?: ReactNode
}

const GroupLink = observer(
  ({ node, is_active, onClick, startDecorator }: GroupLinkProps) => (
    <Link
      onClick={e => onClick?.(node.id)}
      key={node.id}
      to={openPage(routeMap.pdo.detailGroup, node.id)}
      style={{ textDecoration: 'none' }}
    >
      <Group
        startDecorator={startDecorator}
        is_active={is_active}
        node={node}
      />
    </Link>
  ),
)

export const Group = observer(
  ({ node, is_active, startDecorator, onClick }: GroupLinkProps) => (
    <Button
      onClick={e => onClick?.(node.id)}
      startDecorator={startDecorator}
      variant={is_active ? 'soft' : 'plain'}
      color={is_active ? 'primary' : 'neutral'}
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

const LevelIndicator = () => (
  <Box
    sx={{
      position: 'absolute',
      width: 2,
      borderRadius: 10,
      height: 1,
      backgroundColor: '#9f9fba',
    }}
  />
)
