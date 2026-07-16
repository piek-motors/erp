/** Tree node components for hierarchical group display. */
import {
  FolderOpenRounded,
  FolderRounded,
  FormatListBulletedRounded,
} from '@mui/icons-material'
import { Box, Button, Sheet } from '@mui/joy'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { observer, Row, UseIcon, useEffect } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import type { GroupAssigment } from '../detail/detail.state'
import { store } from './group.store'
import type { Node } from './tree/node_vm'

export interface TreeNodeProps {
  node: Node
  depth: number
  onClick?: (id: number) => void
  strategy: 'link' | 'btn'
  group_assigment?: GroupAssigment
}

export const TreeNode = observer(
  ({ node, depth, onClick, group_assigment, strategy }: TreeNodeProps) => {
    const selected_ids = group_assigment?.group_ids ?? []
    const group_id = store.group_content.group?.id

    useEffect(() => {
      const active_node_id = group_id
      if (active_node_id) {
        node.expand_up_to_node(active_node_id)
      }
    }, [])

    const SelectionControl = group_assigment ? (
      <input
        type={'checkbox'}
        checked={selected_ids.includes(node.id)}
        onChange={() => {
          group_assigment?.on_selection_change?.(node.id)
        }}
        onClick={e => e.stopPropagation()}
      />
    ) : null

    const group_props: GroupLinkProps = {
      title: node.name,
      is_active: group_id === node.id,
      startDecorator: <ExpandButton node={node} />,
      onClick: () => {
        onClick?.(node.id)
        node.toggle_expanded()
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
          {strategy === 'btn' ? (
            <>
              {SelectionControl}
              <GroupBtn {...group_props} />
            </>
          ) : (
            <GroupLink {...group_props} group_id={node.id} />
          )}
        </Row>

        {node.is_expanded(group_assigment?.group_ids) && (
          <Sheet sx={{ ml: 2, position: 'relative' }}>
            <LevelIndicator />
            {node.children.map(child => (
              <TreeNode
                key={child.id}
                strategy={strategy}
                node={child}
                depth={depth + 1}
                onClick={onClick}
                group_assigment={group_assigment}
              />
            ))}
          </Sheet>
        )}
      </>
    )
  },
)

/** Expand/collapse button or empty spacer. */
const ExpandButton = observer(({ node }: { node: Node }) => {
  const size = 20
  if (node.has_childrens()) {
    return <ExpandDirIcon is_expanded={node.is_expanded()} />
  }
  return (
    <UseIcon
      small
      icon={FormatListBulletedRounded}
      settings={{ opacity: 0.3, width: size, fill: 'black' }}
    />
  )
})

export const ExpandDirIcon = observer(
  ({ is_expanded }: { is_expanded?: boolean }) => {
    const size = 20
    const icon = is_expanded ? FolderOpenRounded : FolderRounded
    return (
      <UseIcon
        small
        icon={icon}
        settings={{ opacity: 1, width: size, fill: 'blue' }}
      />
    )
  },
)

interface GroupLinkProps {
  title: string
  is_active: boolean
  onClick?: () => void
  startDecorator?: ReactNode
}

export const GroupLink = observer(
  ({
    title,
    is_active,
    onClick,
    startDecorator,
    group_id,
  }: GroupLinkProps & { group_id: number }) => (
    <Link
      onClick={e => onClick?.()}
      key={title}
      to={openPage(routeMap.pdo.detailGroup, group_id)}
      style={{ textDecoration: 'none' }}
    >
      <GroupBtn
        startDecorator={startDecorator}
        is_active={is_active}
        title={title}
      />
    </Link>
  ),
)

export const GroupBtn = observer(
  ({ title, is_active, startDecorator, onClick }: GroupLinkProps) => (
    <Button
      onClick={_ => onClick?.()}
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
      {title}
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
